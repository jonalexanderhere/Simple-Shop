import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Target, Lightbulb, Heart, Shield, Zap, Globe, ArrowRight } from "lucide-react"

export default function InformationPage() {
  const values = [
    {
      icon: Shield,
      title: "Kepercayaan",
      description: "Membangun kepercayaan melalui transparansi dan kualitas layanan yang konsisten",
      color: "text-blue-400",
    },
    {
      icon: Zap,
      title: "Inovasi",
      description: "Selalu menghadirkan solusi terdepan dengan teknologi terbaru",
      color: "text-yellow-400",
    },
    {
      icon: Heart,
      title: "Dedikasi",
      description: "Berkomitmen penuh untuk kesuksesan setiap klien yang mempercayai kami",
      color: "text-red-400",
    },
    {
      icon: Globe,
      title: "Profesionalisme",
      description: "Menjaga standar profesional tinggi dalam setiap aspek layanan",
      color: "text-green-400",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Berdiri",
      description: "JonsStore didirikan dengan visi menjadi penyedia solusi digital terdepan",
    },
    { year: "2021", title: "100+ Klien", description: "Mencapai milestone 100 klien dengan tingkat kepuasan 95%" },
    {
      year: "2022",
      title: "Ekspansi Layanan",
      description: "Menambah layanan hosting dan PPOB untuk melengkapi portofolio",
    },
    {
      year: "2023",
      title: "500+ Proyek",
      description: "Berhasil menyelesaikan lebih dari 500 proyek dengan berbagai kompleksitas",
    },
    { year: "2024", title: "Tim Expert", description: "Membangun tim ahli dengan sertifikasi internasional" },
  ]

  const team = [
    {
      name: "JonsStore",
      role: "Founder & CEO",
      description: "Visioner di balik JonsStore dengan pengalaman 8+ tahun di industri teknologi",
      image: "/professional-businessman-portrait.png",
    },
    {
      name: "Tim Development",
      role: "Lead Developer",
      description: "Tim developer berpengalaman yang menguasai teknologi terkini",
      image: "/professional-businesswoman-portrait.png",
    },
    {
      name: "Tim Support",
      role: "Customer Success",
      description: "Tim support 24/7 yang siap membantu kebutuhan klien kapan saja",
      image: "/digital-marketing-professional-portrait.jpg",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Tentang Kami</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">JonsStore Digital Solutions</h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Menyediakan solusi digital terdepan untuk mengembangkan bisnis Anda ke level yang lebih tinggi dengan
              teknologi modern dan layanan profesional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                <Users className="mr-2 h-5 w-5" />
                Bergabung dengan Kami
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent px-8"
              >
                <Target className="mr-2 h-5 w-5" />
                Lihat Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Visi & Misi</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 gradient-text">
                Membangun Masa Depan Digital
              </h2>

              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Visi Kami</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Menjadi penyedia solusi digital terdepan di Indonesia yang membantu bisnis berkembang melalui
                    teknologi inovatif dan layanan berkualitas tinggi.
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Misi Kami</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Memberikan solusi digital yang inovatif, terjangkau, dan mudah digunakan untuk membantu setiap
                    bisnis mencapai potensi maksimalnya di era digital.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="glass-effect rounded-2xl p-8 text-center">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                    <p className="text-slate-400">Klien Puas</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-400 mb-2">1200+</div>
                    <p className="text-slate-400">Proyek Selesai</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-400 mb-2">4.9/5</div>
                    <p className="text-slate-400">Rating Rata-rata</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
                    <p className="text-slate-400">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Nilai-Nilai Kami</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Prinsip yang Kami Pegang</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Nilai-nilai fundamental yang menjadi landasan setiap keputusan dan tindakan kami dalam melayani klien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="glass-effect hover:neon-glow transition-all duration-300 text-center">
                  <CardContent className="p-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-6 ${value.color}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Perjalanan Kami</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Milestone Penting</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Perjalanan JonsStore dari startup kecil hingga menjadi penyedia solusi digital terpercaya
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="glass-effect hover:neon-glow transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-400 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-900 z-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Tim Kami</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Orang-Orang Hebat</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Tim profesional yang berpengalaman dan berdedikasi untuk memberikan layanan terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="glass-effect hover:neon-glow transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-500">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-semibold mb-4">{member.role}</p>
                  <p className="text-slate-400 leading-relaxed">{member.description}</p>
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
              Siap Memulai Proyek Anda?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Mari berdiskusi tentang bagaimana kami dapat membantu mengembangkan bisnis Anda dengan solusi digital
              terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Konsultasi Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent px-8"
              >
                Lihat Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
