"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { shopConfig } from "@/lib/config"
import Image from "next/image"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart()

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    let message = `Halo, saya ingin memesan produk berikut:\n\n`

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   Harga: Rp ${item.price.toLocaleString("id-ID")}\n`
      message += `   Jumlah: ${item.quantity}\n`
      message += `   Subtotal: Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n\n`
    })

    message += `*Total Keseluruhan: Rp ${getTotalPrice().toLocaleString("id-ID")}*\n\n`
    message += `Mohon konfirmasi ketersediaan dan proses pembayaran.`

    const whatsappUrl = `https://wa.me/${shopConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg glass-effect border-slate-700">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingCart className="h-5 w-5" />
            Keranjang Belanja
            {items.length > 0 && <Badge className="bg-blue-600 text-white">{getTotalItems()}</Badge>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Keranjang Kosong</h3>
                <p className="text-slate-400 mb-6">Belum ada produk yang ditambahkan</p>
                <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                  Mulai Belanja
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="glass-effect rounded-lg p-4">
                      <div className="flex gap-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2 line-clamp-2">{item.name}</h4>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-400 font-bold">Rp {item.price.toLocaleString("id-ID")}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 border-slate-600"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-white">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 border-slate-600"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="text-white font-semibold">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-slate-700 pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Subtotal ({getTotalItems()} item)</span>
                    <span className="text-white font-semibold">Rp {getTotalPrice().toLocaleString("id-ID")}</span>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-xl font-bold text-blue-400">
                      Rp {getTotalPrice().toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                      onClick={handleWhatsAppCheckout}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Checkout via WhatsApp
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                      onClick={clearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Kosongkan Keranjang
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
