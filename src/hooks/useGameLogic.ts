'use client';

import { useState, useCallback } from 'react';
import { GameCategory, GameHistory, DIFFICULTY_COLORS, DIFFICULTY_LEVELS } from '@/types/game';

// 简化的游戏状态（仅UI相关）
interface SimpleGameState {
  selectedWords: string[];
  foundCategories: GameCategory[];
  mistakes: number;
  isGameOver: boolean;
  isWon: boolean;
  shuffleCount: number;
}

interface UseGameLogicProps {
  gameData: GameData;
  // 从父组件传入的游戏状态和方法
  gameState: SimpleGameState & { words?: any[] }; // 添加words数组
  selectWord: (wordId: string) => void;
  deselectWord: (wordId: string) => void;
  submitGuess: () => void;
  shuffleWords: () => void;
  resetGame: () => void;
}

export const useGameLogic = ({
  gameData,
  gameState,
  selectWord,
  deselectWord,
  submitGuess,
  shuffleWords,
  resetGame
}: UseGameLogicProps) => {
  // UI 状态
  const [isShaking, setIsShaking] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 显示提示消息
  const showToast = useCallback((message: string, duration = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  }, []);

  // 触发抖动效果
  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  // 清除所有选择
  const clearSelection = useCallback(() => {
    if (gameState.selectedWords) {
      gameState.selectedWords.forEach(wordId => {
        deselectWord(wordId);
      });
    }
  }, [gameState.selectedWords, deselectWord]);

  // 启动无限模式（留空实现）
  const enableInfiniteMode = useCallback(() => {
    console.log('Infinite mode not implemented yet');
  }, []);

  // 获取类别颜色
  const getCategoryColor = useCallback((category: GameCategory) => {
    return DIFFICULTY_COLORS[DIFFICULTY_LEVELS[category.level]];
  }, []);

  // 获取可用的单词
  // 从Zustand的words数组获取，保证洗牌功能正常
  const availableWords = (gameState.words || [])
    .filter(word => !word.isFound)
    .map(word => word.text);

  // 返回整合后的状态
  const gameState_ui = {
    selectedWords: gameState.selectedWords || [],
    foundCategories: gameState.foundCategories || [],
    availableWords,
    mistakes: gameState.mistakes || 4,
    maxMistakes: 4,
    isGameOver: gameState.isGameOver || false,
    isWon: gameState.isWon || false,
    shuffleCount: gameState.shuffleCount || 0,
    isShaking,
    toastMessage,
    canSubmit: (gameState.selectedWords?.length || 0) === 4,
    canClear: (gameState.selectedWords?.length || 0) > 0
  };

  // 游戏操作
  const gameActions = {
    selectWord: (word: string) => {
      // 根据单词文本查找对应的ID
      const allWords = gameData.categories.flatMap(cat =>
        cat.cards.map(card => ({ text: card.content, id: `${cat.title}-${card.content}` }))
      );
      const wordId = allWords.find(w => w.text === word)?.id || word;
      selectWord(wordId);
    },
    clearSelection,
    shuffleWords,
    submitGuess,
    enableInfiniteMode,
    resetGame,
    getCategoryColor,
    showToast,
    triggerShake
  };

  return {
    gameState: gameState_ui,
    gameActions,
    gameHistory: null // 不需要游戏历史
  };
};