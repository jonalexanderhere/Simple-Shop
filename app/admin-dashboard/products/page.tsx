"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, Package, TrendingUp, DollarSign } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { products } from "@/lib/config"

export default function ProductsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin-dashboard/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const categories = ["All", "Script", "Jasa", "Hosting", "PPOB", "Utilities"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = [
    {
      title: "Total Produk",
      value: products.length.toString(),
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Produk Aktif",
      value: products.filter((p) => p.stock > 0).length.toString(),
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Stok Rendah",
      value: products.filter((p) => p.stock < 10).length.toString(),
      icon: Package,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Total Nilai",
      value: `Rp ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString("id-ID")}`,
      icon: DollarSign,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Manajemen Produk</h1>
            <p className="text-slate-400">Kelola semua produk dan layanan yang tersedia</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl glass-effect border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Tambah Produk Baru</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Nama Produk</Label>
                    <Input className="bg-slate-800/50 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Kategori</Label>
                    <Select>
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300">Harga</Label>
                    <Input type="number" className="bg-slate-800/50 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Stok</Label>
                    <Input type="number" className="bg-slate-800/50 border-slate-600 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Deskripsi</Label>
                    <Textarea rows={4} className="bg-slate-800/50 border-slate-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Fitur (pisahkan dengan koma)</Label>
                    <Textarea rows={3} className="bg-slate-800/50 border-slate-600 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Simpan Produk</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-slate-600 bg-transparent"
                >
                  Batal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="glass-effect border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="glass-effect border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="glass-effect border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Daftar Produk ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Produk</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Kategori</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Harga</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Stok</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Rating</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-slate-400 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-blue-600 text-white">{product.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-white">Rp {product.price.toLocaleString("id-ID")}</p>
                          {product.originalPrice > product.price && (
                            <p className="text-sm text-slate-500 line-through">
                              Rp {product.originalPrice.toLocaleString("id-ID")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                          className={
                            product.stock > 10
                              ? "bg-green-500/20 text-green-400"
                              : product.stock > 0
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }
                        >
                          {product.stock}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white">{product.rating}</span>
                          <span className="text-slate-400 text-sm">({product.reviews})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={product.stock > 0 ? "default" : "destructive"}
                          className={
                            product.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                          }
                        >
                          {product.stock > 0 ? "Aktif" : "Habis"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-400 hover:text-green-300">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
