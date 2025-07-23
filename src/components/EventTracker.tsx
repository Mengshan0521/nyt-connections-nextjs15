'use client';

import { useCallback } from 'react';

interface EventTrackerProps {
  eventName: string;
  label: string;
  className?: string;
  data?: Record<string, string | number | boolean | null>;
}

/**
 * 事件跟踪按钮组件
 * 点击时会调用Google Analytics跟踪事件
 */
export default function EventTracker({
  eventName,
  label,
  className = '',
  data = {}
}: EventTrackerProps) {
  const handleClick = useCallback(() => {
    // 确保gtag函数存在
    if (typeof window !== 'undefined' && window.gtag) {
      // 获取当前路径，可能包含语言代码
      const pathParts = window.location.pathname.split('/');
      let locale = '';
      
      // 如果路径包含可能的语言代码（通常是第一个非空段）
      if (pathParts.length > 1 && pathParts[1]) {
        const possibleLocale = pathParts[1];
        // 简单检查是否为语言代码（通常是2-5个字符）
        if (possibleLocale.length >= 2 && possibleLocale.length <= 5) {
          locale = possibleLocale;
        }
      }
      
      // 添加语言到事件参数
      const eventParams = {
        ...data,
        ...(locale && { locale })
      };
      
      // 发送事件
      console.log(`[Analytics] Tracking event: ${eventName}`, eventParams);
      window.gtag('event', eventName, eventParams);
    } else {
      console.warn('Google Analytics not available');
    }
  }, [eventName, data]);

  return (
    <button
      className={className}
      onClick={handleClick}
      aria-label={`Track event: ${label}`}
    >
      {label}
    </button>
  );
} 