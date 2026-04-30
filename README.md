# Naguib Selim – Landing & Admin Dashboard

Landing page for customers (form: full name + phone) and admin dashboard to view submissions. Uses **Supabase** and deploys on **Vercel**.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the script in `supabase-schema.sql` to create the `submissions` table.
3. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Local env

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Install and run

```bash
npm install
npm run dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### 4. Logo

To use your Naguib Selim logo, add your image as `public/logo.png`. The landing page currently shows a text “Naguib Selim”; you can replace that block with:

```tsx
<Image src="/logo.png" alt="Naguib Selim" width={160} height={80} className="object-contain" />
```

## Deploy on Vercel

1. Push the project to GitHub (or connect another Git provider).
2. In [Vercel](https://vercel.com), **Add New Project** and import this repo.
3. In **Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Your landing and admin URLs will be:

   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/admin`

## Optional: Protect admin

- The admin dashboard at `/admin` is currently open. To restrict it, you can add authentication (e.g. NextAuth) or put the app behind a login.
- The `/api/submissions` endpoint can be protected with a secret: set `ADMIN_SECRET` in env and send `x-admin-secret: <value>` when calling the API.
