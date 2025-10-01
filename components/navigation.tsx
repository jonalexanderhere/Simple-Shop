"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User, Moon, Sun, LogIn } from "lucide-react"
import { shopConfig } from "@/lib/config"
import { useCartStore } from "@/lib/cart-store"
import { ShoppingCartComponent } from "@/components/cart/shopping-cart"
import { useAuth } from "@/lib/auth"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { totalItems } = useCartStore()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleProfileClick = () => {
    if (isAuthenticated) {
      // If user is logged in, redirect to admin dashboard
      router.push('/admin-dashboard')
    } else {
      // If user is not logged in, redirect to login page
      router.push('/admin/login')
    }
  }

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Produk" },
    { href: "/informasi", label: "Informasi" },
    { href: "/testimoni", label: "Testimoni" },
    { href: "/contact", label: "Kontak" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "glass-effect shadow-2xl border-b border-blue-500/20 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg font-display">Y</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-indigo-300 transition-all duration-300">
              {shopConfig.shop.name}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-slate-300 hover:text-blue-400 transition-all duration-300 font-medium text-lg group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 rounded-xl"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 rounded-xl"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <ShoppingCartComponent />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileClick}
              className="hidden md:flex hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 rounded-xl"
              title={isAuthenticated ? `Logged in as ${user?.email}` : "Login to Admin"}
            >
              {isAuthenticated ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 rounded-xl"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-slate-900/95 backdrop-blur-xl border-blue-500/20">
                <div className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-slate-300 hover:text-blue-400 transition-all duration-300 p-3 rounded-xl hover:bg-blue-500/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-6 border-t border-blue-500/20 space-y-3">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                      <Search className="h-4 w-4 mr-2" />
                      Cari Produk
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleProfileClick}
                      className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 bg-transparent"
                    >
                      {isAuthenticated ? (
                        <>
                          <User className="h-4 w-4 mr-2" />
                          Dashboard Admin
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Masuk Admin
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
