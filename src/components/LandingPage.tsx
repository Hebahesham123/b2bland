"use client";

import { useState } from "react";
import Image from "next/image";
import type { Campaign } from "@/lib/supabase";

type Props = {
  campaign?: Pick<
    Campaign,
    | "id"
    | "title"
    | "discount_text"
    | "subtitle"
    | "cta_text"
    | "banner_url"
    | "logo_url"
  > | null;
};

const DEFAULTS = {
  id: null as number | null,
  title: "شركة نجيب سليم | خبرة، جودة، واستمرارية",
  discount_text: "خصم 10% علي جميع الأقمشة",
  subtitle: "في فروع الاسكندرية",
  cta_text: "سجّل الآن لتحصل على قسيمتك!",
  banner_url: "/banner.png",
  logo_url: "/logo.png",
};

export default function LandingPage({ campaign }: Props) {
  const c = { ...DEFAULTS, ...(campaign || {}) };
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^01\d{9}$/.test(phoneNumber.trim())) {
      setError("رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim(),
          campaign_id: c.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ. يرجى المحاولة مرة أخرى.");
        return;
      }
      setPromoCode(data.promo_code);
      setSubmitted(true);
    } catch {
      setError("خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  const connectFooter = (
    <footer className="relative z-10 mt-auto bg-[#522F1F] text-white py-2.5 px-4 sm:py-3">
      <div className="max-w-4xl mx-auto flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-4">
        <span className="text-sm font-medium whitespace-nowrap">تواصل معنا:</span>
        <a href="https://share.google/MZAcTIWBVCvQAo43Y" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/10 transition active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label="Facebook">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
        </a>
        <a href="https://share.google/ccTaQQsOlUXl7O6Kg" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/10 transition active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label="Instagram">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
        </a>
        <a href="tel:19976" className="p-1.5 rounded-full hover:bg-white/10 transition active:scale-95 flex items-center gap-1.5 min-h-[40px]" aria-label="اتصل">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          <span className="text-sm font-medium">19976</span>
        </a>
        <a href="https://wa.me/201225020005" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/10 transition active:scale-95 min-w-[40px] min-h-[40px] flex items-center justify-center" aria-label="WhatsApp">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        </a>
      </div>
    </footer>
  );

  const logoBackground = (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden>
      <Image src={c.logo_url} alt="" width={800} height={400} className="object-contain w-[min(120vw,75rem)] max-w-none h-auto animate-logo-bg opacity-[0.06]" />
    </div>
  );

  if (submitted) {
    return (
      <main dir="rtl" lang="ar" className="min-h-screen flex flex-col bg-white pt-0">
        {logoBackground}
        <section className="relative z-10 w-full bg-stone-100">
          <div className="relative w-full min-h-[180px] sm:min-h-[240px] flex items-center justify-center">
            <Image src={c.banner_url} alt={c.discount_text} width={1200} height={600} className="w-full h-auto object-contain object-center" sizes="100vw" />
          </div>
        </section>
        <header className="relative z-10 py-0.5">
          <div className="relative w-52 h-28 sm:w-64 sm:h-36 flex justify-center mx-auto">
            <Image src={c.logo_url} alt="" width={256} height={144} className="object-contain block" />
          </div>
        </header>
        <div className="relative z-10 text-center px-3 mb-2">
          <p className="text-stone-600 text-sm">{c.title}</p>
        </div>
        <div className="relative z-10 flex-1 flex items-start justify-center px-3 pb-4">
          <div className="w-full max-w-md rounded-lg border-2 border-[#522F1F]/60 bg-stone-50/95 shadow-xl p-5 sm:p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 sm:mb-6">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-800 mb-2">شكراً لكم</h1>
            <p className="text-stone-600 text-sm sm:text-base mb-4 sm:mb-6">تم استلام بياناتكم بنجاح.</p>
            <div className="rounded-lg border-2 border-[#522F1F]/50 bg-amber-50/80 p-4 mb-4">
              <p className="text-sm text-stone-600 mb-2">كود الخصم:</p>
              <p className="text-lg sm:text-xl font-mono font-bold text-[#522F1F]">{promoCode}</p>
            </div>
            <p className="text-sm text-stone-500">احتفظوا بالكود لاستخدامه عند الدفع.</p>
          </div>
        </div>
        {connectFooter}
      </main>
    );
  }

  return (
    <main dir="rtl" lang="ar" className="min-h-screen flex flex-col bg-white pt-0">
      {logoBackground}
      <section className="relative z-10 w-full bg-stone-100 mt-0">
        <div className="relative w-full min-h-[220px] sm:min-h-[280px] flex items-center justify-center">
          <Image src={c.banner_url} alt={c.discount_text} width={1200} height={600} className="w-full h-auto object-contain object-center" sizes="100vw" priority />
        </div>
      </section>
      <header className="relative z-10 py-0.5">
        <div className="relative w-56 h-32 sm:w-72 sm:h-40 flex justify-center mx-auto">
          <Image src={c.logo_url} alt="" width={288} height={160} className="object-contain block" />
        </div>
      </header>
      <div className="relative z-10 flex-1 flex flex-col items-center px-3 py-3 sm:py-5">
        <div className="w-full max-w-md text-center">
          {c.title && (
            <p className="text-stone-600 text-sm sm:text-base mb-3 sm:mb-4">{c.title}</p>
          )}
          {(c.discount_text || c.subtitle || c.cta_text) && (
            <div className="border-2 border-[#522F1F]/50 rounded-none bg-amber-50/90 p-5 sm:p-6 mb-4 text-right">
              {c.discount_text && (
                <p className="text-stone-800 text-base sm:text-lg whitespace-pre-line">{c.discount_text}</p>
              )}
              {c.subtitle && (
                <p className="text-stone-800 text-base sm:text-lg mt-2 whitespace-pre-line">{c.subtitle}</p>
              )}
              {c.cta_text && (
                <p className="text-stone-800 text-base sm:text-lg mt-2 font-semibold whitespace-pre-line">{c.cta_text}</p>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="border-2 border-[#522F1F]/60 rounded-none shadow-lg p-4 sm:p-5 space-y-4 text-right bg-gradient-to-br from-stone-100 via-amber-50/70 to-stone-100">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-stone-700 mb-1">الاسم الكامل</label>
              <input id="full_name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} dir="rtl" className="w-full px-4 py-3.5 sm:py-3 rounded-none border-2 border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#522F1F]/40 focus:border-[#522F1F] outline-none transition text-base text-right" placeholder="الاسم الكامل" />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-stone-700 mb-1">رقم الهاتف</label>
              <input id="phone_number" type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11))} inputMode="numeric" pattern="01\d{9}" maxLength={11} minLength={11} dir="ltr" title="رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم" className="w-full px-4 py-3.5 sm:py-3 rounded-none border-2 border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#522F1F]/40 focus:border-[#522F1F] outline-none transition text-base text-right" placeholder="01XXXXXXXXX" />
            </div>
            {error && (
              <p className="text-sm text-red-700 bg-red-50 py-2 px-3 rounded border border-red-200">{error}</p>
            )}
            <button type="submit" disabled={loading} className="w-full py-4 sm:py-3.5 px-4 rounded-none bg-[#522F1F] hover:bg-[#613a27] text-white font-semibold focus:ring-2 focus:ring-[#522F1F]/50 focus:ring-offset-2 disabled:opacity-60 transition text-base min-h-[48px] active:scale-[0.98]">
              {loading ? "جاري الإرسال…" : "ارسال"}
            </button>
          </form>
        </div>
      </div>
      {connectFooter}
    </main>
  );
}
