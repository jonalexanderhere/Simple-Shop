"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  MousePointer,
  Globe,
  Smartphone,
  Download,
  Calendar,
} from "lucide-react"
import { useAuth } from "@/lib/auth"

const salesData = [
  { month: "Jan", revenue: 4000000, orders: 24, visitors: 1200 },
  { month: "Feb", revenue: 3000000, orders: 18, visitors: 980 },
  { month: "Mar", revenue: 5000000, orders: 32, visitors: 1500 },
  { month: "Apr", revenue: 4500000, orders: 28, visitors: 1350 },
  { month: "May", revenue: 6000000, orders: 38, visitors: 1800 },
  { month: "Jun", revenue: 5500000, orders: 35, visitors: 1650 },
]

const trafficData = [
  { name: "Organic Search", value: 45, color: "#3B82F6" },
  { name: "Direct", value: 25, color: "#10B981" },
  { name: "Social Media", value: 15, color: "#8B5CF6" },
  { name: "Referral", value: 10, color: "#F59E0B" },
  { name: "Email", value: 5, color: "#EF4444" },
]

const deviceData = [
  { name: "Desktop", sessions: 1250, percentage: 62 },
  { name: "Mobile", sessions: 650, percentage: 32 },
  { name: "Tablet", sessions: 120, percentage: 6 },
]

const topPages = [
  { page: "/", views: 5420, bounce_rate: 32 },
  { page: "/produk", views: 3210, bounce_rate: 28 },
  { page: "/informasi", views: 1890, bounce_rate: 45 },
  { page: "/contact", views: 1560, bounce_rate: 38 },
  { page: "/testimoni", views: 980, bounce_rate: 42 },
]

const conversionFunnel = [
  { stage: "Pengunjung", count: 10000, percentage: 100 },
  { stage: "Lihat Produk", count: 3500, percentage: 35 },
  { stage: "Tambah ke Keranjang", count: 1200, percentage: 12 },
  { stage: "Checkout", count: 450, percentage: 4.5 },
  { stage: "Pembelian", count: 320, percentage: 3.2 },
]

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin-dashboard/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "Rp 28,500,000",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pengunjung Unik",
      value: "8,420",
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Avg. Order Value",
      value: "Rp 285,000",
      change: "-2.1%",
      changeType: "negative",
      icon: ShoppingCart,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">Analisis mendalam performa website dan bisnis Anda</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Hari</SelectItem>
                <SelectItem value="30d">30 Hari</SelectItem>
                <SelectItem value="90d">90 Hari</SelectItem>
                <SelectItem value="1y">1 Tahun</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="glass-effect border-slate-700 hover:neon-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <Badge
                          variant={stat.changeType === "positive" ? "default" : "destructive"}
                          className={`text-xs ${
                            stat.changeType === "positive"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {stat.change}
                        </Badge>
                        <span className="text-xs text-slate-500 ml-2">vs periode sebelumnya</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Revenue & Orders Chart */}
        <Card className="glass-effect border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Revenue & Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources & Device Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <Card className="glass-effect border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-400" />
                Sumber Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={trafficData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {trafficData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {trafficData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-white font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Analytics */}
          <Card className="glass-effect border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-400" />
                Device Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deviceData.map((device, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{device.name}</span>
                      <div className="text-right">
                        <span className="text-white font-semibold">{device.sessions.toLocaleString()}</span>
                        <span className="text-slate-400 text-sm ml-2">({device.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages & Conversion Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card className="glass-effect border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-400" />
                Halaman Terpopuler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                    <div className="flex-1">
                      <p className="text-white font-medium">{page.page}</p>
                      <p className="text-sm text-slate-400">{page.views.toLocaleString()} views</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          page.bounce_rate < 35 ? "default" : page.bounce_rate < 45 ? "secondary" : "destructive"
                        }
                        className={`text-xs ${
                          page.bounce_rate < 35
                            ? "bg-green-500/20 text-green-400"
                            : page.bounce_rate < 45
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {page.bounce_rate}% bounce
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card className="glass-effect border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-cyan-400" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{stage.stage}</span>
                      <div className="text-right">
                        <span className="text-white font-semibold">{stage.count.toLocaleString()}</span>
                        <span className="text-slate-400 text-sm ml-2">({stage.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Activity */}
        <Card className="glass-effect border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-400" />
              Aktivitas Real-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">24</div>
                <p className="text-slate-400">Pengunjung Online</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
                <p className="text-slate-400">Pesanan Hari Ini</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">12</div>
                <p className="text-slate-400">Pesan Baru</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
