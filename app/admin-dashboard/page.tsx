"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const { isAuthenticated, user, logout, checkAuth } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Check authentication status on mount
      const verifyAuth = async () => {
        setCheckingAuth(true)
        await checkAuth()
        setCheckingAuth(false)
      }
      verifyAuth()
    }
  }, [mounted, checkAuth])

  useEffect(() => {
    console.log("Admin dashboard - auth state:", { isAuthenticated, user })
    
    if (mounted && !checkingAuth && !isAuthenticated) {
      console.log("Admin dashboard - not authenticated, redirecting to login")
      router.push('/admin-dashboard/login')
    }
  }, [isAuthenticated, router, mounted, checkingAuth])

  const handleLogout = async () => {
    await logout()
    router.push('/admin-dashboard/login')
  }

  if (!mounted || checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/20">
          <h1 className="text-3xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <div className="text-blue-200 mb-6">
            Welcome, {user?.email}
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-500/20 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">
                Dashboard Status
              </h2>
              <p className="text-blue-200">
                You are successfully logged in to the admin panel.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </Button>
              <Button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}