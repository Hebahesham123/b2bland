"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Campaign } from "@/lib/supabase";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountText, setDiscountText] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [bannerUrl, setBannerUrl] = useState("/banner.png");
  const [logoUrl, setLogoUrl] = useState("/logo.png");

  useEffect(() => {
    setSecret(localStorage.getItem("admin_secret") || "");
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/campaigns", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      setCampaigns(await res.json());
    } catch (e) {
      setError("فشل التحميل. تأكد من إعداد Supabase.");
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          name: name.trim(),
          promo_code: promoCode.trim(),
          title: title.trim(),
          discount_text: discountText,
          subtitle: subtitle,
          cta_text: ctaText,
          banner_url: bannerUrl.trim(),
          logo_url: logoUrl.trim(),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "فشل الإنشاء");
        return;
      }
      const created: Campaign = await res.json();
      setName("");
      setPromoCode("");
      setShowCreate(false);
      setCampaigns((cs) => [created, ...cs]);
    } finally {
      setCreating(false);
    }
  }

  async function deleteCampaign(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذه الحملة؟ سيتم حذف كل بياناتها.")) return;
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret },
    });
    if (!res.ok) {
      alert("فشل الحذف");
      return;
    }
    setCampaigns((cs) => cs.filter((c) => c.id !== id));
  }

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-6 px-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 mb-1">لوحة التحكم</h1>
            <p className="text-stone-600 text-sm">إدارة الحملات وأكواد الخصم</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition"
            >
              + حملة جديدة
            </button>
            <Link href="/" className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg text-sm font-medium transition">
              الصفحة الرئيسية
            </Link>
          </div>
        </div>

        {showCreate && (
          <form
            onSubmit={createCampaign}
            className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 mb-6 space-y-3"
          >
            <h2 className="text-lg font-semibold text-stone-800">إنشاء حملة جديدة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">اسم الحملة (داخلي)</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  placeholder="مثلاً: حملة رمضان"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">كود الخصم</label>
                <input
                  required
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono"
                  placeholder="NS10"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">العنوان الرئيسي</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">يظهر فوق صندوق الخصم. اتركه فارغاً ليُخفى.</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">نص الخصم (السطر الأول داخل الصندوق)</label>
                <textarea
                  rows={4}
                  value={discountText}
                  onChange={(e) => setDiscountText(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">يدعم عدة أسطر. اكتب كل ما تريده هنا — لا تكرّر نفس النص في الحقول التالية.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">النص الفرعي (سطر منفصل)</label>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">سطر إضافي تحت نص الخصم. اتركه فارغاً ليُخفى.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">نص الدعوة للتسجيل (سطر بالخط العريض)</label>
                <input
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
                <p className="text-xs text-stone-500 mt-1">آخر سطر بالخط العريض. اتركه فارغاً ليُخفى.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">رابط البانر</label>
                <input
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">رابط الشعار</label>
                <input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700 mb-2">معاينة كيف ستظهر البيانات:</p>
              <div className="border-2 border-[#522F1F]/50 rounded-none bg-amber-50/90 p-5 sm:p-6 text-right" dir="rtl">
                {title && (
                  <p className="text-stone-600 text-sm mb-3">{title}</p>
                )}
                {discountText && (
                  <p className="text-stone-800 text-base sm:text-lg whitespace-pre-line">{discountText}</p>
                )}
                {subtitle && (
                  <p className="text-stone-800 text-base sm:text-lg mt-2 whitespace-pre-line">{subtitle}</p>
                )}
                {ctaText && (
                  <p className="text-stone-800 text-base sm:text-lg mt-2 font-semibold whitespace-pre-line">{ctaText}</p>
                )}
                {promoCode && (
                  <p className="mt-3 text-sm text-stone-600">
                    كود الخصم:{" "}
                    <span className="font-mono font-bold text-[#522F1F]">{promoCode}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-sm font-medium transition disabled:opacity-60"
            >
              {creating ? "جاري الإنشاء…" : "إنشاء"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="mt-4 text-stone-600">جاري التحميل...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">{error}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center text-stone-500">لا توجد حملات. ابدأ بإنشاء واحدة.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">#</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">الاسم</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">كود الخصم</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">الرابط</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">الحالة</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-stone-100 hover:bg-stone-50 transition">
                      <td className="py-3 px-4 text-stone-700 text-sm font-mono">{c.id}</td>
                      <td className="py-3 px-4 text-stone-800 font-medium">{c.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-mono font-semibold rounded-lg text-sm">
                          {c.promo_code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Link href={`/${c.id}`} target="_blank" className="text-blue-600 hover:underline font-mono">
                          /{c.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {c.active ? (
                          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">نشطة</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 bg-stone-200 text-stone-700 rounded text-xs">معطلة</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/${c.id}`}
                            className="px-3 py-1 bg-stone-700 hover:bg-stone-800 text-white rounded text-xs font-medium transition"
                          >
                            تعديل / بيانات
                          </Link>
                          <button
                            onClick={() => deleteCampaign(c.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
