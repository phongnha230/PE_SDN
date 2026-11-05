import React from 'react'
import { Navbar } from '@/components/Navbar'
import { ItemProvider } from '@/features/items'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ItemProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
      </div>
    </ItemProvider>
  )
}
