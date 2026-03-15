'use client'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { User, AuthState, Notification } from '@/lib/types/dashboard'

// Mock user for development
const mockUser: User = {
  id: 'user-1',
  email: 'admin@civicpulse.gov',
  name: 'Maria Santos',
  role: 'admin',
  avatar: undefined,
  department: 'City Safety & Risk Management',
  lastLogin: new Date().toISOString(),
  createdAt: '2024-01-15T00:00:00.000Z',
}

// Auth state (persisted)
export const authStateAtom = atomWithStorage<AuthState>('civicpulse-auth', {
  user: null,
  isAuthenticated: false,
  isLoading: false,
})

// Derived atoms
export const currentUserAtom = atom((get) => get(authStateAtom).user)
export const isAuthenticatedAtom = atom((get) => get(authStateAtom).isAuthenticated)
export const isAuthLoadingAtom = atom((get) => get(authStateAtom).isLoading)

// User role check
export const userRoleAtom = atom((get) => get(authStateAtom).user?.role ?? null)
export const isAdminAtom = atom((get) => get(userRoleAtom) === 'admin')
export const canEditAtom = atom((get) => {
  const role = get(userRoleAtom)
  return role === 'admin' || role === 'analyst' || role === 'operator'
})

// Login action (mock)
export const loginAtom = atom(
  null,
  async (get, set, credentials: { email: string; password: string }) => {
    set(authStateAtom, { user: null, isAuthenticated: false, isLoading: true })
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Mock validation
    if (credentials.email && credentials.password) {
      set(authStateAtom, {
        user: { ...mockUser, email: credentials.email },
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    }
    
    set(authStateAtom, { user: null, isAuthenticated: false, isLoading: false })
    return { success: false, error: 'Invalid credentials' }
  }
)

// Logout action
export const logoutAtom = atom(
  null,
  (get, set) => {
    set(authStateAtom, { user: null, isAuthenticated: false, isLoading: false })
  }
)

// Notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'warning',
    title: 'High Risk Alert',
    message: 'Zone 5 (Barangay Rawis) has exceeded critical threshold',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/dashboard?zone=rawis',
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'New Incident Report',
    message: 'Infrastructure damage reported near City Hall',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Incident Resolved',
    message: 'Traffic incident on National Highway has been cleared',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
]

export const notificationsAtom = atom<Notification[]>(mockNotifications)

export const unreadNotificationCountAtom = atom((get) => 
  get(notificationsAtom).filter((n) => !n.read).length
)

// Mark notification as read
export const markNotificationReadAtom = atom(
  null,
  (get, set, notificationId: string) => {
    const notifications = get(notificationsAtom)
    set(
      notificationsAtom,
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }
)

// Mark all as read
export const markAllNotificationsReadAtom = atom(
  null,
  (get, set) => {
    const notifications = get(notificationsAtom)
    set(
      notificationsAtom,
      notifications.map((n) => ({ ...n, read: true }))
    )
  }
)

// Add notification
export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notifications = get(notificationsAtom)
    set(notificationsAtom, [
      {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...notifications,
    ])
  }
)
