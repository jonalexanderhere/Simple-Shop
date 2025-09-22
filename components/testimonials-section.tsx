"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, Heart, Headphones, ArrowRight } from "lucide-react"
import { testimonials } from "@/lib/config"
import Image from "next/image"

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-slate-800/30 to-slate-900/50 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/3 to-blue-500/3 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <Badge className="mb-8 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/30 text-xl backdrop-blur-sm rounded-full">
            <Quote className="w-6 h-6 mr-3" />
            Testimoni Klien
          </Badge>
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Apa Kata Klien Kami
          </h2>
          <p className="text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Kepuasan klien adalah prioritas utama kami. Berikut testimoni dari mereka yang telah merasakan layanan
            terbaik dan hasil luar biasa dari tim profesional kami
          </p>
        </div>

        {/* Enhanced 3D Testimonial Carousel */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-[500px] perspective-1000">
            {testimonials.map((testimonial, index) => {
              const isActive = index === currentIndex
              const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length
              const isNext = index === (currentIndex + 1) % testimonials.length
              const isPrevPrev = index === (currentIndex - 2 + testimonials.length) % testimonials.length
              const isNextNext = index === (currentIndex + 2) % testimonials.length

              let transform = "translateX(-50%) translateY(-50%) scale(0.4) rotateY(0deg) translateZ(-200px)"
              let zIndex = 1
              let opacity = 0

              if (isActive) {
                transform = "translateX(-50%) translateY(-50%) scale(1.1) rotateY(0deg) translateZ(0px)"
                zIndex = 5
                opacity = 1
              } else if (isPrev) {
                transform = "translateX(-140%) translateY(-50%) scale(0.9) rotateY(35deg) translateZ(-100px)"
                zIndex = 4
                opacity = 0.8
              } else if (isNext) {
                transform = "translateX(40%) translateY(-50%) scale(0.9) rotateY(-35deg) translateZ(-100px)"
                zIndex = 4
                opacity = 0.8
              } else if (isPrevPrev) {
                transform = "translateX(-200%) translateY(-50%) scale(0.7) rotateY(60deg) translateZ(-200px)"
                zIndex = 2
                opacity = 0.4
              } else if (isNextNext) {
                transform = "translateX(100%) translateY(-50%) scale(0.7) rotateY(-60deg) translateZ(-200px)"
                zIndex = 2
                opacity = 0.4
              }

              return (
                <Card
                  key={testimonial.id}
                  className="absolute top-1/2 left-1/2 w-full max-w-3xl glass-effect transition-all duration-1000 ease-out cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20"
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => !isActive && goToTestimonial(index)}
                >
                  <CardContent className="p-10 text-center relative">
                    {/* Enhanced quote styling */}
                    <div className="relative mb-8">
                      <Quote className="absolute -top-6 -left-6 h-12 w-12 text-blue-400/20" />
                      <p className="text-xl md:text-2xl text-slate-300 leading-relaxed italic font-medium px-8">
                        "{testimonial.quote}"
                      </p>
                      <Quote className="absolute -bottom-6 -right-6 h-12 w-12 text-blue-400/20 rotate-180" />
                    </div>

                    {/* Enhanced client info */}
                    <div className="flex items-center justify-center gap-6">
                      <div className="relative">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={100}
                          height={100}
                          className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className="text-2xl font-bold text-white mb-2">{testimonial.name}</h4>
                        <p className="text-blue-400 text-lg mb-3">{testimonial.role}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                          <span className="ml-2 text-slate-400 text-sm">({testimonial.rating}.0)</span>
                        </div>
                      </div>
                    </div>

                    {/* Company badge */}
                    <div className="mt-6">
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-400/30 px-4 py-2">
                        Verified Client
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Enhanced Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 bg-slate-900/80 backdrop-blur-sm h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 bg-slate-900/80 backdrop-blur-sm h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Enhanced Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-4 w-4 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 scale-125 shadow-lg shadow-blue-500/50"
                    : "bg-slate-600 hover:bg-slate-500 hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Stats with animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto">
          {[
            { value: "4.9/5", label: "Rating Rata-rata", icon: Star, color: "text-yellow-400" },
            { value: "500+", label: "Klien Puas", icon: CheckCircle, color: "text-green-400" },
            { value: "98%", label: "Tingkat Kepuasan", icon: Heart, color: "text-red-400" },
            { value: "24/7", label: "Support", icon: Headphones, color: "text-blue-400" },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
                  <Icon
                    className={`h-12 w-12 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <div className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-slate-400 text-lg">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl p-8 backdrop-blur-sm border border-blue-500/20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">Bergabunglah dengan Klien Puas Kami</h3>
            <p className="text-xl text-slate-300 mb-8">
              Rasakan pengalaman layanan digital terbaik dan bergabunglah dengan ratusan klien yang telah merasakan
              kepuasan bekerja sama dengan kami
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-12 py-4 text-xl rounded-2xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              Mulai Proyek Anda
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
