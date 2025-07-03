# Licensify Landing Page

A modern, responsive landing page for Licensify - the ultimate app for UK learner drivers. This page is designed to capture user interest and collect email addresses for launch notifications.

## Features

- **Modern Design**: Clean, professional design with UK-focused branding
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Email Collection**: Two strategically placed email signup forms
- **Interactive Elements**: Smooth animations, hover effects, and modal confirmations
- **Phone Mockup**: Visual preview of the app interface
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Performance Optimized**: Lightweight code with efficient loading

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Key Sections

### 1. Hero Section
- Compelling headline and value proposition
- Feature highlights with icons
- Primary email signup form
- Phone mockup showing app preview

### 2. Features Section
- Four key features with detailed descriptions:
  - Complete Theory Coverage
  - Hazard Perception Training
  - Smart Progress Tracking
  - Realistic Mock Tests

### 3. Call-to-Action Section
- Secondary email signup form
- Social proof messaging

### 4. Success Modal
- Confirmation dialog after email submission
- Professional thank you message

## Email Collection

Currently, the landing page stores emails in localStorage for development purposes. For production, you'll need to:

1. **Replace the email storage logic** in `script.js` with your preferred backend service
2. **Popular options include**:
   - Mailchimp API
   - ConvertKit
   - Netlify Forms
   - Custom backend endpoint

### Email Storage Code Location

Look for this function in `script.js`:

```javascript
function storeEmail(email) {
    // Replace this with your actual API call
    let emails = JSON.parse(localStorage.getItem('licensifyEmails') || '[]');
    // ... rest of the function
}
```

## Deployment Instructions

### Option 1: Static Hosting (Recommended)
1. Upload all files to your web hosting service
2. Point your domain (licensify.uk) to the hosting location
3. Ensure `index.html` is set as the default page

### Option 2: GitHub Pages
1. Create a new GitHub repository
2. Upload the files to the repository
3. Enable GitHub Pages in repository settings
4. Configure custom domain (licensify.uk)

### Option 3: Netlify
1. Drag and drop the folder to Netlify
2. Configure custom domain
3. Enable form handling for email collection

### Option 4: Vercel
1. Connect your GitHub repository to Vercel
2. Deploy with one click
3. Configure custom domain

## Customization

### Colors
The main color scheme uses:
- Primary: `#e53935` to `#1976d2` (gradient) - matches the Licensify logo
- Accent: `#e53935` to `#d32f2f` (gradient) - red L-plate inspired
- Background: `#f8f9fa`

### Fonts
- Primary font: Inter (loaded from Google Fonts)
- Fallback: System fonts (Apple, Windows, Linux)

### Content
- Update the content in `index.html` to match your specific messaging
- Replace the example theory question in the phone mockup
- Modify feature descriptions as needed

## Analytics Integration

The landing page includes hooks for analytics tracking:

1. **Google Analytics 4**: Uncomment and configure the gtag code
2. **Facebook Pixel**: Uncomment and configure the fbq code
3. **Custom Analytics**: Add your preferred tracking service

## Performance Optimization

- Uses modern CSS Grid and Flexbox for layout
- Optimized images and minimal external dependencies
- Efficient JavaScript with event delegation
- CSS animations for smooth interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

To work on this locally:

1. Clone or download the files
2. Open `index.html` in a web browser
3. Make changes to the files
4. Refresh the browser to see changes

For live development with auto-refresh, use a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have live-server installed)
npx live-server
```

## SEO Checklist

- [x] Meta title and description
- [x] Semantic HTML structure
- [x] Alt text for images (add if you include actual images)
- [x] Proper heading hierarchy
- [x] Mobile-friendly design
- [x] Fast loading times

## Next Steps

1. **Backend Integration**: Set up email collection backend
2. **Domain Setup**: Configure licensify.uk to point to your hosting
3. **Analytics**: Add your tracking codes
4. **A/B Testing**: Test different headlines or CTAs
5. **Social Media**: Add social sharing buttons if needed

## Legal Considerations

Make sure to add:
- Privacy Policy link
- Terms of Service link
- GDPR compliance notices (if applicable)
- Cookie consent banner (if using analytics)

## Support

For questions or issues with this landing page, check:
- Browser console for JavaScript errors
- Network tab for failed requests
- Mobile responsiveness on different devices

---

**Ready to launch?** Upload these files to your web server and start collecting emails for your Licensify app launch! 🚗 