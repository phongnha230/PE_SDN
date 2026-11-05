'use client'

import React from 'react'
import { useItems } from '../context/ItemContext'
import { Search, RotateCcw } from 'lucide-react'

const FILTER_CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Food', value: 'Food' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Bills', value: 'Bills' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Other', value: 'Other' },
]

export function ItemFilters() {
  const { filters, updateFilter, resetFilters } = useItems()

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            data-testid="search-input"
            placeholder="Search by title or note..."
            value={filters.q || ''}
            onChange={(e) => updateFilter('q', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <select
            data-testid="filter-category"
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {FILTER_CATEGORIES.map((cat) => (
              <option key={cat.label} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Starred Checkbox */}
        <div className="md:col-span-3 flex items-center gap-2 px-2">
          <input
            type="checkbox"
            id="filter-starred-chk"
            data-testid="filter-starred"
            checked={filters.starred === 'true'}
            onChange={(e) => updateFilter('starred', e.target.checked ? 'true' : '')}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <label
            htmlFor="filter-starred-chk"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none cursor-pointer"
          >
            Starred only ⭐
          </label>
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            type="button"
            data-testid="btn-clear-filters"
            onClick={resetFilters}
            title="Clear all filters"
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
