/**
 * SEO 配置
 * 集中管理网站的 SEO 相关配置
 */
export const siteConfig = {
  name: 'NYT Connections',
  description: 'A Next.js 15 application inspired by the NYT Connections game',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/nytimes',
    github: 'https://github.com/vercel/next.js',
  },
};

/**
 * 生成动态的元数据
 */
export function generateMetadata(
  title?: string,
  description?: string,
  path?: string
) {
  const metaTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  
  const metaDescription = description || siteConfig.description;
  
  const url = path 
    ? `${siteConfig.url}/${path}`
    : siteConfig.url;
  
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [`${siteConfig.url}${siteConfig.ogImage}`],
      creator: '@nytimes',
    },
    alternates: {
      canonical: url,
    },
  };
} 