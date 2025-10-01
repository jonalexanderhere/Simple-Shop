"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  // Check if already authenticated
  useEffect(() => {
    console.log("Auth state:", { isAuthenticated })
    setDebugInfo(`Auth state: ${isAuthenticated}`)
    
    if (isAuthenticated) {
      console.log("Already authenticated, redirecting...")
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    console.log("Starting login process...")
    setDebugInfo("Starting login...")

    try {
      console.log("Calling admin login with:", { email })
      
      // Use unified login system for admin
      const response = await fetch('/api/auth/unified-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType: 'admin' }),
      })

      const data = await response.json()
      console.log("Admin login response:", data)
      
      const success = data.success
      
      setDebugInfo(`Login result: ${success}`)
      
      if (success) {
        console.log("Login successful, redirecting to /admin")
        setDebugInfo("Login successful, redirecting...")
        
        // Force redirect after small delay
        setTimeout(() => {
          router.push('/admin')
          router.refresh()
        }, 100)
      } else {
        setError('Invalid login credentials')
        setDebugInfo("Login failed - invalid credentials")
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please try again.')
      setDebugInfo(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <Card className="w-full max-w-md glass-effect border-blue-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
          <CardDescription className="text-blue-200">Access the JonsStore admin dashboard</CardDescription>
          {/* Debug info */}
          {debugInfo && (
            <div className="text-xs text-yellow-300 mt-2 p-2 bg-yellow-900/20 rounded">
              Debug: {debugInfo}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@jonsstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800/50 border-blue-500/30 text-white"
              />
            </div>
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}