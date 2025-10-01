-- JonsStore Complete Database Schema - FIXED VERSION
-- Comprehensive e-commerce and digital solutions platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table for customer management
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  country VARCHAR(100) DEFAULT 'Indonesia',
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  gallery JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  features JSONB DEFAULT '[]',
  tags TEXT[],
  weight DECIMAL(8,2),
  dimensions JSONB,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_inventory BOOLEAN DEFAULT TRUE,
  is_digital BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  admin_notes TEXT,
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart table
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  session_id VARCHAR(255),
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp messages table
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'incoming',
  status VARCHAR(50) DEFAULT 'sent',
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics tables
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES public.users(id),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT NOT NULL,
  page_title VARCHAR(255),
  event_type VARCHAR(50) DEFAULT 'page_view',
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  total_visitors INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  new_orders INTEGER DEFAULT 0,
  total_sales DECIMAL(10,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) DEFAULT 'percentage', -- percentage or fixed
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session_id ON public.cart(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_session_id ON public.visitor_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_created_at ON public.visitor_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_analytics_updated_at BEFORE UPDATE ON public.daily_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO public.admins (email, name, password_hash, role) 
VALUES (
  'admin@jonsstore.com',
  'JonsStore Admin',
  crypt('jonsstore123', gen_salt('bf')),
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert default settings
INSERT INTO public.settings (key, value, description, category, is_public) VALUES
('site_name', '"JonsStore"', 'Nama website', 'general', true),
('site_tagline', '"Digital Solutions & Services Provider"', 'Tagline website', 'general', true),
('site_description', '"Menyediakan berbagai layanan digital berkualitas tinggi untuk kebutuhan bisnis dan personal Anda"', 'Deskripsi website', 'general', true),
('contact_whatsapp', '"6282181183590"', 'Nomor WhatsApp', 'contact', true),
('contact_email', '"info@jonsstore.com"', 'Email kontak', 'contact', true),
('social_telegram', '"@jonsstore"', 'Telegram', 'social', true),
('social_instagram', '"jonsstore"', 'Instagram', 'social', true),
('social_github', '"jonalexanderhere"', 'GitHub', 'social', true),
('currency', '"IDR"', 'Mata uang default', 'general', true),
('tax_rate', '0.11', 'Tarif pajak (11%)', 'general', false),
('shipping_cost', '15000', 'Biaya pengiriman default', 'general', false),
('low_stock_threshold', '5', 'Ambang batas stok rendah', 'inventory', false),
('order_prefix', '"ORD"', 'Prefix nomor order', 'orders', false),
('enable_analytics', 'true', 'Aktifkan analytics', 'analytics', false),
('maintenance_mode', 'false', 'Mode maintenance', 'general', false)
ON CONFLICT (key) DO NOTHING;

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, is_active) VALUES
('Web Development', 'web-development', 'Layanan pengembangan website profesional', true),
('Mobile Development', 'mobile-development', 'Pengembangan aplikasi mobile', true),
('Digital Marketing', 'digital-marketing', 'Layanan pemasaran digital', true),
('Design', 'design', 'Layanan desain grafis dan UI/UX', true),
('Hosting', 'hosting', 'Layanan hosting dan server', true),
('Consultation', 'consultation', 'Konsultasi teknologi', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, slug, description, short_description, price, category_id, image_url, stock_quantity, is_active, is_featured) 
SELECT 
  'Website Development',
  'website-development',
  'Layanan pengembangan website profesional dengan teknologi modern dan responsive design. Cocok untuk bisnis yang ingin memiliki kehadiran online yang kuat.',
  'Website profesional dengan teknologi modern',
  2500000,
  c.id,
  '/images/web-dev.jpg',
  100,
  true,
  true
FROM public.categories c WHERE c.slug = 'web-development'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, short_description, price, category_id, image_url, stock_quantity, is_active, is_featured) 
SELECT 
  'Mobile App Development',
  'mobile-app-development',
  'Pengembangan aplikasi mobile native dan cross-platform dengan performa optimal dan user experience yang excellent.',
  'Aplikasi mobile dengan performa optimal',
  5000000,
  c.id,
  '/images/mobile-dev.jpg',
  50,
  true,
  true
