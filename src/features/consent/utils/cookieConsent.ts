'use client';

const CONSENT_KEY = 'cookie_consent';

export interface ConsentOptions {
  analytics: boolean;
  advertising: boolean;
  timestamp: number;
}

/**
 * 获取用户的cookie同意状态
 */
export function getConsentStatus(): ConsentOptions | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (storedConsent) {
      return JSON.parse(storedConsent) as ConsentOptions;
    }
  } catch (error) {
    console.error('Failed to parse consent status:', error);
  }
  
  return null;
}

/**
 * 保存用户的cookie同意状态
 */
export function saveConsentStatus(options: {
  analytics: boolean;
  advertising: boolean;
}): void {
  if (typeof window === 'undefined') return;
  
  try {
    const consent: ConsentOptions = {
      ...options,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    console.log('Cookie consent saved:', consent);
    
    // 触发自定义事件，通知其他组件cookie同意状态已更改
    window.dispatchEvent(new CustomEvent('consentStatusChanged', { 
      detail: consent 
    }));
  } catch (error) {
    console.error('Failed to save consent status:', error);
  }
}

/**
 * 清除用户的cookie同意状态
 */
export function clearConsentStatus(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CONSENT_KEY);
    console.log('Cookie consent cleared');
    
    // 触发自定义事件，通知其他组件cookie同意状态已更改
    window.dispatchEvent(new CustomEvent('consentStatusChanged', { 
      detail: null 
    }));
  } catch (error) {
    console.error('Failed to clear consent status:', error);
  }
}

/**
 * 判断用户是否已同意特定类型的cookie
 */
export function hasConsented(type: 'analytics' | 'advertising'): boolean {
  const consent = getConsentStatus();
  return !!consent && consent[type] === true;
} 