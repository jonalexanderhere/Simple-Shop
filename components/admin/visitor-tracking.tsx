"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Monitor, Smartphone, Tablet, Globe, Clock, Search, Filter } from "lucide-react"

interface VisitorData {
  id: string
  ip_address: string
  user_agent: string
  page_url: string
  referrer: string
  country: string
  city: string
  device_type: string
  browser: string
  session_id: string
  visit_duration: number
  created_at: string
}

interface VisitorStats {
  totalVisitors: number
  uniqueVisitors: number
  avgDuration: number
  topCountries: { country: string; count: number }[]
  topDevices: { device: string; count: number }[]
  topPages: { page: string; count: number }[]
}

export function VisitorTracking() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorData[]>([])
  const [stats, setStats] = useState<VisitorStats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    avgDuration: 0,
    topCountries: [],
    topDevices: [],
    topPages: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deviceFilter, setDeviceFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("today")
  const supabase = createClient()

  useEffect(() => {
    fetchVisitorData()
    fetchVisitorStats()

    // Set up real-time subscription
    const channel = supabase
      .channel("visitor-tracking")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "visitor_tracking" }, () => {
        fetchVisitorData()
        fetchVisitorStats()
      })
      .subscribe()

    // Refresh data every minute
    const interval = setInterval(() => {
      fetchVisitorData()
      fetchVisitorStats()
    }, 60000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [timeFilter])

  useEffect(() => {
    filterVisitors()
  }, [visitors, searchTerm, deviceFilter])

  const fetchVisitorData = async () => {
    try {
      let query = supabase.from("visitor_tracking").select("*").order("created_at", { ascending: false }).limit(100)

      // Apply time filter
      if (timeFilter === "today") {
        const today = new Date().toISOString().split("T")[0]
        query = query.gte("created_at", today)
      } else if (timeFilter === "week") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte("created_at", weekAgo)
      } else if (timeFilter === "month") {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        query = query.gte("created_at", monthAgo)
      }

      const { data, error } = await query

      if (error) throw error
      setVisitors(data || [])
    } catch (error) {
      console.error("Error fetching visitor data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchVisitorStats = async () => {
    try {
      let timeCondition = ""
      if (timeFilter === "today") {
        timeCondition = `created_at >= '${new Date().toISOString().split("T")[0]}'`
      } else if (timeFilter === "week") {
        timeCondition = `created_at >= '${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}'`
      } else if (timeFilter === "month") {
        timeCondition = `created_at >= '${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}'`
      }

      // Get total and unique visitors
      const { count: totalVisitors } = await supabase
        .from("visitor_tracking")
        .select("*", { count: "exact", head: true })
        .gte(
          "created_at",
          timeFilter === "today"
            ? new Date().toISOString().split("T")[0]
            : timeFilter === "week"
              ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              : timeFilter === "month"
                ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                : "1970-01-01",
        )

      // Get unique visitors by IP
      const { data: uniqueIPs } = await supabase
        .from("visitor_tracking")
        .select("ip_address")
        .gte(
          "created_at",
          timeFilter === "today"
            ? new Date().toISOString().split("T")[0]
            : timeFilter === "week"
              ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              : timeFilter === "month"
                ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                : "1970-01-01",
        )

      const uniqueVisitors = new Set(uniqueIPs?.map((v) => v.ip_address)).size

      // Get average duration
      const { data: durationsData } = await supabase
        .from("visitor_tracking")
        .select("visit_duration")
        .gte(
          "created_at",
          timeFilter === "today"
            ? new Date().toISOString().split("T")[0]
            : timeFilter === "week"
              ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              : timeFilter === "month"
                ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                : "1970-01-01",
        )
        .not("visit_duration", "is", null)

      const avgDuration = durationsData?.length
        ? durationsData.reduce((sum, d) => sum + (d.visit_duration || 0), 0) / durationsData.length
        : 0

      setStats({
        totalVisitors: totalVisitors || 0,
        uniqueVisitors,
        avgDuration: Math.round(avgDuration),
        topCountries: [],
        topDevices: [],
        topPages: [],
      })
    } catch (error) {
      console.error("Error fetching visitor stats:", error)
    }
  }

  const filterVisitors = () => {
    let filtered = visitors

    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.ip_address.includes(searchTerm) ||
          visitor.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.page_url?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (deviceFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.device_type === deviceFilter)
    }

    setFilteredVisitors(filtered)
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getLocationBadge = (country: string, city: string) => {
    if (!country && !city) return <Badge variant="secondary">Unknown</Badge>
    return (
      <Badge variant="outline" className="border-blue-500/30 text-blue-300">
        <MapPin className="h-3 w-3 mr-1" />
        {city ? `${city}, ${country}` : country}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-blue-500/20">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Total Visitors</CardTitle>
            <Globe className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalVisitors}</div>
            <p className="text-xs text-blue-300">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Real-time tracking
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Unique Visitors</CardTitle>
            <Globe className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.uniqueVisitors}</div>
            <p className="text-xs text-blue-300">Unique IP addresses</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatDuration(stats.avgDuration)}</div>
            <p className="text-xs text-blue-300">Time on site</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Active Now</CardTitle>
            <div className="h-4 w-4 bg-green-400 rounded-full animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {visitors.filter((v) => new Date(v.created_at).getTime() > Date.now() - 5 * 60 * 1000).length}
            </div>
            <p className="text-xs text-blue-300">Last 5 minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Visitor Tracking Table */}
      <Card className="glass-effect border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">Live Visitor Tracking</CardTitle>
          <CardDescription className="text-blue-200">
            Real-time monitoring of website visitors with IP tracking and analytics
          </CardDescription>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <Input
                placeholder="Search IP, location, page..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-blue-500/30 text-white"
              />
            </div>
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-blue-500/30 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-blue-500/30 text-white">
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-500/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-500/20 hover:bg-slate-800/50">
                  <TableHead className="text-blue-200">IP Address</TableHead>
                  <TableHead className="text-blue-200">Location</TableHead>
                  <TableHead className="text-blue-200">Device</TableHead>
                  <TableHead className="text-blue-200">Page</TableHead>
                  <TableHead className="text-blue-200">Duration</TableHead>
                  <TableHead className="text-blue-200">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id} className="border-blue-500/20 hover:bg-slate-800/30">
                    <TableCell className="font-mono text-white">{visitor.ip_address}</TableCell>
                    <TableCell>{getLocationBadge(visitor.country, visitor.city)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-blue-200">
                        {getDeviceIcon(visitor.device_type)}
                        <span className="capitalize">{visitor.device_type || "Desktop"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-200 max-w-xs truncate">{visitor.page_url || "/"}</TableCell>
                    <TableCell className="text-white">{formatDuration(visitor.visit_duration)}</TableCell>
                    <TableCell className="text-blue-200">
                      {new Date(visitor.created_at).toLocaleTimeString("id-ID")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredVisitors.length === 0 && (
              <div className="text-center py-8 text-blue-300">No visitors found matching your criteria</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
