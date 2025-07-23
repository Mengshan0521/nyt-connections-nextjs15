'use client';

import { useAnalytics } from '../hooks/useAnalytics';
import EventTracker from './EventTracker';

interface GoogleAnalyticsProviderProps {
  gaId?: string;
  debug?: boolean;
}

/**
 * Google Analytics 提供者
 * 负责加载 GA 和跟踪事件
 */
export default function GoogleAnalyticsProvider({
  gaId,
  debug = false
}: GoogleAnalyticsProviderProps) {
  // 初始化 Analytics
  useAnalytics({ gaId });
  
  return (
    <EventTracker gaId={gaId} debug={debug} />
  );
} 