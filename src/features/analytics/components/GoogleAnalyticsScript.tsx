'use client';

import Script from 'next/script';

interface GoogleAnalyticsScriptProps {
  gaId: string;
}

/**
 * Google Analytics 脚本组件
 * 客户端组件，注入 GA 脚本
 */
export default function GoogleAnalyticsScript({ gaId }: GoogleAnalyticsScriptProps) {
  return (
    <>
      {/* Google Analytics 初始化脚本 */}
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      
      {/* Google Analytics 配置脚本 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
} 