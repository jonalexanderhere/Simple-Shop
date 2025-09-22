"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, MapPin, Phone, User, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CheckoutForm {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  notes: string
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCartStore()
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
    }
  }, [items, router])

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create or get user
      let userId = null

      // Create user record
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
          {
            email: form.email,
            full_name: form.fullName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postal_code: form.postalCode,
          },
        ])
        .select()
        .single()

      if (userError && userError.code !== "23505") {
        // Ignore duplicate email error
        throw userError
      }

      if (userData) {
        userId = userData.id
      } else {
        // Get existing user
        const { data: existingUser } = await supabase.from("users").select("id").eq("email", form.email).single()

        userId = existingUser?.id
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            total_amount: totalPrice(),
            status: "pending",
            payment_method: "whatsapp",
            shipping_address: `${form.address}, ${form.city} ${form.postalCode}`,
            notes: form.notes,
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Generate WhatsApp message
      const message = `Halo, saya ingin memesan:\n\n${items
        .map((item) => `• ${item.name} (${item.quantity}x) - ${formatCurrency(item.price * item.quantity)}`)
        .join(
          "\n",
        )}\n\nTotal: ${formatCurrency(totalPrice())}\n\nData Pelanggan:\nNama: ${form.fullName}\nEmail: ${form.email}\nTelepon: ${form.phone}\nAlamat: ${form.address}, ${form.city} ${form.postalCode}\n\nCatatan: ${form.notes || "Tidak ada"}\n\nOrder ID: ${orderData.order_number}`

      const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`

      // Clear cart
      await clearCart()

      // Redirect to WhatsApp
      window.open(whatsappUrl, "_blank")

      toast({
        title: "Order berhasil dibuat!",
        description: "Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.",
      })

      // Redirect to success page
      router.push(`/order-success?order=${orderData.order_number}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Gagal membuat pesanan. Silakan coba lagi.",
        variant: "destructive",
      })
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

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="glass-effect border-blue-500/20 order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Order Summary
              </CardTitle>
              <CardDescription className="text-blue-200">
                {totalItems()} item{totalItems() > 1 ? "s" : ""} in your order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-800/50">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                    {item.image_url ? (
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-400">
                        <span className="text-xs font-medium">{item.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Qty: {item.quantity}
                      </Badge>
                      <span className="text-blue-200 font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="bg-blue-500/20" />

              <div className="space-y-2">
                <div className="flex justify-between text-blue-200">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <Separator className="bg-blue-500/20" />
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Form */}
          <Card className="glass-effect border-blue-500/20 order-1 lg:order-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
              <CardDescription className="text-blue-200">Please fill in your details for delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-blue-200">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      required
                      className="bg-slate-800/50 border-blue-500/30 text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-200">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-slate-800/50 border-blue-500/30 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-blue-200 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                    placeholder="08123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-blue-200 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-blue-200">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                      className="bg-slate-800/50 border-blue-500/30 text-white"
                      placeholder="Your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-blue-200">
                      Postal Code
                    </Label>
                    <Input
                      id="postalCode"
                      value={form.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="bg-slate-800/50 border-blue-500/30 text-white"
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-blue-200 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Order Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                    placeholder="Any special instructions or notes..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 h-auto"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Order via WhatsApp</span>
                      <span className="ml-2 font-bold">{formatCurrency(totalPrice())}</span>
                    </div>
                  )}
                </Button>

                <p className="text-xs text-blue-300 text-center">
                  By placing this order, you will be redirected to WhatsApp to confirm payment and delivery details.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
