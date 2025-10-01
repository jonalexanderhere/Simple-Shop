"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X, Moon, Sun, Search, User, LogIn, UserPlus } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { useAuth } from "@/lib/auth"

export function ImprovedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { items } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
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
      router.push('/login')
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Produk" },
    { href: "/informasi", label: "Informasi" },
    { href: "/testimoni", label: "Testimoni" },
    { href: "/contact", label: "Kontak" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-effect shadow-2xl border-b border-blue-500/20 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg font-display">Y</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-indigo-300 transition-all duration-300">
              JonsStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
          </nav>

          {/* Action Buttons */}
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

            {/* Cart Button */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 rounded-xl"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500 hover:bg-blue-600">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {!isAuthenticated && (
              <Link href="/register">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:bg-green-500/20 hover:text-green-400 transition-all duration-300 rounded-xl"
                  title="Create Account"
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileClick}
              className="hidden md:flex hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 rounded-xl"
              title={isAuthenticated ? `Logged in as ${user?.email}` : "Login"}
            >
              {isAuthenticated ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-blue-500/20 shadow-lg">
            <nav className="flex flex-col space-y-6 p-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-slate-300 hover:text-blue-400 transition-all duration-300 p-3 rounded-xl hover:bg-blue-500/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-blue-500/20 space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                  <Search className="h-4 w-4 mr-2" />
                  Cari Produk
                </Button>
                
                {!isAuthenticated && (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="w-full border-green-500/50 text-green-300 hover:bg-green-500/10 hover:border-green-400 transition-all duration-300 bg-transparent"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Daftar
                    </Button>
                  </Link>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleProfileClick}
                  className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 bg-transparent"
                >
                  {isAuthenticated ? (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Masuk
                    </>
                  )}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
