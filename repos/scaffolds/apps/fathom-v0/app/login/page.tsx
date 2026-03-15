'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtom, useSetAtom, useAtomValue } from 'jotai'
import { Shield, Eye, EyeOff, Loader2, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { loginAtom } from '@/lib/atoms/auth'
import { themeNameAtom, availableThemesAtom, type ThemeName } from '@/lib/atoms/theme'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const login = useSetAtom(loginAtom)
  const [themeName, setThemeName] = useAtom(themeNameAtom)
  const availableThemes = useAtomValue(availableThemesAtom)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login({ email, password })
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'Login failed')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>
      
      {/* Theme Switcher - Bottom Corner */}
      <div className="absolute bottom-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-card/80 backdrop-blur">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {availableThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.name}
                onClick={() => setThemeName(theme.name as ThemeName)}
                className={cn(
                  'flex items-center gap-3',
                  themeName === theme.name && 'bg-accent'
                )}
              >
                {/* 3-dot color preview */}
                <div className="flex items-center gap-0.5">
                  <span 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <span 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: theme.colors.background }}
                  />
                </div>
                <span className="text-sm">{theme.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card className="relative w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">CivicPulse</CardTitle>
            <CardDescription className="mt-1">
              City Safety & Risk Management Dashboard
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@civicpulse.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              Demo credentials: any email + any password
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
