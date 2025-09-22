"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/cart-store"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2 } from "lucide-react"
import { CartItem } from "./cart-item"
import { CheckoutButton } from "./checkout-button"

export function ShoppingCartComponent() {
  const { items, isOpen, isLoading, toggleCart, loadCart, totalItems, totalPrice, clearCart } = useCartStore()

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative glass-effect border-blue-500/30 hover:bg-blue-500/20 bg-transparent"
        >
          <span className="h-4 w-4 text-blue-400">Cart</span>
          {totalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {totalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg bg-slate-900/95 backdrop-blur-sm border-blue-500/20">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            <span>Shopping Cart</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </SheetTitle>
          <SheetDescription className="text-blue-200">
            {items.length === 0
              ? "Your cart is empty"
              : `${totalItems()} item${totalItems() > 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <span className="h-16 w-16 text-blue-400/50 mb-4">Cart</span>
            <p className="text-blue-200 mb-2">Your cart is empty</p>
            <p className="text-blue-300 text-sm">Add some products to get started</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-blue-500/20 pt-4 mt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-blue-200">
                  <span>Subtotal ({totalItems()} items)</span>
                  <span>{formatCurrency(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <Separator className="bg-blue-500/20" />
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice())}</span>
                </div>
              </div>

              <CheckoutButton />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
