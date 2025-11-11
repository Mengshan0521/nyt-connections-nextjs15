import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 导出 next-intl 中间件
export default createMiddleware(routing);

// 配置路由匹配器
export const config = {
  // 匹配所有路径，除了：
  // - API 路由、静态文件等
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*|.*@.*).*)',
    '/([a-z]{2}(?:-[A-Z]{2})?)/(.*)'
  ]
};

// 导出routing供其他文件使用
export { routing };