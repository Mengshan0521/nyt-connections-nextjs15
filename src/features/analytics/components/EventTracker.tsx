'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../hooks/useAnalytics';

interface EventTrackerProps {
  gaId?: string;
  debug?: boolean;
}

/**
 * 事件跟踪组件
 * 自动跟踪页面浏览和其他事件
 */
export default function EventTracker({
  gaId,
  debug = false
}: EventTrackerProps) {
  const pathname = usePathname();
  const { sendEvent } = useAnalytics({ gaId });
  const prevPathname = useRef<string | null>(null);
  
  // 跟踪页面浏览
  useEffect(() => {
    // 避免首次加载重复发送
    if (prevPathname.current !== null && pathname !== prevPathname.current) {
      sendEvent('page_view', {
        page_path: pathname,
        page_title: document.title
      });
      
      if (debug) {
        console.log(`[Analytics] Page view tracked: ${pathname}`);
      }
    }
    
    prevPathname.current = pathname;
  }, [pathname, sendEvent, debug]);
  
  // 该组件不渲染任何内容，仅用于跟踪
  return null;
} 