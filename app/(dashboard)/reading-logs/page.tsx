'use client'

import React from 'react'
import {
  ReadingLogForm,
  ReadingLogFilters,
  ReadingLogList,
  ReadingLogSummary,
} from '@/features/reading-logs'

export default function ReadingLogsPage() {
  return (
    <div data-testid="reading-logs-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Summary Section */}
      <section>
        <ReadingLogSummary />
      </section>

      {/* 2. Two-Column Layout: Form (35%) & Filters + List (65%) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Form 35%) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <ReadingLogForm />
        </div>

        {/* Right Column (Filters & List 65%) */}
        <div className="lg:col-span-8 space-y-6">
          <ReadingLogFilters />
          <ReadingLogList />
        </div>
      </section>
    </div>
  )
}
