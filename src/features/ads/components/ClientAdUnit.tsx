'use client';

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ClientAdUnitProps {
  slotId: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle' | string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 客户端广告单元组件
 * 处理 AdSense 脚本的注入和广告的渲染
 */
export default function ClientAdUnit({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
  style = {}
}: ClientAdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // 加载广告
  useEffect(() => {
    if (!slotId || !adRef.current) return;
    
    const loadAd = () => {
      try {
        // 确保 DOM 元素存在
        if (!adRef.current) return;
        
        // 清除之前的广告内容
        adRef.current.innerHTML = '';
        
        // 获取 AdSense ID
        const adsenseId = document.querySelector('meta[name="google-adsense-account"]')?.getAttribute('content');
        if (!adsenseId) {
          console.warn('[AdSense] AdSense ID not found');
          return;
        }
        
        // 创建新的广告元素
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.setAttribute('data-ad-client', adsenseId);
        adElement.setAttribute('data-ad-slot', slotId);
        adElement.setAttribute('data-ad-format', format);
        
        if (responsive) {
          adElement.setAttribute('data-full-width-responsive', 'true');
        }
        
        // 添加到容器
        adRef.current.appendChild(adElement);
        
        // 请求广告
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`[AdSense] Ad loaded for slot: ${slotId}`);
        }
      } catch (error) {
        console.error('[AdSense] Error loading ad:', error);
      }
    };
    
    // 延迟加载广告，确保 AdSense 脚本已加载
    const timer = setTimeout(loadAd, 200);
    
    return () => {
      clearTimeout(timer);
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [slotId, format, responsive, pathname]);
  
  return (
    <div
      ref={adRef}
      className={`adsense-ad ${className}`}
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