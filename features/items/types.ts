export interface Item {
  id: string
  userId: string
  title: string
  amount: number
  category: string
  note?: string | null
  starred: boolean
  spentAt: string | Date
  createdAt: string | Date
}

export interface CreateItemDTO {
  title: string
  amount: number | string
  category: string
  note?: string
  spentAt: string
}

export interface UpdateItemDTO {
  title?: string
  amount?: number | string
  category?: string
  note?: string
  starred?: boolean
  spentAt?: string
}

export interface ItemFilterParams {
  q?: string
  category?: string
  starred?: string
}

export interface CategoryBreakdown {
  category: string
  count: number
  total: number
}

export interface ItemSummaryData {
  count: number
  starredCount: number
  totalAmount: number
  breakdown: CategoryBreakdown[]
}
