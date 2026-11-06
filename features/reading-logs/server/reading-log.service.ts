import { ReadingLogRepository } from './reading-log.repository'
import {
  CreateReadingLogDTO,
  UpdateReadingLogDTO,
  ReadingLogFilterParams,
  ReadingLog,
} from '../types'
import {
  validateBookTitle,
  validateMinutesRead,
  validateGenre,
  validateReadOn,
  validateCreateReadingLog,
} from '../validations/reading-log.schema'

export function formatReadingLogResponse(log: any): ReadingLog {
  const readOnStr =
    log.readOn instanceof Date
      ? log.readOn.toISOString().split('T')[0]
      : String(log.readOn).split('T')[0]

  const createdAtStr =
    log.createdAt instanceof Date
      ? log.createdAt.toISOString()
      : new Date(log.createdAt).toISOString()

  return {
    id: log.id,
    bookTitle: log.bookTitle,
    minutesRead: log.minutesRead,
    genre: log.genre,
    note: log.note || '',
    favorite: Boolean(log.favorite),
    readOn: readOnStr,
    createdAt: createdAtStr,
  }
}

export class ReadingLogService {
  static async getAll(userId: string, filter?: ReadingLogFilterParams): Promise<ReadingLog[]> {
    const logs = await ReadingLogRepository.findMany(userId, filter)
    return logs.map(formatReadingLogResponse)
  }

  static async getById(id: string, userId: string): Promise<ReadingLog> {
    const log = await ReadingLogRepository.findById(id, userId)
    if (!log) {
      const err: any = new Error('Reading log not found')
      err.statusCode = 404
      throw err
    }
    return formatReadingLogResponse(log)
  }

  static async create(userId: string, dto: CreateReadingLogDTO): Promise<ReadingLog> {
    const validation = validateCreateReadingLog(dto)
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      const err: any = new Error(firstError)
      err.statusCode = 400
      throw err
    }

    const readOnDate = new Date(dto.readOn.trim().split('T')[0] + 'T00:00:00.000Z')
    const duplicate = await ReadingLogRepository.findDuplicate(
      userId,
      dto.bookTitle,
      Number(dto.minutesRead),
      readOnDate
    )

    if (duplicate) {
      const err: any = new Error(
        'Duplicate reading session: a reading session with the same book title, minutes and date already exists'
      )
      err.statusCode = 409
      throw err
    }

    const created = await ReadingLogRepository.create(userId, {
      ...dto,
      minutesRead: Number(dto.minutesRead),
    })

    return formatReadingLogResponse(created)
  }

  static async update(id: string, userId: string, dto: UpdateReadingLogDTO): Promise<ReadingLog> {
    const existing = await ReadingLogRepository.findById(id, userId)
    if (!existing) {
      const err: any = new Error('Reading log not found')
      err.statusCode = 404
      throw err
    }

    if (dto.bookTitle !== undefined) {
      const v = validateBookTitle(dto.bookTitle)
      if (!v.isValid && v.error) {
        const err: any = new Error(v.error)
        err.statusCode = 400
        throw err
      }
    }

    if (dto.minutesRead !== undefined) {
      const v = validateMinutesRead(dto.minutesRead)
      if (!v.isValid && v.error) {
        const err: any = new Error(v.error)
        err.statusCode = 400
        throw err
      }
    }

    if (dto.genre !== undefined) {
      const v = validateGenre(dto.genre)
      if (!v.isValid && v.error) {
        const err: any = new Error(v.error)
        err.statusCode = 400
        throw err
      }
    }

    if (dto.readOn !== undefined) {
      const v = validateReadOn(dto.readOn)
      if (!v.isValid && v.error) {
        const err: any = new Error(v.error)
        err.statusCode = 400
        throw err
      }
    }

    const finalTitle = dto.bookTitle !== undefined ? dto.bookTitle : existing.bookTitle
    const finalMinutes = dto.minutesRead !== undefined ? Number(dto.minutesRead) : existing.minutesRead
    const finalReadOnDate =
      dto.readOn !== undefined
        ? new Date(dto.readOn.trim().split('T')[0] + 'T00:00:00.000Z')
        : existing.readOn

    if (dto.bookTitle !== undefined || dto.minutesRead !== undefined || dto.readOn !== undefined) {
      const duplicate = await ReadingLogRepository.findDuplicate(
        userId,
        finalTitle,
        finalMinutes,
        finalReadOnDate,
        id
      )
      if (duplicate) {
        const err: any = new Error(
          'Duplicate reading session: a reading session with the same book title, minutes and date already exists'
        )
        err.statusCode = 409
        throw err
      }
    }

    const updated = await ReadingLogRepository.update(id, userId, {
      ...dto,
      ...(dto.minutesRead !== undefined ? { minutesRead: Number(dto.minutesRead) } : {}),
    })

    return formatReadingLogResponse(updated)
  }

  static async delete(id: string, userId: string): Promise<{ success: boolean }> {
    const existing = await ReadingLogRepository.findById(id, userId)
    if (!existing) {
      const err: any = new Error('Reading log not found')
      err.statusCode = 404
      throw err
    }

    await ReadingLogRepository.delete(id, userId)
    return { success: true }
  }

  static async getSummary(userId: string, filter?: ReadingLogFilterParams) {
    return ReadingLogRepository.getSummary(userId, filter)
  }
}
