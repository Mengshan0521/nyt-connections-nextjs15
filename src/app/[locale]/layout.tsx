// 导入必要的模块和组件
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ServiceProvider from "@/components/ServiceProvider";
import { ThemeProvider } from "next-themes";
import { siteConfig, generateMetadata as genMeta } from '@/config/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "../globals.css";

// 定义字体变量
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 为应用生成静态元数据（使用SSG特性）
export const metadata: Metadata = genMeta();

// 视口配置（移动设备优化）
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

// 语言环境布局组件（使用SSR特性）
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // 解析参数获取语言环境
  const {locale} = await params;
  
  // 验证语言环境是否有效
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  
  // 获取环境变量中的服务ID（在服务端获取）
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Analytics 元数据 */}
        {gaId && (
          <meta name="google-analytics-id" content={gaId} />
        )}

        {/* Google AdSense 元数据 */}
        {adsenseId && (
          <meta name="google-adsense-account" content={adsenseId} />
        )}

        {/* SEO 元数据 - 已通过 Next.js 元数据 API 设置 */}
        <link rel="canonical" href={`${siteConfig.url}/${locale}`} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 国际化提供者 - 最外层，所有文本都可能需要翻译 */}
        <NextIntlClientProvider locale={locale}>
          {/* 主题提供者 - 内层，主题名称也需要国际化支持 */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            {/* 布局容器 */}
            <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
              <Header />
              <main className="py-8">
                {children}
              </main>
              <Footer />
            </section>
            {/* 服务提供者（分析、广告等） */}
            <ServiceProvider gaId={gaId} adsenseId={adsenseId} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}