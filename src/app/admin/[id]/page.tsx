"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Campaign, Submission } from "@/lib/supabase";

const FIELDS: { key: keyof Campaign; label: string; type?: string; textarea?: boolean }[] = [
  { key: "name", label: "اسم الحملة (داخلي)" },
  { key: "promo_code", label: "كود الخصم" },
  { key: "title", label: "العنوان الرئيسي" },
  { key: "discount_text", label: "نص الخصم", textarea: true },
  { key: "subtitle", label: "النص الفرعي", textarea: true },
  { key: "cta_text", label: "نص الدعوة للتسجيل", textarea: true },
  { key: "banner_url", label: "رابط صورة البانر" },
  { key: "logo_url", label: "رابط الشعار" },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function CampaignAdminPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSecret(localStorage.getItem("admin_secret") || "");
    load();
  }, [id]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const sec = localStorage.getItem("admin_secret") || "";
      const [cRes, sRes] = await Promise.all([
        fetch(`/api/campaigns/${id}`, { cache: "no-store" }),
        fetch(`/api/submissions?campaign_id=${id}`, {
          cache: "no-store",
          headers: { "x-admin-secret": sec },
        }),
      ]);
      if (!cRes.ok) throw new Error("Campaign not found");
      setCampaign(await cRes.json());
      if (sRes.ok) setSubmissions(await sRes.json());
      else setSubmissions([]);
    } catch {
      setError("فشل التحميل");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!campaign) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify(campaign),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "فشل الحفظ");
        return;
      }
      setCampaign(await res.json());
      alert("تم الحفظ");
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof Campaign>(k: K, v: Campaign[K]) {
    setCampaign((c) => (c ? { ...c, [k]: v } : c));
  }

  const filtered = submissions.filter(
    (s) =>
      !search ||
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone_number.includes(search)
  );

  function exportCSV() {
    const headers = ["الاسم الكامل", "رقم الهاتف", "كود الخصم", "التاريخ"];
    const rows = filtered.map((s) => [s.full_name, s.phone_number, s.promo_code, formatDate(s.created_at)]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `campaign-${id}-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || "غير موجود"}</p>
        <Link href="/admin" className="text-blue-600 hover:underline">العودة</Link>
      </div>
    );
  }

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-6 px-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1">
              تعديل الحملة #{campaign.id}
            </h1>
            <p className="text-stone-600 text-sm">
              الرابط:{" "}
              <Link href={`/${campaign.id}`} target="_blank" className="text-blue-600 hover:underline font-mono">
                /{campaign.id}
              </Link>
            </p>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg text-sm font-medium transition">
            ← كل الحملات
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">المحتوى</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.textarea ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-stone-700 mb-1">{f.label}</label>
                {f.textarea ? (
                  <textarea
                    rows={2}
                    value={(campaign[f.key] as string) || ""}
                    onChange={(e) => update(f.key, e.target.value as never)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                ) : (
                  <input
                    value={(campaign[f.key] as string) || ""}
                    onChange={(e) => update(f.key, e.target.value as never)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm"
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={campaign.active}
                  onChange={(e) => update("active", e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-stone-700">الحملة نشطة (تظهر للعملاء)</span>
              </label>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-60"
            >
              {saving ? "جاري الحفظ…" : "حفظ التغييرات"}
            </button>
            <Link
              href={`/${campaign.id}`}
              target="_blank"
              className="px-5 py-2 bg-stone-700 hover:bg-stone-800 text-white rounded-lg text-sm font-medium transition"
            >
              معاينة الصفحة
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-800">
              التسجيلات ({submissions.length})
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 sm:w-56 px-3 py-2 border border-stone-300 rounded-lg text-sm"
              />
              {filtered.length > 0 && (
                <button
                  onClick={exportCSV}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition whitespace-nowrap"
                >
                  تصدير CSV
                </button>
              )}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              {submissions.length === 0 ? "لا توجد تسجيلات بعد." : "لا نتائج."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">#</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">الاسم</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">الهاتف</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">الكود</th>
                    <th className="py-3 px-4 font-semibold text-stone-700 text-sm">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-3 px-4 text-stone-500 text-sm">{filtered.length - i}</td>
                      <td className="py-3 px-4 text-stone-800 font-medium">{s.full_name}</td>
                      <td className="py-3 px-4 text-stone-700">
                        <a href={`tel:${s.phone_number}`} className="hover:text-amber-600">
                          {s.phone_number}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 font-mono rounded text-xs">
                          {s.promo_code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-600 text-sm">{formatDate(s.created_at)}</td>
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
