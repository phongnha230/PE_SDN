'use client'

import React from 'react'
import { useItems } from '../context/ItemContext'
import { ItemRow } from './ItemRow'
import { Inbox, Loader2 } from 'lucide-react'

export function ItemList() {
  const { items, loading, error, resetFilters } = useItems()

  if (loading && items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading records...</p>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-700">
        <p className="text-sm font-semibold">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        data-testid="expenses-empty"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm"
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-700 dark:text-slate-200">No expenses found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No records match your current filters or no entries have been added yet.
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="mt-4 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-lg transition"
        >
          Clear Filters
        </button>
      </div>
    )
  }

  return (
    <div data-testid="expense-list" className="space-y-3">
      {items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  )
}
