"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Sparkles, ArrowRight } from "lucide-react"

export function ImprovedFooter() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-blue-800/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
              Stay Updated with Yilzi
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Get the latest updates on our digital solutions and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-blue-400/30 text-white placeholder:text-blue-200 focus:border-blue-400"
              />
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-75" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Yilzi
              </span>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Providing innovative digital solutions to help your business grow and succeed in the digital world.
            </p>
            <div className="flex space-x-4">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-400/30 text-blue-300 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-400/30 text-blue-300 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-400/30 text-blue-300 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-400/30 text-blue-300 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                Home
              </Link>
              <Link href="/products" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                Products
              </Link>
              <Link href="/about" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                About Us
              </Link>
              <Link href="/contact" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                Contact
              </Link>
              <Link href="/cart" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                Shopping Cart
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Our Services</h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/products" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                Web Development
              </Link>
              <Link href="/products" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                WhatsApp Bot
              </Link>
              <Link href="/products" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                Hosting Services
              </Link>
              <Link href="/products" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                PPOB Solutions
              </Link>
              <Link href="/products" className="text-blue-100 hover:text-blue-400 transition-colors duration-200">
                SEO Tools
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-blue-100">Jakarta, Indonesia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-blue-100">+62 123 456 7890</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-blue-100">hello@yilzi.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-blue-800/30" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-blue-200 text-sm">© 2024 Yilzi Digital Solutions. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-blue-200 hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-200 hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/admin" className="text-blue-200 hover:text-blue-400 transition-colors duration-200">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
