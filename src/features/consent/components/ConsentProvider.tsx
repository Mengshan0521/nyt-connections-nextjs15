'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useCookieConsent, ConsentOptions } from '../hooks/useCookieConsent';
import CookieConsent from './CookieConsent';

// 创建同意上下文
interface ConsentContextValue {
  hasConsented: (type: keyof ConsentOptions) => boolean;
  showConsentDialog: () => void;
  hideConsentDialog: () => void;
  updateConsent: (choices: ConsentOptions) => void;
  resetConsent: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

// 同意提供者属性
interface ConsentProviderProps {
  children: ReactNode;
}

/**
 * Cookie同意提供者组件
 * 管理Cookie同意状态并提供上下文API
 */
export default function ConsentProvider({ children }: ConsentProviderProps) {
  const {
    showDialog,
    setShowDialog,
    saveChoices,
    clearConsent,
    hasConsented
  } = useCookieConsent();
  
  // 显示同意对话框
  const showConsentDialog = () => setShowDialog(true);
  
  // 隐藏同意对话框
  const hideConsentDialog = () => setShowDialog(false);
  
  // 更新同意状态
  const updateConsent = (choices: ConsentOptions) => saveChoices(choices);
  
  // 重置同意状态
  const resetConsent = () => clearConsent();
  
  // 上下文值
  const contextValue: ConsentContextValue = {
    hasConsented,
    showConsentDialog,
    hideConsentDialog,
    updateConsent,
    resetConsent
  };
  
  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
      <CookieConsent />
    </ConsentContext.Provider>
  );
}

/**
 * 使用同意上下文的钩子
 */
export function useConsentContext() {
  const context = useContext(ConsentContext);
  
  if (!context) {
    throw new Error('useConsentContext must be used within a ConsentProvider');
  }
  
  return context;
} 