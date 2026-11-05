import prisma from '@/lib/prisma'
import { CreateItemDTO, UpdateItemDTO, ItemFilterParams } from '../types'

export class ItemRepository {
  static async findMany(userId: string, filters?: ItemFilterParams) {
    const where: any = { userId }

    if (filters?.q && filters.q.trim()) {
      const keyword = filters.q.trim()
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { note: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    if (filters?.category && filters.category !== 'all' && filters.category.trim() !== '') {
      where.category = { equals: filters.category.trim(), mode: 'insensitive' }
    }

    if (filters?.starred === 'true') {
      where.starred = true
    } else if (filters?.starred === 'false') {
      where.starred = false
    }

    return prisma.item.findMany({
      where,
      orderBy: [
        { spentAt: 'desc' },
        { title: 'asc' },
      ],
    })
  }

  static async findById(id: string, userId: string) {
    return prisma.item.findFirst({
      where: { id, userId },
    })
  }

  static async findDuplicate(userId: string, title: string, amount: number, spentAt: Date) {
    const startOfDay = new Date(spentAt)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(spentAt)
    endOfDay.setUTCHours(23, 59, 59, 999)

    return prisma.item.findFirst({
      where: {
        userId,
        title: { equals: title.trim(), mode: 'insensitive' },
        amount,
        spentAt: { gte: startOfDay, lte: endOfDay },
      },
    })
  }

  static async create(userId: string, data: CreateItemDTO) {
    return prisma.item.create({
      data: {
        userId,
        title: data.title.trim(),
        amount: Number(data.amount),
        category: data.category.trim(),
        note: data.note?.trim() || '',
        spentAt: new Date(data.spentAt),
      },
    })
  }

  static async update(id: string, userId: string, data: UpdateItemDTO) {
    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title.trim()
    if (data.amount !== undefined) updateData.amount = Number(data.amount)
    if (data.category !== undefined) updateData.category = data.category.trim()
    if (data.note !== undefined) updateData.note = data.note.trim()
    if (data.starred !== undefined) updateData.starred = data.starred
    if (data.spentAt !== undefined) updateData.spentAt = new Date(data.spentAt)

    return prisma.item.updateMany({
      where: { id, userId },
      data: updateData,
    })
  }

  static async toggleStar(id: string, userId: string) {
    const current = await this.findById(id, userId)
    if (!current) return null

    return prisma.item.update({
      where: { id },
      data: { starred: !current.starred },
    })
  }

  static async delete(id: string, userId: string) {
    return prisma.item.deleteMany({
      where: { id, userId },
    })
  }

  static async getSummary(userId: string, filters?: ItemFilterParams) {
    const items = await this.findMany(userId, filters)

    const count = items.length
    const totalAmount = items.reduce((acc, item) => acc + item.amount, 0)
    const starredCount = items.filter((item) => item.starred).length

    if (count === 0) {
      return {
        count: 0,
        starredCount: 0,
        totalAmount: 0,
        breakdown: [],
      }
    }

    const catMap: Record<string, { total: number; count: number }> = {}
    for (const item of items) {
      if (!catMap[item.category]) {
        catMap[item.category] = { total: 0, count: 0 }
      }
      catMap[item.category].total += item.amount
      catMap[item.category].count += 1
    }

    const breakdown = Object.entries(catMap)
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        total: stats.total,
      }))
      .sort((a, b) => b.total - a.total)

    return {
      count,
      starredCount,
      totalAmount,
      breakdown,
    }
  }
}
