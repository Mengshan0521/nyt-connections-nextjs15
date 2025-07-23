import ConsentBanner from '@/features/consent/components/ConsentBanner';
import AnalyticsProvider from '@/features/analytics/components/AnalyticsProvider';

interface ServiceProviderProps {
  gaId?: string;
  adsenseId?: string;
}

/**
 * 服务提供者组件
 * 管理所有第三方服务的加载
 * 使用服务端组件来尽可能多地在服务端渲染
 */
export default function ServiceProvider({
  gaId,
  adsenseId
}: ServiceProviderProps) {
  return (
    <>
      {/* Cookie 同意横幅 */}
      <ConsentBanner />
      
      {/* 分析和广告脚本 */}
      <AnalyticsProvider gaId={gaId} adsenseId={adsenseId} />
    </>
  );
} 