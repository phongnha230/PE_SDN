import { prisma } from '@/lib/prisma'
import {
  CreateReadingLogDTO,
  UpdateReadingLogDTO,
  ReadingLogFilterParams,
  Genre,
  GenreBreakdown,
  ReadingLogSummaryData,
} from '../types'

const GENRE_PRIORITY: Genre[] = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography', 'Other']

export class ReadingLogRepository {
  private static buildWhereClause(userId: string, filter?: ReadingLogFilterParams) {
    const where: any = { userId }

    if (filter?.genre && filter.genre.trim()) {
      where.genre = filter.genre.trim()
    }

    if (filter?.favorite === true) {
      where.favorite = true
    }

    if (filter?.q && filter.q.trim()) {
      const q = filter.q.trim()
      where.OR = [
        { bookTitle: { contains: q, mode: 'insensitive' } },
        { note: { contains: q, mode: 'insensitive' } },
      ]
    }

    return where
  }

  static async findMany(userId: string, filter?: ReadingLogFilterParams) {
    const where = this.buildWhereClause(userId, filter)

    const logs = await prisma.readingLog.findMany({
      where,
      orderBy: [
        { readOn: 'desc' },
      ],
    })

    // Sắp xếp thứ tự ưu tiên: readOn giảm dần, hòa nhau thì xếp bookTitle A-Z không phân biệt hoa thường
    return logs.sort((a, b) => {
      const dateA = new Date(a.readOn).getTime()
      const dateB = new Date(b.readOn).getTime()
      if (dateB !== dateA) {
        return dateB - dateA
      }
      return a.bookTitle.localeCompare(b.bookTitle, undefined, { sensitivity: 'base' })
    })
  }

  static async findById(id: string, userId: string) {
    return prisma.readingLog.findFirst({
      where: { id, userId },
    })
  }

  static async findDuplicate(
    userId: string,
    bookTitle: string,
    minutesRead: number,
    readOnDate: Date,
    excludeId?: string
  ) {
    const startOfDay = new Date(readOnDate)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(readOnDate)
    endOfDay.setUTCHours(23, 59, 59, 999)

    return prisma.readingLog.findFirst({
      where: {
        userId,
        bookTitle: { equals: bookTitle.trim(), mode: 'insensitive' },
        minutesRead,
        readOn: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    })
  }

  static async create(userId: string, dto: CreateReadingLogDTO) {
    const readOnDate = new Date(dto.readOn.trim().split('T')[0] + 'T00:00:00.000Z')

    return prisma.readingLog.create({
      data: {
        userId,
        bookTitle: dto.bookTitle.trim(),
        minutesRead: dto.minutesRead,
        genre: dto.genre,
        note: dto.note?.trim() || '',
        readOn: readOnDate,
      },
    })
  }

  static async update(id: string, userId: string, data: UpdateReadingLogDTO) {
    const updateData: any = {}

    if (data.bookTitle !== undefined) updateData.bookTitle = data.bookTitle.trim()
    if (data.minutesRead !== undefined) updateData.minutesRead = data.minutesRead
    if (data.genre !== undefined) updateData.genre = data.genre
    if (data.note !== undefined) updateData.note = data.note.trim()
    if (data.favorite !== undefined) updateData.favorite = data.favorite
    if (data.readOn !== undefined) {
      updateData.readOn = new Date(data.readOn.trim().split('T')[0] + 'T00:00:00.000Z')
    }

    return prisma.readingLog.update({
      where: { id },
      data: updateData,
    })
  }

  static async delete(id: string, userId: string) {
    return prisma.readingLog.delete({
      where: { id },
    })
  }

  static async getSummary(userId: string, filter?: ReadingLogFilterParams): Promise<ReadingLogSummaryData> {
    const where = this.buildWhereClause(userId, filter)

    const logs = await prisma.readingLog.findMany({
      where,
      select: {
        minutesRead: true,
        genre: true,
        favorite: true,
      },
    })

    if (logs.length === 0) {
      return {
        count: 0,
        favoriteCount: 0,
        totalMinutes: 0,
        breakdown: [],
      }
    }

    let favoriteCount = 0
    let totalMinutes = 0
    const genreMap: Record<string, { count: number; total: number }> = {}

    for (const log of logs) {
      if (log.favorite) favoriteCount += 1
      totalMinutes += log.minutesRead

      if (!genreMap[log.genre]) {
        genreMap[log.genre] = { count: 0, total: 0 }
      }
      genreMap[log.genre].count += 1
      genreMap[log.genre].total += log.minutesRead
    }

    const breakdown: GenreBreakdown[] = Object.entries(genreMap).map(([genre, val]) => ({
      genre: genre as Genre,
      count: val.count,
      total: val.total,
    }))

    // Tie-break: ordered by total minutes descending; equal totals ordered Fiction, Non-Fiction, Sci-Fi, Biography, Other
    breakdown.sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total
      }
      return GENRE_PRIORITY.indexOf(a.genre) - GENRE_PRIORITY.indexOf(b.genre)
    })

    return {
      count: logs.length,
      favoriteCount,
      totalMinutes,
      breakdown,
    }
  }
}
