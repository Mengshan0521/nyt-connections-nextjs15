'use client';

import { useState, useEffect } from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import AdSense from './AdSense';
import CookieConsent from './CookieConsent';
import { hasConsented } from '@/utils/cookieConsent';

interface ServiceProviderProps {
  gaId?: string;
  adsenseId?: string;
}

/**
 * 服务提供者组件
 * 管理所有第三方服务的加载
 */
export default function ServiceProvider({
  gaId,
  adsenseId
}: ServiceProviderProps) {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [advertisingConsent, setAdvertisingConsent] = useState(false);
  
  // 处理同意状态变化
  const handleConsentChange = () => {
    setAnalyticsConsent(hasConsented('analytics'));
    setAdvertisingConsent(hasConsented('advertising'));
  };
  
  useEffect(() => {
    // 初始化时检查同意状态
    handleConsentChange();
    
    // 监听同意状态变化
    window.addEventListener('consentStatusChanged', handleConsentChange);
    
    // 清理
    return () => {
      window.removeEventListener('consentStatusChanged', handleConsentChange);
    };
  }, []);
  
  return (
    <>
      {/* Cookie同意对话框 */}
      <CookieConsent />
      
      {/* Google Analytics */}
      <GoogleAnalytics
        gaId={gaId}
        consentGiven={analyticsConsent}
      />
      
      {/* Google AdSense */}
      <AdSense
        publisherId={adsenseId}
        consentGiven={advertisingConsent}
      />
    </>
  );
} 