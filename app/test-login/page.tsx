"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestLoginPage() {
  const [email, setEmail] = useState("admin@jonsstore.com")
  const [password, setPassword] = useState("jonsstore123")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testLogin = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      console.log("Testing login with:", { email, password })
      
      const response = await fetch('/api/auth/debug-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Debug login response:", data)
      setResult(data)
    } catch (error) {
      console.error("Debug login error:", error)
      setResult({ success: false, message: 'Network error', error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white">Debug Login Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white text-sm">Email:</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 text-white"
            />
          </div>
          <div>
            <label className="text-white text-sm">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 text-white"
            />
          </div>
          <Button 
            onClick={testLogin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Login"}
          </Button>
          
          {result && (
            <Alert className={result.success ? "border-green-500" : "border-red-500"}>
              <AlertDescription>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
