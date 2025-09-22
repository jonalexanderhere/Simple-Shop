-- Create functions and triggers for real-time analytics

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert daily analytics for today
  INSERT INTO public.daily_analytics (date, total_visitors, unique_visitors, page_views, new_orders, total_sales, conversion_rate)
  VALUES (CURRENT_DATE, 0, 0, 0, 0, 0, 0)
  ON CONFLICT (date) DO NOTHING;
  
  -- Update counters based on trigger type
  IF TG_TABLE_NAME = 'visitor_tracking' THEN
    UPDATE public.daily_analytics 
    SET 
      total_visitors = total_visitors + 1,
      page_views = page_views + 1,
      updated_at = NOW()
    WHERE date = CURRENT_DATE;
  END IF;
  
  IF TG_TABLE_NAME = 'orders' AND NEW.status = 'completed' THEN
    UPDATE public.daily_analytics 
    SET 
      new_orders = new_orders + 1,
      total_sales = total_sales + NEW.total_amount,
      conversion_rate = ROUND((new_orders::DECIMAL / NULLIF(total_visitors, 0) * 100), 2),
      updated_at = NOW()
    WHERE date = CURRENT_DATE;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'YLZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_analytics_visitor ON public.visitor_tracking;
CREATE TRIGGER trigger_update_analytics_visitor
  AFTER INSERT ON public.visitor_tracking
  FOR EACH ROW EXECUTE FUNCTION update_daily_analytics();

DROP TRIGGER IF EXISTS trigger_update_analytics_order ON public.orders;
CREATE TRIGGER trigger_update_analytics_order
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_daily_analytics();

DROP TRIGGER IF EXISTS trigger_generate_order_number ON public.orders;
CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function to clean old visitor tracking data (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_visitor_data()
RETURNS void AS $$
BEGIN
  DELETE FROM public.visitor_tracking 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
