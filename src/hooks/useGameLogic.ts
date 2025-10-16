'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameData, GameCategory, GameHistory, GameGuess, DIFFICULTY_COLORS, DIFFICULTY_LEVELS } from '@/types/game';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UseGameLogicProps {
  gameData: GameData;
}

export const useGameLogic = ({ gameData }: UseGameLogicProps) => {
  // 基础状态
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [foundCategories, setFoundCategories] = useState<GameCategory[]>([]);
  const [mistakes, setMistakes] = useState(4);
  const [maxMistakes] = useState(4);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isInfiniteMode, setIsInfiniteMode] = useState(false);

  // 本地存储的游戏历史 - 使用全局key，不依赖语言
  const [gameHistory, setGameHistory] = useLocalStorage<GameHistory>(
    `connections-game-${gameData.print_date}`,
    {
      guesses: [],
      solvedCategories: [],
      InfiniteMode: false,
      cardPositions: [],
      selectedCards: [],
    }
  );

  // 获取可用的单词（排除已找到的类别）
  const availableWords = useMemo(() => {
    const words = gameData.categories
      .flatMap(category =>
        foundCategories.some(found => found.title === category.title)
          ? []
          : category.cards.map(card => card.content)
      )
      .sort();

    // 只有当shuffleCount变化时才重新排序
    if (shuffleCount > 0) {
      // 使用Fisher-Yates洗牌算法
      const shuffled = [...words];

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled;
    }

    return words;
  }, [gameData.categories, foundCategories, shuffleCount]);

  // 初始化游戏状态
  useEffect(() => {
    if (gameHistory.solvedCategories.length > 0) {
      setFoundCategories(gameHistory.solvedCategories);
    }

    if (gameHistory.selectedCards.length > 0) {
      setSelectedWords(gameHistory.selectedCards);
    }

    if (gameHistory.InfiniteMode) {
      setIsInfiniteMode(true);
      setMistakes(Infinity);
    } else {
      setMistakes(maxMistakes - gameHistory.guesses.length);
    }

    // 检查游戏是否已完成
    if (gameHistory.solvedCategories.length === gameData.categories.length) {
      setIsWon(true);
      setIsGameOver(true);
    }
  }, [gameData, gameHistory, maxMistakes]);

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

  // 选择单词
  const selectWord = useCallback((word: string) => {
    if (selectedWords.includes(word)) {
      // 取消选择
      const newSelected = selectedWords.filter(w => w !== word);
      setSelectedWords(newSelected);
      setGameHistory(prev => ({ ...prev, selectedCards: newSelected }));
    } else if (selectedWords.length < 4) {
      // 选择单词
      const newSelected = [...selectedWords, word];
      setSelectedWords(newSelected);
      setGameHistory(prev => ({ ...prev, selectedCards: newSelected }));
    }
  }, [selectedWords, setGameHistory]);

  // 清除所有选择
  const clearSelection = useCallback(() => {
    setSelectedWords([]);
    setGameHistory(prev => ({ ...prev, selectedCards: [] }));
  }, [setGameHistory]);

  // 洗牌
  const shuffleWords = useCallback(() => {
    setShuffleCount(prev => prev + 1);
  }, []);

  // 检查猜测是否正确
  const submitGuess = useCallback(() => {
    if (selectedWords.length !== 4) return;

    // 检查是否已经猜过这个组合
    const existingGuess = gameHistory.guesses.some(guess =>
      guess.cards.length === selectedWords.length &&
      guess.cards.every(card => selectedWords.includes(card.content))
    );

    if (existingGuess) {
      showToast('Already guessed!');
      return;
    }

    // 检查是否匹配某个类别
    const matchedCategory = gameData.categories.find(category =>
      category.cards.length === selectedWords.length &&
      category.cards.every(card => selectedWords.includes(card.content))
    );

    // 创建猜测记录
    const guess: GameGuess = {
      cards: selectedWords.map(word => {
        const level = gameData.categories.findIndex(cat =>
          cat.cards.some(card => card.content === word)
        );
        return { content: word, level };
      }),
      correct: !!matchedCategory
    };

    // 更新游戏历史
    const newGuesses = [...gameHistory.guesses, guess];
    let newSolvedCategories = gameHistory.solvedCategories;

    if (matchedCategory) {
      // 正确猜测
      newSolvedCategories = [...foundCategories, matchedCategory];
      setFoundCategories(newSolvedCategories);
      clearSelection();

      // 检查是否获胜
      if (newSolvedCategories.length === gameData.categories.length) {
        setIsWon(true);
        setIsGameOver(true);
      }
    } else {
      // 错误猜测
      if (!isInfiniteMode) {
        const newMistakes = maxMistakes - newGuesses.length;
        setMistakes(newMistakes);

        if (newMistakes <= 0) {
          setIsGameOver(true);
        }
      }

      triggerShake();
      showToast('Not quite right. Try again!');
    }

    setGameHistory(prev => ({
      ...prev,
      guesses: newGuesses,
      solvedCategories: newSolvedCategories,
      selectedCards: matchedCategory ? [] : prev.selectedCards
    }));
  }, [
    selectedWords,
    gameHistory,
    gameData,
    foundCategories,
    isInfiniteMode,
    maxMistakes,
    showToast,
    triggerShake,
    clearSelection,
    setGameHistory
  ]);

  // 启动无限模式
  const enableInfiniteMode = useCallback(() => {
    setIsInfiniteMode(true);
    setMistakes(Infinity);
    setIsGameOver(false);
    setGameHistory(prev => ({ ...prev, InfiniteMode: true }));
  }, [setGameHistory]);

  // 重置游戏
  const resetGame = useCallback(() => {
    setSelectedWords([]);
    setFoundCategories([]);
    setMistakes(maxMistakes);
    setIsGameOver(false);
    setIsWon(false);
    setShuffleCount(0);
    setIsInfiniteMode(false);
    setGameHistory({
      guesses: [],
      solvedCategories: [],
      InfiniteMode: false,
      cardPositions: [],
      selectedCards: [],
    });
  }, [maxMistakes, setGameHistory]);

  // 获取类别颜色
  const getCategoryColor = useCallback((category: GameCategory) => {
    return DIFFICULTY_COLORS[DIFFICULTY_LEVELS[category.level]];
  }, []);

  // 获取当前游戏状态
  const gameState = {
    selectedWords,
    foundCategories,
    availableWords,
    mistakes,
    maxMistakes,
    isGameOver,
    isWon,
    shuffleCount,
    isShaking,
    toastMessage,
    isInfiniteMode,
    canSubmit: selectedWords.length === 4,
    canClear: selectedWords.length > 0
  };

  // 游戏操作
  const gameActions = {
    selectWord,
    clearSelection,
    shuffleWords,
    submitGuess,
    enableInfiniteMode,
    resetGame,
    getCategoryColor
  };

  return {
    gameState,
    gameActions,
    gameHistory
  };
};