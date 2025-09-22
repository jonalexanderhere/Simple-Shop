"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { createBrowserClient } from "@supabase/ssr"
import {
  Activity,
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface SystemMetrics {
  activeUsers: number
  totalVisitors: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  conversionRate: number
  avgSessionDuration: number
  topPages: Array<{ page: string; views: number }>
  deviceBreakdown: { desktop: number; mobile: number; tablet: number }
  recentActivity: Array<{
    id: string
    type: "order" | "visitor" | "contact"
    description: string
    timestamp: string
    status: "success" | "warning" | "error"
  }>
}

export default function RealTimeMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 0,
    totalVisitors: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    recentActivity: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchMetrics = async () => {
    try {
      // Fetch real-time statistics
      const [visitorsResult, ordersResult, analyticsResult, recentActivityResult] = await Promise.all([
        supabase
          .from("visitor_tracking")
          .select("*")
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("daily_analytics").select("*").order("date", { ascending: false }).limit(7),
        supabase.from("orders").select("*, users(full_name)").order("created_at", { ascending: false }).limit(10),
      ])

      const visitors = visitorsResult.data || []
      const orders = ordersResult.data || []
      const analytics = analyticsResult.data || []
      const recentOrders = recentActivityResult.data || []

      // Calculate metrics
      const activeUsers = visitors.filter((v) => new Date(v.created_at) > new Date(Date.now() - 30 * 60 * 1000)).length

      const pendingOrders = orders.filter((o) => o.status === "pending").length
      const completedOrders = orders.filter((o) => o.status === "completed").length
      const totalRevenue = orders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + (o.total_amount || 0), 0)

      const deviceBreakdown = visitors.reduce(
        (acc, v) => {
          const device = v.device_type?.toLowerCase() || "desktop"
          if (device.includes("mobile")) acc.mobile++
          else if (device.includes("tablet")) acc.tablet++
          else acc.desktop++
          return acc
        },
        { desktop: 0, mobile: 0, tablet: 0 },
      )

      const topPages = visitors.reduce((acc: any, v) => {
        const page = v.page_url || "/"
        acc[page] = (acc[page] || 0) + 1
        return acc
      }, {})

      const topPagesArray = Object.entries(topPages)
        .map(([page, views]) => ({ page, views: views as number }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)

      const avgSessionDuration =
        visitors.length > 0 ? visitors.reduce((sum, v) => sum + (v.visit_duration || 0), 0) / visitors.length : 0

      const conversionRate = visitors.length > 0 ? (orders.length / visitors.length) * 100 : 0

      // Recent activity
      const recentActivity = recentOrders.map((order) => ({
        id: order.id,
        type: "order" as const,
        description: `New order #${order.order_number} from ${order.users?.full_name || "Guest"}`,
        timestamp: order.created_at,
        status:
          order.status === "completed"
            ? ("success" as const)
            : order.status === "cancelled"
              ? ("error" as const)
              : ("warning" as const),
      }))

      setMetrics({
        activeUsers,
        totalVisitors: visitors.length,
        pendingOrders,
        completedOrders,
        totalRevenue,
        conversionRate,
        avgSessionDuration,
        topPages: topPagesArray,
        deviceBreakdown,
        recentActivity,
      })

      setLastUpdate(new Date())
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Real-time Monitoring</h2>
          <p className="text-blue-200">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <Button
          onClick={fetchMetrics}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.activeUsers}</div>
            <p className="text-xs text-blue-200">Currently online</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-green-200">From completed orders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-100">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.pendingOrders}</div>
            <p className="text-xs text-yellow-200">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Conversion Rate</CardTitle>
            <Eye className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.conversionRate.toFixed(2)}%</div>
            <p className="text-xs text-purple-200">Visitors to orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
            Overview
          </TabsTrigger>
          <TabsTrigger value="traffic" className="data-[state=active]:bg-white/20">
            Traffic
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white/20">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Device Breakdown</CardTitle>
                <CardDescription className="text-blue-200">Visitor device types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-blue-400" />
                    <span className="text-white">Desktop</span>
                  </div>
                  <span className="text-white font-medium">{metrics.deviceBreakdown.desktop}</span>
                </div>
                <Progress value={(metrics.deviceBreakdown.desktop / metrics.totalVisitors) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-green-400" />
                    <span className="text-white">Mobile</span>
                  </div>
                  <span className="text-white font-medium">{metrics.deviceBreakdown.mobile}</span>
                </div>
                <Progress value={(metrics.deviceBreakdown.mobile / metrics.totalVisitors) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tablet className="h-4 w-4 text-purple-400" />
                    <span className="text-white">Tablet</span>
                  </div>
                  <span className="text-white font-medium">{metrics.deviceBreakdown.tablet}</span>
                </div>
                <Progress value={(metrics.deviceBreakdown.tablet / metrics.totalVisitors) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Top Pages</CardTitle>
                <CardDescription className="text-blue-200">Most visited pages today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white text-sm truncate">{page.page}</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                        {page.views} views
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Traffic Statistics</CardTitle>
              <CardDescription className="text-blue-200">Visitor analytics for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{metrics.totalVisitors}</div>
                  <p className="text-sm text-blue-200">Total Visitors</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatDuration(Math.round(metrics.avgSessionDuration))}
                  </div>
                  <p className="text-sm text-blue-200">Avg. Session</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{metrics.completedOrders}</div>
                  <p className="text-sm text-blue-200">Completed Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-blue-200">Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.description}</p>
                      <p className="text-blue-200 text-xs">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
