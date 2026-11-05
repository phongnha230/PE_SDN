import { ItemRepository } from './item.repository'
import { CreateItemDTO, UpdateItemDTO, ItemFilterParams } from '../types'
import { validateItemInput } from '../validations/item.schema'

export class ItemService {
  static async listItems(userId: string, filters?: ItemFilterParams) {
    return ItemRepository.findMany(userId, filters)
  }

  static async getItemById(id: string, userId: string) {
    return ItemRepository.findById(id, userId)
  }

  static async createItem(userId: string, dto: CreateItemDTO) {
    // 1. Validation
    const validation = validateItemInput(dto)
    if (!validation.isValid) {
      const errorMsg = Object.values(validation.errors).join(', ')
      const err: any = new Error(errorMsg)
      err.statusCode = 400
      throw err
    }

    const spentDate = new Date(dto.spentAt)
    const amount = Number(dto.amount)

    // 2. Duplicate Check: Same User, Same Title (case-insensitive), Same Amount, Same Day
    const duplicate = await ItemRepository.findDuplicate(userId, dto.title, amount, spentDate)
    if (duplicate) {
      const err: any = new Error('Duplicate entry: an item with the same title, amount, and date already exists')
      err.statusCode = 409
      throw err
    }

    return ItemRepository.create(userId, dto)
  }

  static async updateItem(id: string, userId: string, dto: UpdateItemDTO) {
    const existing = await ItemRepository.findById(id, userId)
    if (!existing) {
      const err: any = new Error('Item not found')
      err.statusCode = 404
      throw err
    }

    await ItemRepository.update(id, userId, dto)
    return ItemRepository.findById(id, userId)
  }

  static async toggleStar(id: string, userId: string) {
    const updated = await ItemRepository.toggleStar(id, userId)
    if (!updated) {
      const err: any = new Error('Item not found')
      err.statusCode = 404
      throw err
    }
    return updated
  }

  static async deleteItem(id: string, userId: string) {
    const result = await ItemRepository.delete(id, userId)
    if (result.count === 0) {
      const err: any = new Error('Item not found')
      err.statusCode = 404
      throw err
    }
    return { success: true }
  }

  static async getSummary(userId: string, filters?: ItemFilterParams) {
    return ItemRepository.getSummary(userId, filters)
  }
}
