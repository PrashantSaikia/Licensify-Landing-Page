-- Analytics Schema for Licensify Landing Page
-- Run this SQL in your Supabase SQL editor

-- 1. Page visits tracking table
CREATE TABLE page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_url TEXT DEFAULT 'landing_page'
);

-- 2. Daily analytics aggregation table
CREATE TABLE daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE UNIQUE,
  unique_visitors INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  email_signups INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX idx_page_visits_session_id ON page_visits(session_id);
CREATE INDEX idx_page_visits_visited_at ON page_visits(visited_at);
CREATE INDEX idx_daily_stats_date ON daily_stats(date);

-- 4. Enable Row Level Security
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public access (insert only)
CREATE POLICY "Allow public page visit tracking" ON page_visits
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public daily stats updates" ON daily_stats
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 6. Create a function to get real-time conversion rate
CREATE OR REPLACE FUNCTION get_conversion_rate()
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_visitors INTEGER;
  total_signups INTEGER;
  rate DECIMAL(5,2);
BEGIN
  -- Count unique visitors (unique session_ids)
  SELECT COUNT(DISTINCT session_id) INTO total_visitors FROM page_visits;
  
  -- Count email signups
  SELECT COUNT(*) INTO total_signups FROM early_access_emails;
  
  -- Calculate conversion rate
  IF total_visitors > 0 THEN
    rate := (total_signups::DECIMAL / total_visitors::DECIMAL) * 100;
  ELSE
    rate := 0.00;
  END IF;
  
  RETURN ROUND(rate, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a function to get analytics dashboard data
CREATE OR REPLACE FUNCTION get_analytics_dashboard()
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_visitors INTEGER;
  total_signups INTEGER;
  conversion_rate DECIMAL(5,2);
  today_visitors INTEGER;
  today_signups INTEGER;
  today_rate DECIMAL(5,2);
BEGIN
  -- Get overall stats
  SELECT COUNT(DISTINCT session_id) INTO total_visitors FROM page_visits;
  SELECT COUNT(*) INTO total_signups FROM early_access_emails;
  
  IF total_visitors > 0 THEN
    conversion_rate := (total_signups::DECIMAL / total_visitors::DECIMAL) * 100;
  ELSE
    conversion_rate := 0.00;
  END IF;
  
  -- Get today's stats
  SELECT COUNT(DISTINCT session_id) INTO today_visitors 
  FROM page_visits 
  WHERE DATE(visited_at) = CURRENT_DATE;
  
  SELECT COUNT(*) INTO today_signups 
  FROM early_access_emails 
  WHERE DATE(created_at) = CURRENT_DATE;
  
  IF today_visitors > 0 THEN
    today_rate := (today_signups::DECIMAL / today_visitors::DECIMAL) * 100;
  ELSE
    today_rate := 0.00;
  END IF;
  
  -- Build result JSON
  result := json_build_object(
    'overall', json_build_object(
      'total_visitors', total_visitors,
      'total_signups', total_signups,
      'conversion_rate', ROUND(conversion_rate, 2)
    ),
    'today', json_build_object(
      'visitors', today_visitors,
      'signups', today_signups,
      'conversion_rate', ROUND(today_rate, 2)
    ),
    'last_updated', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 