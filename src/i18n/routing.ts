import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-cn'],

  // Used when no locale matches
  defaultLocale: 'en',

  // 配置路径命名策略，使默认语言不显示在URL中
  localePrefix: 'as-needed'
});

// Custom locale utilities
export const localeUtils = {
  // Check if a locale is supported
  isSupported: (locale: string): boolean => {
    return routing.locales.includes(locale as any);
  },
  
  // Get the best matching locale for a request
  getBestLocale: (acceptLanguage: string): string => {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
    
    for (const lang of languages) {
      // Check exact match first
      if (routing.locales.includes(lang as any)) {
        return lang;
      }
      
      // Check language prefix (e.g., 'en' for 'en-US')
      const langPrefix = lang.split('-')[0];
      if (routing.locales.includes(langPrefix as any)) {
        return langPrefix;
      }
    }
    
    return routing.defaultLocale;
  },
  
  // Generate localized paths
  generatePath: (path: string, locale?: string): string => {
    const targetLocale = locale || routing.defaultLocale;
    
    if (targetLocale === routing.defaultLocale && routing.localePrefix === 'as-needed') {
      return path;
    }
    
    const withoutLocale = path.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '');
    return `/${targetLocale}${withoutLocale}`;
  },
  
  // Extract locale from path
  extractLocaleFromPath: (path: string): string | null => {
    const match = path.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)/);
    return match ? match[1] : null;
  }
};

// Static route configuration for SSG
export const staticRoutes = {
  // Static pages that should be pre-rendered
  pages: {
    home: '/',
    about: '/about',
    privacy: '/privacy',
    blog: '/blog',
    game: '/game'
  },

  // API routes
  api: {
    health: '/api/services/health',
    posts: '/api/posts',
    monitoring: '/api/monitoring'
  }
};

// 导航链接配置（用于 Header 和 Footer 组件）
export const headerNavLinks: Array<{ href: string; title: string }> = [
  { href: '/', title: 'home' },
  { href: '/blog', title: 'blog' },
  { href: '/game', title: 'games' },
  { href: '/about', title: 'about' },
  { href: '/privacy', title: 'privacy' },
];