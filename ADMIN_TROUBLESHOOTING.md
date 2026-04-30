# Admin Dashboard Troubleshooting Guide

إذا كانت صفحة `/admin` لا تعمل أو تظهر صفحة فارغة، اتبع هذه الخطوات:

## 1. التحقق من URL الصحيح

تأكد من استخدام URL الصحيح:
- ✅ الصحيح: `https://your-app.vercel.app/admin`
- ❌ الخطأ: `https://b2blanding/admin.vercel.app`

## 2. التحقق من Environment Variables في Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com)
2. اختر مشروعك
3. اذهب إلى **Settings** → **Environment Variables**
4. تأكد من وجود المتغيرات التالية:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. إذا لم تكن موجودة، أضفها:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key-here`
6. بعد إضافة المتغيرات، **أعد نشر المشروع (Redeploy)**

## 3. التحقق من Supabase Setup

1. تأكد من إنشاء جدول `submissions` في Supabase:
   - اذهب إلى Supabase Dashboard
   - SQL Editor
   - نفّذ محتوى `supabase-schema.sql`

2. تأكد من RLS Policies:
   - Table Editor → `submissions` → Policies
   - يجب أن يكون هناك policy للـ INSERT و SELECT

## 4. اختبار API Route مباشرة

افتح في المتصفح:
```
https://your-app.vercel.app/api/submissions
```

يجب أن ترى:
- ✅ JSON array (حتى لو فارغ `[]`)
- ❌ Error message (إذا كان هناك مشكلة)

## 5. فحص Console في المتصفح

1. افتح `/admin` في المتصفح
2. اضغط F12 لفتح Developer Tools
3. اذهب إلى Console tab
4. ابحث عن أي أخطاء (errors) باللون الأحمر
5. اذهب إلى Network tab
6. ابحث عن طلب `/api/submissions`
7. تحقق من Status Code:
   - ✅ 200 = نجح
   - ❌ 500 = خطأ في السيرفر
   - ❌ 401 = غير مصرح
   - ❌ 404 = المسار غير موجود

## 6. التحقق من Build Logs

1. في Vercel Dashboard
2. اذهب إلى **Deployments**
3. اختر آخر deployment
4. تحقق من Build Logs
5. ابحث عن أي أخطاء

## 7. إعادة البناء

إذا لم يعمل شيء:

1. في Vercel Dashboard
2. اذهب إلى **Deployments**
3. اضغط على **Redeploy** → **Redeploy**

## 8. التحقق من الصفحة محلياً

اختبر الصفحة محلياً أولاً:

```bash
# تأكد من وجود .env.local
cat .env.local

# يجب أن يحتوي على:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# شغّل السيرفر
npm run dev

# افتح
# http://localhost:3000/admin
```

## 9. المشاكل الشائعة والحلول

### المشكلة: صفحة بيضاء تماماً
**الحل:**
- تحقق من Console للأخطاء
- تأكد من Environment Variables في Vercel
- أعد نشر المشروع

### المشكلة: "خطأ في تحميل البيانات"
**الحل:**
- تحقق من Supabase credentials
- تأكد من إنشاء جدول `submissions`
- تحقق من RLS policies

### المشكلة: "Server configuration error"
**الحل:**
- Environment Variables غير موجودة في Vercel
- أضفها وأعد النشر

### المشكلة: "Unauthorized"
**الحل:**
- إذا كنت تستخدم `ADMIN_SECRET`، تأكد من إضافته في Vercel
- أو احذف `ADMIN_SECRET` من `.env.local` و Vercel

## 10. اختبار سريع

افتح هذه الروابط بالترتيب:

1. `https://your-app.vercel.app` - يجب أن تعمل الصفحة الرئيسية
2. `https://your-app.vercel.app/api/submissions` - يجب أن ترى JSON
3. `https://your-app.vercel.app/admin` - يجب أن ترى لوحة التحكم

## 11. الحصول على المساعدة

إذا استمرت المشكلة:

1. افتح Console في المتصفح (F12)
2. انسخ أي أخطاء
3. تحقق من Network tab للأخطاء
4. تحقق من Vercel Logs:
   - Vercel Dashboard → Project → Logs

## ملاحظات مهمة

- ⚠️ بعد تغيير Environment Variables في Vercel، يجب **إعادة النشر**
- ⚠️ تأكد من أن Supabase project نشط
- ⚠️ تأكد من أن جدول `submissions` موجود
- ⚠️ تأكد من RLS policies صحيحة

