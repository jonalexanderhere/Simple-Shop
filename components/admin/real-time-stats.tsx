"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react"

interface ChartData {
  date: string
  visitors: number
  sales: number
  orders: number
  conversion: number
}

interface LiveStats {
  currentVisitors: number
  todayOrders: number
  todaySales: number
  conversionRate: number
}

export function RealTimeStats() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [liveStats, setLiveStats] = useState<LiveStats>({
    currentVisitors: 0,
    todayOrders: 0,
    todaySales: 0,
    conversionRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAnalyticsData()
    fetchLiveStats()

    // Set up real-time subscriptions
    const channel = supabase
      .channel("real-time-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_analytics" }, () => {
        fetchAnalyticsData()
        fetchLiveStats()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "visitor_tracking" }, () => {
        fetchLiveStats()
      })
      .subscribe()

    // Update live stats every 30 seconds
    const interval = setInterval(fetchLiveStats, 30000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const { data, error } = await supabase
        .from("daily_analytics")
        .select("*")
        .order("date", { ascending: true })
        .limit(30)

      if (error) throw error

      const formattedData =
        data?.map((item) => ({
          date: new Date(item.date).toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
          visitors: item.total_visitors,
          sales: item.total_sales / 1000000, // Convert to millions for better chart display
          orders: item.new_orders,
          conversion: item.conversion_rate,
        })) || []

      setChartData(formattedData)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    }
  }

  const fetchLiveStats = async () => {
    try {
      // Get today's analytics
      const today = new Date().toISOString().split("T")[0]
      const { data: todayData } = await supabase.from("daily_analytics").select("*").eq("date", today).single()

      // Get current active visitors (last 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      const { count: currentVisitors } = await supabase
        .from("visitor_tracking")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyMinutesAgo)

      setLiveStats({
        currentVisitors: currentVisitors || 0,
        todayOrders: todayData?.new_orders || 0,
        todaySales: todayData?.total_sales || 0,
        conversionRate: todayData?.conversion_rate || 0,
      })
    } catch (error) {
      console.error("Error fetching live stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-effect border-blue-500/20">
            <CardContent className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Active Visitors</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveStats.currentVisitors}</div>
            <p className="text-xs text-blue-300">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Live now
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Today's Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveStats.todayOrders}</div>
            <p className="text-xs text-blue-300">{liveStats.conversionRate}% conversion rate</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(liveStats.todaySales)}</div>
            <p className="text-xs text-blue-300">Real-time tracking</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{liveStats.conversionRate}%</div>
            <p className="text-xs text-blue-300">Visitors to customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-effect border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">Visitors & Sales Trend</CardTitle>
            <CardDescription className="text-blue-200">
              30-day overview of website traffic and sales performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.3} />
                <XAxis dataKey="date" stroke="#93c5fd" />
                <YAxis stroke="#93c5fd" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.9)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} name="Visitors" />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Sales (M IDR)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">Orders & Conversion</CardTitle>
            <CardDescription className="text-blue-200">Daily orders and conversion rate analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.3} />
                <XAxis dataKey="date" stroke="#93c5fd" />
                <YAxis stroke="#93c5fd" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.9)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" name="Orders" />
                <Bar dataKey="conversion" fill="#f59e0b" name="Conversion %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
