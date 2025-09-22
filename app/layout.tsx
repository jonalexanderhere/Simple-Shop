import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { shopConfig } from "@/lib/config"
import { Suspense } from "react"
import { VisitorTrackerProvider } from "@/components/visitor-tracker-provider"
import { WhatsAppFloatButton } from "@/components/whatsapp/whatsapp-float-button"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: `${shopConfig.shop.name} - ${shopConfig.shop.tagline}`,
  description: shopConfig.shop.description,
  generator: "v0.app",
  keywords: "digital solutions, web development, bot whatsapp, hosting, PPOB, SEO tools",
  authors: [{ name: shopConfig.shop.name }],
  openGraph: {
    title: `${shopConfig.shop.name} - ${shopConfig.shop.tagline}`,
    description: shopConfig.shop.description,
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: `${shopConfig.shop.name} - ${shopConfig.shop.tagline}`,
    description: shopConfig.shop.description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`font-sans ${inter.variable} ${orbitron.variable} antialiased`}>
        <VisitorTrackerProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <WhatsAppFloatButton />
          <Toaster />
        </VisitorTrackerProvider>
        <Analytics />
      </body>
    </html>
  )
}
