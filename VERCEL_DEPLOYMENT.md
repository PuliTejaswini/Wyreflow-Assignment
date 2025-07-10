# 🚀 WyerFlow Contact Form - Vercel Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas** - Your database should be accessible from anywhere (IP: `0.0.0.0/0`)
4. **Gmail App Password** - For email functionality

## 🔧 Deployment Steps

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - WyerFlow Contact Form"
git branch -M main
git remote add origin https://github.com/yourusername/wyerflow-contact-form.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure as follows:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (keep default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=your-contact-email@gmail.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
DB_NAME=contactform
```

### Step 4: Deploy

Click **"Deploy"** - Vercel will automatically build and deploy your app!

## 🔗 Your App URLs

- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api/contact`

## 🛠️ Post-Deployment

### Update CORS in Your Backend

Make sure your `FRONTEND_URL` environment variable in Vercel is set to your Vercel domain:

```env
FRONTEND_URL=https://your-project.vercel.app
```

### Test Your Deployment

1. Visit your Vercel URL
2. Fill out the contact form
3. Check that emails are sent
4. Verify data is saved to MongoDB

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**

   - Ensure IP `0.0.0.0/0` is whitelisted in MongoDB Atlas
   - Check MONGODB_URI format

2. **Email Not Sending**

   - Verify Gmail App Password
   - Check EMAIL_USER and EMAIL_PASS

3. **CORS Errors**
   - Update FRONTEND_URL to your Vercel domain
   - Redeploy after environment variable changes

### Build Errors:

- Check Vercel Function Logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

## 📱 Features Deployed

✅ Responsive contact form
✅ MongoDB data storage  
✅ Email notifications
✅ Auto-reply emails
✅ Form validation
✅ Modern UI with navigation

## 🔄 Updates

To update your deployed app:

1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Check deployment status in Vercel dashboard
