import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-cn'],

  // 默认语言
  defaultLocale: 'en',

  // 路径命名策略：默认语言不显示在URL中
  localePrefix: 'as-needed'
});

// 简化的语言工具
export const localeUtils = {
  isSupported: (locale: string): boolean => {
    return routing.locales.includes(locale as any);
  },
  extractLocaleFromPath: (path: string): string | null => {
    const match = path.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)/);
    return match ? match[1] : null;
  },
  generatePath: (path: string, locale?: string): string => {
    const targetLocale = locale || routing.defaultLocale;
    if (targetLocale === routing.defaultLocale && routing.localePrefix === 'as-needed') {
      return path;
    }
    const withoutLocale = path.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '');
    return `/${targetLocale}${withoutLocale}`;
  }
};

// 静态路由配置
export const staticRoutes = {
  pages: {
    home: '/',
    about: '/about',
    privacy: '/privacy',
    blog: '/blog',
    game: '/game'
  },
  api: {
    health: '/api/services/health',
    posts: '/api/posts',
    monitoring: '/api/monitoring'
  }
};

// 导航链接配置
export const headerNavLinks: Array<{ href: string; title: string }> = [
  { href: '/', title: 'home' },
  { href: '/blog', title: 'blog' },
  { href: '/game', title: 'games' },
  { href: '/about', title: 'about' },
  { href: '/privacy', title: 'privacy' },
];