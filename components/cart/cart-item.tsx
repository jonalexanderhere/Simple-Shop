"use client"

import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItemProps {
  item: {
    id: string
    product_id: string
    name: string
    price: number
    quantity: number
    image_url?: string
    category?: string
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCartStore()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="p-4 glass-effect border-blue-500/20">
      <div className="flex items-start space-x-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-800">
          {item.image_url ? (
            <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-400">
              <span className="text-xs font-medium">{item.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
          {item.category && <p className="text-blue-300 text-xs mt-1">{item.category}</p>}
          <div className="flex items-center justify-between mt-2">
            <span className="text-blue-200 font-medium">{formatCurrency(item.price)}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-blue-500/30 hover:bg-blue-500/20 bg-transparent"
                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                disabled={isLoading || item.quantity <= 1}
              >
                <Minus className="h-3 w-3 text-blue-400" />
              </Button>

              <span className="text-white font-medium min-w-[2rem] text-center">{item.quantity}</span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-blue-500/30 hover:bg-blue-500/20 bg-transparent"
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                disabled={isLoading}
              >
                <Plus className="h-3 w-3 text-blue-400" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          onClick={() => removeItem(item.product_id)}
          disabled={isLoading}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-500/20">
        <div className="flex justify-between items-center">
          <span className="text-blue-200 text-sm">Subtotal:</span>
          <span className="text-white font-medium">{formatCurrency(item.price * item.quantity)}</span>
        </div>
      </div>
    </Card>
  )
}
