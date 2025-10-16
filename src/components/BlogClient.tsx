'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Pagination from './Pagination'
import BlogList from './BlogList'
import { useTranslations } from 'next-intl'
import { getPosts } from '@/lib/postService'

interface BlogClientProps {
  initialPosts: any[]
  totalPosts: number
  locale: string
}

const item = {
  hidden: { opacity: 0, x: -25 },
  show: { opacity: 1, x: 0 },
}

export default function BlogClient({
  initialPosts,
  totalPosts,
  locale,
}: BlogClientProps) {
  const t = useTranslations('BlogList')
  const [posts, setPosts] = useState(initialPosts)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pageSize = 5
  const totalPages = Math.ceil(totalPosts / pageSize)

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || isLoading) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(
        `/api/posts?page=${newPage}&pageSize=${pageSize}&locale=${locale}`
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch posts`)
      }

      const { posts: newPosts } = await response.json()

      setPosts(newPosts)
      setCurrentPage(newPage)
    } catch (error) {
      console.error('Error loading page:', error)
      setError(error instanceof Error ? error.message : 'Failed to load posts')

      // 自动清除错误信息
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 错误提示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* 加载状态遮罩 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
        >
          <div
            className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-3"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Loading posts...</span>
          </div>
        </motion.div>
      )}

      {/* 内容区域，加载时稍微模糊 */}
      <div className={`${isLoading ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}>
        <BlogList posts={posts} locale={locale} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  )
}