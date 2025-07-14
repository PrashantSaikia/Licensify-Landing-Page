# Licensify Instagram Automation - n8n Workflow Setup Guide

This n8n workflow automatically posts about your Licensify driving app to Instagram **3 times daily** with AI-generated images and engaging content tailored for learner drivers.

## 🚀 What This Workflow Does

- **Schedules posts 3 times daily** (8AM, 4PM, 12AM)
- **Generates AI images** using Replicate API with driving-related prompts
- **Posts varied content** about Licensify's features (theory tests, hazard perception, instructor booking, etc.)
- **Automatically handles** Instagram's media container creation and publishing
- **Includes error handling** and success tracking

## 📋 Prerequisites

Before setting up this workflow, you'll need:

### 1. Instagram Business Account
- Convert your Instagram account to a Business account
- Connect it to a Facebook Page
- Note down your Instagram Business Account ID

### 2. Facebook Developer Account
- Create a Facebook Developer account
- Create a new Facebook App
- Get necessary permissions and access tokens

### 3. n8n Instance
- Self-hosted n8n or n8n Cloud account
- Basic familiarity with n8n workflows

### 4. API Keys
- **Replicate API Token** (for AI image generation)
- **Facebook Access Token** (for Instagram posting)

## 🛠️ Step-by-Step Setup

### Step 1: Facebook Developer Setup

1. **Create Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app → Business → App Name: "Licensify Social Media"

2. **Add Instagram Basic Display:**
   - In your app dashboard, add "Instagram Basic Display" product
   - Add "Instagram Graph API" product

3. **Configure Instagram:**
   - Go to Instagram Basic Display → Basic Display
   - Add your Instagram Business Account
   - Generate Access Token with permissions:
     - `instagram_basic`
     - `instagram_content_publish`
     - `pages_read_engagement`
     - `pages_show_list`

4. **Get Instagram Account ID:**
   - Use Graph API Explorer: `GET /me/accounts`
   - Find your page and get the connected Instagram account ID

### Step 2: Replicate API Setup

1. **Sign up for Replicate:**
   - Go to [Replicate.com](https://replicate.com/)
   - Create account and get API token

2. **Test API Access:**
   - Verify you can access the Flux image generation model
   - Note: Replicate charges per generation (~$0.055 per image)

### Step 3: n8n Workflow Configuration

1. **Import the Workflow:**
   - Copy the `licensify-instagram-automation.json` content
   - In n8n: Import from JSON

2. **Configure Credentials:**
   
   **Facebook Graph API:**
   - Go to n8n Settings → Credentials
   - Add "Facebook Graph API" credential
   - Enter your Facebook Access Token

   **Replicate API:**
   - Add "Header Auth" credential
   - Name: "Replicate API"
   - Header: "Authorization"
   - Value: "Token YOUR_REPLICATE_API_TOKEN"

3. **Update Workflow Variables:**
   
   Replace these placeholders in the workflow:
   - `YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID` → Your actual Instagram Business Account ID
   - `YOUR_FACEBOOK_ACCESS_TOKEN` → Your Facebook Access Token
   - `YOUR_REPLICATE_API_TOKEN` → Your Replicate API Token

### Step 4: Content Customization

The workflow includes 8 predefined post variations about Licensify:

1. Theory Test Practice
2. Hazard Perception Training
3. Instructor Booking
4. Progress Tracking
5. Smart Reminders
6. All-in-One Features
7. Success Stories
8. Mock Tests Tips

**To customize content:**
- Edit the `Prepare Content` node
- Modify the captions array with your own messaging
- Update image prompts for different visual styles
- Adjust hashtags for your target audience

### Step 5: Testing & Activation

1. **Test the Workflow:**
   - Click "Test workflow" in n8n
   - Check each node for successful execution
   - Verify image generation and Instagram posting

2. **Activate Automation:**
   - Toggle the workflow to "Active"
   - Monitor the execution log for the first few runs

## 📊 Posting Schedule

The workflow posts **3 times daily** at:
- **8:00 AM** - Morning motivation post
- **4:00 PM** - Afternoon engagement post  
- **12:00 AM** - Late night study tips

## 🎨 AI Image Generation

Each post includes a unique AI-generated image using:
- **Model:** Flux-1.1-Pro (via Replicate)
- **Format:** 1080x1080 (Instagram square)
- **Style:** Professional, driving-related imagery
- **Cost:** ~$0.055 per image (~$0.17/day)

## 🔧 Troubleshooting

### Common Issues:

**Instagram API Errors:**
- Verify your access token hasn't expired
- Check Instagram Business Account permissions
- Ensure Facebook Page is properly connected

**Image Generation Failures:**
- Check Replicate API token validity
- Verify account balance for image generation
- Adjust wait times if generation takes longer

**Posting Rate Limits:**
- Instagram allows 50 API posts per 24 hours
- 3 posts/day is well within limits
- Monitor for any rate limiting warnings

**Workflow Execution Errors:**
- Check n8n execution logs
- Verify all credentials are properly configured
- Test each node individually

## 📈 Monitoring & Analytics

Track your automated posts:
- Instagram Insights for engagement metrics
- n8n execution logs for technical monitoring
- Facebook Creator Studio for detailed analytics

## 🔒 Security Best Practices

1. **Rotate Access Tokens:** Update Facebook tokens every 60 days
2. **Monitor API Usage:** Track Replicate and Facebook API consumption
3. **Backup Workflow:** Export workflow JSON regularly
4. **Review Permissions:** Regularly audit app permissions

## 💡 Customization Ideas

**Enhance the workflow with:**
- Weather-based content (rainy day driving tips)
- Seasonal messaging (winter driving, summer holidays)
- User-generated content integration
- Cross-posting to other social platforms
- A/B testing different post formats

## 🆘 Support

If you encounter issues:
1. Check n8n community forums
2. Review Facebook Developer documentation
3. Test API endpoints manually
4. Verify all credentials and permissions

## 📝 Cost Breakdown

**Monthly Costs (estimated):**
- Replicate API: ~$5.10 (3 images/day × 30 days × $0.055)
- n8n Cloud: $20/month (if using cloud version)
- Facebook API: Free
- Instagram Business: Free

**Total:** ~$25-30/month for full automation

---

**🎯 Ready to Launch?**
1. Import the workflow JSON
2. Configure your credentials
3. Test with a single post
4. Activate and monitor!

Your Licensify Instagram presence will now run on autopilot, engaging potential learner drivers with consistent, professional content 3 times daily! 🚗✨ 