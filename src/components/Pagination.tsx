'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  isLoading = false,
}) => {
  const t = useTranslations('BlogList')

  // 智能分页显示逻辑
  const getVisiblePages = () => {
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = Math.max(1, currentPage - halfVisible)
    const end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex justify-center items-center space-x-2 mt-8 ${isLoading ? 'pointer-events-none opacity-50' : ''} transition-opacity duration-200`}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:scale-105 active:scale-95"
        style={{
          backgroundColor: 'var(--hover-bg)',
          color: 'var(--text-primary)'
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--card-border)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
            e.currentTarget.style.transform = 'scale(1)'
          }
        }}
      >
        {t('prevp')}
      </button>

      {/* 首页按钮 */}
      {currentPage > 3 && totalPages > 5 && (
        <>
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            onClick={() => !isLoading && onPageChange(1)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--hover-bg)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--card-border)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              }
            }}
          >
            1
          </motion.button>
          {currentPage > 4 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {visiblePages.map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: isLoading ? 1 : 1.05 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          onClick={() => !isLoading && onPageChange(page)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed ${
            page === currentPage
              ? 'bg-blue-500 text-white shadow-lg'
              : ''
          }`}
          style={page === currentPage ? {} : {
            backgroundColor: 'var(--hover-bg)',
            color: 'var(--text-primary)'
          }}
          onMouseEnter={(e) => {
            if (page !== currentPage && !isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--card-border)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }
          }}
          onMouseLeave={(e) => {
            if (page !== currentPage && !isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          {isLoading && page === currentPage ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
          ) : (
            page
          )}
        </motion.button>
      ))}

      {/* 末页按钮 */}
      {currentPage < totalPages - 2 && totalPages > 5 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            onClick={() => !isLoading && onPageChange(totalPages)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--hover-bg)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--card-border)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
              }
            }}
          >
            {totalPages}
          </motion.button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:scale-105 active:scale-95"
        style={{
          backgroundColor: 'var(--hover-bg)',
          color: 'var(--text-primary)'
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--card-border)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
            e.currentTarget.style.transform = 'scale(1)'
          }
        }}
      >
        {t('nextp')}
      </button>
    </motion.div>
  )
}

export default Pagination