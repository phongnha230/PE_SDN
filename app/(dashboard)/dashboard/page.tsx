'use client'

import React from 'react'
import {
  ItemForm,
  ItemFilters,
  ItemList,
  ItemSummary,
} from '@/features/items'

export default function DashboardPage() {
  return (
    <div data-testid="expenses-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Summary Cards on Top */}
      <section>
        <ItemSummary />
      </section>

      {/* 2. Standard 2-Column Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 35% (lg:col-span-4) - Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <ItemForm />
        </div>

        {/* Right Column: 65% (lg:col-span-8) - Filters + List */}
        <div className="lg:col-span-8 space-y-6">
          <ItemFilters />
          <ItemList />
        </div>
      </section>
    </div>
  )
}
