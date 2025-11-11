'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameModalProps {
  isOpen: boolean;
  isWon: boolean;
  isInfiniteMode: boolean;
  onReset: () => void;
  onEnableInfinite?: () => void;
}

/**
 * 游戏结束模态框组件
 * 只负责渲染游戏结束的弹窗
 */
export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  isWon,
  isInfiniteMode,
  onReset,
  onEnableInfinite
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 sm:p-8 rounded-lg max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
              {isWon ? 'Congratulations!' : 'Game Over'}
            </h2>

            {isWon ? (
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                You found all the connections!
              </p>
            ) : (
              <div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Better luck next time!
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Want to keep playing? Try infinite mode!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              {!isWon && !isInfiniteMode && onEnableInfinite && (
                <button
                  onClick={onEnableInfinite}
                  className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
                >
                  Enable Infinite Mode
                </button>
              )}

              <button
                onClick={onReset}
                className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base font-medium"
              >
                Play Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GameModal;
