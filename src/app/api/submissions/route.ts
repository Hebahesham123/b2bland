import { NextResponse } from "next/server";
import { checkAdmin, getServerSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const url = new URL(request.url);
  const campaignId = url.searchParams.get("campaign_id");

  let query = supabase
    .from("submissions")
    .select("id, campaign_id, full_name, phone_number, promo_code, created_at")
    .order("created_at", { ascending: false });

  if (campaignId) query = query.eq("campaign_id", campaignId);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 });
  }

  return NextResponse.json(data);
}
