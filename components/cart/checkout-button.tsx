"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"

export function CheckoutButton() {
  const { items, totalPrice, totalItems } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsLoading(true)

    try {
      // Navigate to checkout page
      router.push("/checkout")
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={items.length === 0 || isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 h-auto"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <ShoppingBag className="h-4 w-4 mr-2" />
          <span>Checkout</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{formatCurrency(totalPrice())}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Button>
  )
}
