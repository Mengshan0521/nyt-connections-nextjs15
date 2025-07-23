'use client';

import { useEffect } from 'react';
import { useConsentContext } from '@/features/consent/components/ConsentProvider';

interface AnalyticsOptions {
  gaId?: string;
}

// GA 参数类型
type GTagParams = Record<string, unknown>;

/**
 * Google Analytics 钩子
 * 根据用户同意状态加载 Google Analytics
 */
export function useAnalytics({ gaId }: AnalyticsOptions = {}) {
  const { hasConsented } = useConsentContext();
  
  // 初始化 Google Analytics
  useEffect(() => {
    // 如果没有提供 GA ID 或没有同意，则不加载
    if (!gaId || !hasConsented('analytics')) return;
    
    // 确保只初始化一次
    if (window.dataLayer) return;
    
    // 加载 Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    
    // 初始化 gtag
    window.dataLayer = window.dataLayer || [];
    
    function gtag(command: string, ...args: unknown[]) {
      window.dataLayer?.push([command, ...args]);
    }
    window.gtag = gtag;
    
    gtag('js', new Date() as unknown as string);
    gtag('config', gaId);
    
    console.log('Google Analytics initialized with ID:', gaId);
    
    // 清理
    return () => {
      // 清理脚本（但GA通常是会保留的）
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [gaId, hasConsented]);
  
  // 发送事件
  const sendEvent = (eventName: string, params?: GTagParams) => {
    if (!window.dataLayer || !hasConsented('analytics')) return;
    
    window.gtag?.('event', eventName, params);
  };
  
  return { sendEvent };
} 