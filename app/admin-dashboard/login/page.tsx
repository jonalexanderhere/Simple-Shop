"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { shopConfig } from "@/lib/config"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const [mounted, setMounted] = useState(false)
  const { login, isAuthenticated, checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check auth status on mount
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!mounted) return
    
    console.log("Admin dashboard login - auth state:", { isAuthenticated })
    setDebugInfo(`Auth state: ${isAuthenticated}`)
    
    // Jika sudah authenticated, redirect ke dashboard
    if (isAuthenticated) {
      console.log("Already authenticated, redirecting to admin-dashboard...")
      router.push('/admin-dashboard')
    }
  }, [isAuthenticated, router, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    console.log("Admin dashboard login - starting login process...")
    setDebugInfo("Starting login...")

    try {
      console.log("Admin dashboard login - calling login with email:", email)
      const success = await login(email, password)
      console.log("Admin dashboard login - login result:", success)
      
      setDebugInfo(`Login result: ${success}`)
      
      if (success) {
        console.log("Admin dashboard login - login successful, redirecting to /admin-dashboard")
        setDebugInfo("Login successful, redirecting...")
        
        // Redirect ke dashboard
        router.push('/admin-dashboard')
        router.refresh()
      } else {
        setError("Email atau password salah")
        setDebugInfo("Login failed - invalid credentials")
      }
    } catch (err) {
      console.error("Admin dashboard login - error:", err)
      setError("Terjadi kesalahan saat login")
      setDebugInfo(`Error: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">{shopConfig.shop.name} - Login untuk mengakses panel admin</p>
          
          {/* Debug info */}
          {debugInfo && (
            <div className="text-xs text-yellow-300 mt-2 p-2 bg-yellow-900/20 rounded">
              Debug: {debugInfo}
            </div>
          )}
        </div>

        {/* Login Form */}
        <Card className="bg-slate-800/50 backdrop-blur border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-white">Masuk ke Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                    placeholder="yilzi@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-3"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <Shield className="mr-2 h-5 w-5" />
                )}
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Demo Credentials:</p>
              <p className="text-sm text-slate-300">Email: yilzi@gmail.com</p>
              <p className="text-sm text-slate-300">Password: yilzi123</p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-slate-400 hover:text-white">
            ← Kembali ke Website
          </Button>
        </div>
      </div>
    </div>
  )
}