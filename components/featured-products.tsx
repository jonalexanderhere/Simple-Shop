"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Eye, Heart, ArrowRight, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useCartStore } from "@/lib/cart-store"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  stock_quantity: number
  is_active: boolean
}

export function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { addItem } = useCartStore()
  const supabase = createClient()

  const categories = ["All", "Web Development", "Mobile Development", "Marketing", "E-commerce", "Design", "Hosting"]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).limit(6)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory)

  const handleAddToCart = async (product: Product) => {
    await addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-800/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-6 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/30 text-xl backdrop-blur-sm rounded-full">
            <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
            Produk Unggulan Terbaik
          </Badge>
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
            Solusi Digital Premium
          </h2>
          <p className="text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Pilihan produk dan layanan digital berkualitas tinggi dengan teknologi terdepan untuk mengembangkan bisnis
            Anda ke level selanjutnya
          </p>
        </div>

        {/* Enhanced category filters with view toggle */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl hover:shadow-blue-500/25 hover:scale-110 transform"
                    : "border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 hover:scale-105 bg-transparent backdrop-blur-sm"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-2 backdrop-blur-sm">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className="rounded-lg"
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="rounded-lg"
            >
              List
            </Button>
          </div>
        </div>

        {/* Enhanced product grid with better animations */}
        <div
          className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group glass-effect hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 overflow-hidden border border-blue-500/20 hover:border-blue-400/40 hover:scale-105 rounded-3xl relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              {/* Enhanced product image with overlay effects */}
              <div className="relative overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center relative">
                  {product.image_url ? (
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                    />
                  ) : (
                    <div className="text-8xl font-bold text-blue-400/50 group-hover:scale-110 transition-transform duration-500">
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Animated overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Floating action buttons */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex gap-3">
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/20"
                      >
                        <Eye className="h-5 w-5 text-white" />
                      </Button>
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/20"
                      >
                        <Heart className="h-5 w-5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enhanced badges */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl text-sm px-4 py-2 rounded-full">
                    {product.category}
                  </Badge>
                </div>

                {/* New badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl text-xs px-3 py-1 rounded-full animate-pulse">
                    NEW
                  </Badge>
                </div>
              </div>

              <CardContent className="p-8">
                {/* Enhanced rating display */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-slate-400 font-medium">(4.9) • 127 reviews</span>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400/50 bg-green-400/10 px-3 py-1">
                    Stok: {product.stock_quantity}
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-2 leading-tight">
                  {product.name}
                </h3>

                <p className="text-slate-400 mb-6 line-clamp-3 leading-relaxed text-lg">{product.description}</p>

                {/* Enhanced pricing */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm text-slate-500 line-through">{formatCurrency(product.price * 1.3)}</span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-300 border-red-400/30 px-3 py-1 text-sm">Save 30%</Badge>
                </div>

                {/* Enhanced action buttons */}
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-blue-500/25 transition-all duration-300 rounded-2xl py-3 text-lg font-semibold"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Tambah ke Keranjang
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-blue-500/50 text-blue-300 bg-transparent hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-300 rounded-2xl h-12 w-12"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress bar for stock */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Stok tersisa</span>
                    <span>{product.stock_quantity} unit</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((product.stock_quantity / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced call-to-action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl p-8 backdrop-blur-sm border border-blue-500/20">
            <h3 className="text-3xl font-bold text-white mb-4">Butuh Solusi Khusus?</h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Tim ahli kami siap membantu Anda menemukan solusi digital yang tepat untuk kebutuhan bisnis Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-12 py-4 text-xl rounded-2xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                Lihat Semua Produk
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 px-12 py-4 text-xl bg-transparent backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Konsultasi Gratis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
