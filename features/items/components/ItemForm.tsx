'use client'

import React, { useState } from 'react'
import { useItems } from '../context/ItemContext'
import { validateDate } from '../validations/item.schema'
import { PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react'

const FORM_CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Other',
]

export function ItemForm() {
  const { addItem } = useItems()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [spentAt, setSpentAt] = useState('')
  const [note, setNote] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorTitle, setErrorTitle] = useState<string | null>(null)
  const [errorAmount, setErrorAmount] = useState<string | null>(null)
  const [errorCategory, setErrorCategory] = useState<string | null>(null)
  const [errorDate, setErrorDate] = useState<string | null>(null)
  const [errorExpense, setErrorExpense] = useState<string | null>(null)
  const [expenseSuccess, setExpenseSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorTitle(null)
    setErrorAmount(null)
    setErrorCategory(null)
    setErrorDate(null)
    setErrorExpense(null)
    setExpenseSuccess(null)

    let hasClientError = false

    // 1. Title validation
    if (!title || !title.trim()) {
      setErrorTitle('Title is required')
      hasClientError = true
    } else if (title.trim().length > 80) {
      setErrorTitle('Title must be at most 80 characters')
      hasClientError = true
    }

    // 2. Amount validation
    if (!amount || amount.trim() === '') {
      setErrorAmount('Amount is required')
      hasClientError = true
    } else {
      const num = parseFloat(amount)
      if (isNaN(num) || num <= 0) {
        setErrorAmount('Amount must be a positive number')
        hasClientError = true
      }
    }

    // 3. Category validation
    if (!category) {
      setErrorCategory('Please choose a category')
      hasClientError = true
    } else if (!FORM_CATEGORIES.includes(category)) {
      setErrorCategory('Invalid category')
      hasClientError = true
    }

    // 4. Date validation
    const dateCheck = validateDate(spentAt)
    if (!dateCheck.isValid) {
      setErrorDate(dateCheck.error || 'Date is required')
      hasClientError = true
    }

    if (hasClientError) return

    setIsSubmitting(true)
    const res = await addItem({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      spentAt,
      note: note.trim(),
    })
    setIsSubmitting(false)

    if (res.success) {
      setExpenseSuccess('Expense added')
      setTitle('')
      setAmount('')
      setCategory('')
      setSpentAt('')
      setNote('')
      setTimeout(() => setExpenseSuccess(null), 4000)
    } else {
      setErrorExpense(res.error || 'Failed to add record')
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Add New Entry</h2>
          <p className="text-xs text-slate-500">Create a new item record</p>
        </div>
      </div>

      {errorExpense && (
        <div
          data-testid="error-expense"
          className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorExpense}</span>
        </div>
      )}

      {expenseSuccess && (
        <div
          data-testid="expense-success"
          className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{expenseSuccess}</span>
        </div>
      )}

      <form data-testid="expense-form" noValidate onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            data-testid="input-title"
            placeholder="e.g. Grab to campus, Groceries..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errorTitle) setErrorTitle(null)
            }}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          {errorTitle && (
            <p data-testid="error-title" className="text-xs text-rose-600 mt-1 font-medium">
              {errorTitle}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amount <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="any"
            data-testid="input-amount"
            placeholder="e.g. 45000"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              if (errorAmount) setErrorAmount(null)
            }}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          {errorAmount && (
            <p data-testid="error-amount" className="text-xs text-rose-600 mt-1 font-medium">
              {errorAmount}
            </p>
          )}
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              data-testid="input-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                if (errorCategory) setErrorCategory(null)
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Choose category</option>
              {FORM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errorCategory && (
              <p data-testid="error-category" className="text-xs text-rose-600 mt-1 font-medium">
                {errorCategory}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              data-testid="input-date"
              value={spentAt}
              onChange={(e) => {
                setSpentAt(e.target.value)
                if (errorDate) setErrorDate(null)
              }}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            {errorDate && (
              <p data-testid="error-date" className="text-xs text-rose-600 mt-1 font-medium">
                {errorDate}
              </p>
            )}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Note (optional)
          </label>
          <textarea
            rows={2}
            data-testid="input-note"
            placeholder="Morning class, dinner..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
          />
        </div>

        <button
          type="submit"
          data-testid="btn-add-expense"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm shadow transition duration-150 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span>Adding Expense...</span>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
