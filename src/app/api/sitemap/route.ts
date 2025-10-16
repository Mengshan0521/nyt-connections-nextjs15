import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { staticRoutes } from '@/i18n/routing'
import { siteConfig } from '@/config/seo'
import { unstable_cache } from 'next/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    const type = searchParams.get('type') || 'pages' // 'pages', 'blog', 'api'

    const getCachedSitemap = unstable_cache(
      async () => {
        let sitemap = ''

        switch (type) {
          case 'pages':
            sitemap = generatePagesSitemap(locale)
            break
          case 'blog':
            sitemap = await generateBlogSitemap(locale)
            break
          case 'api':
            sitemap = generateApiSitemap()
            break
          default:
            throw new Error('Invalid sitemap type')
        }

        return sitemap
      },
      [`sitemap-${locale}-${type}`],
      {
        tags: ['sitemap', `sitemap-${locale}`, `sitemap-${type}`],
        revalidate: 3600 // 1 hour
      }
    )

    const sitemap = await getCachedSitemap()

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

function generatePagesSitemap(locale: string): string {
  const baseUrl = siteConfig.url
  const localePath = locale === 'en' ? '' : `/${locale}`
  
  const pages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'weekly' },
    { path: '/privacy', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    { path: '/game', priority: '1.0', changefreq: 'daily' }
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${localePath}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`
}

async function generateBlogSitemap(locale: string): Promise<string> {
  const baseUrl = siteConfig.url
  const now = new Date().toISOString().split('T')[0]

  // Get blog posts from Supabase
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('post')
    .select('post_date')
    .eq('language', locale)
    .lte('post_date', now)
    .order('post_date', { ascending: false })

  const localePath = locale === 'en' ? '' : `/${locale}`
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Blog listing page -->
  <url>
    <loc>${baseUrl}${localePath}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Individual blog posts -->
  ${posts?.map(post => `
  <url>
    <loc>${baseUrl}${localePath}/blog/${post.post_date}</loc>
    <lastmod>${post.post_date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('') || ''}
</urlset>`
}

function generateApiSitemap(): string {
  const baseUrl = siteConfig.url
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- API endpoints for discovery -->
  <url>
    <loc>${baseUrl}/api/health</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/api/sitemap</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`
}

// Generate sitemap index
export async function SITEMAP_INDEX(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'en'

  const getCachedIndex = unstable_cache(
    async () => {
      const baseUrl = siteConfig.url
      const localePath = locale === 'en' ? '' : `/${locale}`

      return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}${localePath}/api/sitemap?type=pages</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}${localePath}/api/sitemap?type=blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}${localePath}/api/sitemap?type=api</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`
    },
    [`sitemap-index-${locale}`],
    {
      tags: ['sitemap', `sitemap-index-${locale}`],
      revalidate: 3600 // 1 hour
    }
  )

  const sitemapIndex = await getCachedIndex()

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}