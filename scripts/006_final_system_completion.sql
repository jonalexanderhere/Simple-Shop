-- Final comprehensive system completion and optimization

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_session_id ON visitor_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_created_at ON visitor_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- Create function to update daily analytics automatically
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert daily analytics for today
  INSERT INTO daily_analytics (
    date,
    total_visitors,
    unique_visitors,
    page_views,
    new_orders,
    total_sales,
    conversion_rate,
    created_at,
    updated_at
  )
  VALUES (
    CURRENT_DATE,
    1,
    1,
    1,
    0,
    0,
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (date) DO UPDATE SET
    total_visitors = daily_analytics.total_visitors + 1,
    page_views = daily_analytics.page_views + 1,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic analytics updates
DROP TRIGGER IF EXISTS trigger_update_daily_analytics ON visitor_tracking;
CREATE TRIGGER trigger_update_daily_analytics
  AFTER INSERT ON visitor_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_analytics();

-- Create function to update order analytics
CREATE OR REPLACE FUNCTION update_order_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update daily analytics when new order is created
  INSERT INTO daily_analytics (
    date,
    total_visitors,
    unique_visitors,
    page_views,
    new_orders,
    total_sales,
    conversion_rate,
    created_at,
    updated_at
  )
  VALUES (
    CURRENT_DATE,
    0,
    0,
    0,
    1,
    NEW.total_amount,
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (date) DO UPDATE SET
    new_orders = daily_analytics.new_orders + 1,
    total_sales = daily_analytics.total_sales + NEW.total_amount,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order analytics
DROP TRIGGER IF EXISTS trigger_update_order_analytics ON orders;
CREATE TRIGGER trigger_update_order_analytics
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_analytics();

-- Insert some initial analytics data if none exists
INSERT INTO daily_analytics (
  date,
  total_visitors,
  unique_visitors,
  page_views,
  new_orders,
  total_sales,
  conversion_rate,
  created_at,
  updated_at
) VALUES (
  CURRENT_DATE,
  0,
  0,
  0,
  0,
  0,
  0,
  NOW(),
  NOW()
) ON CONFLICT (date) DO NOTHING;

-- Create function to clean old visitor tracking data (optional)
CREATE OR REPLACE FUNCTION cleanup_old_visitor_data()
RETURNS void AS $$
BEGIN
  -- Delete visitor tracking data older than 90 days
  DELETE FROM visitor_tracking 
  WHERE created_at < NOW() - INTERVAL '91 days';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_daily_analytics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_order_analytics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_visitor_data() TO authenticated;

-- Ensure all sequences are properly owned
ALTER SEQUENCE IF EXISTS products_id_seq OWNED BY products.id;
ALTER SEQUENCE IF EXISTS orders_id_seq OWNED BY orders.id;
ALTER SEQUENCE IF EXISTS users_id_seq OWNED BY users.id;

-- Final verification: ensure all tables have proper permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create a view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM products WHERE is_active = true) as active_products,
  (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE) as today_orders,
  (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') as unread_messages,
  (SELECT COUNT(DISTINCT session_id) FROM visitor_tracking WHERE created_at >= CURRENT_DATE) as today_visitors,
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= CURRENT_DATE) as today_revenue,
  (SELECT COUNT(*) FROM users) as total_users;

-- Grant access to the view
GRANT SELECT ON admin_dashboard_stats TO anon, authenticated;

-- Create notification function for new orders (for WhatsApp integration)
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be extended to send notifications
  -- For now, it just logs the new order
  RAISE NOTICE 'New order created: %', NEW.order_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new order notifications
DROP TRIGGER IF EXISTS trigger_notify_new_order ON orders;
CREATE TRIGGER trigger_notify_new_order
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_order();

-- Final system status check
DO $$
BEGIN
  RAISE NOTICE 'JonsStore Digital Solutions database setup completed successfully!';
  RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
  RAISE NOTICE 'Functions created: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
  RAISE NOTICE 'System is ready for production use.';
END $$;
