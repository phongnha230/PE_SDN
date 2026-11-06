'use client'

import React from 'react'
import { useReadingLog } from '../context/ReadingLogContext'
import { VALID_GENRES } from '../types'
import { Search, RotateCcw, Star } from 'lucide-react'

export function ReadingLogFilters() {
  const { filters, setFilters, resetFilters } = useReadingLog()

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            data-testid="search-input"
            type="text"
            placeholder="Search book title or note..."
            value={filters.q || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
            className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 transition"
          />
        </div>

        {/* Genre Filter */}
        <div className="sm:col-span-3">
          <select
            data-testid="filter-genre"
            value={filters.genre || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, genre: e.target.value }))}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition"
          >
            <option value="">All</option>
            {VALID_GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Favorite Only Checkbox */}
        <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 transition">
            <input
              data-testid="filter-favorite"
              type="checkbox"
              checked={Boolean(filters.favorite)}
              onChange={(e) => setFilters((prev) => ({ ...prev, favorite: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Favorites
            </span>
          </label>
        </div>

        {/* Clear Filters Button */}
        <div className="sm:col-span-2 flex justify-end">
          <button
            data-testid="btn-clear-filters"
            type="button"
            onClick={resetFilters}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}
