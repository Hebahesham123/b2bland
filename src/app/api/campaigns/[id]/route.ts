import { NextResponse } from "next/server";
import { checkAdmin, getServerSupabase } from "@/lib/supabase";

type Ctx = { params: { id: string } };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = ctx.params;
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PUT(request: Request, ctx: Ctx) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = ctx.params;
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
  const body = await request.json().catch(() => ({}));
  const allowed = [
    "name",
    "title",
    "discount_text",
    "subtitle",
    "cta_text",
    "promo_code",
    "banner_url",
    "logo_url",
    "active",
  ];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];
  const { data, error } = await supabase
    .from("campaigns")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    console.error("campaign update error", error);
    return NextResponse.json(
      { error: `Failed to update: ${error.message}` },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

export async function DELETE(request: Request, ctx: Ctx) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = ctx.params;
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
