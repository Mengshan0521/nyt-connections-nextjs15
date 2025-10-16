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
  // Performance optimization settings
  performance: {
    prefetch: true,
    preconnect: true,
    dnsPrefetch: true,
    lazyLoading: true,
    imageOptimization: true,
    bundleAnalysis: true
  },
  // SEO optimization settings
  seo: {
    structuredData: true,
    sitemap: true,
    robots: true,
    schemaOrg: true,
    jsonLd: true,
    metaTags: true
  }
};

/**
 * 生成动态的元数据
 */
export function generateMetadata(
  title?: string,
  description?: string,
  path?: string,
  locale?: string,
  additionalData?: {
    date?: string
    category?: string
    author?: string
    image?: string
  }
) {
  const metaTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  
  const metaDescription = description || siteConfig.description;
  
  const url = path 
    ? `${siteConfig.url}/${path}`
    : siteConfig.url;
  
  const ogImageUrl = additionalData?.image 
    ? `${siteConfig.url}${additionalData.image}`
    : `${siteConfig.url}${siteConfig.ogImage}`;
  
  const metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: getKeywords(additionalData?.category),
    authors: [{ name: additionalData?.author || siteConfig.name }],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: locale || 'en_US',
      type: 'website',
      publishedTime: additionalData?.date,
      section: additionalData?.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImageUrl],
      creator: '@nytimes',
    },
    alternates: {
      canonical: url,
    },
    other: {
      'twitter:site': '@nytimes',
      'twitter:creator': '@nytimes',
      'article:author': additionalData?.author || siteConfig.name,
    }
  };

  // Add structured data if enabled
  if (siteConfig.seo.structuredData) {
    metadata.other = {
      ...metadata.other,
      'structured-data': JSON.stringify(generateStructuredData(metaTitle, metaDescription, url, ogImageUrl, additionalData))
    }
  }

  return metadata;
}

/**
 * 生成结构化数据
 */
export function generateStructuredData(
  title: string,
  description: string,
  url: string,
  image: string,
  additionalData?: {
    date?: string
    category?: string
    author?: string
  }
) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: title,
    description: description,
    url: url,
    image: image,
    gamePlatform: 'Web Browser',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    }
  };

  if (additionalData?.date) {
    structuredData.datePublished = additionalData.date;
  }

  if (additionalData?.category) {
    structuredData.gameCategory = additionalData.category;
  }

  if (additionalData?.author) {
    structuredData.author.name = additionalData.author;
  }

  return structuredData;
}

/**
 * 获取关键词
 */
export function getKeywords(category?: string): string {
  const baseKeywords = [
    'connections',
    'word game',
    'puzzle',
    'nyt',
    'word categorization',
    'brain game',
    'logic puzzle',
    'word association',
    'vocabulary game',
    'trivia game'
  ];

  if (category) {
    return [...baseKeywords, category].join(', ');
  }

  return baseKeywords.join(', ');
}

/**
 * 生成预连接配置
 */
export function generatePreconnectConfig() {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://googleads.g.doubleclick.net',
    'https://www.googletagmanager.com',
    'https://connect.facebook.net'
  ];

  return domains.map(domain => ({
    rel: 'preconnect',
    href: domain,
    crossOrigin: 'anonymous'
  }));
}

/**
 * 生成 DNS 预取配置
 */
export function generateDnsPrefetchConfig() {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com'
  ];

  return domains.map(domain => ({
    rel: 'dns-prefetch',
    href: domain
  }));
}

/**
 * 生成性能优化配置
 */
export function generatePerformanceConfig() {
  return {
    // Next.js Image optimization
    images: {
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // Font optimization
    fonts: {
      google: {
        families: ['Inter:wght@400;500;600;700&display=swap'],
      },
    },
    
    // Script optimization
    scripts: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID',
        strategy: 'lazyOnload',
      },
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        strategy: 'lazyOnload',
      }
    ],
    
    // Bundle analysis
    experimental: {
      optimizeCss: true,
      optimizePackageImports: ['framer-motion', '@headlessui/react'],
    },
  };
}

/**
 * SEO 分析工具
 */
export const seoAnalysis = {
  // 检查元数据完整性
  checkMetadata: (metadata: any) => {
    const checks = {
      title: metadata.title?.length > 0 && metadata.title.length <= 60,
      description: metadata.description?.length > 0 && metadata.description.length <= 160,
      keywords: metadata.keywords?.length > 0,
      ogImage: metadata.openGraph?.images?.length > 0,
      canonical: metadata.alternates?.canonical,
      structuredData: metadata.other?.['structured-data']
    };

    return {
      passed: Object.values(checks).every(v => v),
      checks,
      suggestions: generateSeoSuggestions(checks)
    };
  },

  // 生成 SEO 建议
  generateSeoSuggestions: (checks: any) => {
    const suggestions = [];

    if (!checks.title) suggestions.push('Add a title (60 characters max)');
    if (!checks.description) suggestions.push('Add a description (160 characters max)');
    if (!checks.keywords) suggestions.push('Add keywords for better search ranking');
    if (!checks.ogImage) suggestions.push('Add Open Graph image');
    if (!checks.canonical) suggestions.push('Add canonical URL');
    if (!checks.structuredData) suggestions.push('Add structured data');

    return suggestions;
  }
};

// 辅助函数
function generateSeoSuggestions(checks: any): string[] {
  const suggestions = [];

  if (!checks.title) suggestions.push('Add a title (60 characters max)');
  if (!checks.description) suggestions.push('Add a description (160 characters max)');
  if (!checks.keywords) suggestions.push('Add keywords for better search ranking');
  if (!checks.ogImage) suggestions.push('Add Open Graph image');
  if (!checks.canonical) suggestions.push('Add canonical URL');
  if (!checks.structuredData) suggestions.push('Add structured data');

  return suggestions;
}