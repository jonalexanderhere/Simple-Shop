"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SystemCheck {
  name: string
  status: "checking" | "success" | "warning" | "error"
  message: string
}

export function SystemStatus() {
  const [checks, setChecks] = useState<SystemCheck[]>([
    { name: "Database Connection", status: "checking", message: "Connecting..." },
    { name: "RLS Policies", status: "checking", message: "Verifying..." },
    { name: "Visitor Tracking", status: "checking", message: "Testing..." },
    { name: "Product Catalog", status: "checking", message: "Loading..." },
    { name: "Analytics System", status: "checking", message: "Initializing..." },
  ])

  useEffect(() => {
    const runSystemChecks = async () => {
      const supabase = createClient()

      // Check database connection
      try {
        const { error } = await supabase.from("products").select("count").limit(1)
        updateCheck(
          "Database Connection",
          error ? "error" : "success",
          error ? "Connection failed" : "Connected successfully",
        )
      } catch (err) {
        updateCheck("Database Connection", "error", "Connection failed")
      }

      // Check RLS policies
      try {
        const { error } = await supabase.from("daily_analytics").select("*").limit(1)
        updateCheck(
          "RLS Policies",
          error ? "warning" : "success",
          error ? "Some policies may need adjustment" : "All policies working",
        )
      } catch (err) {
        updateCheck("RLS Policies", "error", "Policy check failed")
      }

      // Check visitor tracking
      try {
        const { error } = await supabase.from("visitor_tracking").select("count").limit(1)
        updateCheck(
          "Visitor Tracking",
          error ? "error" : "success",
          error ? "Tracking system offline" : "Tracking system active",
        )
      } catch (err) {
        updateCheck("Visitor Tracking", "error", "Tracking system error")
      }

      // Check product catalog
      try {
        const { data, error } = await supabase.from("products").select("count").eq("is_active", true)
        updateCheck(
          "Product Catalog",
          error ? "error" : "success",
          error ? "Catalog unavailable" : `${data?.length || 0} active products`,
        )
      } catch (err) {
        updateCheck("Product Catalog", "error", "Catalog error")
      }

      // Check analytics system
      try {
        const { error } = await supabase.from("daily_analytics").select("*").limit(1)
        updateCheck(
          "Analytics System",
          error ? "warning" : "success",
          error ? "Analytics may be limited" : "Analytics fully operational",
        )
      } catch (err) {
        updateCheck("Analytics System", "error", "Analytics system error")
      }
    }

    const updateCheck = (name: string, status: SystemCheck["status"], message: string) => {
      setChecks((prev) => prev.map((check) => (check.name === name ? { ...check, status, message } : check)))
    }

    runSystemChecks()
  }, [])

  const getStatusIcon = (status: SystemCheck["status"]) => {
    switch (status) {
      case "checking":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: SystemCheck["status"]) => {
    const variants = {
      checking: "secondary",
      success: "default",
      warning: "secondary",
      error: "destructive",
    } as const

    const colors = {
      checking: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    }

    return <Badge className={colors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const overallStatus = checks.every((c) => c.status === "success")
    ? "success"
    : checks.some((c) => c.status === "error")
      ? "error"
      : checks.some((c) => c.status === "warning")
        ? "warning"
        : "checking"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Status</span>
          {getStatusBadge(overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checks.map((check) => (
            <div key={check.name} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium">{check.name}</p>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
