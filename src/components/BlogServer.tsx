import { getPosts } from '@/lib/postService'
import BlogClient from './BlogClient'

export default async function BlogServer({ locale }: { locale: string }) {
  const { posts, totalPosts } = await getPosts(1, 10, locale)

  return (
    <BlogClient
      initialPosts={posts}
      totalPosts={totalPosts}
      locale={locale}
    />
  )
}