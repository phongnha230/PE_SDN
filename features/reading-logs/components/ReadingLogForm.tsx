'use client'

import React, { useState } from 'react'
import { useReadingLog } from '../context/ReadingLogContext'
import {
  validateBookTitle,
  validateMinutesRead,
  validateGenre,
  validateReadOn,
} from '../validations/reading-log.schema'
import { Genre, VALID_GENRES } from '../types'
import { BookOpen, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ReadingLogForm() {
  const { addReadingLog } = useReadingLog()

  const [bookTitle, setBookTitle] = useState('')
  const [minutesRead, setMinutesRead] = useState('')
  const [genre, setGenre] = useState('')
  const [note, setNote] = useState('')
  const [readOn, setReadOn] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTitleChange = (val: string) => {
    setBookTitle(val)
    if (hasSubmitted) {
      const v = validateBookTitle(val)
      setErrors((prev) => {
        const next = { ...prev }
        if (v.isValid) delete next.bookTitle
        else next.bookTitle = v.error!
        return next
      })
    }
  }

  const handleMinutesChange = (val: string) => {
    setMinutesRead(val)
    if (hasSubmitted) {
      const v = validateMinutesRead(val)
      setErrors((prev) => {
        const next = { ...prev }
        if (v.isValid) delete next.minutesRead
        else next.minutesRead = v.error!
        return next
      })
    }
  }

  const handleGenreChange = (val: string) => {
    setGenre(val)
    if (hasSubmitted) {
      const v = validateGenre(val)
      setErrors((prev) => {
        const next = { ...prev }
        if (v.isValid) delete next.genre
        else next.genre = v.error!
        return next
      })
    }
  }

  const handleDateChange = (val: string) => {
    setReadOn(val)
    if (hasSubmitted) {
      const v = validateReadOn(val)
      setErrors((prev) => {
        const next = { ...prev }
        if (v.isValid) delete next.readOn
        else next.readOn = v.error!
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)
    setApiError(null)
    setSuccessMessage(null)

    const newErrors: Record<string, string> = {}
    const vTitle = validateBookTitle(bookTitle)
    if (!vTitle.isValid && vTitle.error) newErrors.bookTitle = vTitle.error

    const vMinutes = validateMinutesRead(minutesRead)
    if (!vMinutes.isValid && vMinutes.error) newErrors.minutesRead = vMinutes.error

    const vGenre = validateGenre(genre)
    if (!vGenre.isValid && vGenre.error) newErrors.genre = vGenre.error

    const vDate = validateReadOn(readOn)
    if (!vDate.isValid && vDate.error) newErrors.readOn = vDate.error

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    const result = await addReadingLog({
      bookTitle,
      minutesRead: Number(minutesRead),
      genre: genre as Genre,
      note,
      readOn,
    })

    setIsSubmitting(false)

    if (result.success) {
      setSuccessMessage('Reading session added')
      setBookTitle('')
      setMinutesRead('')
      setGenre('')
      setNote('')
      setReadOn('')
      setErrors({})
      setHasSubmitted(false)
    } else {
      setApiError(result.error || 'Failed to add reading session')
    }
  }

  return (
    <Card className="rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Log Reading Session</h2>
          <p className="text-xs text-slate-500">Add book, minutes, and category</p>
        </div>
      </div>

      <form noValidate data-testid="reading-log-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Book Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Book Title <span className="text-rose-500">*</span>
          </label>
          <input
            data-testid="input-book-title"
            type="text"
            placeholder="e.g. Atomic Habits"
            value={bookTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition"
          />
          {errors.bookTitle && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span data-testid="error-book-title">{errors.bookTitle}</span>
            </p>
          )}
        </div>

        {/* Minutes Read */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Minutes Read <span className="text-rose-500">*</span>
          </label>
          <input
            data-testid="input-minutes"
            type="number"
            min="1"
            placeholder="e.g. 45"
            value={minutesRead}
            onChange={(e) => handleMinutesChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition"
          />
          {errors.minutesRead && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span data-testid="error-minutes">{errors.minutesRead}</span>
            </p>
          )}
        </div>

        {/* Genre */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Genre <span className="text-rose-500">*</span>
          </label>
          <select
            data-testid="input-genre"
            value={genre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
          >
            <option value="">Choose genre</option>
            {VALID_GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {errors.genre && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span data-testid="error-genre">{errors.genre}</span>
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            data-testid="input-date"
            type="date"
            value={readOn}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
          />
          {errors.readOn && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span data-testid="error-date">{errors.readOn}</span>
            </p>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Note (Optional)
          </label>
          <textarea
            data-testid="input-note"
            rows={2}
            placeholder="e.g. Chapter 3: Key habits summary..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition"
          />
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span data-testid="error-reading-log">{apiError}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span data-testid="reading-log-success">{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          data-testid="btn-add-reading-log"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 h-auto rounded-xl font-semibold gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving Session...' : 'Add Reading Session'}</span>
        </Button>
      </form>
    </Card>
  )
}
