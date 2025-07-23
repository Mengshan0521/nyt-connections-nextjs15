'use server';

import { cookies } from 'next/headers';

// Cookie 同意状态类型
export interface ConsentOptions {
  analytics: boolean;
  advertising: boolean;
}

// Cookie 名称
const CONSENT_COOKIE_NAME = 'cookie_consent';

/**
 * 保存用户的 cookie 同意状态
 */
export async function saveConsentStatus(options: ConsentOptions) {
  // 获取当前时间戳
  const timestamp = Date.now();
  
  // 设置过期时间（180天）
  const expires = new Date();
  expires.setDate(expires.getDate() + 180);
  
  // 将同意选项和时间戳转换为 JSON 字符串
  const consentData = JSON.stringify({
    ...options,
    timestamp,
  });
  
  // 将同意状态保存到 HTTP-only cookie
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: CONSENT_COOKIE_NAME,
    value: consentData,
    expires,
    path: '/',
    httpOnly: true, // 仅服务端可访问，增强安全性
    sameSite: 'lax', // 适用于大多数场景的安全设置
    secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
  });
  
  return { success: true, timestamp };
}

/**
 * 获取用户的 cookie 同意状态
 */
export async function getConsentStatus(): Promise<ConsentOptions | null> {
  // 读取同意 cookie
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get(CONSENT_COOKIE_NAME);
  
  if (!consentCookie?.value) {
    return null;
  }
  
  try {
    // 解析 cookie 值
    const consent = JSON.parse(consentCookie.value);
    return {
      analytics: Boolean(consent.analytics),
      advertising: Boolean(consent.advertising),
    };
  } catch (error) {
    console.error('Failed to parse consent cookie:', error);
    return null;
  }
}

/**
 * 清除用户的 cookie 同意状态
 */
export async function clearConsentStatus() {
  const cookieStore = await cookies();
  cookieStore.delete(CONSENT_COOKIE_NAME);
  return { success: true };
} 