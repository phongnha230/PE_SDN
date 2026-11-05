'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Item, ItemFilterParams, ItemSummaryData, CreateItemDTO } from '../types'

interface ItemContextType {
  items: Item[]
  summary: ItemSummaryData | null
  filters: ItemFilterParams
  loading: boolean
  error: string | null
  setFilters: React.Dispatch<React.SetStateAction<ItemFilterParams>>
  updateFilter: (key: keyof ItemFilterParams, value: string) => void
  resetFilters: () => void
  loadData: () => Promise<void>
  toggleStar: (id: string) => Promise<void>
  deleteItem: (id: string) => Promise<{ success: boolean; error?: string }>
  addItem: (data: CreateItemDTO) => Promise<{ success: boolean; error?: string }>
}

const ItemContext = createContext<ItemContextType | undefined>(undefined)

const initialFilters: ItemFilterParams = {
  q: '',
  category: 'all',
  starred: 'all',
}

export function ItemProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [summary, setSummary] = useState<ItemSummaryData | null>(null)
  const [filters, setFilters] = useState<ItemFilterParams>(initialFilters)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (filters.q) params.set('q', filters.q)
      if (filters.category && filters.category !== 'all') params.set('category', filters.category)
      if (filters.starred && filters.starred !== 'all') params.set('starred', filters.starred)

      const [itemsRes, summaryRes] = await Promise.all([
        fetch(`/api/items?${params.toString()}`),
        fetch(`/api/items/summary?${params.toString()}`),
      ])

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        setItems(itemsData)
      } else {
        const errJson = await itemsRes.json().catch(() => ({}))
        setError(errJson.error || 'Failed to fetch items')
      }

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading data')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateFilter = (key: keyof ItemFilterParams, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  // 1. Optimistic Toggle Star (0ms)
  const toggleStar = async (id: string) => {
    const previousItems = [...items]
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item))
    )

    try {
      const res = await fetch(`/api/items/${id}/star`, { method: 'PATCH' })
      if (!res.ok) {
        setItems(previousItems)
      } else {
        // Sync summary in background
        const params = new URLSearchParams()
        if (filters.q) params.set('q', filters.q)
        if (filters.category && filters.category !== 'all') params.set('category', filters.category)
        if (filters.starred && filters.starred !== 'all') params.set('starred', filters.starred)
        const sumRes = await fetch(`/api/items/summary?${params.toString()}`)
        if (sumRes.ok) setSummary(await sumRes.json())
      }
    } catch {
      setItems(previousItems)
    }
  }

  // 2. Optimistic Delete (0ms)
  const deleteItem = async (id: string) => {
    const previousItems = [...items]
    setItems((prev) => prev.filter((item) => item.id !== id))

    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        setItems(previousItems)
        const json = await res.json().catch(() => ({}))
        return { success: false, error: json.error || 'Failed to delete' }
      }
      // Re-fetch summary in background
      const params = new URLSearchParams()
      if (filters.q) params.set('q', filters.q)
      if (filters.category && filters.category !== 'all') params.set('category', filters.category)
      if (filters.starred && filters.starred !== 'all') params.set('starred', filters.starred)
      const sumRes = await fetch(`/api/items/summary?${params.toString()}`)
      if (sumRes.ok) setSummary(await sumRes.json())
      return { success: true }
    } catch (err: any) {
      setItems(previousItems)
      return { success: false, error: err.message }
    }
  }

  // 3. Add Item (Wait for Server to catch 409 Conflict)
  const addItem = async (data: CreateItemDTO) => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok) {
        setItems((prev) => [json, ...prev])
        await loadData()
        return { success: true }
      }
      return { success: false, error: json.error || 'Failed to create item' }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' }
    }
  }

  return (
    <ItemContext.Provider
      value={{
        items,
        summary,
        filters,
        loading,
        error,
        setFilters,
        updateFilter,
        resetFilters,
        loadData,
        toggleStar,
        deleteItem,
        addItem,
      }}
    >
      {children}
    </ItemContext.Provider>
  )
}

export function useItems() {
  const context = useContext(ItemContext)
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider')
  }
  return context
}
