'use client'

import React from 'react'
import { ReadingLog } from '../types'
import { useReadingLog } from '../context/ReadingLogContext'
import { Star, Trash2, Clock, Calendar, BookOpen } from 'lucide-react'

export function ReadingLogRow({ log }: { log: ReadingLog }) {
  const { toggleFavorite, deleteReadingLog } = useReadingLog()

  const getGenreBadgeColor = (genre: string) => {
    switch (genre) {
      case 'Fiction':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
      case 'Non-Fiction':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
      case 'Sci-Fi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
      case 'Biography':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    }
  }

  return (
    <div
      data-testid="reading-log-item"
      className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3
            data-testid="reading-log-title"
            className="text-base font-bold text-slate-900 dark:text-white truncate"
          >
            {log.bookTitle}
          </h3>
          <span
            data-testid="reading-log-genre"
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getGenreBadgeColor(
              log.genre
            )}`}
          >
            {log.genre}
          </span>
        </div>

        {log.note && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic pl-1">
            "{log.note}"
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span data-testid="reading-log-minutes">{log.minutesRead}</span> mins
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span data-testid="reading-log-date">{log.readOn}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {/* Toggle Favorite Button */}
        <button
          data-testid="btn-toggle-favorite"
          type="button"
          aria-pressed={log.favorite ? 'true' : 'false'}
          onClick={() => toggleFavorite(log.id)}
          title={log.favorite ? 'Favorited' : 'Add to favorites'}
          className={`p-2.5 rounded-xl border transition-all duration-150 active:scale-95 ${
            log.favorite
              ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm dark:bg-amber-950/40 dark:border-amber-800'
              : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Star
            className={`w-4 h-4 ${log.favorite ? 'fill-amber-400 text-amber-500' : ''}`}
          />
        </button>

        {/* Delete Button */}
        <button
          data-testid="btn-delete-reading-log"
          type="button"
          onClick={() => deleteReadingLog(log.id)}
          title="Delete reading session"
          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-150 active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