FROM public.categories c WHERE c.slug = 'mobile-development'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, short_description, price, category_id, image_url, stock_quantity, is_active, is_featured) 
SELECT 
  'Digital Marketing Package',
  'digital-marketing-package',
  'Paket lengkap digital marketing termasuk SEO, social media management, dan content marketing untuk meningkatkan visibilitas online bisnis Anda.',
  'Paket lengkap digital marketing',
  1500000,
  c.id,
  '/images/digital-marketing.jpg',
  200,
  true,
  true
FROM public.categories c WHERE c.slug = 'digital-marketing'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, short_description, price, category_id, image_url, stock_quantity, is_active, is_featured) 
SELECT 
  'Brand Identity Design',
  'brand-identity-design',
  'Desain identitas merek lengkap termasuk logo, business card, dan brand guidelines untuk membangun citra profesional.',
  'Desain identitas merek lengkap',
  1200000,
  c.id,
  '/images/branding.jpg',
  150,
  true,
  false
FROM public.categories c WHERE c.slug = 'design'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, short_description, price, category_id, image_url, stock_quantity, is_active, is_featured) 
SELECT 
  'Cloud Hosting Service',
  'cloud-hosting-service',
  'Layanan hosting cloud dengan uptime 99.9%, SSL gratis, dan support 24/7 untuk website Anda.',
  'Hosting cloud dengan uptime 99.9%',
  500000,
  c.id,
  '/images/hosting.jpg',
  500,
  true,
  false
FROM public.categories c WHERE c.slug = 'hosting'
ON CONFLICT (slug) DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.testimonials (name, company, content, rating, image_url, is_featured, is_approved) VALUES
('Requime BoostID', 'Shop. Digitalz', 'JonsStore Digital Solutions memberikan layanan yang sangat profesional. Website kami sekarang terlihat modern dan performa sangat baik!', 5, '/images/testimonial-1.jpg', true, true),
('Rifki Hermawan', 'Mahasiswa', 'Tim JonsStore sangat membantu dalam mengembangkan toko online kami. Penjualan meningkat 300% setelah menggunakan layanan mereka.', 5, '/images/testimonial-2.jpg', true, true),
('Danz Shop', 'Jb akun Game', 'Aplikasi mobile yang dikembangkan JonsStore sangat user-friendly dan stabil. Highly recommended!', 5, '/images/testimonial-3.jpg', true, true),
('Qinday Shop', 'Hosting Marketplace', 'Digital marketing package dari JonsStore membantu klinik kami mendapatkan lebih banyak pasien. ROI sangat memuaskan!', 4, '/images/testimonial-4.jpg', false, true),
('FadilJb', 'Shop. Online', 'Brand identity yang dibuat JonsStore sangat mencerminkan visi perusahaan kami. Terima kasih atas kerja sama yang baik!', 5, '/images/testimonial-5.jpg', false, true);

-- Insert sample daily analytics (last 30 days) - FIXED ROUND FUNCTION
INSERT INTO public.daily_analytics (date, total_visitors, unique_visitors, page_views, new_orders, total_sales, conversion_rate)
SELECT 
  CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29),
  FLOOR(RANDOM() * 100) + 50,
  FLOOR(RANDOM() * 80) + 30,
  FLOOR(RANDOM() * 200) + 100,
  FLOOR(RANDOM() * 5) + 1,
  FLOOR(RANDOM() * 5000000) + 1000000,
  CAST(ROUND(CAST((RANDOM() * 5) + 2 AS NUMERIC), 2) AS DECIMAL(5,2))
ON CONFLICT (date) DO NOTHING;

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

-- Cart policies
CREATE POLICY "Users can manage own cart" ON public.cart FOR ALL USING (auth.uid() = user_id);

-- Public read access for products, categories, testimonials
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (is_approved = true);

-- Admin access policies
CREATE POLICY "Admins can manage all" ON public.orders FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Admins can manage all" ON public.order_items FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Admins can manage all" ON public.contact_messages FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Admins can manage all" ON public.whatsapp_messages FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Admins can manage all" ON public.visitor_analytics FOR ALL USING (auth.role() = 'admin');

-- Final system status check
DO $$
BEGIN
  RAISE NOTICE 'JonsStore database schema setup completed successfully!';
  RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
  RAISE NOTICE 'Functions created: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
  RAISE NOTICE 'Indexes created: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
  RAISE NOTICE 'System is ready for production use.';
END $$;
