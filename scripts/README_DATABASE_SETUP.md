# JonsStore Database Setup Guide

## 🚀 Quick Setup

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `008_jonsstore_fixed_schema.sql`
4. Click **Run** to execute the script

### Option 2: Command Line
```bash
# If you have psql installed
psql "postgres://postgres.kfyvkytvwhicggwgrqmu:XsY7NSoa9LgSCufK@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require" -f scripts/008_jonsstore_fixed_schema.sql
```

## 📋 What Gets Created

### Core Tables
- **users** - Customer management
- **admins** - Admin user authentication
- **products** - Product catalog
- **categories** - Product categories
- **orders** - Order management
- **order_items** - Order line items
- **cart** - Shopping cart

### Analytics & Tracking
- **visitor_analytics** - Website analytics
- **daily_analytics** - Daily metrics
- **contact_messages** - Contact form submissions
- **whatsapp_messages** - WhatsApp integration

### System
- **settings** - System configuration
- **testimonials** - Customer testimonials
- **coupons** - Discount management
- **newsletter_subscribers** - Email marketing

## 🔐 Default Admin Credentials

**Email:** admin@jonsstore.com  
**Password:** jonsstore123

## ✅ Verification

After running the script, you should see:
- ✅ 15+ tables created
- ✅ Admin user created
- ✅ Sample data inserted
- ✅ RLS policies enabled
- ✅ Indexes created for performance

## 🛠️ Troubleshooting

### Common Issues:

1. **ROUND function error** - Fixed in version 008
2. **Permission errors** - Make sure you're using the service role key
3. **RLS policies** - May need to be adjusted based on your auth setup

### Check Setup:
```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check admin user
SELECT * FROM public.admins WHERE email = 'admin@jonsstore.com';

-- Test sample data
SELECT COUNT(*) FROM public.products;
SELECT COUNT(*) FROM public.categories;
```

## 🔧 Environment Variables

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kfyvkytvwhicggwgrqmu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🎯 Next Steps

1. Run the database setup
2. Test the admin login at `/admin/login`
3. Access the dashboard at `/admin-dashboard`
4. Configure your settings in the admin panel

Your JonsStore is now ready for production! 🚀
