import { VALID_GENRES, Genre } from '../types'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateBookTitle(title?: string): ValidationResult {
  if (!title || !title.trim()) {
    return { isValid: false, error: 'Book title is required' }
  }
  if (title.trim().length > 80) {
    return { isValid: false, error: 'Book title must be at most 80 characters' }
  }
  return { isValid: true }
}

export function validateMinutesRead(minutes: any): ValidationResult {
  if (minutes === undefined || minutes === null || minutes === '') {
    return { isValid: false, error: 'Minutes read is required' }
  }
  const parsed = Number(minutes)
  if (isNaN(parsed)) {
    return { isValid: false, error: 'Minutes read is required' }
  }
  if (parsed <= 0 || !Number.isInteger(parsed)) {
    return { isValid: false, error: 'Minutes read must be a positive number' }
  }
  return { isValid: true }
}

export function validateGenre(genre?: string): ValidationResult {
  if (!genre || !genre.trim()) {
    return { isValid: false, error: 'Please choose a genre' }
  }
  if (!VALID_GENRES.includes(genre as Genre)) {
    return { isValid: false, error: 'Invalid genre' }
  }
  return { isValid: true }
}

export function validateReadOn(dateStr?: string): ValidationResult {
  if (!dateStr || !dateStr.trim()) {
    return { isValid: false, error: 'Date is required' }
  }

  const trimmed = dateStr.trim().split('T')[0]
  const parsed = new Date(trimmed + 'T00:00:00.000Z')
  if (isNaN(parsed.getTime())) {
    return { isValid: false, error: 'Date is required' }
  }

  // Khắc phục Timezone Bug rạng sáng VN (00:00 - 07:00)
  const now = new Date()
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const utcToday = now.toISOString().split('T')[0]
  const maxToday = localToday > utcToday ? localToday : utcToday

  if (trimmed > maxToday) {
    return { isValid: false, error: 'Date cannot be in the future' }
  }

  return { isValid: true }
}

export function validateCreateReadingLog(data: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  const titleRes = validateBookTitle(data.bookTitle)
  if (!titleRes.isValid && titleRes.error) errors.bookTitle = titleRes.error

  const minutesRes = validateMinutesRead(data.minutesRead)
  if (!minutesRes.isValid && minutesRes.error) errors.minutesRead = minutesRes.error

  const genreRes = validateGenre(data.genre)
  if (!genreRes.isValid && genreRes.error) errors.genre = genreRes.error

  const dateRes = validateReadOn(data.readOn)
  if (!dateRes.isValid && dateRes.error) errors.readOn = dateRes.error

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
