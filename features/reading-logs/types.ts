export type Genre = 'Fiction' | 'Non-Fiction' | 'Sci-Fi' | 'Biography' | 'Other'

export const VALID_GENRES: Genre[] = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography', 'Other']

export interface ReadingLog {
  id: string
  userId?: string
  bookTitle: string
  minutesRead: number
  genre: Genre
  note: string
  favorite: boolean
  readOn: string // YYYY-MM-DD
  createdAt: string // ISO string
}

export interface CreateReadingLogDTO {
  bookTitle: string
  minutesRead: number
  genre: Genre
  note?: string
  readOn: string
}

export interface UpdateReadingLogDTO {
  bookTitle?: string
  minutesRead?: number
  genre?: Genre
  note?: string
  readOn?: string
  favorite?: boolean
}

export interface ReadingLogFilterParams {
  genre?: string
  favorite?: boolean
  q?: string
}

export interface GenreBreakdown {
  genre: Genre
  count: number
  total: number
}

export interface ReadingLogSummaryData {
  count: number
  favoriteCount: number
  totalMinutes: number
  breakdown: GenreBreakdown[]
}
