import React from 'react'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Navbar } from '@/components/Navbar'
import { ReadingLogProvider } from '@/features/reading-logs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userPayload = await getAuthenticatedUser()
  if (!userPayload) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userPayload.id },
    select: { id: true },
  })

  if (!dbUser) {
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
