"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function TestUnifiedLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("member")
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testLogin = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      console.log("Testing unified login with:", { email, password, userType })
      
      const response = await fetch('/api/auth/unified-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      })

      const data = await response.json()
      console.log("Unified login response:", data)
      setResult(data)
    } catch (error) {
      console.error("Unified login error:", error)
      setResult({ success: false, message: 'Network error', error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testCredentials = (type: string) => {
    if (type === 'admin') {
      setEmail("admin@jonsstore.com")
      setPassword("jonsstore123")
      setUserType("admin")
    } else if (type === 'member') {
      setEmail("member@jonsstore.com")
      setPassword("member123")
      setUserType("member")
    } else {
      setEmail("any@email.com")
      setPassword("anypassword")
      setUserType("member")
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white">Test Unified Login System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-white text-sm">User Type:</label>
            <div className="flex gap-2">
              <Button 
                variant={userType === "admin" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("admin")}
              >
                Admin
              </Button>
              <Button 
                variant={userType === "member" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("member")}
              >
                Member
              </Button>
            </div>
          </div>

          <div>
            <label className="text-white text-sm">Email:</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 text-white"
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <label className="text-white text-sm">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800 text-white"
              placeholder="Enter password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm">Quick Test:</label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testCredentials('admin')}
                className="text-xs"
              >
                Admin Creds
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testCredentials('member')}
                className="text-xs"
              >
                Member Creds
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => testCredentials('any')}
                className="text-xs"
              >
                Any Creds
              </Button>
            </div>
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "SUCCESS" : "FAILED"}
                    </Badge>
                    {result.user?.role && (
                      <Badge variant="outline">
                        {result.user.role.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <pre className="text-xs overflow-auto bg-slate-800 p-2 rounded">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
