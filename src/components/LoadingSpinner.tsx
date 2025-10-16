import React from 'react'
import { motion } from 'framer-motion'

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      >
        <style jsx>{`
          .w-16 h-16 {
            width: 4rem;
            height: 4rem;
          }
          .border-4 {
            border-width: 0.25rem;
          }
          .border-blue-500 {
            border-color: #3B82F6;
          }
          .border-t-transparent {
            border-top-color: transparent;
          }
          .rounded-full {
            border-radius: 9999px;
          }
        `}</style>
      </motion.div>
    </div>
  )
}

export const LoadingCard: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      </div>
    </div>
  )
}

export const LoadingGame: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-block">
            <LoadingSpinner />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Loading Game...
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Preparing your puzzle...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}