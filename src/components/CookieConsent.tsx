'use client';

import { useState, useEffect } from 'react';
import { getConsentStatus, saveConsentStatus } from '@/utils/cookieConsent';

interface CookieConsentProps {
  className?: string;
}

export default function CookieConsent({ className = '' }: CookieConsentProps) {
  // 是否显示同意对话框
  const [show, setShow] = useState(false);
  // 跟踪用户的选择
  const [choices, setChoices] = useState({
    analytics: true,  // 默认勾选分析
    advertising: true, // 默认勾选广告
  });

  useEffect(() => {
    // 仅在客户端渲染
    if (typeof window !== 'undefined') {
      // 检查用户是否已经设置了cookie同意
      const consent = getConsentStatus();
      if (!consent) {
        // 如果没有设置，显示同意对话框
        setShow(true);
      }
    }
  }, []);

  // 处理复选框变化
  const handleCheckboxChange = (type: 'analytics' | 'advertising') => {
    setChoices(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // 处理同意所有
  const handleAcceptAll = () => {
    saveConsentStatus({ analytics: true, advertising: true });
    setShow(false);
  };

  // 处理保存选择
  const handleSaveChoices = () => {
    saveConsentStatus(choices);
    setShow(false);
  };

  // 处理仅接受必要cookies
  const handleAcceptNecessary = () => {
    saveConsentStatus({ analytics: false, advertising: false });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-bold mb-2">Cookie 设置</h3>
        <p className="mb-4">
          我们使用cookie来增强您的浏览体验，提供个性化内容和广告，以及分析我们的流量。
          请选择您愿意允许我们使用的cookie类型。
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="necessary-cookies"
              checked
              disabled
              className="mt-1 mr-2"
            />
            <div>
              <label htmlFor="necessary-cookies" className="font-medium">必要的cookies</label>
              <p className="text-sm text-gray-600">这些cookie对于网站的功能是必不可少的，不能被禁用。</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="analytics-cookies"
              checked={choices.analytics}
              onChange={() => handleCheckboxChange('analytics')}
              className="mt-1 mr-2"
            />
            <div>
              <label htmlFor="analytics-cookies" className="font-medium">分析cookies (Google Analytics)</label>
              <p className="text-sm text-gray-600">帮助我们了解访问者如何使用网站，以改善用户体验。</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <input
              type="checkbox"
              id="advertising-cookies"
              checked={choices.advertising}
              onChange={() => handleCheckboxChange('advertising')}
              className="mt-1 mr-2"
            />
            <div>
              <label htmlFor="advertising-cookies" className="font-medium">广告cookies (Google AdSense)</label>
              <p className="text-sm text-gray-600">用于提供与您的兴趣相关的广告。</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAcceptNecessary}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            仅接受必要cookies
          </button>
          <button
            onClick={handleSaveChoices}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded"
          >
            保存选择
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            接受所有cookies
          </button>
        </div>
      </div>
    </div>
  );
} 