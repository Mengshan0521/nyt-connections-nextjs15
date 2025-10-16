import { NextRequest, NextResponse } from 'next/server'
import { getPosts } from '@/lib/postService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const locale = searchParams.get('locale') || 'en'

    // 获取博客文章数据
    const { posts, totalPosts } = await getPosts(page, pageSize, locale)

    return NextResponse.json(
      {
        posts,
        totalPosts,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalPosts / pageSize),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}