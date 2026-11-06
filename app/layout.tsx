import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReadLog - Personal Reading Tracker',
  description: 'Track your personal reading sessions, minutes read, and favorite books.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
