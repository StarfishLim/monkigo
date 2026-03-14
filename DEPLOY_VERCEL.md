# Deploy monkiGO to Vercel – Step by Step

Follow these steps to get your Next.js app live on Vercel.

---

## Step 1: Push your code to GitHub

1. **Create a GitHub account** (if you don’t have one): [github.com](https://github.com)
2. **Create a new repository** on GitHub:
   - Click **New repository**
   - Name it (e.g. `monkiGO`)
   - Leave it empty (no README, no .gitignore)
   - Click **Create repository**
3. **In your project folder**, open Terminal and run:

   ```bash
   cd /Users/starfish/Desktop/Playground/monkiGO
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

---

## Step 2: Sign up / log in to Vercel

1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up** or **Log In**
3. Choose **Continue with GitHub** and authorize Vercel to access your GitHub account

---

## Step 3: Import your project

1. On the Vercel dashboard, click **Add New…** → **Project**
2. You’ll see a list of your GitHub repos. Find **monkiGO** (or whatever you named it) and click **Import**
3. On the import screen:
   - **Framework Preset**: should be **Next.js** (auto-detected)
   - **Root Directory**: leave as **./**
   - **Build Command**: leave default (`npm run build` or `next build`)
   - **Output Directory**: leave default
   - **Install Command**: leave default (`npm install`)

---

## Step 4: Add environment variables

Before deploying, add the variables your app needs.

1. On the same import screen, expand **Environment Variables**
2. Add these (use the same values as in your local `.env.local`):

   | Name | Value | Notes |
   |------|--------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Same place as above |
   | `NEXT_PUBLIC_FORMSPREE_FEEDBACK_ID` | Your Formspree form ID | Optional; only if you use the feedback form |

3. For each variable:
   - Enter **Name** and **Value**
   - Leave environment as **Production** (or add for Preview too if you want)
   - Click **Add** or the checkmark

---

## Step 5: Deploy

1. Click **Deploy**
2. Wait 1–2 minutes. Vercel will:
   - Clone your repo
   - Run `npm install`
   - Run `npm run build`
   - Deploy the app
3. When it finishes, you’ll see **Congratulations!** and a link like `https://monkigo-xxxx.vercel.app`

---

## Step 6: Open your live site

1. Click **Visit** (or the project URL) to open your app
2. Test the main flows (e.g. Supabase data, feedback form if you use it)
3. If something fails, check that all env vars are set correctly (Step 4)

---

## Optional: Use your own domain

1. In Vercel, open your project → **Settings** → **Domains**
2. Add your domain (e.g. `monkigo.com` or `app.yoursite.com`)
3. Follow Vercel’s instructions to add the DNS records at your domain registrar (or in Plesk DNS)
4. Vercel will issue SSL automatically

---

## Updating the site after changes

1. Edit your code locally
2. Commit and push to the same branch (e.g. `main`):

   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

3. Vercel will automatically build and deploy a new version. The deployment appears under **Deployments** in the Vercel dashboard.

---

## Troubleshooting

- **Build fails**: Check the build log on Vercel. Often it’s a missing env var or a TypeScript/lint error. Fix locally, then push again.
- **Supabase not working**: Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel and match your Supabase project. In Supabase, under Authentication → URL Configuration, add your Vercel URL to **Redirect URLs** if you use auth.
- **404 on refresh**: Next.js and Vercel handle this by default; if you see it, you may have custom routing that needs adjustment.

That’s it. Once the first deploy works, future updates are just `git push`.
