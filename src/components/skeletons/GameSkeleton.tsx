'use client';

import { motion } from 'framer-motion';

/**
 * 游戏板加载骨架屏
 * 模拟 4x4 单词网格和已解决类别的显示
 */
const GameSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        {/* 游戏标题 */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-8 animate-pulse" />

        {/* 已解决类别区域 */}
        <div className="mb-8 space-y-3">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-16 animate-pulse"
            />
          ))}
        </div>

        {/* 单词网格 - 4x4 */}
        <div className="grid grid-cols-4 gap-2 mb-6 max-w-2xl mx-auto">
          {Array.from({ length: 16 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`
                aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg
                animate-pulse
              `}
            />
          ))}
        </div>

        {/* 游戏控制按钮 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="mb-2 sm:mb-0">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse" />
          </div>
          <div className="flex justify-center space-x-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded-[32px] w-24 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSkeleton;
