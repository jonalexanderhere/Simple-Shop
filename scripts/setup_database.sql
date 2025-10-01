-- JonsStore Database Setup Script
-- Run this script in your Supabase SQL Editor

-- Step 1: Run the complete schema
\i scripts/008_jonsstore_fixed_schema.sql

-- Step 2: Verify the setup
SELECT 
  'Database Setup Complete' as status,
  COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Step 3: Check admin user
SELECT 
  'Admin User' as type,
  email,
  name,
  role,
  is_active
FROM public.admins 
WHERE email = 'admin@jonsstore.com';

-- Step 4: Check sample data
SELECT 
  'Sample Data' as type,
  COUNT(*) as count,
  'products' as table_name
FROM public.products
UNION ALL
SELECT 
  'Sample Data' as type,
  COUNT(*) as count,
  'categories' as table_name
FROM public.categories
UNION ALL
SELECT 
  'Sample Data' as type,
  COUNT(*) as count,
  'testimonials' as table_name
FROM public.testimonials
UNION ALL
SELECT 
  'Sample Data' as type,
  COUNT(*) as count,
  'settings' as table_name
FROM public.settings;

-- Step 5: Test authentication
SELECT 
  'Authentication Test' as test,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.admins WHERE email = 'admin@jonsstore.com') 
    THEN 'Admin user exists' 
    ELSE 'Admin user missing' 
  END as result;
