import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = (body.full_name || "").trim();
    const phoneNumber = (body.phone_number || "").trim();
    const campaignId = body.campaign_id ? Number(body.campaign_id) : null;
    if (!fullName || !phoneNumber) {
      return NextResponse.json(
        { error: "Full name and phone number are required" },
        { status: 400 }
      );
    }
    if (!/^\d{11}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "رقم الهاتف يجب أن يتكون من 11 رقم." },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "الخدمة غير مهيأة. يرجى إضافة بيانات Supabase في .env.local" },
        { status: 503 }
      );
    }

    let promoCode = "NS10";
    if (campaignId) {
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("promo_code, active")
        .eq("id", campaignId)
        .maybeSingle();
      if (!campaign || campaign.active === false) {
        return NextResponse.json(
          { error: "الحملة غير متاحة" },
          { status: 404 }
        );
      }
      promoCode = campaign.promo_code;
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        full_name: fullName,
        phone_number: phoneNumber,
        promo_code: promoCode,
        campaign_id: campaignId,
      })
      .select("id, promo_code")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      promo_code: data.promo_code,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
