import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'en'
  
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://example.com/${locale}/sitemap.xml`
  
  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}