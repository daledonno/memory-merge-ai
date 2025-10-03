# 🚀 GitHub to Live Deployment Guide

## Option 1: Vercel (Recommended - Free & Easy)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Memory Merge AI"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/memory-merge-ai.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `FAL_KEY` = `f842343c-8953-4215-bc95-78b61df4afc5:fcc1f2cb204cf7ce9a1bc23019b56056`
   - `PRINTFUL_API_KEY` = `your_printful_oauth_token_here`
6. Click "Deploy"

### Step 3: Get Your Live URL
- Vercel will give you a live URL like: `https://memory-merge-ai.vercel.app`
- You can also add a custom domain later

---

## Option 2: Netlify (Alternative)

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in Site settings
7. Deploy

---

## Option 3: Railway

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Add environment variables
7. Deploy

---

## 🔧 Environment Variables Needed

Add these to your deployment platform:

```env
FAL_KEY=f842343c-8953-4215-bc95-78b61df4afc5:fcc1f2cb204cf7ce9a1bc23019b56056
PRINTFUL_API_KEY=your_printful_oauth_token_here
NODE_ENV=production
```

---

## 🚀 Automatic Deployments

Once set up, every time you push to GitHub:
- ✅ Code automatically deploys
- ✅ New version goes live
- ✅ Zero manual work needed

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Vercel** | 100GB bandwidth/month | $20/month | Next.js apps |
| **Netlify** | 100GB bandwidth/month | $19/month | Static sites |
| **Railway** | $5 credit/month | $5/month | Full-stack apps |

---

## 🎯 Recommended: Vercel

**Why Vercel?**
- ✅ Made by Next.js team
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect for your app
- ✅ Free tier is generous

---

## 📝 Next Steps After Deployment

1. **Test your live app** - Generate a family memory
2. **Get Printful OAuth token** - For order functionality
3. **Add custom domain** - If you have one
4. **Set up analytics** - Track usage
5. **Configure webhooks** - For order notifications

Your app will be live and accessible worldwide! 🌍
