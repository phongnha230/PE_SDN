import React from 'react'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { ReadingLogProvider } from '@/features/reading-logs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <ReadingLogProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
      </div>
    </ReadingLogProvider>
  )
}
