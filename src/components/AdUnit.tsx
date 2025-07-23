'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AdUnitProps {
  slotId: string;
  format?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AdUnit组件 - 用于在页面中显示Google AdSense广告
 * 
 * 使用示例:
 * <AdUnit slotId="1234567890" />
 * 
 * 注意: 该组件只会在用户同意后显示广告，并且会在路由变化时自动重新加载广告
 */
export default function AdUnit({
  slotId,
  format = 'auto',
  className = '',
  style = {}
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adConsent, setAdConsent] = useState(false);
  const pathname = usePathname();
  
  // 检查用户是否同意广告
  useEffect(() => {
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem('cookie_consent');
        if (consent) {
          const { advertising } = JSON.parse(consent);
          setAdConsent(!!advertising);
        }
      } catch (e) {
        console.error('Error checking ad consent:', e);
      }
    };
    
    // 初始检查
    checkConsent();
    
    // 监听存储变化
    const handleStorage = () => checkConsent();
    window.addEventListener('storage', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  
  // 加载广告
  useEffect(() => {
    if (!adConsent || !adRef.current) return;
    
    const loadAd = () => {
      try {
        // 确保adsbygoogle存在
        if (window.adsbygoogle) {
          // 清除之前的广告
          adRef.current!.innerHTML = '';
          
          // 获取AdSense ID
          const adsenseId = document.querySelector('meta[name="google-adsense-account"]')?.getAttribute('content');
          if (!adsenseId) {
            console.warn('AdSense ID not found');
            return;
          }
          
          // 创建新广告
          const adElement = document.createElement('ins');
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          adElement.setAttribute('data-ad-client', adsenseId);
          adElement.setAttribute('data-ad-slot', slotId);
          adElement.setAttribute('data-ad-format', format);
          adElement.setAttribute('data-full-width-responsive', 'true');
          
          // 添加到容器
          adRef.current!.appendChild(adElement);
          
          // 请求广告
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`[AdSense] Ad loaded for slot: ${slotId}`);
        }
      } catch (e) {
        console.error('[AdSense] Error loading ad:', e);
      }
    };
    
    // 延迟加载广告，确保AdSense脚本已加载
    const timer = setTimeout(loadAd, 100);
    
    return () => {
      clearTimeout(timer);
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [slotId, format, adConsent, pathname]);
  
  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{
        display: 'block',
        textAlign: 'center',
        overflow: 'hidden',
        ...style
      }}
      data-ad-slot={slotId}
    >
      {/* 广告将动态加载到这里 */}
    </div>
  );
} 