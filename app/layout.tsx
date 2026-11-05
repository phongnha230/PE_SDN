import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PE SDN302 Exam Boilerplate',
  description: 'Universal Reusable Boilerplate for PE SDN302 Exam',
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
