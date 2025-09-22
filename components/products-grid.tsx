"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, ShoppingCart, Eye, Heart, Search, Grid, List } from "lucide-react"
import { products } from "@/lib/config"
import { useCart } from "@/hooks/use-cart"
import { ProductModal } from "@/components/product-modal"
import { CartSidebar } from "@/components/cart-sidebar"
import Image from "next/image"

export function ProductsGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { addItem } = useCart()

  const categories = ["All", "Script", "Jasa", "Hosting", "PPOB", "Utilities"]

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setIsCartOpen(true)
  }

  return (
    <section className="py-12 bg-slate-900/30">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Cari Produk</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kategori</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Urutkan</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="reviews">Paling Populer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tampilan</label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="bg-slate-800/50 border-slate-600"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="bg-slate-800/50 border-slate-600"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rentang Harga: Rp {priceRange[0].toLocaleString("id-ID")} - Rp {priceRange[1].toLocaleString("id-ID")}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000000}
              min={0}
              step={50000}
              className="w-full"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-slate-300">
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </p>
          <Button onClick={() => setIsCartOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Lihat Keranjang
          </Button>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`group glass-effect hover:neon-glow transition-all duration-300 overflow-hidden ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={250}
                  className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                    viewMode === "list" ? "w-full h-full" : "w-full h-48"
                  }`}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">{product.category}</Badge>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                {product.originalPrice > product.price && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="destructive">
                      Diskon {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">({product.reviews})</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {product.name}
                </h3>

                <p className="text-slate-400 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-400">Rp {product.price.toLocaleString("id-ID")}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-slate-500 line-through">
                        Rp {product.originalPrice.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    Stok: {product.stock}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Tambah ke Keranjang
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-blue-500/50 text-blue-300 bg-transparent"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Produk Tidak Ditemukan</h3>
            <p className="text-slate-400 mb-8">Coba ubah filter pencarian atau kata kunci Anda</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setPriceRange([0, 1000000])
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </section>
  )
}
