-- Setup Admin User for JonsStore
-- This script creates an admin user in Supabase Auth

-- First, you need to manually create the admin user in Supabase Dashboard:
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add user" 
-- 3. Enter email: admin@jonsstore.com
-- 4. Enter password: jonsstore123
-- 5. Confirm email: true
-- 6. Save the user

-- Then run this script to add admin role to the user
-- (Replace 'user-uuid-here' with the actual UUID from Supabase Auth)

-- Create admin role if it doesn't exist
INSERT INTO auth.roles (role) VALUES ('admin') ON CONFLICT (role) DO NOTHING;

-- Add admin role to the user (replace with actual user ID)
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb 
-- WHERE email = 'admin@jonsstore.com';

-- Alternative: Create a custom admin table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
INSERT INTO admin_users (email, role) 
VALUES ('admin@jonsstore.com', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  role = EXCLUDED.role,
  updated_at = NOW();

-- Create RLS policy for admin users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all admin users
CREATE POLICY "Admins can read admin users" ON admin_users
  FOR SELECT USING (true);

-- Allow admins to insert new admin users
CREATE POLICY "Admins can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (true);

-- Allow admins to update admin users
CREATE POLICY "Admins can update admin users" ON admin_users
  FOR UPDATE USING (true);

-- Allow admins to delete admin users
CREATE POLICY "Admins can delete admin users" ON admin_users
  FOR DELETE USING (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = user_email AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin(TEXT) TO authenticated;

-- Test the function
SELECT is_admin('admin@jonsstore.com') as is_admin_check;
