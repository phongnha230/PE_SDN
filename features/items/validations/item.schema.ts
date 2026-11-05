export function validateDate(dateStr?: string): { isValid: boolean; error?: string } {
  if (!dateStr || !dateStr.trim()) {
    return { isValid: false, error: 'Date is required' }
  }
  const trimmed = dateStr.trim().split('T')[0]
  const parsed = new Date(trimmed + 'T00:00:00.000Z')
  if (isNaN(parsed.getTime())) {
    return { isValid: false, error: 'Invalid date format' }
  }

  // Chống Timezone Bug khi test lúc rạng sáng (00:00 - 07:00 VN)
  const now = new Date()
  const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const utcToday = now.toISOString().split('T')[0]
  const maxToday = localToday > utcToday ? localToday : utcToday

  if (trimmed > maxToday) {
    return { isValid: false, error: 'Date cannot be in the future' }
  }
  return { isValid: true }
}

export function validateItemInput(data: {
  title?: any
  amount?: any
  category?: any
  spentAt?: any
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters'
  }

  const numAmount = Number(data.amount)
  if (data.amount === undefined || data.amount === null || isNaN(numAmount)) {
    errors.amount = 'Valid amount is required'
  } else if (numAmount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (!data.category || typeof data.category !== 'string' || !data.category.trim()) {
    errors.category = 'Category is required'
  }

  const dateValidation = validateDate(data.spentAt)
  if (!dateValidation.isValid) {
    errors.spentAt = dateValidation.error || 'Invalid date'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
