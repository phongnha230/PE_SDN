'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { BookOpen, PieChart, Clock, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) setIsLoggedIn(true)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Track Your Reading Habits</span>
          </div>

          <h1
            data-testid="home-title"
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            ReadLog
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            The simplest way to track your personal reading sessions, record minutes spent, sort by genre,
            and keep your favorite sessions organized in one place.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/reading-logs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition active:scale-[0.98]"
              >
                <span>Go to Reading Logs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition active:scale-[0.98]"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-800 shadow-sm transition"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 3 Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Log every session</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Keep a detailed record of book titles, notes, and reading dates in seconds.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sort by genre</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Filter and group your sessions into Fiction, Non-Fiction, Sci-Fi, Biography, and more.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">See minutes read</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Instant breakdown of total minutes read and favorite session counts.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
