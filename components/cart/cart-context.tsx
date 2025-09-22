"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  description?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ITEMS":
      const items = action.payload
      return {
        ...state,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      }

    case "ADD_ITEM":
      const existingItem = state.items.find((item) => item.product_id === action.payload.product_id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      }

    case "UPDATE_QUANTITY":
      const updatedItems = state.items
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      }

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
      }

    case "CLEAR_CART":
      return initialState

    default:
      return state
  }
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "id">) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  loadCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const supabase = createClient()

  // Get session ID for anonymous users
  const getSessionId = () => {
    if (typeof window === "undefined") return null

    let sessionId = sessionStorage.getItem("cart_session_id")
    if (!sessionId) {
      sessionId = "cart_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem("cart_session_id", sessionId)
    }
    return sessionId
  }

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const sessionId = getSessionId()
      if (!sessionId) return

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          quantity,
          products (
            name,
            price,
            image_url,
            description
          )
        `)
        .eq("session_id", sessionId)

      if (error) {
        console.error("Error loading cart:", error)
        return
      }

      const cartItems: CartItem[] =
        data?.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products?.name || "",
          price: item.products?.price || 0,
          quantity: item.quantity,
          image_url: item.products?.image_url,
          description: item.products?.description,
        })) || []

      dispatch({ type: "SET_ITEMS", payload: cartItems })
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const addItem = async (item: Omit<CartItem, "id">) => {
    try {
      const sessionId = getSessionId()
      if (!sessionId) return

      // Check if item already exists in cart
      const existingItem = state.items.find((cartItem) => cartItem.product_id === item.product_id)

      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + item.quantity)
      } else {
        // Add new item
        const { data, error } = await supabase
          .from("cart_items")
          .insert([
            {
              session_id: sessionId,
              product_id: item.product_id,
              quantity: item.quantity,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Error adding item to cart:", error)
          return
        }

        const newCartItem: CartItem = {
          id: data.id,
          ...item,
        }

        dispatch({ type: "ADD_ITEM", payload: newCartItem })
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(id)
        return
      }

      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id)

      if (error) {
        console.error("Error updating cart item:", error)
        return
      }

      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    } catch (error) {
      console.error("Error updating cart item:", error)
    }
  }

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", id)

      if (error) {
        console.error("Error removing cart item:", error)
        return
      }

      dispatch({ type: "REMOVE_ITEM", payload: id })
    } catch (error) {
      console.error("Error removing cart item:", error)
    }
  }

  const clearCart = async () => {
    try {
      const sessionId = getSessionId()
      if (!sessionId) return

      const { error } = await supabase.from("cart_items").delete().eq("session_id", sessionId)

      if (error) {
        console.error("Error clearing cart:", error)
        return
      }

      dispatch({ type: "CLEAR_CART" })
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  // Load cart on mount
  useEffect(() => {
    loadCart()
  }, [])

  const value: CartContextType = {
    ...state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
