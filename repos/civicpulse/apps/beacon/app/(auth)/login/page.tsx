"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, BarChart3, MapPin, Shield, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { cn } from "@beacon/ui"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const { signIn } = useAuth()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }
    if (!password) {
      setError("Password is required")
      return
    }

    startTransition(async () => {
      const result = await signIn(email, password)
      if (result.success) {
        // Use window.location for full navigation after auth state change
        // This ensures cookies/localStorage are properly read by the new page
        window.location.href = "/dashboard/overview"
      } else {
        setError(result.error || "Invalid credentials")
      }
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="relative hidden overflow-hidden bg-card lg:flex lg:w-1/2">
        {/* Topographic pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 C20 25, 80 25, 50 50 C20 75, 80 75, 50 100' stroke='%23fff' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 50 C25 20, 25 80, 50 50 C75 20, 75 80, 100 50' stroke='%23fff' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          {/* Logo and tagline */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              CivicPulse
            </h1>
            <p className="mt-3 max-w-sm text-lg text-muted-foreground">
              Situational awareness for Calbayog City (WIP)
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Demo Charts, mock data
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Weatherlink data coming soon 🚧
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  12 monitored zones (Sample)
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Map got taken out for now 🚧
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  enim sint non Lorem magna aliquip minim amet non eu Lorem
                  velit
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Took some creative liberty for the texts 😉
                </p>
              </div>
            </div>
          </div>

          {/* Attribution */}
          <p className="text-xs text-muted-foreground">
            NwSSU · CDRRMO · Calbayog City
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              CivicPulse
            </h1>
          </div>

          <h2 className="text-xl font-semibold text-foreground">
            Sign in to CivicPulse
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-sm border border-border bg-input px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Submit */}
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
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* OAuth placeholder */}
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-sm border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Forgot password */}
          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
