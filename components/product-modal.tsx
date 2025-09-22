"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Heart, Share2, CheckCircle, MessageCircle } from "lucide-react"
import { shopConfig } from "@/lib/config"
import Image from "next/image"

interface ProductModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: any) => void
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)

  const handleWhatsAppOrder = () => {
    const message = `Halo, saya tertarik dengan produk:
    
*${product.name}*
Harga: Rp ${product.price.toLocaleString("id-ID")}
Quantity: ${quantity}
Total: Rp ${(product.price * quantity).toLocaleString("id-ID")}

Mohon informasi lebih lanjut untuk pemesanan.`

    const whatsappUrl = `https://wa.me/${shopConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-effect border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={400}
                className="w-full h-80 object-cover rounded-lg"
              />
              {product.originalPrice > product.price && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive">
                    Diskon {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-blue-600 text-white">{product.category}</Badge>
                <div className="flex items-center gap-2">
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
                  <span className="text-sm text-slate-400">({product.reviews} ulasan)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-blue-400">Rp {product.price.toLocaleString("id-ID")}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-slate-500 line-through">
                    Rp {product.originalPrice.toLocaleString("id-ID")}
                  </span>
                )}
              </div>

              <p className="text-slate-300 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Stok: {product.stock}
                </Badge>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  Rating: {product.rating}/5
                </Badge>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-slate-300">Jumlah:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 border-slate-600"
                >
                  -
                </Button>
                <span className="w-12 text-center text-white">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-8 w-8 border-slate-600"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Tambah ke Keranjang
              </Button>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-3" onClick={handleWhatsAppOrder}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Pesan via WhatsApp
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-slate-600 bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" className="flex-1 border-slate-600 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="features" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="features">Fitur</TabsTrigger>
            <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
            <TabsTrigger value="reviews">Ulasan</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Fitur Utama</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Spesifikasi Teknis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kategori:</span>
                    <span className="text-white">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rating:</span>
                    <span className="text-white">{product.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ulasan:</span>
                    <span className="text-white">{product.reviews}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">Ulasan Pelanggan</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="glass-effect rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">U{review}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">User {review}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-slate-400">2 hari yang lalu</span>
                      </div>
                    </div>
                    <p className="text-slate-300">
                      Produk sangat bagus dan sesuai dengan deskripsi. Pelayanan juga sangat memuaskan!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
