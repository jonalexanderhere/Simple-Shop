"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createBrowserClient } from "@supabase/ssr"
import { Database, Wifi, HardDrive, Cpu, Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface SystemHealth {
  database: {
    status: "healthy" | "warning" | "error"
    responseTime: number
    connections: number
    uptime: number
  }
  api: {
    status: "healthy" | "warning" | "error"
    responseTime: number
    requests: number
    errors: number
  }
  storage: {
    used: number
    total: number
    status: "healthy" | "warning" | "error"
  }
  performance: {
    cpu: number
    memory: number
    status: "healthy" | "warning" | "error"
  }
}

export default function SystemHealth() {
  const [health, setHealth] = useState<SystemHealth>({
    database: { status: "healthy", responseTime: 0, connections: 0, uptime: 99.9 },
    api: { status: "healthy", responseTime: 0, requests: 0, errors: 0 },
    storage: { used: 0, total: 100, status: "healthy" },
    performance: { cpu: 0, memory: 0, status: "healthy" },
  })
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const checkSystemHealth = async () => {
    try {
      const startTime = Date.now()

      // Test database connection
      const { data, error } = await supabase.from("daily_analytics").select("count").limit(1)

      const dbResponseTime = Date.now() - startTime

      // Simulate system metrics (in a real app, these would come from monitoring services)
      const mockHealth: SystemHealth = {
        database: {
          status: error ? "error" : dbResponseTime > 1000 ? "warning" : "healthy",
          responseTime: dbResponseTime,
          connections: Math.floor(Math.random() * 50) + 10,
          uptime: 99.9,
        },
        api: {
          status: "healthy",
          responseTime: Math.floor(Math.random() * 200) + 50,
          requests: Math.floor(Math.random() * 1000) + 500,
          errors: Math.floor(Math.random() * 5),
        },
        storage: {
          used: Math.floor(Math.random() * 60) + 20,
          total: 100,
          status: "healthy",
        },
        performance: {
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 50) + 30,
          status: "healthy",
        },
      }

      // Determine storage status
      const storageUsage = (mockHealth.storage.used / mockHealth.storage.total) * 100
      if (storageUsage > 90) mockHealth.storage.status = "error"
      else if (storageUsage > 75) mockHealth.storage.status = "warning"

      // Determine performance status
      if (mockHealth.performance.cpu > 80 || mockHealth.performance.memory > 85) {
        mockHealth.performance.status = "error"
      } else if (mockHealth.performance.cpu > 60 || mockHealth.performance.memory > 70) {
        mockHealth.performance.status = "warning"
      }

      setHealth(mockHealth)
    } catch (error) {
      console.error("Error checking system health:", error)
      setHealth((prev) => ({
        ...prev,
        database: { ...prev.database, status: "error" },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSystemHealth()
    const interval = setInterval(checkSystemHealth, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: "bg-green-500/20 text-green-200 border-green-400/30",
      warning: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
      error: "bg-red-500/20 text-red-200 border-red-400/30",
    }
    return colors[status as keyof typeof colors] || colors.healthy
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">System Health</h3>
        <p className="text-blue-200">Monitor system performance and status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Database Health */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Database</CardTitle>
            <Database className={`h-4 w-4 ${getStatusColor(health.database.status)}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(health.database.status)}
              <Badge className={getStatusBadge(health.database.status)}>{health.database.status.toUpperCase()}</Badge>
            </div>
            <div className="text-xs text-blue-200 space-y-1">
              <div>Response: {health.database.responseTime}ms</div>
              <div>Connections: {health.database.connections}</div>
              <div>Uptime: {health.database.uptime}%</div>
            </div>
          </CardContent>
        </Card>

        {/* API Health */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">API</CardTitle>
            <Wifi className={`h-4 w-4 ${getStatusColor(health.api.status)}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(health.api.status)}
              <Badge className={getStatusBadge(health.api.status)}>{health.api.status.toUpperCase()}</Badge>
            </div>
            <div className="text-xs text-blue-200 space-y-1">
              <div>Response: {health.api.responseTime}ms</div>
              <div>Requests: {health.api.requests}</div>
              <div>Errors: {health.api.errors}</div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Health */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Storage</CardTitle>
            <HardDrive className={`h-4 w-4 ${getStatusColor(health.storage.status)}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(health.storage.status)}
              <Badge className={getStatusBadge(health.storage.status)}>{health.storage.status.toUpperCase()}</Badge>
            </div>
            <div className="space-y-2">
              <Progress value={(health.storage.used / health.storage.total) * 100} className="h-2" />
              <div className="text-xs text-blue-200">
                {health.storage.used}GB / {health.storage.total}GB used
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Health */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Performance</CardTitle>
            <Cpu className={`h-4 w-4 ${getStatusColor(health.performance.status)}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(health.performance.status)}
              <Badge className={getStatusBadge(health.performance.status)}>
                {health.performance.status.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>CPU</span>
                  <span>{health.performance.cpu}%</span>
                </div>
                <Progress value={health.performance.cpu} className="h-1" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Memory</span>
                  <span>{health.performance.memory}%</span>
                </div>
                <Progress value={health.performance.memory} className="h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
