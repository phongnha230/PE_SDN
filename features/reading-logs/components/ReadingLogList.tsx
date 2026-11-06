'use client'

import React from 'react'
import { useReadingLog } from '../context/ReadingLogContext'
import { ReadingLogRow } from './ReadingLogRow'
import { BookOpen } from 'lucide-react'

export function ReadingLogList() {
  const { readingLogs, isLoading } = useReadingLog()

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="w-8 h-8 mx-auto mb-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading reading sessions...</p>
      </div>
    )
  }

  if (readingLogs.length === 0) {
    return (
      <div className="p-14 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500 shadow-sm">
          <BookOpen className="w-7 h-7" />
        </div>
        <p
          data-testid="reading-logs-empty"
          className="text-base font-bold text-slate-800 dark:text-slate-200"
        >
          No reading sessions found
        </p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Start logging your books on the left, or try resetting the search filter above to see your reading logs.
        </p>
      </div>
    )
  }

  return (
    <div data-testid="reading-log-list" className="space-y-3.5">
      {readingLogs.map((log) => (
        <ReadingLogRow key={log.id} log={log} />
      ))}
    </div>
  )
}
