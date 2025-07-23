import { getConsentStatus } from '@/features/consent/actions';
import ClientAdUnit from './ClientAdUnit';

interface AdUnitProps {
  slotId: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle' | string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 广告单元组件 - 服务端渲染
 * 在服务端检查同意状态，仅当用户同意时才在客户端渲染广告
 */
export default async function AdUnit(props: AdUnitProps) {
  // 在服务端检查用户是否已同意广告
  const consentStatus = await getConsentStatus();
  const canShowAds = consentStatus?.advertising ?? false;
  
  // 如果未同意广告，则不显示
  if (!canShowAds) {
    return null;
  }
  
  // 同意了广告，则渲染客户端广告组件
  return <ClientAdUnit {...props} />;
} 