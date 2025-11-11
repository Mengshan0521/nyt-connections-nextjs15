'use client';

import { motion } from 'framer-motion';

/**
 * 博客文章列表骨架屏
 * 模拟文章卡片的显示
 */
const PostsSkeleton = () => {
  return (
    <div className="space-y-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* 文章标题 */}
          <div className="flex items-start justify-between mb-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="ml-4 h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          </div>

          {/* 日期 */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse" />

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: 8 }).map((_, tagIndex) => (
              <div
                key={tagIndex}
                className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"
              />
            ))}
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PostsSkeleton;
