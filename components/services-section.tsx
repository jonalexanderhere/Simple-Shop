"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Palette, Server, CreditCard, Search, Smartphone, ArrowRight, CheckCircle } from "lucide-react"

export function ServicesSection() {
  const services = [
    {
      icon: Code,
      title: "Script & Bot Development",
      description: "Pengembangan script dan bot otomatis untuk berbagai kebutuhan bisnis",
      features: ["WhatsApp Bot", "Telegram Bot", "Web Scraping", "Automation Tools"],
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Palette,
      title: "Web Development",
      description: "Pembuatan website profesional dengan design modern dan responsive",
      features: ["Responsive Design", "SEO Optimized", "Admin Panel", "E-commerce"],
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Server,
      title: "Cloud Hosting",
      description: "Layanan hosting cloud dengan performa tinggi dan uptime maksimal",
      features: ["SSD Storage", "Free SSL", "Daily Backup", "24/7 Support"],
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: CreditCard,
      title: "Payment Gateway",
      description: "Integrasi sistem pembayaran lengkap untuk berbagai metode",
      features: ["Multi Provider", "Real-time", "Secure", "API Integration"],
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Search,
      title: "SEO Tools",
      description: "Tools analisis SEO untuk optimasi website dan peningkatan ranking",
      features: ["Keyword Analysis", "Backlink Checker", "Site Audit", "Competitor Analysis"],
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Pengembangan aplikasi mobile untuk Android dan iOS",
      features: ["Cross Platform", "Native Performance", "Push Notification", "Offline Support"],
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ]

  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Layanan Kami</Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Solusi Lengkap Digital</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Kami menyediakan berbagai layanan digital profesional untuk membantu mengembangkan bisnis Anda ke level yang
            lebih tinggi
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="group glass-effect hover:neon-glow transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${service.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-8 w-8 ${service.color}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-400 mb-6 leading-relaxed">{service.description}</p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                    Pelajari Lebih Lanjut
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Butuh Solusi Custom?</h3>
            <p className="text-xl text-slate-300 mb-8">Konsultasikan kebutuhan digital Anda dengan tim expert kami</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
              >
                Konsultasi Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 px-8 bg-transparent"
              >
                Lihat Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
