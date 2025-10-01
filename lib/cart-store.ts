"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  category?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  sessionId: string

  // Actions
  addItem: (product: Omit<CartItem, "id" | "quantity">) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  toggleCart: () => void
  loadCart: () => Promise<void>

  // Computed
  totalItems: () => number
  totalPrice: () => number
}

const generateSessionId = () => {
  if (typeof window === "undefined") return ""
  let sessionId = sessionStorage.getItem("cart_session_id")
  if (!sessionId) {
    sessionId = "cart_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem("cart_session_id", sessionId)
  }
  return sessionId
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      sessionId: generateSessionId(),

      addItem: async (product) => {
        const supabase = createClient()
        const { sessionId, items } = get()

        set({ isLoading: true })

        try {
          // Check if item already exists
          const existingItem = items.find((item) => item.product_id === product.product_id)

          if (existingItem) {
            // Update quantity
            await get().updateQuantity(product.product_id, existingItem.quantity + 1)
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              ...product,
              quantity: 1,
            }

            // Save to database
            const { error } = await supabase.from("cart_items").insert([
              {
                session_id: sessionId,
                product_id: product.product_id,
                quantity: 1,
              },
            ])

            if (error) throw error

            set((state) => ({
              items: [...state.items, newItem],
              isOpen: true,
            }))
          }
        } catch (error) {
          console.error("Error adding item to cart:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (productId) => {
        const supabase = createClient()
        const { sessionId } = get()

        set({ isLoading: true })

        try {
          // Remove from database
          const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("session_id", sessionId)
            .eq("product_id", productId)

          if (error) throw error

          set((state) => ({
            items: state.items.filter((item) => item.product_id !== productId),
          }))
        } catch (error) {
          console.error("Error removing item from cart:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (productId, quantity) => {
        const supabase = createClient()
        const { sessionId } = get()

        if (quantity <= 0) {
          await get().removeItem(productId)
          return
        }

        set({ isLoading: true })

        try {
          // Update in database
          const { error } = await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("session_id", sessionId)
            .eq("product_id", productId)

          if (error) throw error

          set((state) => ({
            items: state.items.map((item) => (item.product_id === productId ? { ...item, quantity } : item)),
          }))
        } catch (error) {
          console.error("Error updating quantity:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        const supabase = createClient()
        const { sessionId } = get()

        set({ isLoading: true })

        try {
          // Clear from database
          const { error } = await supabase.from("cart_items").delete().eq("session_id", sessionId)

          if (error) throw error

          set({ items: [] })
        } catch (error) {
          console.error("Error clearing cart:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      loadCart: async () => {
        const supabase = createClient()
        const { sessionId } = get()

        if (!sessionId) return

        set({ isLoading: true })

        try {
          // Load cart items from database
          const { data: cartItems, error } = await supabase
            .from("cart_items")
            .select(`
              *,
              products (
                name,
                price,
                image_url,
                category
              )
            `)
            .eq("session_id", sessionId)

          if (error) throw error

          const items: CartItem[] =
            cartItems?.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              name: item.products?.name || "Unknown Product",
              price: item.products?.price || 0,
              quantity: item.quantity,
              image_url: item.products?.image_url,
              category: item.products?.category,
            })) || []

          set({ items })
        } catch (error) {
          console.error("Error loading cart:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      totalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      totalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "jonsstore-cart-storage",
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
      }),
    },
  ),
)
