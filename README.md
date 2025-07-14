# Licensify Landing Page

A modern, responsive landing page for Licensify - the ultimate app for UK learner drivers. Built with real-time analytics tracking, email collection, and conversion optimization.

## Features

- **Modern Design**: Clean, professional design with UK-focused branding
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Email Collection**: Supabase-powered email signup with duplicate prevention
- **Interactive Elements**: Smooth animations, hover effects, and success messages
- **Analytics Dashboard**: Real-time conversion tracking and geographic insights
- **SEO Optimized**: Schema.org markup and semantic HTML structure
- **Performance Optimized**: Optimized animations and efficient DOM operations
- **Cookie Consent**: GDPR-compliant cookie management
- **Conversion Tracking**: Google Analytics 4 and Google Ads integration

## File Structure

```
├── index.html                    # Main landing page
├── thank-you.html               # Post-signup thank you page
├── styles.css                   # CSS styling
├── script.js                    # Core JavaScript functionality
├── favicon.png                  # Site favicon
├── CNAME                        # Domain configuration
├── backend/                     # Analytics backend
│   ├── analytics-dashboard.html # Real-time analytics dashboard
│   ├── config.js               # Supabase configuration
│   ├── analytics-schema.sql    # Database schema
│   └── daily-stats-update.sql  # Analytics update procedures
└── n8n_automation/             # Instagram automation
    ├── README-n8n-setup.md     # Setup instructions
    └── licensify-instagram-automation.json # n8n workflow
```

## Key Components

### 1. Landing Page (index.html)
- Social proof banner (15,000+ learners, 98% pass rate)
- Feature highlights with trust indicators
- Email collection with real-time validation
- Cookie consent management
- Schema.org markup for SEO

### 2. Thank You Page (thank-you.html)
- Conversion confirmation
- Google Ads conversion tracking
- Return to homepage option

### 3. Analytics System
- Real-time conversion tracking
- Geographic visitor analysis
- Session-based analytics
- Daily statistics aggregation

## Email Collection & Analytics

The landing page uses Supabase for email collection and analytics:

1. **Email Storage**:
   - Real-time duplicate checking
   - Geolocation tracking
   - User agent and referrer tracking
   - Session-based analytics

2. **Analytics Dashboard**:
   - Overall conversion rate
   - Daily performance metrics
   - Geographic distribution
   - Real-time visitor tracking

### Configuration

The Supabase and analytics configuration is embedded in the HTML files:

```javascript
window.LICENSIFY_CONFIG = {
    supabase: {
        url: 'YOUR_SUPABASE_URL',
        anonKey: 'YOUR_ANON_KEY'
    },
    analytics: {
        ga4Id: 'YOUR_GA4_ID',
        googleAdsId: 'YOUR_ADS_ID'
    }
};
```

## Deployment

### Prerequisites
1. Supabase project setup
2. Google Analytics 4 configuration
3. Google Ads account (optional)

### Deployment Steps
1. Update configuration in `index.html` and `thank-you.html`
2. Deploy files to your hosting service
3. Set up the analytics dashboard:
   - Deploy backend folder
   - Configure `config.js` with Supabase credentials
   - Run SQL schema setup

## Development

To work on this locally:

1. Clone the repository
2. Set up local environment:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx live-server
```
3. Configure Supabase:
   - Create new project
   - Run `backend/analytics-schema.sql`
   - Update configuration

## Analytics Integration

The site includes:

1. **Supabase Analytics**:
   - Real-time conversion tracking
   - Geographic analysis
   - Session tracking

2. **Google Analytics 4**:
   - Event tracking
   - Conversion goals
   - User behavior analysis

3. **Google Ads**:
   - Conversion tracking
   - Campaign attribution
   - ROI measurement

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security & Privacy

- GDPR-compliant cookie consent
- Secure email storage
- No sensitive data collection
- Rate limiting on submissions
- XSS prevention measures

## Instagram Automation (Optional)

The `n8n_automation` folder contains a workflow for automated Instagram posting:
- 3 posts daily schedule
- AI-generated images
- Engagement-optimized content
- Error handling and monitoring

See `n8n_automation/README-n8n-setup.md` for setup instructions.

## Support

For technical support:
1. Check browser console for errors
2. Verify Supabase configuration
3. Confirm analytics setup
4. Test email submission flow
