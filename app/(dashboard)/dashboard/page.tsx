'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/reading-logs')
  }, [router])

  return (
    <div className="p-8 text-center text-slate-500">
      Redirecting to Reading Logs...
    </div>
  )
}
