-- Seed sample data for Yilzi Digital Solutions

-- Insert sample products
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity) VALUES
('Website Development', 'Professional website development with modern design and responsive layout', 2500000, 'Web Development', '/images/web-dev.jpg', 100),
('Mobile App Development', 'Native and cross-platform mobile application development', 5000000, 'Mobile Development', '/images/mobile-dev.jpg', 50),
('Digital Marketing Package', 'Complete digital marketing solution including SEO, social media, and content marketing', 1500000, 'Marketing', '/images/digital-marketing.jpg', 200),
('E-commerce Solution', 'Full-featured online store with payment integration and inventory management', 3500000, 'E-commerce', '/images/ecommerce.jpg', 75),
('Brand Identity Design', 'Logo design, brand guidelines, and complete visual identity package', 1200000, 'Design', '/images/branding.jpg', 150),
('Cloud Hosting Service', 'Reliable cloud hosting with 99.9% uptime guarantee and 24/7 support', 500000, 'Hosting', '/images/hosting.jpg', 500);

-- Insert sample testimonials
INSERT INTO public.testimonials (name, company, content, rating, image_url, is_featured) VALUES
('Ahmad Rizki', 'PT. Teknologi Maju', 'Yilzi Digital Solutions memberikan layanan yang sangat profesional. Website kami sekarang terlihat modern dan performa sangat baik!', 5, '/images/testimonial-1.jpg', true),
('Sari Dewi', 'Toko Online Berkah', 'Tim Yilzi sangat membantu dalam mengembangkan toko online kami. Penjualan meningkat 300% setelah menggunakan layanan mereka.', 5, '/images/testimonial-2.jpg', true),
('Budi Santoso', 'Startup InnovateTech', 'Aplikasi mobile yang dikembangkan Yilzi sangat user-friendly dan stabil. Highly recommended!', 5, '/images/testimonial-3.jpg', true),
('Maya Putri', 'Klinik Sehat Sentosa', 'Digital marketing package dari Yilzi membantu klinik kami mendapatkan lebih banyak pasien. ROI sangat memuaskan!', 4, '/images/testimonial-4.jpg', false),
('Eko Prasetyo', 'CV. Mitra Sukses', 'Brand identity yang dibuat Yilzi sangat mencerminkan visi perusahaan kami. Terima kasih atas kerja sama yang baik!', 5, '/images/testimonial-5.jpg', false);

-- Insert sample daily analytics (last 30 days)
INSERT INTO public.daily_analytics (date, total_visitors, unique_visitors, page_views, new_orders, total_sales, conversion_rate)
SELECT 
  CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29),
  FLOOR(RANDOM() * 500 + 100)::INTEGER,
  FLOOR(RANDOM() * 300 + 80)::INTEGER,
  FLOOR(RANDOM() * 1500 + 300)::INTEGER,
  FLOOR(RANDOM() * 15 + 2)::INTEGER,
  FLOOR(RANDOM() * 50000000 + 5000000)::DECIMAL(12,2),
  ROUND((RANDOM() * 5 + 2)::NUMERIC, 2)
FROM generate_series(0, 29);

-- Update today's analytics with current data
UPDATE public.daily_analytics 
SET 
  total_visitors = 245,
  unique_visitors = 189,
  page_views = 892,
  new_orders = 8,
  total_sales = 15750000,
  conversion_rate = 4.2
WHERE date = CURRENT_DATE;
