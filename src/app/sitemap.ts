import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

/**
 * 生成动态 sitemap.xml 文件
 * 包含所有支持的语言的主页URL
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  
  // 获取所有支持的语言
  const locales = routing.locales;
  
  // 基本路由（每种语言的主页）
  const routes = locales.map(locale => ({
    url: `${baseUrl}/${locale === routing.defaultLocale ? '' : locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));
  
  // 这里可以添加其他需要包含在sitemap中的页面
  // 例如：博客文章、产品页面等
  
  return routes;
} 