'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  ReadingLog,
  CreateReadingLogDTO,
  ReadingLogFilterParams,
  ReadingLogSummaryData,
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

      // Re-fetch to guarantee sorting and summary breakdown
      await fetchData(filters)
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

    // If "favorite" filter is ON and user un-favorites, remove from current list
    if (filters.favorite && !newFavorite) {
      setReadingLogs((prev) => prev.filter((l) => l.id !== id))
    } else {
      setReadingLogs((prev) =>
        prev.map((l) => (l.id === id ? { ...l, favorite: newFavorite } : l))
      )
    }

    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: newFavorite }),
      })

      if (!res.ok) {
        setReadingLogs(prevLogs)
        setSummary(prevSummary)
      } else {
        // Refresh summary
        const params = new URLSearchParams()
        if (filters.genre) params.set('genre', filters.genre)
        if (filters.favorite) params.set('favorite', 'true')
        if (filters.q) params.set('q', filters.q)
        const queryString = params.toString() ? `?${params.toString()}` : ''
        const summaryRes = await fetch(`/api/reading-logs/summary${queryString}`)
        if (summaryRes.ok) {
          const sumData = await summaryRes.json()
          setSummary(sumData)
        }
      }
    } catch {
      setReadingLogs(prevLogs)
      setSummary(prevSummary)
    }
  }

  const deleteReadingLog = async (id: string) => {
    const prevLogs = [...readingLogs]
    const prevSummary = { ...summary }

    // Optimistic remove
    setReadingLogs((prev) => prev.filter((l) => l.id !== id))

    try {
      const res = await fetch(`/api/reading-logs/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        setReadingLogs(prevLogs)
        setSummary(prevSummary)
      } else {
        // Refresh summary
        const params = new URLSearchParams()
        if (filters.genre) params.set('genre', filters.genre)
        if (filters.favorite) params.set('favorite', 'true')
        if (filters.q) params.set('q', filters.q)
        const queryString = params.toString() ? `?${params.toString()}` : ''
        const summaryRes = await fetch(`/api/reading-logs/summary${queryString}`)
        if (summaryRes.ok) {
          const sumData = await summaryRes.json()
          setSummary(sumData)
        }
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
