"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, ShoppingCart, TrendingUp, Eye, Package, MessageSquare, Settings, LogOut } from "lucide-react"
import { RealTimeStats } from "./real-time-stats"
import { OrderManagement } from "./order-management"
import { VisitorTracking } from "./visitor-tracking"
import { ProductManagement } from "./product-management"
import { ContactMessages } from "./contact-messages"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalSales: number
  newOrders: number
  dailyVisitors: number
  conversionRate: number
  totalProducts: number
  pendingOrders: number
  totalMessages: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    newOrders: 0,
    dailyVisitors: 0,
    conversionRate: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalMessages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardStats()

    // Set up real-time subscriptions
    const channel = supabase
      .channel("admin-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchDashboardStats()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "visitor_tracking" }, () => {
        fetchDashboardStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Get today's analytics
      const { data: todayAnalytics } = await supabase
        .from("daily_analytics")
        .select("*")
        .eq("date", new Date().toISOString().split("T")[0])
        .single()

      // Get total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)

      // Get pending orders
      const { count: pendingOrdersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      // Get unread messages
      const { count: messagesCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread")

      setStats({
        totalSales: todayAnalytics?.total_sales || 0,
        newOrders: todayAnalytics?.new_orders || 0,
        dailyVisitors: todayAnalytics?.total_visitors || 0,
        conversionRate: todayAnalytics?.conversion_rate || 0,
        totalProducts: productsCount || 0,
        pendingOrders: pendingOrdersCount || 0,
        totalMessages: messagesCount || 0,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <h1 className="text-xl font-bold text-white">Yilzi Admin</h1>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-red-500/20 hover:text-red-400">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="glass-effect border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Total Sales Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalSales)}</div>
              <p className="text-xs text-blue-300">Real-time updates</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">New Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.newOrders}</div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                  {stats.pendingOrders} pending
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Daily Visitors</CardTitle>
              <Eye className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.dailyVisitors}</div>
              <p className="text-xs text-blue-300">{stats.conversionRate}% conversion rate</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Active Products</CardTitle>
              <Package className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                  {stats.totalMessages} messages
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="visitors" className="data-[state=active]:bg-blue-600">
              <Users className="h-4 w-4 mr-2" />
              Visitors
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-600">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-blue-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <RealTimeStats />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="visitors" className="space-y-4">
            <VisitorTracking />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <ContactMessages />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="glass-effect border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-blue-200">
                  Configure system preferences and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white">
                <p>Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
