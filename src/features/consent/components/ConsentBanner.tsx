import { getConsentStatus } from '../actions';
import ConsentDialog from './ConsentDialog';

/**
 * 同意横幅组件 - 服务端渲染
 * 根据服务端获取的同意状态决定是否显示对话框
 */
export default async function ConsentBanner() {
  // 获取当前的同意状态
  const consentStatus = await getConsentStatus();
  
  // 如果用户已同意，则不显示横幅
  if (consentStatus) {
    return null;
  }
  
  // 如果用户未同意，显示同意对话框
  return <ConsentDialog />;
} 