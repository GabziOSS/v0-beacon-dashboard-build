'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@beacon/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    startTransition(async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      setSent(true)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-success-dim flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Check your inbox</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent password reset instructions to{' '}
              <strong className="text-foreground">{email}</strong>
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Return to login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-foreground">Forgot password?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you reset instructions
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-input border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="coordinator@cdrrmo.gov.ph"
                  autoComplete="email"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  'w-full h-10 flex items-center justify-center gap-2 text-sm font-medium rounded-sm transition-colors',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
