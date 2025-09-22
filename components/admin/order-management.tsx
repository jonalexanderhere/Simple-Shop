"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Clock, Search, Filter, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  user_id: string
  shipping_address: string
  notes: string
  whatsapp_sent: boolean
  users?: {
    full_name: string
    email: string
    phone: string
  }
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()

    // Set up real-time subscription
    const channel = supabase
      .channel("orders-management")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          users (
            full_name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      })

      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const sendWhatsAppMessage = async (order: Order) => {
    try {
      const message = `Halo ${order.users?.full_name || "Customer"}, terima kasih atas pesanan Anda (${order.order_number}). Total: ${formatCurrency(order.total_amount)}. Tim kami akan segera memproses pesanan Anda.`
      const whatsappUrl = `https://wa.me/${order.users?.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`

      window.open(whatsappUrl, "_blank")

      // Mark as WhatsApp sent
      await supabase.from("orders").update({ whatsapp_sent: true }).eq("id", order.id)

      fetchOrders()
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
      processing: { color: "bg-blue-500/20 text-blue-400", icon: Clock },
      completed: { color: "bg-green-500/20 text-green-400", icon: CheckCircle },
      cancelled: { color: "bg-red-500/20 text-red-400", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
    <Card className="glass-effect border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white">Order Management</CardTitle>
        <CardDescription className="text-blue-200">Manage and track all customer orders in real-time</CardDescription>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-blue-500/30 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-blue-500/30 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-blue-500/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-blue-500/20 hover:bg-slate-800/50">
                <TableHead className="text-blue-200">Order #</TableHead>
                <TableHead className="text-blue-200">Customer</TableHead>
                <TableHead className="text-blue-200">Amount</TableHead>
                <TableHead className="text-blue-200">Status</TableHead>
                <TableHead className="text-blue-200">Date</TableHead>
                <TableHead className="text-blue-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-blue-500/20 hover:bg-slate-800/30">
                  <TableCell className="font-medium text-white">{order.order_number}</TableCell>
                  <TableCell className="text-blue-200">
                    <div>
                      <div className="font-medium">{order.users?.full_name || "N/A"}</div>
                      <div className="text-sm text-blue-300">{order.users?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-medium">{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-blue-200">
                    {new Date(order.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "processing")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Process
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "completed")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </Button>
                      )}
                      {order.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                        >
                          Cancel
                        </Button>
                      )}
                      {order.users?.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendWhatsAppMessage(order)}
                          className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-blue-300">No orders found matching your criteria</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
