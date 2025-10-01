"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageCircle,
  Send,
  Github,
  Youtube,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Clock,
  Headphones,
  CheckCircle,
} from "lucide-react"
import { shopConfig } from "@/lib/config"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    service: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat langsung dengan tim support kami",
      value: `+${shopConfig.contact.whatsapp}`,
      action: `https://wa.me/${shopConfig.contact.whatsapp}`,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Send,
      title: "Telegram",
      description: "Hubungi kami melalui Telegram",
      value: shopConfig.contact.telegram,
      action: `https://t.me/${shopConfig.contact.telegram.replace("@", "")}`,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Kirim email untuk pertanyaan detail",
      value: "info@jonsstore.com",
      action: "mailto:info@jonsstore.com",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Phone,
      title: "Telepon",
      description: "Hubungi langsung untuk konsultasi",
      value: `+${shopConfig.contact.whatsapp}`,
      action: `tel:+${shopConfig.contact.whatsapp}`,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  const socialLinks = [
    {
      name: "GitHub",
      href: `https://github.com/${shopConfig.contact.github}`,
      icon: Github,
      color: "hover:text-gray-400",
      followers: "1.2K",
    },
    {
      name: "YouTube",
      href: `https://youtube.com/@${shopConfig.contact.youtube}`,
      icon: Youtube,
      color: "hover:text-red-400",
      followers: "5.8K",
    },
    {
      name: "Instagram",
      href: `https://instagram.com/${shopConfig.contact.instagram}`,
      icon: Instagram,
      color: "hover:text-pink-400",
      followers: "3.2K",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Send to WhatsApp
      const message = `Pesan dari Website:

Nama: ${formData.name}
Email: ${formData.email}
Telepon: ${formData.phone}
Subjek: ${formData.subject}
Layanan: ${formData.service}

Pesan:
${formData.message}`

      const whatsappUrl = `https://wa.me/${shopConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Enhanced Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-8 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/30 text-xl backdrop-blur-sm rounded-full">
              <MessageCircle className="w-6 h-6 mr-3" />
              Hubungi Kami
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Mari Berkolaborasi
            </h1>
            <p className="text-2xl md:text-3xl text-slate-300 mb-12 leading-relaxed">
              Siap membantu mewujudkan visi digital Anda. Hubungi kami untuk konsultasi gratis dan solusi terbaik yang
              akan mengubah bisnis Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-12 py-4 text-xl rounded-2xl shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Chat WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 bg-transparent px-12 py-4 text-xl rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Mail className="mr-3 h-6 w-6" />
                Kirim Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Methods */}
      <section className="py-24 bg-gradient-to-b from-slate-900/30 to-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Cara Menghubungi Kami
            </h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Pilih metode komunikasi yang paling nyaman untuk Anda. Tim ahli kami siap membantu 24/7 dengan respons
              cepat dan solusi terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card
                  key={index}
                  className="glass-effect hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 text-center group hover:scale-105 rounded-3xl overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <CardContent className="p-10">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${method.bgColor} mb-8 group-hover:scale-125 transition-all duration-500 shadow-xl`}
                    >
                      <Icon className={`h-10 w-10 ${method.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{method.title}</h3>
                    <p className="text-slate-400 mb-6 text-lg leading-relaxed">{method.description}</p>
                    <p className="text-blue-400 font-semibold mb-8 text-lg">{method.value}</p>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 text-lg rounded-2xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                      onClick={() => window.open(method.action, "_blank")}
                    >
                      Hubungi Sekarang
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Kirim Pesan</h2>
              <p className="text-xl text-slate-300">
                Ceritakan kebutuhan proyek Anda dan kami akan memberikan solusi terbaik
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Lokasi</h4>
                        <p className="text-slate-400">Indonesia</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Jam Operasional</h4>
                        <p className="text-slate-400">24/7 Support</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Headphones className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Response Time</h4>
                        <p className="text-slate-400">&lt; 1 Jam</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Ikuti Kami</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon
                      return (
                        <Button
                          key={social.name}
                          variant="outline"
                          size="icon"
                          asChild
                          className={`border-slate-600 bg-transparent ${social.color} transition-colors`}
                        >
                          <a href={social.href} target="_blank" rel="noopener noreferrer">
                            <Icon className="h-5 w-5" />
                          </a>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="glass-effect">
                  <CardContent className="p-8">
                    {!isSubmitted ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap *</label>
                            <Input
                              required
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white"
                              placeholder="Masukkan nama lengkap"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                            <Input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white"
                              placeholder="nama@email.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nomor Telepon</label>
                            <Input
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white"
                              placeholder="+62 xxx xxxx xxxx"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Layanan yang Dibutuhkan
                            </label>
                            <Select
                              value={formData.service}
                              onValueChange={(value) => handleInputChange("service", value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                                <SelectValue placeholder="Pilih layanan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="website">Pembuatan Website</SelectItem>
                                <SelectItem value="bot">Bot Development</SelectItem>
                                <SelectItem value="hosting">Cloud Hosting</SelectItem>
                                <SelectItem value="ppob">Sistem PPOB</SelectItem>
                                <SelectItem value="seo">SEO Tools</SelectItem>
                                <SelectItem value="konsultasi">Konsultasi</SelectItem>
                                <SelectItem value="lainnya">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Subjek *</label>
                          <Input
                            required
                            value={formData.subject}
                            onChange={(e) => handleInputChange("subject", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white"
                            placeholder="Subjek pesan Anda"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Pesan *</label>
                          <Textarea
                            required
                            rows={6}
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white resize-none"
                            placeholder="Ceritakan detail kebutuhan proyek Anda..."
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-3"
                        >
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          ) : (
                            <Send className="mr-2 h-5 w-5" />
                          )}
                          {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Pesan Terkirim!</h3>
                        <p className="text-slate-300 mb-6">
                          Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.
                        </p>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          variant="outline"
                          className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent"
                        >
                          Kirim Pesan Lain
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Pertanyaan Umum</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Jawaban untuk pertanyaan yang sering diajukan oleh klien kami
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Berapa lama waktu pengerjaan proyek?",
                answer:
                  "Waktu pengerjaan bervariasi tergantung kompleksitas proyek, mulai dari 1-4 minggu untuk proyek standar.",
              },
              {
                question: "Apakah ada garansi untuk layanan?",
                answer: "Ya, kami memberikan garansi 30 hari untuk semua layanan dan support teknis berkelanjutan.",
              },
              {
                question: "Bagaimana sistem pembayaran?",
                answer:
                  "Kami menerima pembayaran melalui transfer bank, e-wallet, dan berbagai metode pembayaran digital.",
              },
              {
                question: "Apakah bisa konsultasi gratis?",
                answer: "Tentu! Kami menyediakan konsultasi gratis untuk memahami kebutuhan proyek Anda.",
              },
            ].map((faq, index) => (
              <Card key={index} className="glass-effect hover:neon-glow transition-all duration-300">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
