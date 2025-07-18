'use client';

import { sendGAEvent } from '@next/third-parties/google';

interface EventParams {
  [key: string]: string | number | boolean | null;
}

/**
 * 发送Google Analytics事件
 * @param eventName 事件名称
 * @param params 事件参数
 * @param locale 当前语言，如果不提供则自动尝试从URL获取
 */
export function trackEvent(
  eventName: string,
  params: EventParams = {},
  locale?: string
) {
  // 尝试从URL获取locale
  if (!locale && typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/');
    // 通常第一个非空段是locale
    if (pathSegments.length > 1) {
      const possibleLocale = pathSegments[1];
      if (possibleLocale && possibleLocale.length === 2) {
        locale = possibleLocale;
      }
    }
  }

  // 添加语言到事件参数
  const eventParams = {
    ...params,
    ...(locale && { locale })
  };

  // 发送事件
  console.log(`[Analytics] Tracking event: ${eventName}`, eventParams);
  sendGAEvent({
    event: eventName,
    ...eventParams
  });
} 