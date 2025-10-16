import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/supabase'
import { localeUtils } from '@/i18n/routing'
import { unstable_cache } from 'next/cache'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || routing.defaultLocale

  const getCachedSitemap = unstable_cache(
    async () => {
      // Get all blog post dates
      const now = new Date().toISOString().split('T')[0]
      const supabase = await createClient()
      const { data: posts } = await supabase
        .from(TABLES.POST)
        .select('post_date')
        .eq('language', locale)
        .lte('post_date', now)
        .order('post_date', { ascending: false })

      // Generate sitemap
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  ${['/', '/about', '/privacy', '/blog'].map(path => {
    const localizedPath = localeUtils.generatePath(path, locale)
    return `
  <url>
    <loc>${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}${localizedPath}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  }).join('')}

  <!-- Blog posts -->
  ${posts?.map(post => {
    const localizedPath = localeUtils.generatePath(`/blog/${post.post_date}`, locale)
    return `
  <url>
    <loc>${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}${localizedPath}</loc>
    <lastmod>${post.post_date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  }).join('') || ''}

  <!-- Home page -->
  <url>
    <loc>${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}${localeUtils.generatePath('/', locale)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

      return sitemap
    },
    [`sitemap-${locale}`],
    {
      tags: ['sitemap', `sitemap-${locale}`],
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
}