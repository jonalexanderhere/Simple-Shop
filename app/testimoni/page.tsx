import { Navigation } from "@/components/navigation"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote, Users, Award, TrendingUp } from "lucide-react"
import { testimonials } from "@/lib/config"

export default function TestimonialsPage() {
  const stats = [
    { icon: Users, label: "Total Klien", value: "500+", color: "text-blue-400" },
    { icon: Star, label: "Rating Rata-rata", value: "4.9/5", color: "text-yellow-400" },
    { icon: Award, label: "Tingkat Kepuasan", value: "98%", color: "text-green-400" },
    { icon: TrendingUp, label: "Repeat Client", value: "85%", color: "text-purple-400" },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Testimoni Klien</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">Cerita Sukses Klien</h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Dengarkan langsung dari klien kami tentang pengalaman menggunakan layanan JonsStore Digital Solutions
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/50 mb-3 ${stat.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Testimonials */}
      <TestimonialsSection />

      {/* All Testimonials Grid */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Semua Testimoni</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Koleksi lengkap testimoni dari berbagai klien yang telah mempercayai layanan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card key={index} className="glass-effect hover:neon-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-blue-400/30" />
                    <p className="text-slate-300 leading-relaxed italic pl-4">"{testimonial.quote}"</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-blue-400 mb-2">{testimonial.role}</p>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">
              Bergabunglah dengan Klien Puas Kami
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Jadilah bagian dari cerita sukses berikutnya. Mari wujudkan visi digital Anda bersama kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Mulai Proyek Anda
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent px-8"
              >
                Konsultasi Gratis
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
