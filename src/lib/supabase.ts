import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Campaign = {
  id: number;
  name: string;
  title: string;
  discount_text: string;
  subtitle: string;
  cta_text: string;
  promo_code: string;
  banner_url: string;
  logo_url: string;
  active: boolean;
  created_at: string;
};

export type Submission = {
  id: string;
  campaign_id: number | null;
  full_name: string;
  phone_number: string;
  promo_code: string;
  created_at: string;
};

export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function checkAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return true; // no secret configured -> open (matches existing behavior)
  const url = new URL(req.url);
  const provided =
    req.headers.get("x-admin-secret") || url.searchParams.get("secret");
  return provided === expected;
}
