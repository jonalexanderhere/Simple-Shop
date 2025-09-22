"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Users,
  MessageCircle,
  LogOut,
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { shopConfig } from "@/lib/config"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
      current: pathname === "/admin-dashboard",
    },
    {
      name: "Produk",
      href: "/admin-dashboard/products",
      icon: Package,
      current: pathname === "/admin-dashboard/products",
    },
    {
      name: "Analytics",
      href: "/admin-dashboard/analytics",
      icon: BarChart3,
      current: pathname === "/admin-dashboard/analytics",
    },
    {
      name: "Pesan",
      href: "/admin-dashboard/messages",
      icon: MessageCircle,
      current: pathname === "/admin-dashboard/messages",
      badge: "3",
    },
    {
      name: "Pengguna",
      href: "/admin-dashboard/users",
      icon: Users,
      current: pathname === "/admin-dashboard/users",
    },
    {
      name: "Pengaturan",
      href: "/admin-dashboard/settings",
      icon: Settings,
      current: pathname === "/admin-dashboard/settings",
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/admin-dashboard/login")
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-full" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-700">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">Y</span>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl gradient-text">{shopConfig.shop.name}</h2>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.current ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && <Badge className="ml-auto bg-red-500 text-white text-xs">{item.badge}</Badge>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="glass-effect border-r border-slate-700">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="glass-effect border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-slate-400">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 glass-effect border-slate-700">
                  <Sidebar mobile />
                </SheetContent>
              </Sheet>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 min-w-[300px]">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari produk, pesanan, atau pelanggan..."
                  className="bg-transparent text-white placeholder:text-slate-400 outline-none flex-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-400 hover:text-white">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* View Site */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/", "_blank")}
                className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
              >
                Lihat Website
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
