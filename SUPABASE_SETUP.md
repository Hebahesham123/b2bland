# Supabase Setup Guide

This guide will help you set up the Supabase database table for the landing page form and admin dashboard.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: Your project name (e.g., "naguib-selim-b2b")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"** (takes 1-2 minutes)

## Step 2: Create the Database Table

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **"Run"** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

The table `submissions` is now created with:
- `id` - Unique identifier (UUID)
- `full_name` - Customer's full name
- `phone_number` - Customer's phone number
- `promo_code` - Promo code (NS4020)
- `created_at` - Timestamp when submitted

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. Copy these two values:

   **Project URL**
   - Found under "Project URL"
   - Example: `https://xxxxxxxxxxxxx.supabase.co`

   **anon public key**
   - Found under "Project API keys" → "anon public"
   - Click the eye icon to reveal it
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Configure Environment Variables

### For Local Development:

1. Open `.env.local` file in the project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. Restart your dev server (`npm run dev`)

### For Production (Vercel):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
4. Click **"Save"**
5. Redeploy your application

## Step 5: Test the Setup

1. **Test Form Submission:**
   - Go to `http://localhost:3000` (or your deployed URL)
   - Fill out the form with test data
   - Submit the form
   - You should see a success message with promo code "NS4020"

2. **Test Admin Dashboard:**
   - Go to `http://localhost:3000/admin` (or your deployed URL + `/admin`)
   - You should see the submission you just made
   - The table shows: Full name, Phone number, Promo code, and Date

3. **Verify in Supabase:**
   - Go to Supabase dashboard → **Table Editor** → `submissions`
   - You should see your test submission

## Security Notes

⚠️ **Important:** The current setup allows anyone to view submissions in the admin dashboard. For production, consider:

1. **Option 1: Add Authentication**
   - Use NextAuth.js or Supabase Auth
   - Protect the `/admin` route

2. **Option 2: Use Environment Secret**
   - Set `ADMIN_SECRET` in `.env.local`
   - The `/api/submissions` endpoint will require this secret

3. **Option 3: Restrict RLS Policy**
   - Modify the RLS policy in Supabase to only allow reads with service role key
   - Use service role key only in server-side API routes

## Troubleshooting

**Error: "الخدمة غير مهيأة" (Service not configured)**
- Make sure `.env.local` exists and has correct values
- Restart the dev server after changing `.env.local`

**Error: "Failed to save"**
- Check Supabase dashboard → Table Editor → verify table exists
- Check RLS policies are set correctly
- Verify API keys are correct

**Admin page shows "No submissions"**
- Check that form submissions are working
- Verify RLS policy allows SELECT operations
- Check browser console for errors

## Need Help?

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)

