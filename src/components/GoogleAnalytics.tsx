'use client';

import { GoogleAnalytics as GA } from '@next/third-parties/google';

interface GoogleAnalyticsProps {
  gaId?: string;
  consentGiven?: boolean;
}

export default function GoogleAnalytics({ gaId, consentGiven = true }: GoogleAnalyticsProps) {
  // 使用环境变量作为默认值，优先使用props传入的值
  const analyticsId = gaId || process.env.NEXT_PUBLIC_GA_ID;
  
  // 如果用户未同意或没有ID，则不加载分析脚本
  if (!consentGiven || !analyticsId) return null;

  return <GA gaId={analyticsId} />;
} 