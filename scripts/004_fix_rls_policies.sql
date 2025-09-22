-- Fix RLS policies for daily_analytics table to allow automated updates
-- This addresses the RLS violation error when tracking visitors

-- Add INSERT and UPDATE policies for daily_analytics
-- Allow system to automatically update daily analytics
CREATE POLICY "Allow system insert daily analytics" ON public.daily_analytics 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow system update daily analytics" ON public.daily_analytics 
FOR UPDATE USING (true);

-- Add missing policies for order_items
CREATE POLICY "Allow order items access" ON public.order_items 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR current_setting('app.admin_access', true)::boolean = true)
  )
);

-- Add missing policies for users table
CREATE POLICY "Allow users to view their profile" ON public.users 
FOR SELECT USING (id = auth.uid() OR current_setting('app.admin_access', true)::boolean = true);

CREATE POLICY "Allow users to update their profile" ON public.users 
FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Allow user registration" ON public.users 
FOR INSERT WITH CHECK (true);

-- Add admin policies for all tables
CREATE POLICY "Allow admin full access to products" ON public.products 
FOR ALL USING (current_setting('app.admin_access', true)::boolean = true);

CREATE POLICY "Allow admin full access to orders" ON public.orders 
FOR ALL USING (current_setting('app.admin_access', true)::boolean = true);

CREATE POLICY "Allow admin full access to testimonials" ON public.testimonials 
FOR ALL USING (current_setting('app.admin_access', true)::boolean = true);

CREATE POLICY "Allow admin update contact messages" ON public.contact_messages 
FOR UPDATE USING (current_setting('app.admin_access', true)::boolean = true);

-- Allow admin full access to visitor tracking for analytics
CREATE POLICY "Allow admin full access to visitor tracking" ON public.visitor_tracking 
FOR ALL USING (current_setting('app.admin_access', true)::boolean = true);
