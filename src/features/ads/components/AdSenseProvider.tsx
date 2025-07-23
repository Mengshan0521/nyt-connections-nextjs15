'use client';

import { useAdsense } from '../hooks/useAdsense';

interface AdSenseProviderProps {
  adsenseId?: string;
}

/**
 * Google AdSense 提供者
 * 根据用户同意状态加载 AdSense
 */
export default function AdSenseProvider({ adsenseId }: AdSenseProviderProps) {
  useAdsense({ adsenseId });
  
  // 此组件不渲染任何内容，仅负责加载脚本
  return null;
} 