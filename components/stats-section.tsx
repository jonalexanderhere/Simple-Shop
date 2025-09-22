"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Star, Shield, Zap, Award, Globe } from "lucide-react"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({
    clients: 0,
    rating: 0,
    uptime: 0,
    projects: 0,
    awards: 0,
    countries: 0,
  })
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = [
    { icon: Users, label: "Klien Puas", value: 500, suffix: "+", color: "text-blue-400" },
    { icon: Star, label: "Rating Rata-rata", value: 4.9, suffix: "/5", color: "text-yellow-400" },
    { icon: Shield, label: "Uptime", value: 99.9, suffix: "%", color: "text-green-400" },
    { icon: Zap, label: "Proyek Selesai", value: 1200, suffix: "+", color: "text-purple-400" },
    { icon: Award, label: "Penghargaan", value: 15, suffix: "+", color: "text-orange-400" },
    { icon: Globe, label: "Negara", value: 25, suffix: "+", color: "text-cyan-400" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      stats.forEach((stat, index) => {
        let currentStep = 0
        const increment = stat.value / steps

        const timer = setInterval(() => {
          currentStep++
          const currentValue = Math.min(increment * currentStep, stat.value)

          setCounts((prev) => ({
            ...prev,
            [Object.keys(prev)[index]]: currentValue,
          }))

          if (currentStep >= steps) {
            clearInterval(timer)
          }
        }, stepDuration)
      })
    }
  }, [isVisible])

  return (
    <section ref={sectionRef} className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Pencapaian Kami</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Angka-angka yang membuktikan dedikasi kami dalam memberikan layanan terbaik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const countKey = Object.keys(counts)[index] as keyof typeof counts
            const currentValue = counts[countKey]

            return (
              <Card key={index} className="glass-effect hover:neon-glow transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-6 ${stat.color}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {stat.label === "Rating Rata-rata"
                        ? currentValue.toFixed(1)
                        : Math.floor(currentValue).toLocaleString("id-ID")}
                    </span>
                    <span className={`text-2xl font-semibold ${stat.color}`}>{stat.suffix}</span>
                  </div>
                  <p className="text-slate-400 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
