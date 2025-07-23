import { getConsentStatus } from '@/features/consent/actions';
import GoogleAnalyticsScript from './GoogleAnalyticsScript';
import AdSenseScript from '@/features/ads/components/AdSenseScript';

interface AnalyticsProviderProps {
  gaId?: string;
  adsenseId?: string;
}

/**
 * 分析提供者组件 - 服务端渲染
 * 根据用户的同意状态，有条件地加载分析和广告脚本
 */
export default async function AnalyticsProvider({
  gaId,
  adsenseId
}: AnalyticsProviderProps) {
  // 检查用户是否已同意
  const consentStatus = await getConsentStatus();
  
  // 默认不加载任何脚本
  const loadAnalytics = consentStatus?.analytics ?? false;
  const loadAdsense = consentStatus?.advertising ?? false;
  
  return (
    <>
      {/* Google Analytics 脚本 */}
      {loadAnalytics && gaId && (
        <GoogleAnalyticsScript gaId={gaId} />
      )}
      
      {/* AdSense 脚本 */}
      {loadAdsense && adsenseId && (
        <AdSenseScript adsenseId={adsenseId} />
      )}
    </>
  );
} 