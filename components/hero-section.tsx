"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Star, Users, Zap, Shield } from "lucide-react"
import { shopConfig } from "@/lib/config"
import Link from "next/link"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/80 to-indigo-900/60" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-indigo-500/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-indigo-500/30 transition-all duration-300 text-lg backdrop-blur-sm">
              <Zap className="w-5 h-5 mr-2 animate-pulse" />
              Solusi Digital Terdepan
            </Badge>
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                {shopConfig.shop.name}
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">Digital Solutions</span>
            </h1>
          </div>

          <div
            className={`transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              {shopConfig.shop.description}
            </p>
          </div>

          <div
            className={`transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-10 py-6 text-xl font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 rounded-2xl"
                >
                  Jelajahi Produk
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 px-10 py-6 text-xl bg-transparent backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Lihat Demo
                </Button>
              </Link>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass-effect p-8 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-300">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 font-display">500+</div>
                <p className="text-slate-400 text-lg">Klien Puas</p>
              </div>

              <div className="glass-effect p-8 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-300">
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 font-display">4.9</div>
                <p className="text-slate-400 text-lg">Rating Rata-rata</p>
              </div>

              <div className="glass-effect p-8 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2 font-display">99.9%</div>
                <p className="text-slate-400 text-lg">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-blue-400 rounded-full flex justify-center backdrop-blur-sm bg-blue-500/10">
          <div className="w-1.5 h-4 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
