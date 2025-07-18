'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ResponsiveAdUnitProps {
  publisherId?: string;
  slotId: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  consentGiven?: boolean;
}

/**
 * 响应式广告单元组件
 * 会根据路由变化自动刷新广告内容
 */
export default function ResponsiveAdUnit({
  publisherId,
  slotId,
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
  consentGiven = true
}: ResponsiveAdUnitProps) {
  // 广告容器引用
  const adRef = useRef<HTMLDivElement>(null);
  // 使用pathname来检测路由变化
  const pathname = usePathname();
  // 使用环境变量作为默认值，优先使用props传入的值
  const adsenseId = publisherId || process.env.NEXT_PUBLIC_ADSENSE_ID;
  
  // 初始化和刷新广告的函数
  const initAd = () => {
    try {
      // 确保AdSense脚本已加载
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // 清除旧的广告内容
        if (adRef.current) {
          adRef.current.innerHTML = '';
          
          // 创建新的广告元素
          const adElement = document.createElement('ins');
          adElement.className = 'adsbygoogle';
          adElement.style.display = 'block';
          adElement.setAttribute('data-ad-client', adsenseId || '');
          adElement.setAttribute('data-ad-slot', slotId);
          adElement.setAttribute('data-ad-format', format);
          if (responsive) {
            adElement.setAttribute('data-full-width-responsive', 'true');
          }
          
          // 添加到容器
          adRef.current.appendChild(adElement);
          
          // 请求新广告
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`[AdSense] Ad refreshed for slot: ${slotId}`);
        }
      }
    } catch (error) {
      console.error('[AdSense] Error loading ad:', error);
    }
  };

  useEffect(() => {
    // 如果用户未同意或没有ID或slotId，则不加载广告
    if (!consentGiven || !adsenseId || !slotId) return;
    
    // 路由变化时重新加载广告
    initAd();
    
    // 组件卸载时清理
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [pathname, slotId, adsenseId, format, responsive, consentGiven]);

  // 如果用户未同意或没有ID或slotId，则不显示广告
  if (!consentGiven || !adsenseId || !slotId) return null;

  return (
    <div 
      ref={adRef} 
      className={`adsense-container ${className}`}
      style={{ display: 'block', overflow: 'hidden', ...style }}
    >
      {/* 广告单元将通过JavaScript动态插入到这里 */}
    </div>
  );
} 