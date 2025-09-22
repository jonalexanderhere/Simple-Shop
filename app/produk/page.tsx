import { Navigation } from "@/components/navigation"
import { ProductsGrid } from "@/components/products-grid"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Page Header */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 px-4 py-2 bg-blue-500/20 text-blue-300 border-blue-500/30">Semua Produk</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">Katalog Produk Digital</h1>
            <p className="text-xl text-slate-300">
              Temukan solusi digital terbaik untuk mengembangkan bisnis Anda dengan berbagai pilihan produk berkualitas
              tinggi
            </p>
          </div>
        </div>
      </section>

      <ProductsGrid />
      <Footer />
    </main>
  )
}
