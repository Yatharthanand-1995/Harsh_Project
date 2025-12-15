# Homespun - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### Current Features Ready for Production
- ✅ Homepage with hero and features
- ✅ Product catalog (20 products across 4 categories)
- ✅ Product detail pages with image galleries
- ✅ User registration and login
- ✅ Shopping cart system (add, update, remove)
- ✅ Real-time cart count
- ✅ Session management
- ✅ Responsive design
- ✅ Image optimization

### Features NOT Yet Implemented
- ❌ Checkout completion (payment integration)
- ❌ Order management
- ❌ Admin dashboard
- ❌ User profile pages
- ❌ Email notifications

---

## 🗄️ Step 1: Set Up Production Database

### Option A: Vercel Postgres (Recommended - Easiest)

1. **Install Vercel Postgres package:**
```bash
npm install @vercel/postgres
```

2. **In Vercel Dashboard:**
   - Go to your project → Storage
   - Click "Create Database" → Select "Postgres"
   - Choose region (closest to your users)
   - Click "Create"

3. **Vercel will automatically set these environment variables:**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

4. **Update your local `.env` for testing:**
```bash
# Copy from Vercel dashboard after database creation
DATABASE_URL="postgres://..."
```

### Option B: Neon (Free tier available)

1. **Create account at [neon.tech](https://neon.tech)**

2. **Create a new project:**
   - Name: "homespun-production"
   - Region: Select closest to your users
   - PostgreSQL version: 15 or 16

3. **Copy connection string:**
```
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

### Option C: Supabase (Free tier available)

1. **Create account at [supabase.com](https://supabase.com)**

2. **Create new project:**
   - Name: "homespun"
   - Database password: (generate strong password)
   - Region: Select closest

3. **Get connection string:**
   - Go to Settings → Database
   - Copy "Connection string" (session mode for Prisma)

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

---

## 🔐 Step 2: Environment Variables

### Required Environment Variables

Create these in Vercel Dashboard (Settings → Environment Variables):

#### Authentication
```bash
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Your Vercel deployment URL
NEXTAUTH_URL="https://your-app.vercel.app"
```

#### Database
```bash
# From your chosen database provider
DATABASE_URL="postgresql://..."
```

#### Payment (Optional - for future)
```bash
# Get from Razorpay dashboard
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxx"
RAZORPAY_KEY_SECRET="your_secret_key"
```

#### Email (Optional - for future)
```bash
# Get from Resend.com
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```

#### Application
```bash
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NEXT_PUBLIC_APP_NAME="Homespun"
```

---

## 📝 Step 3: Update Package.json

Ensure build scripts are correct:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint",
    "postinstall": "prisma generate"
  }
}
```

---

## 🚀 Step 4: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
cd "/Users/yatharthanand/Harsh Business/homespun"
vercel
```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No** (first time)
   - Project name? **homespun** (or your choice)
   - Directory? **.** (current directory)
   - Override settings? **No**

5. **Deploy to production:**
```bash
vercel --prod
```

### Method 2: Using GitHub (Easier for continuous deployment)

1. **Connect GitHub repository to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Root Directory: **./homespun** (if monorepo) or **.** (if standalone)
     - Build Command: `npm run build`
     - Output Directory: `.next`

2. **Add Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all required variables from Step 2

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

---

## 🗃️ Step 5: Database Migration & Seeding

After first deployment, you need to set up the production database:

### Option A: Using Vercel CLI

1. **Set up database schema:**
```bash
# This will push schema to production database
DATABASE_URL="your-production-url" npx prisma db push
```

2. **Seed production database:**
```bash
DATABASE_URL="your-production-url" npx prisma db seed
```

### Option B: Using Vercel Build Step

Add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

**⚠️ Warning:** This will run on every deployment. Better to do manually first time.

---

## ✅ Step 6: Post-Deployment Verification

### Test These Features:

1. **Homepage**
   - Visit `https://your-app.vercel.app`
   - Verify all images load
   - Check navigation works

2. **Products Page**
   - Navigate to `/products`
   - Verify all 20 products display
   - Test category filters

3. **User Registration**
   - Go to `/register`
   - Create a test account
   - Verify account creation

4. **Login**
   - Go to `/login`
   - Login with test account
   - Verify session persists

5. **Shopping Cart**
   - Add products to cart
   - Verify cart count updates
   - Go to `/cart`
   - Test quantity updates
   - Test remove items

6. **Product Details**
   - Visit any product page
   - Test quantity selector
   - Test add to cart

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails - "Cannot find module '@prisma/client'"

**Solution:**
Add `postinstall` script to package.json:
```json
"postinstall": "prisma generate"
```

### Issue 2: Database Connection Error

**Solution:**
- Verify DATABASE_URL is set in Vercel environment variables
- Check database is accessible (not behind firewall)
- For Neon/Supabase: Ensure connection pooling is enabled

### Issue 3: NextAuth Session Not Working

**Solution:**
- Verify NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your deployment URL
- Check cookies are not blocked

### Issue 4: Images Not Loading

**Solution:**
- Verify `next.config.ts` has image domains configured
- Check image URLs are accessible from production

### Issue 5: Environment Variables Not Loading

**Solution:**
- Redeploy after adding environment variables
- Check variable names are exact (case-sensitive)
- Don't prefix server-side variables with NEXT_PUBLIC_

---

## 📊 Monitoring & Analytics

### Add Vercel Analytics (Optional)

1. **Install package:**
```bash
npm install @vercel/analytics
```

2. **Add to layout:**
```tsx
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Vercel Speed Insights (Optional)

```bash
npm install @vercel/speed-insights
```

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

// Add to layout
<SpeedInsights />
```

---

## 🔒 Security Checklist

Before sharing with client:

- ✅ All API routes check authentication
- ✅ Environment variables are not exposed to client
- ✅ Database credentials are secure
- ✅ NEXTAUTH_SECRET is strong and unique
- ✅ CORS is configured if needed
- ✅ Rate limiting considered (future)

---

## 📱 Share with Client

### What to Share:

1. **Production URL:**
   ```
   https://homespun.vercel.app
   or
   https://your-custom-domain.com
   ```

2. **Test Credentials:**
   ```
   Email: test@homespun.com
   Password: password123

   OR create a demo account specifically for client
   ```

3. **Feature List:**
   - ✅ Browse 20 products across 4 categories
   - ✅ View product details with image galleries
   - ✅ Create account and login
   - ✅ Add products to shopping cart
   - ✅ Update quantities and remove items
   - ✅ Responsive design (mobile, tablet, desktop)

4. **Known Limitations:**
   - ⚠️ Checkout not yet complete (coming next)
   - ⚠️ No payment integration yet
   - ⚠️ No order history yet
   - ⚠️ No admin panel yet

5. **Feedback Form:**
   Create a simple Google Form or Typeform for structured feedback

---

## 🔄 Continuous Deployment

Once connected to GitHub:

1. **Every push to `main` branch will:**
   - Automatically deploy to production
   - Run build checks
   - Update live site

2. **Preview Deployments:**
   - Every pull request gets a preview URL
   - Test changes before merging

3. **Rollback:**
   - Can instantly rollback to previous deployment
   - Go to Vercel Dashboard → Deployments → Click "⋯" → Promote to Production

---

## 📋 Deployment Checklist

### Before First Deploy:
- [ ] Production database created
- [ ] Environment variables configured in Vercel
- [ ] `postinstall` script added to package.json
- [ ] Database schema pushed to production
- [ ] Production database seeded with products
- [ ] Test account created for client demo

### After Deploy:
- [ ] Visit homepage - verify loads
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test cart operations
- [ ] Check mobile responsiveness
- [ ] Share URL with client
- [ ] Collect feedback

---

## 🎯 Next Steps After Client Feedback

Based on client feedback, prioritize:

1. **Critical Issues** - Fix immediately
2. **Checkout Flow** - Complete payment integration
3. **Order Management** - Track orders
4. **Admin Dashboard** - Manage products and orders
5. **Nice-to-have Features** - Based on feedback

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Deployment Issues:** https://vercel.com/docs/deployments/troubleshooting
- **Database Issues:** Check your provider's documentation
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## 🔗 Quick Links

After deployment, you'll have:
- **Production URL:** https://your-app.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Analytics:** https://vercel.com/dashboard/analytics
- **Deployment Logs:** https://vercel.com/dashboard/deployments

---

**Last Updated:** December 2024
**Version:** 1.0.0 (Initial Production Deployment)
