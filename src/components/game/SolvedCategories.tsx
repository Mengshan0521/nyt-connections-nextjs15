'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCategory } from '@/types/game';

interface SolvedCategoriesProps {
  categories: GameCategory[];
  getCategoryColor: (category: GameCategory) => string;
}

/**
 * 已解决类别显示组件
 * 只负责渲染已解决的类别
 */
export const SolvedCategories: React.FC<SolvedCategoriesProps> = ({
  categories,
  getCategoryColor
}) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      <AnimatePresence>
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="w-full p-3 rounded-md text-center shadow-sm border max-w-2xl mx-auto"
            style={{ backgroundColor: getCategoryColor(category) }}
          >
            <div className="font-bold text-lg mb-1 text-gray-900">{category.title}</div>
            <div className="text-sm text-gray-700">
              {category.cards.map(card => card.content).join(', ')}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SolvedCategories;
