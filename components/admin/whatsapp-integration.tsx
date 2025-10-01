"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageCircle, Send, Settings, Users, BarChart3, Clock } from "lucide-react"
import { WhatsAppService } from "@/lib/whatsapp-service"
import { useToast } from "@/hooks/use-toast"

interface WhatsAppMessage {
  id: string
  order_id: string
  message_type: string
  message_content: string
  sent_at: string
  status: string
  order_number?: string
  customer_name?: string
  customer_phone?: string
}

interface WhatsAppStats {
  totalMessages: number
  todayMessages: number
  pendingMessages: number
  responseRate: number
}

export function WhatsAppIntegration() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [stats, setStats] = useState<WhatsAppStats>({
    totalMessages: 0,
    todayMessages: 0,
    pendingMessages: 0,
    responseRate: 0,
  })
  const [customMessage, setCustomMessage] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [whatsappSettings, setWhatsappSettings] = useState({
    businessNumber: "6282181183590",
    businessName: "JonsStore",
    autoReply: true,
    workingHours: "09:00-21:00",
  })

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
    fetchStats()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .select(`
          *,
          orders (
            order_number,
            users (
              full_name,
              phone
            )
          )
        `)
        .order("sent_at", { ascending: false })
        .limit(50)

      if (error) throw error

      const formattedMessages =
        data?.map((msg) => ({
          ...msg,
          order_number: msg.orders?.order_number,
          customer_name: msg.orders?.users?.full_name,
          customer_phone: msg.orders?.users?.phone,
        })) || []

      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]

      // Get total messages
      const { count: totalMessages } = await supabase
        .from("whatsapp_messages")
        .select("*", { count: "exact", head: true })

      // Get today's messages
      const { count: todayMessages } = await supabase
        .from("whatsapp_messages")
        .select("*", { count: "exact", head: true })
        .gte("sent_at", today)

      // Get pending messages
      const { count: pendingMessages } = await supabase
        .from("whatsapp_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      setStats({
        totalMessages: totalMessages || 0,
        todayMessages: todayMessages || 0,
        pendingMessages: pendingMessages || 0,
        responseRate: 95.5, // Mock data - in real app, calculate from response times
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const sendCustomMessage = async () => {
    if (!customMessage.trim()) {
      toast({
        title: "Error",
        description: "Pesan tidak boleh kosong",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Save message to database
      const { error } = await supabase.from("whatsapp_messages").insert([
        {
          message_type: "custom",
          message_content: customMessage,
          status: "sent",
        },
      ])

      if (error) throw error

      // Send via WhatsApp
      WhatsAppService.sendMessage(customMessage, phoneNumber)

      toast({
        title: "Berhasil",
        description: "Pesan berhasil dikirim via WhatsApp",
      })

      setCustomMessage("")
      setPhoneNumber("")
      fetchMessages()
      fetchStats()
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendQuickMessage = async (type: "greeting" | "support" | "catalog") => {
    setIsLoading(true)
    try {
      const messageContent = getQuickMessageContent(type)

      // Save to database
      const { error } = await supabase.from("whatsapp_messages").insert([
        {
          message_type: type,
          message_content: messageContent,
          status: "sent",
        },
      ])

      if (error) throw error

      // Send via WhatsApp
      WhatsAppService.sendQuickMessage(type)

      toast({
        title: "Berhasil",
        description: `Pesan ${type} berhasil dikirim`,
      })

      fetchMessages()
      fetchStats()
    } catch (error) {
      console.error("Error sending quick message:", error)
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getQuickMessageContent = (type: string) => {
    switch (type) {
      case "greeting":
        return "Pesan sambutan untuk pelanggan baru"
      case "support":
        return "Pesan bantuan dan dukungan pelanggan"
      case "catalog":
        return "Katalog produk dan layanan"
      default:
        return "Pesan umum"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500/20 text-green-300">Terkirim</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-300">Gagal</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case "order":
        return <Badge className="bg-blue-500/20 text-blue-300">Pesanan</Badge>
      case "greeting":
        return <Badge className="bg-green-500/20 text-green-300">Sambutan</Badge>
      case "support":
        return <Badge className="bg-purple-500/20 text-purple-300">Support</Badge>
      case "catalog":
        return <Badge className="bg-orange-500/20 text-orange-300">Katalog</Badge>
      case "custom":
        return <Badge className="bg-gray-500/20 text-gray-300">Custom</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Total Pesan</CardTitle>
            <MessageCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalMessages}</div>
            <p className="text-xs text-green-300">Semua pesan WhatsApp</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.todayMessages}</div>
            <p className="text-xs text-blue-300">Pesan hari ini</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-200">Pending</CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingMessages}</div>
            <p className="text-xs text-yellow-300">Menunggu respon</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Response Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.responseRate}%</div>
            <p className="text-xs text-purple-300">Tingkat respon</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="messages" className="text-white">
            Pesan
          </TabsTrigger>
          <TabsTrigger value="send" className="text-white">
            Kirim Pesan
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-white">
            Pengaturan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <Card className="glass-effect border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Riwayat Pesan WhatsApp</CardTitle>
              <CardDescription className="text-blue-200">Semua pesan yang dikirim melalui sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-blue-500/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-500/20 hover:bg-slate-800/50">
                      <TableHead className="text-blue-200">Waktu</TableHead>
                      <TableHead className="text-blue-200">Tipe</TableHead>
                      <TableHead className="text-blue-200">Pelanggan</TableHead>
                      <TableHead className="text-blue-200">Pesan</TableHead>
                      <TableHead className="text-blue-200">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id} className="border-blue-500/20 hover:bg-slate-800/30">
                        <TableCell className="text-blue-200">
                          {new Date(message.sent_at).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>{getMessageTypeBadge(message.message_type)}</TableCell>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{message.customer_name || "N/A"}</div>
                            <div className="text-sm text-slate-400">{message.customer_phone || "N/A"}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-blue-200 max-w-xs truncate">{message.message_content}</TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-effect border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white">Pesan Cepat</CardTitle>
                <CardDescription className="text-green-200">Kirim template pesan yang sudah disiapkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => sendQuickMessage("greeting")}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Pesan Sambutan
                </Button>
                <Button
                  onClick={() => sendQuickMessage("catalog")}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Katalog Produk
                </Button>
                <Button
                  onClick={() => sendQuickMessage("support")}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Bantuan Support
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Pesan Custom</CardTitle>
                <CardDescription className="text-blue-200">Kirim pesan khusus ke pelanggan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-blue-200">
                    Nomor WhatsApp (Opsional)
                  </Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="628123456789"
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-blue-200">
                    Pesan
                  </Label>
                  <Textarea
                    id="message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Tulis pesan Anda di sini..."
                    rows={4}
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                </div>
                <Button
                  onClick={sendCustomMessage}
                  disabled={isLoading || !customMessage.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Pesan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-effect border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Pengaturan WhatsApp
              </CardTitle>
              <CardDescription className="text-blue-200">Konfigurasi integrasi WhatsApp Business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessNumber" className="text-blue-200">
                    Nomor WhatsApp Business
                  </Label>
                  <Input
                    id="businessNumber"
                    value={whatsappSettings.businessNumber}
                    onChange={(e) =>
                      setWhatsappSettings((prev) => ({
                        ...prev,
                        businessNumber: e.target.value,
                      }))
                    }
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-blue-200">
                    Nama Bisnis
                  </Label>
                  <Input
                    id="businessName"
                    value={whatsappSettings.businessName}
                    onChange={(e) =>
                      setWhatsappSettings((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours" className="text-blue-200">
                    Jam Operasional
                  </Label>
                  <Input
                    id="workingHours"
                    value={whatsappSettings.workingHours}
                    onChange={(e) =>
                      setWhatsappSettings((prev) => ({
                        ...prev,
                        workingHours: e.target.value,
                      }))
                    }
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Simpan Pengaturan</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
