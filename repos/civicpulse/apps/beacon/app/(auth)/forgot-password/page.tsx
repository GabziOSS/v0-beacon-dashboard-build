"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@beacon/ui"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSent(true)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="bg-success-dim mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <CheckCircle2 className="text-success h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Check your inbox
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent password reset instructions to{" "}
              <strong className="text-foreground">{email}</strong>
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Return to login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-foreground">
              Forgot password?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you reset instructions
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-sm border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="coordinator@cdrrmo.gov.ph"
                  autoComplete="email"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "flex h-10 w-full items-center justify-center gap-2 rounded-sm text-sm font-medium transition-colors",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
