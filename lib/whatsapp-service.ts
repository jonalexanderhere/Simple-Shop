"use client"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface CustomerData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  notes?: string
}

interface WhatsAppMessageData {
  orderNumber: string
  items: OrderItem[]
  totalAmount: number
  customerData: CustomerData
  orderType?: "new" | "payment_confirmation" | "status_update"
}

export class WhatsAppService {
  private static readonly WHATSAPP_NUMBER = "6282181183590" // JonsStore WhatsApp number
  private static readonly BUSINESS_NAME = "JonsStore"

  static generateOrderMessage(data: WhatsAppMessageData): string {
    const { orderNumber, items, totalAmount, customerData, orderType = "new" } = data

    let message = ""

    switch (orderType) {
      case "new":
        message = this.generateNewOrderMessage(data)
        break
      case "payment_confirmation":
        message = this.generatePaymentConfirmationMessage(data)
        break
      case "status_update":
        message = this.generateStatusUpdateMessage(data)
        break
      default:
        message = this.generateNewOrderMessage(data)
    }

    return message
  }

  private static generateNewOrderMessage(data: WhatsAppMessageData): string {
    const { orderNumber, items, totalAmount, customerData } = data

    const itemsList = items
      .map((item) => `• ${item.name} (${item.quantity}x) - ${this.formatCurrency(item.price * item.quantity)}`)
      .join("\n")

    return `🛍️ *PESANAN BARU - ${this.BUSINESS_NAME}*

📋 *Detail Pesanan:*
Order ID: *${orderNumber}*
Tanggal: ${new Date().toLocaleDateString("id-ID")}

🛒 *Produk yang Dipesan:*
${itemsList}

💰 *Total Pembayaran: ${this.formatCurrency(totalAmount)}*

👤 *Data Pelanggan:*
Nama: ${customerData.fullName}
Email: ${customerData.email}
Telepon: ${customerData.phone}
Alamat: ${customerData.address}, ${customerData.city} ${customerData.postalCode}

📝 *Catatan:* ${customerData.notes || "Tidak ada catatan khusus"}

---
✅ Silakan konfirmasi pesanan ini dan lakukan pembayaran sesuai instruksi yang akan kami berikan.

💳 *Metode Pembayaran:*
• Transfer Bank
• E-Wallet (OVO, GoPay, DANA)
• QRIS

Terima kasih telah berbelanja di ${this.BUSINESS_NAME}! 🙏`
  }

  private static generatePaymentConfirmationMessage(data: WhatsAppMessageData): string {
    const { orderNumber, totalAmount } = data

    return `💳 *KONFIRMASI PEMBAYARAN*

Order ID: *${orderNumber}*
Total: *${this.formatCurrency(totalAmount)}*

Silakan kirim bukti pembayaran Anda dengan format:
- Screenshot/foto bukti transfer
- Nama pengirim
- Jumlah yang ditransfer
- Tanggal & waktu transfer

Setelah pembayaran dikonfirmasi, pesanan akan segera diproses. 

Terima kasih! 🙏`
  }

  private static generateStatusUpdateMessage(data: WhatsAppMessageData): string {
    const { orderNumber } = data

    return `📦 *UPDATE STATUS PESANAN*

Order ID: *${orderNumber}*

Status pesanan Anda telah diperbarui. Silakan cek dashboard atau hubungi kami untuk informasi lebih lanjut.

Terima kasih! 🙏`
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  static sendMessage(message: string, phoneNumber?: string): void {
    const targetNumber = phoneNumber || this.WHATSAPP_NUMBER
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  static sendOrderMessage(data: WhatsAppMessageData): void {
    const message = this.generateOrderMessage(data)
    this.sendMessage(message)
  }

  // Quick message templates for common scenarios
  static sendQuickMessage(type: "greeting" | "support" | "catalog", customMessage?: string): void {
    let message = ""

    switch (type) {
      case "greeting":
        message = `Halo! 👋

Selamat datang di *${this.BUSINESS_NAME}*!

Kami menyediakan berbagai solusi digital berkualitas tinggi untuk kebutuhan bisnis Anda.

Silakan lihat katalog produk kami atau tanyakan langsung jika ada yang ingin Anda ketahui.

Terima kasih! 🙏`
        break

      case "support":
        message = `🆘 *BANTUAN & DUKUNGAN*

Halo! Apakah ada yang bisa kami bantu?

Kami siap membantu Anda dengan:
• Informasi produk
• Proses pemesanan
• Status pesanan
• Dukungan teknis
• Pertanyaan lainnya

Silakan jelaskan kebutuhan Anda, dan kami akan segera membantu! 😊`
        break

      case "catalog":
        message = `📋 *KATALOG PRODUK ${this.BUSINESS_NAME}*

Berikut adalah kategori produk kami:

🌐 *Web Development*
• Website Company Profile
• E-commerce Platform
• Web Application

📱 *Mobile Development*
• Android Apps
• iOS Apps
• Cross-platform Apps

🚀 *Digital Marketing*
• SEO Services
• Social Media Management
• Google Ads Management

🛒 *E-commerce Solutions*
• Online Store Setup
• Payment Gateway Integration
• Inventory Management

🎨 *Design Services*
• UI/UX Design
• Graphic Design
• Branding Package

☁️ *Hosting & Domain*
• Web Hosting
• Domain Registration
• SSL Certificate

Untuk informasi lebih detail dan harga, silakan kunjungi website kami atau tanyakan langsung di sini! 

${customMessage || ""}`
        break
    }

    this.sendMessage(message)
  }

  // Generate admin notification message
  static generateAdminNotification(data: WhatsAppMessageData): string {
    const { orderNumber, items, totalAmount, customerData } = data

    return `🔔 *NOTIFIKASI ADMIN - PESANAN BARU*

Order ID: *${orderNumber}*
Waktu: ${new Date().toLocaleString("id-ID")}

👤 *Pelanggan:*
${customerData.fullName} (${customerData.phone})

🛒 *Pesanan:*
${items.map((item) => `• ${item.name} (${item.quantity}x)`).join("\n")}

💰 *Total: ${this.formatCurrency(totalAmount)}*

📍 *Alamat:*
${customerData.address}, ${customerData.city} ${customerData.postalCode}

⚡ *Tindakan yang diperlukan:*
1. Konfirmasi ketersediaan stok
2. Kirim detail pembayaran ke pelanggan
3. Update status pesanan di dashboard

#NewOrder #${orderNumber}`
  }
}
