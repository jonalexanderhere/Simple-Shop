"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthStore {
  isAuthenticated: boolean
  user: { email: string; role: string; isAdmin: boolean; isMember: boolean } | null
  login: (email: string, password: string, userType?: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      
      checkAuth: async () => {
        try {
          console.log("Auth store - checking authentication status")
          const response = await fetch('/api/auth/verify', {
            credentials: 'include',
            cache: 'no-store'
          })
          
          if (!response.ok) {
            throw new Error('Verify request failed')
          }
          
          const data = await response.json()
          console.log("Auth store - verify response:", data)
          
          set({ 
            isAuthenticated: data.isAuthenticated, 
            user: data.user 
          })
        } catch (error) {
          console.error('Auth store - check auth error:', error)
          set({ isAuthenticated: false, user: null })
        }
      },
      
      login: async (email: string, password: string, userType?: string) => {
        console.log("Auth store - starting login process")
        try {
          console.log("Auth store - making API call to /api/auth/unified-login")
          const response = await fetch('/api/auth/unified-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              email: email.trim(), 
              password: password.trim(),
              userType: userType || 'member'
            }),
          })

          console.log("Auth store - API response status:", response.status)
          const data = await response.json()
          console.log("Auth store - API response data:", data)

          if (data.success) {
            console.log("Auth store - setting authenticated state")
            set({ 
              isAuthenticated: true, 
              user: data.user 
            })
            return true
          } else {
            console.log("Auth store - login failed:", data.message)
            return false
          }
        } catch (error) {
          console.error('Auth store - login error:', error)
          return false
        }
      },
      
      logout: async () => {
        console.log("Auth store - logging out")
        try {
          await fetch('/api/auth/logout', { 
            method: 'POST',
            credentials: 'include'
          })
        } catch (error) {
          console.error('Auth store - logout error:', error)
        }
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: "admin-auth-storage",
      onRehydrateStorage: () => (state) => {
        console.log("Auth store - rehydrated:", state)
        // Check auth status after rehydration
        if (state) {
          state.checkAuth()
        }
      }
    },
  ),
)