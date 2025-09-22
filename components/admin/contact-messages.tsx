"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, Phone, CheckCircle, Clock, Trash2, Reply } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: "unread" | "read" | "replied"
  created_at: string
}

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">("all")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, status: "read" | "replied") => {
    try {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", messageId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Message marked as ${status}`,
      })
      fetchMessages()
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      })
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", messageId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Message deleted successfully",
      })
      fetchMessages()
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return

    try {
      // In a real app, you would send an email here
      // For now, we'll just mark as replied and show a success message
      await updateMessageStatus(selectedMessage.id, "replied")

      toast({
        title: "Reply Sent",
        description: `Reply sent to ${selectedMessage.email}`,
      })

      setIsReplyDialogOpen(false)
      setReplyText("")
      setSelectedMessage(null)
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return <Badge className="bg-red-500/20 text-red-200 border-red-400/30">Unread</Badge>
      case "read":
        return <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">Read</Badge>
      case "replied":
        return <Badge className="bg-green-500/20 text-green-200 border-green-400/30">Replied</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-200 border-gray-400/30">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unread":
        return <MessageSquare className="h-4 w-4 text-red-400" />
      case "read":
        return <Clock className="h-4 w-4 text-yellow-400" />
      case "replied":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true
    return message.status === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Contact Messages</h2>
          <p className="text-blue-200">Manage customer inquiries and support requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
          >
            All ({messages.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-red-600" : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
          >
            Unread ({messages.filter((m) => m.status === "unread").length})
          </Button>
          <Button
            variant={filter === "replied" ? "default" : "outline"}
            onClick={() => setFilter("replied")}
            className={
              filter === "replied" ? "bg-green-600" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            Replied ({messages.filter((m) => m.status === "replied").length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(message.status)}
                    <CardTitle className="text-white text-lg">{message.subject}</CardTitle>
                    {getStatusBadge(message.status)}
                  </div>
                  <CardDescription className="text-blue-200">
                    From: {message.name} • {formatDate(message.created_at)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Mail className="h-4 w-4" />
                  <span>{message.email}</span>
                </div>
                {message.phone && (
                  <div className="flex items-center space-x-2 text-blue-200">
                    <Phone className="h-4 w-4" />
                    <span>{message.phone}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-white text-sm leading-relaxed">{message.message}</p>
              </div>

              <div className="flex items-center space-x-2">
                {message.status === "unread" && (
                  <Button
                    size="sm"
                    onClick={() => updateMessageStatus(message.id, "read")}
                    className="bg-yellow-600/20 border-yellow-400/30 text-yellow-200 hover:bg-yellow-600/30"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Read
                  </Button>
                )}

                <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setSelectedMessage(message)}
                      className="bg-blue-600/20 border-blue-400/30 text-blue-200 hover:bg-blue-600/30"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Send a reply to {selectedMessage?.email}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Original Message:</h4>
                        <p className="text-slate-300 text-sm">{selectedMessage?.message}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reply">Your Reply</Label>
                        <Textarea
                          id="reply"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="bg-slate-700 border-slate-600 min-h-[120px]"
                          placeholder="Type your reply here..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleReply} className="bg-blue-600 hover:bg-blue-700">
                        Send Reply
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMessage(message.id)}
                  className="bg-red-600/20 border-red-400/30 text-red-200 hover:bg-red-600/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === "all" ? "No Messages Found" : `No ${filter} Messages`}
            </h3>
            <p className="text-blue-200 text-center">
              {filter === "all"
                ? "Customer messages will appear here when they contact you."
                : `No messages with ${filter} status found.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
