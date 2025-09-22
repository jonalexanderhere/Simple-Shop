"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, CheckCircle } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      setEmail("")
    }, 1500)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <Badge className="mb-6 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Mail className="w-4 h-4 mr-2" />
            Newsletter
          </Badge>

          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Dapatkan Update Terbaru</h2>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Berlangganan newsletter kami untuk mendapatkan informasi produk terbaru, tips digital, dan penawaran
            eksklusif
          </p>

          {/* Newsletter Form */}
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Masukkan email Anda..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Berlangganan
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Terima Kasih!</h3>
                <p className="text-slate-300">
                  Anda telah berhasil berlangganan newsletter kami. Cek email Anda untuk konfirmasi.
                </p>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Update Produk</h4>
              <p className="text-slate-400">Informasi produk dan layanan terbaru</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Tips & Tutorial</h4>
              <p className="text-slate-400">Panduan dan tips digital marketing</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Penawaran Eksklusif</h4>
              <p className="text-slate-400">Diskon dan promo khusus subscriber</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
