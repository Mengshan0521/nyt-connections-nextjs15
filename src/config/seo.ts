/**
 * SEO 配置
 * 简化版 - 保留核心功能，删除冗余代码
 */

export const siteConfig = {
  name: 'NYT Connections',
  description: 'A Next.js 15 application inspired by the NYT Connections game',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com',
  ogImage: '/og-image.png',
};

// 支持的语言列表
const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-cn'];

/**
 * 生成动态的元数据
 * 简化版本 - 支持有参数和无参数调用（兼容layout和页面）
 */
export function generateMetadata({
  title,
  description,
  path,
  locale,
  date,
  category,
  image
}: {
  title?: string
  description?: string
  path?: string
  locale?: string
  date?: string
  category?: string
  image?: string
} = {}) {  // 支持无参数调用
  const baseTitle = 'NYT Connections';
  const baseDescription = 'Daily word categorization puzzle game';
  const url = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  // 简化逻辑
  const finalTitle = title || baseTitle;
  const finalDescription = description || baseDescription;

  return {
    metadataBase: new URL(url),
    title: title ? `${title} | ${baseTitle}` : baseTitle,
    description: finalDescription,
    keywords: getKeywords(category),
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `${url}${path || ''}`,
      images: [image || '/og-image.png'],
      locale: locale || 'en_US',
      type: 'website',
      publishedTime: date
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [image || '/og-image.png'],
      creator: '@nytimes',
    },
    alternates: {
      canonical: `${url}${path || ''}`,
      languages: generateLanguageAlternates(path, locale)
    },
    other: {
      'twitter:site': '@nytimes',
      'twitter:creator': '@nytimes',
      'structured-data': JSON.stringify(generateStructuredData(
        finalTitle,
        finalDescription,
        `${url}${path || ''}`,
        image || '/og-image.png',
        { date, category }
      ))
    }
  };
}

/**
 * 生成多语言 alternates
 * 新增功能 - 支持10种语言版本的SEO
 */
function generateLanguageAlternates(
  path?: string,
  currentLocale?: string
): Record<string, string> {
  const url = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const alternates: Record<string, string> = {};

  SUPPORTED_LANGUAGES.forEach(lang => {
    // 默认语言(en)不显示在URL中
    const localePath = lang === 'en' ? '' : `/${lang}`;
    alternates[lang] = `${url}${localePath}${path || ''}`;
  });

  return alternates;
}

/**
 * 生成结构化数据 (JSON-LD)
 * 简化版本 - 保留核心字段，删除冗余
 */
export function generateStructuredData(
  title: string,
  description: string,
  url: string,
  image: string,
  additionalData?: {
    date?: string
    category?: string
  }
) {
  const baseStructuredData = {
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

  // 只在有数据时添加可选字段
  if (additionalData?.date) {
    (baseStructuredData as any).datePublished = additionalData.date;
  }

  if (additionalData?.category) {
    (baseStructuredData as any).gameCategory = additionalData.category;
  }

  return baseStructuredData;
}

/**
 * 获取关键词
 * 简化版本 - 保留核心关键词
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
    'word association'
  ];

  return category
    ? [...baseKeywords, category].join(', ')
    : baseKeywords.join(', ');
}
