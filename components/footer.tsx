import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Send, Github, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { shopConfig } from "@/lib/config"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    produk: [
      { name: "Script Bot", href: "/produk?category=Script" },
      { name: "Jasa Website", href: "/produk?category=Jasa" },
      { name: "Cloud Hosting", href: "/produk?category=Hosting" },
      { name: "PPOB System", href: "/produk?category=PPOB" },
      { name: "SEO Tools", href: "/produk?category=Utilities" },
    ],
    perusahaan: [
      { name: "Tentang Kami", href: "/informasi" },
      { name: "Testimoni", href: "/testimoni" },
      { name: "Kontak", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Karir", href: "/karir" },
    ],
    dukungan: [
      { name: "Pusat Bantuan", href: "/help" },
      { name: "Dokumentasi", href: "/docs" },
      { name: "Status Server", href: "/status" },
      { name: "Kebijakan Privasi", href: "/privacy" },
      { name: "Syarat Layanan", href: "/terms" },
    ],
  }

  const socialLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/${shopConfig.contact.whatsapp}`,
      icon: MessageCircle,
      color: "hover:text-green-400",
    },
    {
      name: "Telegram",
      href: `https://t.me/${shopConfig.contact.telegram.replace("@", "")}`,
      icon: Send,
      color: "hover:text-blue-400",
    },
    {
      name: "GitHub",
      href: `https://github.com/${shopConfig.contact.github}`,
      icon: Github,
      color: "hover:text-gray-400",
    },
    {
      name: "YouTube",
      href: `https://youtube.com/@${shopConfig.contact.youtube}`,
      icon: Youtube,
      color: "hover:text-red-400",
    },
    {
      name: "Instagram",
      href: `https://instagram.com/${shopConfig.contact.instagram}`,
      icon: Instagram,
      color: "hover:text-pink-400",
    },
  ]

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
                <span className="font-display font-bold text-2xl gradient-text">{shopConfig.shop.name}</span>
              </div>

              <p className="text-slate-400 mb-6 leading-relaxed max-w-md">{shopConfig.shop.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-400">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>+{shopConfig.contact.whatsapp}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>info@yilzi.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>Indonesia</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      asChild
                      className={`text-slate-400 ${social.color} transition-colors`}
                    >
                      <Link href={social.href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-5 w-5" />
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Footer Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Produk</h4>
              <ul className="space-y-3">
                {footerLinks.produk.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Perusahaan</h4>
              <ul className="space-y-3">
                {footerLinks.perusahaan.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Dukungan</h4>
              <ul className="space-y-3">
                {footerLinks.dukungan.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} {shopConfig.shop.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
