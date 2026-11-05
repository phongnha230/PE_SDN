'use client'

import React, { useState } from 'react'
import { Item } from '../types'
import { useItems } from '../context/ItemContext'
import { formatDate } from '@/lib/utils'
import { Star, Trash2, Calendar, Tag, FileText } from 'lucide-react'

interface ItemRowProps {
  item: Item
}

export function ItemRow({ item }: ItemRowProps) {
  const { toggleStar, deleteItem } = useItems()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setIsDeleting(true)
      await deleteItem(item.id)
    }
  }

  return (
    <div
      data-testid="expense-item"
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      {/* Left side: Star, Title, Badges */}
      <div className="flex items-start gap-3 min-w-0">
        <button
          type="button"
          data-testid="btn-toggle-star"
          aria-pressed={item.starred ? 'true' : 'false'}
          onClick={() => toggleStar(item.id)}
          title={item.starred ? 'Unstar' : 'Star'}
          className="mt-1 p-1 text-slate-300 hover:text-amber-400 transition shrink-0 active:scale-125"
        >
          <Star
            className={`w-5 h-5 ${
              item.starred
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
            }`}
          />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              data-testid="expense-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate"
            >
              {item.title}
            </h3>
            <span
              data-testid="expense-category"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900"
            >
              <Tag className="w-3 h-3" />
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 flex-wrap">
            <span data-testid="expense-date" className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(item.spentAt)}
            </span>
            {item.note && (
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 truncate max-w-xs">
                <FileText className="w-3.5 h-3.5" />
                {item.note}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Amount, Delete button */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="text-right">
          <div
            data-testid="expense-amount"
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100"
          >
            {Number(item.amount).toFixed(2)}
          </div>
        </div>

        <button
          type="button"
          data-testid="btn-delete-expense"
          disabled={isDeleting}
          onClick={handleDelete}
          title="Delete Entry"
          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-50 active:scale-[0.98]"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
