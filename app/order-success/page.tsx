"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageCircle, Home } from "lucide-react"

export default function OrderSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect border-green-500/20 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Order Placed Successfully!</CardTitle>
          <CardDescription className="text-green-200">Your order has been created and sent to WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderNumber && (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-green-500/20">
              <p className="text-blue-200 text-sm">Order Number</p>
              <p className="text-white font-mono font-bold text-lg">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-blue-200">
              <MessageCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm">WhatsApp message has been prepared</span>
            </div>
            <p className="text-blue-300 text-sm">Please complete your payment via WhatsApp to confirm your order.</p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <p className="text-xs text-blue-400">Redirecting to home in {countdown} seconds...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
