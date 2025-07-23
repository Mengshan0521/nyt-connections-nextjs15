import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ServiceProvider from "@/components/ServiceProvider";
import { siteConfig, generateMetadata as genMeta } from '@/config/seo';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 为应用生成静态元数据
export const metadata: Metadata = genMeta();

// 视口配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure the locale is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  // 获取环境变量中的 ID
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Analytics Meta */}
        {gaId && (
          <meta name="google-analytics-id" content={gaId} />
        )}
        
        {/* Google AdSense Meta */}
        {adsenseId && (
          <meta name="google-adsense-account" content={adsenseId} />
        )}
        
        {/* SEO 元数据 - 已通过 Next.js 元数据 API 设置 */}
        <link rel="canonical" href={`${siteConfig.url}/${locale}`} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
        <ServiceProvider gaId={gaId} adsenseId={adsenseId} />
      </body>
    </html>
  );
}