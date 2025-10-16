'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameData } from '@/types/game';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useTranslations } from 'next-intl';
import WordCard from '@/components/WordCard';

interface GameBoardProps {
  gameData: GameData;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameData }) => {
  const { gameState, gameActions } = useGameLogic({ gameData });
  const t = useTranslations('GameBoard');

  // 获取当前日期格式化
  const getCurrentUTCDateFormatted = () => {
    const dateInTimeZone = new Date().toLocaleString('en-US', {
      timeZone: 'Pacific/Auckland',
    });
    const date = new Date(dateInTimeZone);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = gameData.print_date === getCurrentUTCDateFormatted();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* 游戏区域 */}
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 text-center">
          {t('ConnectionsGameToday')}
        </h2>

        {/* 提示消息 */}
        <AnimatePresence>
          {gameState.toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm sm:text-base"
            >
              {gameState.toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 已解决的类别 */}
        <div className="space-y-2 mb-6">
          <AnimatePresence>
            {gameState.foundCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="w-full p-3 rounded-md text-center shadow-sm border max-w-2xl mx-auto"
                style={{ backgroundColor: gameActions.getCategoryColor(category) }}
              >
                <div className="font-bold text-lg mb-1 text-gray-900">{category.title}</div>
                <div className="text-sm text-gray-700">
                  {category.cards.map(card => card.content).join(', ')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 游戏网格 */}
        {!gameState.isGameOver && (
          <div className="grid grid-cols-4 gap-2 mb-6 max-w-2xl mx-auto">
            {gameState.availableWords.map((word) => (
              <WordCard
                key={word}
                content={word}
                isSelected={gameState.selectedWords.includes(word)}
                onClick={() => gameActions.selectWord(word)}
                isShaking={gameState.isShaking && gameState.selectedWords.includes(word)}
              />
            ))}
          </div>
        )}

        {/* 游戏状态和控制 */}
        {!gameState.isGameOver && (
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="mb-2 sm:mb-0">
              <span>{t('MistakesRemaining')}: <strong>{gameState.isInfiniteMode ? '∞' : gameState.mistakes}</strong></span>
             
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={gameActions.shuffleWords}
                className="bg-white border border-black text-black h-12 rounded-[32px] px-4 w-auto text-sm sm:text-base whitespace-nowrap"
              >
                {t('Shuffle')}
              </button>

              <button
                onClick={gameActions.clearSelection}
                disabled={!gameState.canClear}
                className=
                {`h-12 rounded-[32px] px-4 w-auto text-sm sm:text-base whitespace-nowrap border 
                ${gameState.canClear
                  ? "text-black border-black bg-white"
                  : "text-[#7f7f7f] border-[#7f7f7f] bg-white"
                }
              }`}
              >
                {t('DeselectAll')}
              </button>

              <button
                onClick={gameActions.submitGuess}
                disabled={!gameState.canSubmit}
                className=
                {`h-12 rounded-[32px] px-4 w-auto text-sm sm:text-base whitespace-nowrap border ${
                gameState.canSubmit
                  ? "text-black border-black bg-white"
                  : "text-[#7f7f7f] border-[#7f7f7f] bg-white"
              }`}
              >
                {t('Submit')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 游戏结束模态框 */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 sm:p-8 rounded-lg max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
                {gameState.isWon ? 'Congratulations!' : 'Game Over'}
              </h2>

              {gameState.isWon ? (
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
                {!gameState.isWon && !gameState.isInfiniteMode && (
                  <button
                    onClick={gameActions.enableInfiniteMode}
                    className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
                  >
                    Enable Infinite Mode
                  </button>
                )}

                <button
                  onClick={gameActions.resetGame}
                  className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base font-medium"
                >
                  Play Again
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;