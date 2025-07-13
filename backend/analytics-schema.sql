-- Analytics Schema for Licensify Landing Page
-- Run this SQL in your Supabase SQL editor

-- 1. Page visits tracking table
CREATE TABLE page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ip_address INET,
  country TEXT,
  city TEXT,
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
CREATE INDEX idx_page_visits_country ON page_visits(country);
CREATE INDEX idx_page_visits_city ON page_visits(city);
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
  conversion_rate DECIMAL(5,2);
BEGIN
  -- Get unique visitors (distinct session_ids)
  SELECT COUNT(DISTINCT session_id) INTO total_visitors
  FROM page_visits;
  
  -- Get total email signups
  SELECT COUNT(*) INTO total_signups
  FROM early_access_emails;
  
  -- Calculate conversion rate
  IF total_visitors > 0 THEN
    conversion_rate := (total_signups::DECIMAL / total_visitors::DECIMAL) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  RETURN ROUND(conversion_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- 7. Create function to get analytics dashboard data
CREATE OR REPLACE FUNCTION get_analytics_dashboard()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_visitors', (SELECT COUNT(DISTINCT session_id) FROM page_visits),
    'total_signups', (SELECT COUNT(*) FROM early_access_emails),
    'conversion_rate', get_conversion_rate(),
    'today_visitors', (
      SELECT COUNT(DISTINCT session_id) 
      FROM page_visits 
      WHERE DATE(visited_at) = CURRENT_DATE
    ),
    'today_signups', (
      SELECT COUNT(*) 
      FROM early_access_emails 
      WHERE DATE(created_at) = CURRENT_DATE
    ),
    'today_conversion_rate', (
      CASE 
        WHEN (SELECT COUNT(DISTINCT session_id) FROM page_visits WHERE DATE(visited_at) = CURRENT_DATE) > 0
        THEN ROUND(
          (SELECT COUNT(*) FROM early_access_emails WHERE DATE(created_at) = CURRENT_DATE)::DECIMAL / 
          (SELECT COUNT(DISTINCT session_id) FROM page_visits WHERE DATE(visited_at) = CURRENT_DATE)::DECIMAL * 100, 
          2
        )
        ELSE 0
      END
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 8. Create function to get country statistics
CREATE OR REPLACE FUNCTION get_country_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'country', country,
      'visitors', visitors,
      'percentage', percentage
    )
    ORDER BY visitors DESC
  ) INTO result
  FROM (
    SELECT 
      COALESCE(country, 'Unknown') as country,
      COUNT(DISTINCT session_id) as visitors,
      ROUND(
        (COUNT(DISTINCT session_id)::DECIMAL / 
         (SELECT COUNT(DISTINCT session_id) FROM page_visits)::DECIMAL * 100), 
        1
      ) as percentage
    FROM page_visits 
    GROUP BY country
    HAVING COUNT(DISTINCT session_id) > 0
  ) country_stats;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql;

-- 9. Create function to get city statistics
CREATE OR REPLACE FUNCTION get_city_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'city', city,
      'country', country,
      'visitors', visitors,
      'percentage', percentage
    )
    ORDER BY visitors DESC
  ) INTO result
  FROM (
    SELECT 
      COALESCE(city, 'Unknown') as city,
      COALESCE(country, 'Unknown') as country,
      COUNT(DISTINCT session_id) as visitors,
      ROUND(
        (COUNT(DISTINCT session_id)::DECIMAL / 
         (SELECT COUNT(DISTINCT session_id) FROM page_visits)::DECIMAL * 100), 
        1
      ) as percentage
    FROM page_visits 
    GROUP BY city, country
    HAVING COUNT(DISTINCT session_id) > 0
  ) city_stats;
  
  RETURN COALESCE(result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql;

-- 10. Migration: Add country and city columns to existing page_visits table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'page_visits' AND column_name = 'country') THEN
        ALTER TABLE page_visits ADD COLUMN country TEXT;
        CREATE INDEX idx_page_visits_country ON page_visits(country);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'page_visits' AND column_name = 'city') THEN
        ALTER TABLE page_visits ADD COLUMN city TEXT;
        CREATE INDEX idx_page_visits_city ON page_visits(city);
    END IF;
END $$; 