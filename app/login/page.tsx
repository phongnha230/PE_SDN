'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, AlertCircle, Eye, EyeOff, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function validateEmailField(value: string): string | null {
  if (!value || !value.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address'
  return null
}

function validatePasswordField(value: string): string | null {
  if (!value) return 'Password is required'
  return null
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const [errorEmail, setErrorEmail] = useState<string | null>(null)
  const [errorPassword, setErrorPassword] = useState<string | null>(null)
  const [errorAuth, setErrorAuth] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmitted(true)
    setErrorAuth(null)

    const eErr = validateEmailField(email)
    const pErr = validatePasswordField(password)
    setErrorEmail(eErr)
    setErrorPassword(pErr)

    if (eErr || pErr) return

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorAuth(data.error || 'Invalid email or password')
        setLoading(false)
        return
      }

      router.push('/reading-logs')
      router.refresh()
    } catch (err: any) {
      setErrorAuth(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome to ReadLog</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to track your reading sessions</p>
        </div>

        {errorAuth && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span data-testid="error-auth">{errorAuth}</span>
          </div>
        )}

        <form data-testid="login-form" noValidate onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              data-testid="login-email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => {
                const val = e.target.value
                setEmail(val)
                if (hasSubmitted) setErrorEmail(validateEmailField(val))
              }}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            {errorEmail && (
              <p data-testid="error-email" className="text-xs text-rose-600 mt-1 font-medium">
                {errorEmail}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                data-testid="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  const val = e.target.value
                  setPassword(val)
                  if (hasSubmitted) setErrorPassword(validatePasswordField(val))
                }}
                className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorPassword && (
              <p data-testid="error-password" className="text-xs text-rose-600 mt-1 font-medium">
                {errorPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            data-testid="login-submit"
            disabled={loading}
            className="w-full mt-2 py-3 h-auto rounded-xl font-semibold gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </Card>
    </div>
  )
}
