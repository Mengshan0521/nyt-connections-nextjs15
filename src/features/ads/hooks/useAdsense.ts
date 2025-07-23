'use client';

import { useEffect } from 'react';
import { useConsentContext } from '@/features/consent/components/ConsentProvider';

interface AdSenseOptions {
  adsenseId?: string;
}

/**
 * Google AdSense 钩子
 * 根据用户同意状态加载 Google AdSense
 */
export function useAdsense({ adsenseId }: AdSenseOptions = {}) {
  const { hasConsented } = useConsentContext();
  
  // 初始化 Google AdSense
  useEffect(() => {
    // 如果没有提供 AdSense ID 或没有同意，则不加载
    if (!adsenseId || !hasConsented('advertising')) return;
    
    // 检查是否已加载
    if (document.querySelector(`script[src*="${adsenseId}"]`)) return;
    
    // 加载 AdSense
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
    document.head.appendChild(script);
    
    console.log('Google AdSense initialized with ID:', adsenseId);
    
    // 清理
    return () => {
      // 清理脚本
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [adsenseId, hasConsented]);
  
  // 加载广告单元的函数
  const loadAd = () => {
    if (!hasConsented('advertising')) return false;
    
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // AdSense API
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        return true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
    
    return false;
  };
  
  return { loadAd };
} 