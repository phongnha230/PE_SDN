'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  ReadingLog,
  CreateReadingLogDTO,
  ReadingLogFilterParams,
  ReadingLogSummaryData,
  Genre,
  GenreBreakdown,
} from '../types'

interface ReadingLogContextType {
  readingLogs: ReadingLog[]
  summary: ReadingLogSummaryData
  isLoading: boolean
  filters: ReadingLogFilterParams
  setFilters: React.Dispatch<React.SetStateAction<ReadingLogFilterParams>>
  resetFilters: () => void
  addReadingLog: (data: CreateReadingLogDTO) => Promise<{ success: boolean; error?: string }>
  toggleFavorite: (id: string) => Promise<void>
  deleteReadingLog: (id: string) => Promise<void>
  refreshData: () => Promise<void>
}

const defaultSummary: ReadingLogSummaryData = {
  count: 0,
  favoriteCount: 0,
  totalMinutes: 0,
  breakdown: [],
}

const GENRE_PRIORITY: Genre[] = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography', 'Other']

function sortLogs(logs: ReadingLog[]): ReadingLog[] {
  return [...logs].sort((a, b) => {
    if (b.readOn !== a.readOn) {
      return b.readOn.localeCompare(a.readOn)
    }
    return a.bookTitle.localeCompare(b.bookTitle, undefined, { sensitivity: 'base' })
  })
}

function matchesFilters(log: ReadingLog, filters: ReadingLogFilterParams): boolean {
  if (filters.genre && filters.genre.trim() && log.genre !== filters.genre.trim()) {
    return false
  }
  if (filters.favorite && !log.favorite) {
    return false
  }
  if (filters.q && filters.q.trim()) {
    const q = filters.q.trim().toLowerCase()
    const inTitle = log.bookTitle.toLowerCase().includes(q)
    const inNote = (log.note || '').toLowerCase().includes(q)
    if (!inTitle && !inNote) return false
  }
  return true
}

function computeSummaryFromLogs(logs: ReadingLog[]): ReadingLogSummaryData {
  if (logs.length === 0) {
    return defaultSummary
  }

  let favoriteCount = 0
  let totalMinutes = 0
  const genreMap: Record<string, { count: number; total: number }> = {}

  for (const log of logs) {
    if (log.favorite) favoriteCount += 1
    totalMinutes += log.minutesRead

    if (!genreMap[log.genre]) {
      genreMap[log.genre] = { count: 0, total: 0 }
    }
    genreMap[log.genre].count += 1
    genreMap[log.genre].total += log.minutesRead
  }

  const breakdown: GenreBreakdown[] = Object.entries(genreMap).map(([genre, val]) => ({
    genre: genre as Genre,
    count: val.count,
    total: val.total,
  }))

  breakdown.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total
    }
    return GENRE_PRIORITY.indexOf(a.genre) - GENRE_PRIORITY.indexOf(b.genre)
  })

  return {
    count: logs.length,
    favoriteCount,
    totalMinutes,
    breakdown,
  }
}

const ReadingLogContext = createContext<ReadingLogContextType | undefined>(undefined)

export function ReadingLogProvider({ children }: { children: React.ReactNode }) {
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([])
  const [summary, setSummary] = useState<ReadingLogSummaryData>(defaultSummary)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<ReadingLogFilterParams>({
    genre: '',
    favorite: false,
    q: '',
  })

  const fetchData = useCallback(async (currentFilters: ReadingLogFilterParams) => {
    try {
      const params = new URLSearchParams()
      if (currentFilters.genre && currentFilters.genre.trim()) {
        params.set('genre', currentFilters.genre.trim())
      }
      if (currentFilters.favorite) {
        params.set('favorite', 'true')
      }
      if (currentFilters.q && currentFilters.q.trim()) {
        params.set('q', currentFilters.q.trim())
      }

      const queryString = params.toString() ? `?${params.toString()}` : ''

      const [logsRes, summaryRes] = await Promise.all([
        fetch(`/api/reading-logs${queryString}`),
        fetch(`/api/reading-logs/summary${queryString}`),
      ])

      if (logsRes.status === 401 || summaryRes.status === 401) {
        window.location.href = '/login'
        return
      }

      if (logsRes.ok) {
        const data = await logsRes.json()
        setReadingLogs(data)
      }
      if (summaryRes.ok) {
        const sumData = await summaryRes.json()
        setSummary(sumData)
      }
    } catch (error) {
      console.error('Failed to fetch reading logs data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(filters)
  }, [fetchData, filters])

  const resetFilters = useCallback(() => {
    setFilters({ genre: '', favorite: false, q: '' })
  }, [])

  const addReadingLog = async (data: CreateReadingLogDTO): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/reading-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await res.json()

      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to add reading session' }
      }

      const createdLog: ReadingLog = resData
      if (matchesFilters(createdLog, filters)) {
        const nextLogs = sortLogs([...readingLogs, createdLog])
        setReadingLogs(nextLogs)
        setSummary(computeSummaryFromLogs(nextLogs))
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' }
    }
  }

  const toggleFavorite = async (id: string) => {
    const target = readingLogs.find((l) => l.id === id)
    if (!target) return
    const newFavorite = !target.favorite
    const prevLogs = [...readingLogs]
    const prevSummary = { ...summary }

    // Optimistic 0ms update for BOTH readingLogs and summary
    const nextLogs =
      filters.favorite && !newFavorite
        ? readingLogs.filter((l) => l.id !== id)
        : readingLogs.map((l) => (l.id === id ? { ...l, favorite: newFavorite } : l))

    setReadingLogs(nextLogs)
    setSummary(computeSummaryFromLogs(nextLogs))

    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: newFavorite }),
      })

      if (!res.ok) {
        setReadingLogs(prevLogs)
        setSummary(prevSummary)
      }
    } catch {
      setReadingLogs(prevLogs)
      setSummary(prevSummary)
    }
  }

  const deleteReadingLog = async (id: string) => {
    const prevLogs = [...readingLogs]
    const prevSummary = { ...summary }

    // Optimistic 0ms update for BOTH readingLogs and summary
    const nextLogs = readingLogs.filter((l) => l.id !== id)
    setReadingLogs(nextLogs)
    setSummary(computeSummaryFromLogs(nextLogs))

    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        setReadingLogs(prevLogs)
        setSummary(prevSummary)
      }
    } catch {
      setReadingLogs(prevLogs)
      setSummary(prevSummary)
    }
  }

  const refreshData = async () => {
    await fetchData(filters)
  }

  return (
    <ReadingLogContext.Provider
      value={{
        readingLogs,
        summary,
        isLoading,
        filters,
        setFilters,
        resetFilters,
        addReadingLog,
        toggleFavorite,
        deleteReadingLog,
        refreshData,
      }}
    >
      {children}
    </ReadingLogContext.Provider>
  )
}

export function useReadingLog() {
  const context = useContext(ReadingLogContext)
  if (!context) {
    throw new Error('useReadingLog must be used within a ReadingLogProvider')
  }
  return context
}
