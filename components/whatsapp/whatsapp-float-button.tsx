"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Phone, Clock, Headphones } from "lucide-react"
import { WhatsAppService } from "@/lib/whatsapp-service"

export function WhatsAppFloatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleQuickMessage = (type: "greeting" | "support" | "catalog") => {
    WhatsAppService.sendQuickMessage(type)
    setIsOpen(false)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
          <Card className="glass-effect border-green-500/20 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">YilziShop Support</CardTitle>
                    <CardDescription className="text-green-200 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      Online sekarang
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-300 text-sm">
                Halo! 👋 Ada yang bisa kami bantu? Pilih opsi di bawah atau langsung chat dengan kami.
              </p>

              <div className="space-y-2">
                <Button
                  onClick={() => handleQuickMessage("greeting")}
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mulai Chat
                </Button>

                <Button
                  onClick={() => handleQuickMessage("catalog")}
                  variant="outline"
                  className="w-full justify-start border-green-500/50 text-green-300 hover:bg-green-500/10 bg-transparent"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Lihat Katalog Produk
                </Button>

                <Button
                  onClick={() => handleQuickMessage("support")}
                  variant="outline"
                  className="w-full justify-start border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Bantuan & Support
                </Button>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Respon dalam 5 menit
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    24/7 Online
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Float Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white animate-pulse" />
          )}
        </Button>

        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        )}
      </div>
    </>
  )
}
