"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, Bell, Shield, Palette, Database, MessageCircle, Save, RefreshCw, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { shopConfig } from "@/lib/config"

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [settings, setSettings] = useState({
    // General Settings
    siteName: shopConfig.shop.name,
    siteTagline: shopConfig.shop.tagline,
    siteDescription: shopConfig.shop.description,
    siteUrl: "https://yilzi.com",
    adminEmail: "admin@yilzi.com",

    // Contact Settings
    whatsapp: shopConfig.contact.whatsapp,
    telegram: shopConfig.contact.telegram,
    instagram: shopConfig.contact.instagram,
    github: shopConfig.contact.github,
    youtube: shopConfig.contact.youtube,

    // Notification Settings
    emailNotifications: true,
    whatsappNotifications: true,
    telegramNotifications: true,
    orderNotifications: true,
    reviewNotifications: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,

    // Theme Settings
    primaryColor: "#1e40af",
    secondaryColor: "#1f2937",
    accentColor: "#3b82f6",
    darkMode: true,

    // SEO Settings
    metaTitle: "Yilzi - Digital Solutions Provider",
    metaDescription: "Penyedia solusi digital terdepan untuk kebutuhan bisnis Anda",
    metaKeywords: "digital solutions, web development, bot whatsapp, hosting",
    googleAnalytics: "",
    facebookPixel: "",

    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: "Website sedang dalam pemeliharaan. Mohon kembali lagi nanti.",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin-dashboard/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1500)
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Pengaturan Sistem</h1>
            <p className="text-slate-400">Kelola konfigurasi website dan sistem</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">Pengaturan berhasil disimpan!</AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-slate-800">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Umum</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Kontak</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifikasi</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Keamanan</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tema</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Pengaturan Umum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-slate-300">Nama Website</Label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => handleInputChange("siteName", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Tagline</Label>
                    <Input
                      value={settings.siteTagline}
                      onChange={(e) => handleInputChange("siteTagline", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Deskripsi Website</Label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-slate-300">URL Website</Label>
                    <Input
                      value={settings.siteUrl}
                      onChange={(e) => handleInputChange("siteUrl", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Email Admin</Label>
                    <Input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div>
                    <Label className="text-white">Mode Maintenance</Label>
                    <p className="text-sm text-slate-400">Aktifkan untuk menutup sementara website</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  />
                </div>
                {settings.maintenanceMode && (
                  <div>
                    <Label className="text-slate-300">Pesan Maintenance</Label>
                    <Textarea
                      value={settings.maintenanceMessage}
                      onChange={(e) => handleInputChange("maintenanceMessage", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-slate-300">WhatsApp</Label>
                    <Input
                      value={settings.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="628123456789"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Telegram</Label>
                    <Input
                      value={settings.telegram}
                      onChange={(e) => handleInputChange("telegram", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="@username"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-slate-300">Instagram</Label>
                    <Input
                      value={settings.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">GitHub</Label>
                    <Input
                      value={settings.github}
                      onChange={(e) => handleInputChange("github", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">YouTube</Label>
                    <Input
                      value={settings.youtube}
                      onChange={(e) => handleInputChange("youtube", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="channel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  Pengaturan Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: "emailNotifications", label: "Email Notifications", desc: "Terima notifikasi via email" },
                  {
                    key: "whatsappNotifications",
                    label: "WhatsApp Notifications",
                    desc: "Terima notifikasi via WhatsApp",
                  },
                  {
                    key: "telegramNotifications",
                    label: "Telegram Notifications",
                    desc: "Terima notifikasi via Telegram",
                  },
                  { key: "orderNotifications", label: "Order Notifications", desc: "Notifikasi pesanan baru" },
                  { key: "reviewNotifications", label: "Review Notifications", desc: "Notifikasi ulasan baru" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                    <div>
                      <Label className="text-white">{item.label}</Label>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                    <Switch
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) => handleInputChange(item.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Pengaturan Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div>
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-400">Aktifkan autentikasi dua faktor untuk keamanan ekstra</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-slate-300">Session Timeout (menit)</Label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleInputChange("sessionTimeout", Number.parseInt(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleInputChange("maxLoginAttempts", Number.parseInt(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Password Expiry (hari)</Label>
                    <Input
                      type="number"
                      value={settings.passwordExpiry}
                      onChange={(e) => handleInputChange("passwordExpiry", Number.parseInt(e.target.value))}
                      className="bg-slate-800/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Settings */}
          <TabsContent value="theme">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  Pengaturan Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div>
                    <Label className="text-white">Dark Mode</Label>
                    <p className="text-sm text-slate-400">Gunakan tema gelap sebagai default</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleInputChange("darkMode", checked)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-slate-300">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        className="w-16 h-10 bg-slate-800/50 border-slate-600"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        className="flex-1 bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        className="w-16 h-10 bg-slate-800/50 border-slate-600"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        className="flex-1 bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Accent Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => handleInputChange("accentColor", e.target.value)}
                        className="w-16 h-10 bg-slate-800/50 border-slate-600"
                      />
                      <Input
                        value={settings.accentColor}
                        onChange={(e) => handleInputChange("accentColor", e.target.value)}
                        className="flex-1 bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card className="glass-effect border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-400" />
                  Pengaturan SEO & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-slate-300">Meta Title</Label>
                  <Input
                    value={settings.metaTitle}
                    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Meta Description</Label>
                  <Textarea
                    value={settings.metaDescription}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Meta Keywords</Label>
                  <Input
                    value={settings.metaKeywords}
                    onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-slate-300">Google Analytics ID</Label>
                    <Input
                      value={settings.googleAnalytics}
                      onChange={(e) => handleInputChange("googleAnalytics", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Facebook Pixel ID</Label>
                    <Input
                      value={settings.facebookPixel}
                      onChange={(e) => handleInputChange("facebookPixel", e.target.value)}
                      className="bg-slate-800/50 border-slate-600 text-white"
                      placeholder="123456789012345"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
