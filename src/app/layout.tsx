import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "نجيب سليم | Naguib Selim",
  description: "نجيب سليم - أقمشة والمزيد. نرحب بالتجار الكبار.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="antialiased min-h-screen bg-stone-900 text-stone-100 font-sans">
        {children}
      </body>
    </html>
  );
}
