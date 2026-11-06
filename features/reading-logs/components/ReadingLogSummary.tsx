'use client'

import React from 'react'
import { useReadingLog } from '../context/ReadingLogContext'
import { BookOpen, Star, Clock, BarChart3, TrendingUp } from 'lucide-react'

export function ReadingLogSummary() {
  const { summary } = useReadingLog()

  return (
    <div className="space-y-5">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sessions */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Total Sessions
              </p>
              <p
                data-testid="reading-log-count"
                className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white"
              >
                {summary.count}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Recorded reading habits</span>
          </div>
        </div>

        {/* Favorites Count */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Starred Favorites
              </p>
              <p
                data-testid="favorite-count"
                className="mt-2 text-3xl font-extrabold text-amber-500 dark:text-amber-400"
              >
                {summary.favoriteCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <span>Special sessions marked</span>
          </div>
        </div>

        {/* Total Minutes */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Total Time Spent
              </p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <p
                  data-testid="total-minutes"
                  className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"
                >
                  {summary.totalMinutes}
                </p>
                <span className="text-sm font-semibold text-slate-500">minutes</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Overall reading time</span>
          </div>
        </div>
      </div>

      {/* Genre Breakdown Container */}
      <div
        data-testid="genre-breakdown"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3.5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reading Minutes by Genre</h3>
          </div>
          <span className="text-xs font-medium text-slate-400">Live Breakdown</span>
        </div>

        {summary.breakdown.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-400 italic">No genres to display in current filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {summary.breakdown.map((item) => (
              <div
                key={item.genre}
                data-testid="breakdown-row"
                className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span
                    data-testid="breakdown-name"
                    className="text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    {item.genre}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    <span data-testid="breakdown-count">{item.count}</span> sessions
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Total</span>
                  <div className="text-right">
                    <span
                      data-testid="breakdown-total"
                      className="text-base font-extrabold text-indigo-600 dark:text-indigo-400"
                    >
                      {item.total}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1 font-medium">mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
