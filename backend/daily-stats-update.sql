-- Daily Stats Update Script
-- Run this daily to populate the daily_stats table with aggregated data

-- Insert or update today's stats
INSERT INTO daily_stats (date, unique_visitors, total_page_views, email_signups, conversion_rate, updated_at)
SELECT 
    CURRENT_DATE as date,
    COUNT(DISTINCT session_id) as unique_visitors,
    COUNT(*) as total_page_views,
    (
        SELECT COUNT(*) 
        FROM early_access_emails 
        WHERE DATE(created_at) = CURRENT_DATE
    ) as email_signups,
    CASE 
        WHEN COUNT(DISTINCT session_id) > 0 THEN 
            ROUND(
                (
                    SELECT COUNT(*) 
                    FROM early_access_emails 
                    WHERE DATE(created_at) = CURRENT_DATE
                ) * 100.0 / COUNT(DISTINCT session_id), 
                2
            )
        ELSE 0
    END as conversion_rate,
    NOW() as updated_at
FROM page_visits 
WHERE DATE(visited_at) = CURRENT_DATE
ON CONFLICT (date) 
DO UPDATE SET 
    unique_visitors = EXCLUDED.unique_visitors,
    total_page_views = EXCLUDED.total_page_views,
    email_signups = EXCLUDED.email_signups,
    conversion_rate = EXCLUDED.conversion_rate,
    updated_at = NOW();

-- Also update yesterday's stats (in case of late data)
INSERT INTO daily_stats (date, unique_visitors, total_page_views, email_signups, conversion_rate, updated_at)
SELECT 
    CURRENT_DATE - INTERVAL '1 day' as date,
    COUNT(DISTINCT session_id) as unique_visitors,
    COUNT(*) as total_page_views,
    (
        SELECT COUNT(*) 
        FROM early_access_emails 
        WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
    ) as email_signups,
    CASE 
        WHEN COUNT(DISTINCT session_id) > 0 THEN 
            ROUND(
                (
                    SELECT COUNT(*) 
                    FROM early_access_emails 
                    WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'
                ) * 100.0 / COUNT(DISTINCT session_id), 
                2
            )
        ELSE 0
    END as conversion_rate,
    NOW() as updated_at
FROM page_visits 
WHERE DATE(visited_at) = CURRENT_DATE - INTERVAL '1 day'
ON CONFLICT (date) 
DO UPDATE SET 
    unique_visitors = EXCLUDED.unique_visitors,
    total_page_views = EXCLUDED.total_page_views,
    email_signups = EXCLUDED.email_signups,
    conversion_rate = EXCLUDED.conversion_rate,
    updated_at = NOW();

-- Clean up old daily stats (keep only last 90 days)
DELETE FROM daily_stats 
WHERE date < CURRENT_DATE - INTERVAL '90 days'; 