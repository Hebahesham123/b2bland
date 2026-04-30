import { NextResponse } from "next/server";
import { checkAdmin, getServerSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("id", { ascending: false });
  if (error) {
    console.error("campaigns list error", error);
    return NextResponse.json({ error: "Failed to load campaigns" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
  const body = await request.json().catch(() => ({}));
  const name = (body.name || "").trim();
  const promo_code = (body.promo_code || "").trim();
  if (!name || !promo_code) {
    return NextResponse.json(
      { error: "name and promo_code are required" },
      { status: 400 }
    );
  }
  const insertRow = {
    name,
    promo_code,
    title: body.title || undefined,
    discount_text: body.discount_text || undefined,
    subtitle: body.subtitle || undefined,
    cta_text: body.cta_text || undefined,
    banner_url: body.banner_url || undefined,
    logo_url: body.logo_url || undefined,
    active: body.active ?? true,
  };
  const { data, error } = await supabase
    .from("campaigns")
    .insert(insertRow)
    .select("*")
    .single();
  if (error) {
    console.error("campaign create error", error);
    return NextResponse.json(
      { error: `Failed to create campaign: ${error.message}` },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}
