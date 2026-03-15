'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { Loader2 } from 'lucide-react'
import { isAuthenticatedAtom, isAuthLoadingAtom } from '@/lib/atoms/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'analyst' | 'operator' | 'viewer'
}

/**
 * AuthGuard - Protects routes that require authentication
 * 
 * For development: Set NEXT_PUBLIC_SKIP_AUTH=true to bypass auth checks
 * For production: Remove or set to false
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const isLoading = useAtomValue(isAuthLoadingAtom)
  const [mounted, setMounted] = useState(false)

  // Skip auth in development mode if env var is set
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading || skipAuth) return

    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, mounted, router, skipAuth])

  // Show nothing until hydrated to prevent flash
  if (!mounted) {
    return null
  }

  // Skip auth check in dev mode
  if (skipAuth) {
    return <>{children}</>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * RoleGuard - Protects routes that require specific roles
 */
interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Array<'admin' | 'analyst' | 'operator' | 'viewer'>
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  // For now, allow all authenticated users
  // TODO: Implement proper role checking when user role is available
  if (!isAuthenticated) {
    return fallback || (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    )
  }

  return <>{children}</>
}
