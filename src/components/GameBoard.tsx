'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { GameData, Puzzle } from '@/types/game';
import { useGameStore } from '@/store/game';
import { useGameLogic } from '@/hooks/useGameLogic';
import GameGrid from '@/components/game/GameGrid';
import GameControls from '@/components/game/GameControls';
import SolvedCategories from '@/components/game/SolvedCategories';
import GameModal from '@/components/game/GameModal';

interface GameBoardProps {
  gameData: GameData;
}

/**
 * 主游戏面板组件
 * 协调所有子组件，管理整体布局
 */
const GameBoard: React.FC<GameBoardProps> = ({ gameData }) => {
  const t = useTranslations('GameBoard');

  // 从 Zustand 获取游戏状态和方法
  const {
    gameState,
    startNewGame,
    selectWord,
    deselectWord,
    submitGuess,
    shuffleWords,
    resetGame
  } = useGameStore();

  // 初始化游戏状态
  useEffect(() => {
    if (gameData && (!gameState || gameState.puzzleId !== gameData.id)) {
      console.log('Initializing game with data:', gameData);
      startNewGame(gameData as Puzzle, 'daily');
    }
  }, [gameData, gameState?.puzzleId, startNewGame]);

  // 使用简化的 useGameLogic（只处理UI状态）
  const { gameState: uiState, gameActions } = useGameLogic({
    gameData,
    gameState: {
      selectedWords: gameState?.selectedWords || [],
      foundCategories: gameState?.categories?.filter(cat => cat.isFound) || [],
      mistakes: gameState?.mistakes || 4,
      isGameOver: gameState?.isGameOver || false,
      isWon: gameState?.isWon || false,
      shuffleCount: gameState?.shuffleCount || 0,
      words: gameState?.words || [], // 传递words数组给useGameLogic
    },
    selectWord,
    deselectWord,
    submitGuess,
    shuffleWords,
    resetGame
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        {/* 游戏标题 */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 text-center">
          {t('ConnectionsGameToday')}
        </h2>

        {/* Toast 消息 */}
        <AnimatePresence>
          {uiState.toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm sm:text-base"
            >
              {uiState.toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 已解决类别 */}
        <SolvedCategories
          categories={uiState.foundCategories}
          getCategoryColor={gameActions.getCategoryColor}
        />

        {/* 单词网格 */}
        <GameGrid
          words={uiState.availableWords}
          selectedWords={uiState.selectedWords}
          isShaking={uiState.isShaking}
          onWordSelect={gameActions.selectWord}
          disabled={uiState.isGameOver}
        />

        {/* 游戏控制 */}
        {!uiState.isGameOver && (
          <GameControls
            canSubmit={uiState.canSubmit}
            canClear={uiState.canClear}
            mistakes={uiState.mistakes}
            isInfiniteMode={false}
            onShuffle={gameActions.shuffleWords}
            onClear={gameActions.clearSelection}
            onSubmit={gameActions.submitGuess}
          />
        )}
      </div>

      {/* 游戏结束模态框 */}
      <GameModal
        isOpen={uiState.isGameOver}
        isWon={uiState.isWon}
        isInfiniteMode={false}
        onReset={gameActions.resetGame}
        onEnableInfinite={gameActions.enableInfiniteMode}
      />
    </div>
  );
};

export default GameBoard;