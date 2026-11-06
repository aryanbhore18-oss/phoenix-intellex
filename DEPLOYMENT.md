# Phoenix Intellex — Deployment Guide

## Deploying to Vercel (Production)

### Method 1: Push to GitHub & Connect to Vercel (Recommended)

1. **Initialize Git repository:**
   ```powershell
   cd "D:\New Folder\phoenix-intellex"
   git init
   git add .
   git commit -m "Initial Phoenix Intellex commit"
   ```

2. **Push to your GitHub account:**
   - Create a new repository on [GitHub](https://github.com/new) called `phoenix-intellex`.
   - Run the commands shown by GitHub, for example:
     ```powershell
     git remote add origin https://github.com/YOUR_USERNAME/phoenix-intellex.git
     git branch -M main
     git push -u origin main
     ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **"Add New..."** -> **"Project"**.
   - Select your `phoenix-intellex` repository.
   - Framework Preset will automatically detect: **Next.js**.
   - Under **Environment Variables**, add (from your Supabase project):
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-anon-key-here`
   - Click **Deploy**.

---

### Method 2: Deploy directly via Vercel CLI

1. Install the Vercel CLI globally:
   ```powershell
   npm install -g vercel
   ```

2. In your terminal, run:
   ```powershell
   cd "D:\New Folder\phoenix-intellex"
   vercel
   ```
3. Follow the on-screen prompts to log in and select your Vercel team/account.

---

## Zero-Data Production Mode
- All mock data has been removed.
- Newly entered clients, projects, reviews, invoices, and tasks are automatically saved and persisted in your browser's persistent storage (`localStorage`) and ready to connect to your live Supabase cloud database via Phase 2 migrations.
