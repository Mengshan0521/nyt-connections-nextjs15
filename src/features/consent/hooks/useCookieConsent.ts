'use client';

import { useState, useEffect } from 'react';
import { getConsentStatus, saveConsentStatus, clearConsentStatus } from '../utils/cookieConsent';

export interface ConsentOptions {
  analytics: boolean;
  advertising: boolean;
}

/**
 * Cookie 同意状态钩子
 * 提供 Cookie 同意状态管理和更新功能
 */
export function useCookieConsent() {
  const [showDialog, setShowDialog] = useState(false);
  const [consentStatus, setConsentStatus] = useState<ConsentOptions | null>(null);
  
  // 初始化同意状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = getConsentStatus();
      setConsentStatus(status);
      setShowDialog(!status); // 如果没有同意状态，显示对话框
    }
  }, []);
  
  // 保存同意选择
  const saveChoices = (choices: ConsentOptions) => {
    saveConsentStatus(choices);
    setConsentStatus(choices);
    setShowDialog(false);
  };
  
  // 接受所有 cookies
  const acceptAll = () => {
    saveChoices({ analytics: true, advertising: true });
  };
  
  // 仅接受必要的 cookies
  const acceptNecessary = () => {
    saveChoices({ analytics: false, advertising: false });
  };
  
  // 清除同意状态
  const clearConsent = () => {
    clearConsentStatus();
    setConsentStatus(null);
    setShowDialog(true);
  };
  
  // 检查特定类型是否已同意
  const hasConsented = (type: keyof ConsentOptions): boolean => {
    return !!consentStatus && consentStatus[type] === true;
  };
  
  return {
    showDialog,
    consentStatus,
    setShowDialog,
    saveChoices,
    acceptAll,
    acceptNecessary,
    clearConsent,
    hasConsented,
  };
} 