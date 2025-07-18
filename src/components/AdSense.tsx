'use client';

import Script from 'next/script';

interface AdSenseProps {
  publisherId?: string;
  consentGiven?: boolean;
  onLoad?: () => void;
}

/**
 * Google AdSense脚本加载组件
 * 添加到页面中会加载Google AdSense脚本
 */
export default function AdSense({
  publisherId,
  consentGiven = true,
  onLoad
}: AdSenseProps) {
  // 使用环境变量作为默认值，优先使用props传入的值
  const adsenseId = publisherId || process.env.NEXT_PUBLIC_ADSENSE_ID;
  
  // 如果用户未同意或没有ID，则不加载广告脚本
  if (!consentGiven || !adsenseId) return null;

  return (
    <>
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
        crossOrigin="anonymous"
        onLoad={onLoad}
      />
      {/* 添加AdSense meta标签 */}
      <meta name="google-adsense-account" content={adsenseId} />
    </>
  );
} 