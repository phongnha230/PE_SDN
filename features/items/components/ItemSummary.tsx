'use client'

import React from 'react'
import { useItems } from '../context/ItemContext'
import { formatCurrency } from '@/lib/utils'
import { Layers, DollarSign, Star, TrendingUp } from 'lucide-react'

export function ItemSummary() {
  const { summary, loading } = useItems()

  if (loading && !summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
    )
  }

  const count = summary?.count ?? 0
  const totalAmount = summary?.totalAmount ?? 0
  const starredCount = summary?.starredCount ?? 0
  const averageAmount = count > 0 ? totalAmount / count : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Count */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Entries</div>
            <div data-testid="expense-count" className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {count}
            </div>
          </div>
        </div>

        {/* Card 2: Total Amount */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Amount</div>
            <div data-testid="total-amount" className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {Number(totalAmount).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Card 3: Starred Count */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Starred Items</div>
            <div data-testid="starred-count" className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {starredCount}
            </div>
          </div>
        </div>

        {/* Card 4: Average Amount */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Average Value</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {formatCurrency(averageAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Rows Container */}
      {summary?.breakdown && summary.breakdown.length > 0 && (
        <div
          data-testid="category-breakdown"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Spending by Category
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {summary.breakdown.map((item) => (
              <div
                key={item.category}
                data-testid="breakdown-row"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <span data-testid="breakdown-name" className="font-semibold text-slate-700 dark:text-slate-200">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span data-testid="breakdown-count" className="text-slate-500">
                    ({item.count})
                  </span>
                  <span data-testid="breakdown-total" className="font-bold text-indigo-600 dark:text-indigo-400">
                    {Number(item.total).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
