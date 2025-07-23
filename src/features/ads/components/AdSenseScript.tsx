'use client';

import Script from 'next/script';

interface AdSenseScriptProps {
  adsenseId: string;
}

/**
 * AdSense 脚本组件
 * 客户端组件，注入 AdSense 脚本
 */
export default function AdSenseScript({ adsenseId }: AdSenseScriptProps) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
} 