# Supabase Integration Setup for Licensify Landing Page

This guide will help you set up Supabase integration to save email addresses from your landing page.

## Prerequisites

1. A Supabase account ([sign up here](https://supabase.com))
2. A Supabase project created

## 1. Create the Database Table

First, you need to create a table in your Supabase database to store the email addresses.

### SQL Command to Create Table

Run this SQL command in your Supabase SQL editor:

```sql
-- Create the early_access_emails table
CREATE TABLE early_access_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'landing_page',
  user_agent TEXT,
  referrer TEXT,
  ip_address INET
);

-- Create an index on email for faster lookups
CREATE INDEX idx_early_access_emails_email ON early_access_emails(email);

-- Create an index on created_at for sorting
CREATE INDEX idx_early_access_emails_created_at ON early_access_emails(created_at);
```

## 2. Set Up Row Level Security (RLS)

For security, enable RLS on your table:

```sql
-- Enable Row Level Security
ALTER TABLE early_access_emails ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows INSERT for everyone (for email signup)
CREATE POLICY "Allow public inserts" ON early_access_emails
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create a policy that allows SELECT for authenticated users only (optional)
CREATE POLICY "Allow authenticated reads" ON early_access_emails
  FOR SELECT
  TO authenticated
  USING (true);
```

## 3. Configure Your Environment Variables

You need to get your Supabase project URL and anon public key:

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 4. Update the Configuration File

Open `config.js` and replace the placeholder values:

```javascript
window.SUPABASE_CONFIG = {
    url: 'https://your-project.supabase.co', // Replace with your project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Replace with your anon public key
};
```

## 5. Test the Integration

1. Open your landing page in a browser
2. Try submitting an email address
3. Check the browser console for any errors
4. Verify the email was saved in your Supabase table

## 6. Monitor Your Database

You can view all submitted emails in your Supabase dashboard:

1. Go to your project dashboard
2. Click on "Table Editor"
3. Select the `early_access_emails` table

## Security Notes

- The anon public key is safe to expose in client-side code
- Row Level Security (RLS) protects your data
- Only INSERT operations are allowed for public users
- All data is automatically timestamped

## Troubleshooting

### Common Issues

1. **"Supabase not configured" in console**
   - Check that your `config.js` file has the correct URL and key
   - Ensure the config file is loaded before `script.js`

2. **"Permission denied" errors**
   - Verify that RLS policies are set up correctly
   - Check that the table exists and has the correct structure

3. **"Email already exists" errors**
   - This is normal behavior - the system prevents duplicate signups
   - Check your database to confirm the email was stored

### Checking Database Connection

Open your browser's developer console and run:

```javascript
console.log('Supabase config:', window.SUPABASE_CONFIG);
```

This should show your configuration. If it's undefined, check that `config.js` is loading correctly.

## Additional Features

The integration includes:

- **Duplicate prevention**: Checks Supabase database for existing emails
- **Error handling**: Gracefully handles connection issues  
- **Automatic metadata**: Stores user agent, referrer, and timestamp
- **Single source of truth**: Uses only Supabase for email storage

## Database Schema

The `early_access_emails` table structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| email | TEXT | User's email address (unique) |
| created_at | TIMESTAMP | When the email was submitted |
| source | TEXT | Source of the signup (default: 'landing_page') |
| user_agent | TEXT | User's browser information |
| referrer | TEXT | Page that referred the user |
| ip_address | INET | User's IP address (optional) |

## Next Steps

- Set up email notifications when new signups occur
- Create a dashboard to view signup analytics
- Export email lists for marketing campaigns
- Set up automated email responses for new signups

## Support

If you encounter any issues, check:
1. Supabase project dashboard for error logs
2. Browser console for JavaScript errors
3. Network tab for failed API requests

Your Supabase integration is now ready to collect early access emails! 