# Deployment Setup Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `simple-2` (or your preferred name)
4. Description: "Static HTML/CSS/JS website with custom responsive CSS framework"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use one of these:

### Option A: HTTPS (Recommended for first-time setup)
```bash
git remote add origin https://github.com/YOUR_USERNAME/simple-2.git
git branch -M main
git push -u origin main
```

### Option B: SSH (If you have SSH keys set up)
```bash
git remote add origin git@github.com:YOUR_USERNAME/simple-2.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Step 3: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in (use "Continue with GitHub")
2. Click "Add New..." → "Project"
3. Import your `simple-2` repository
4. Vercel will auto-detect settings:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (leave empty - static site)
   - **Output Directory:** `./`
5. Click "Deploy"
6. Your site will be live in ~30 seconds!

## Step 4: Access Analytics & Monitoring

After deployment:
1. Go to your project dashboard on Vercel
2. Click on "Analytics" tab (may require upgrade for advanced features)
3. View:
   - Page views and visitors
   - Top pages
   - Web Vitals (Core Web Vitals)
   - Real-time logs
   - Performance metrics

## Step 5: Custom Domain (Optional)

1. In Vercel project settings → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Automatic Deployments

- **Every push to `main` branch** → Production deployment
- **Pull Requests** → Preview deployments (unique URLs)
- **Other branches** → Preview deployments

## Environment Variables (if needed later)

1. Project Settings → "Environment Variables"
2. Add variables for different environments
3. Redeploy to apply changes

---

**Current Status:**
✅ Code committed locally
✅ Vercel configuration ready
⏳ Waiting for GitHub repository creation
⏳ Ready to push to GitHub
⏳ Ready to connect Vercel

