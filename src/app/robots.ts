import { MetadataRoute } from 'next';

/**
 * 生成动态 robots.txt 文件
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 可选：添加不允许爬虫访问的路径
      // disallow: ['/api/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 