'use client';

// 导入必要的模块和组件
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game';
import { PuzzleService } from '@/lib/puzzle-service';
import GameBoard from './GameBoard';
import { Puzzle } from '@/types/game';

// 游戏初始化器组件接口
interface GameInitializerProps {
  locale: string; // 语言环境
}

// 游戏初始化器组件
export default function GameInitializer({ locale }: GameInitializerProps) {
  // 获取游戏状态管理的方法
  const { startNewGame, setLoading, setError, gameState } = useGameStore();
  // 控制是否在客户端的状态（防止服务端渲染时的水合错误）
  const [isClient, setIsClient] = useState(false);

  // 组件挂载时初始化游戏
  useEffect(() => {
    setIsClient(true);
    initializeGame();
  }, []);

  // 初始化游戏逻辑
  const initializeGame = async () => {
    try {
      // 设置加载状态
      setLoading(true);
      // 清除错误信息
      setError(null);

      // 获取每日谜题
      const puzzle = await PuzzleService.getDailyPuzzle();
      
      if (puzzle) {
        // 开始新游戏
        startNewGame(puzzle, 'daily');
      } else {
        // 设置错误信息
        setError('Failed to load puzzle. Please try again later.');
      }
    } catch (error) {
      console.error('Error initializing game:', error);
      setError('An error occurred while loading the game.');
    } finally {
      // 结束加载状态
      setLoading(false);
    }
  };

  // 仅在客户端渲染游戏板（防止服务端渲染时的水合错误）
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  // 渲染游戏板
  return <GameBoard locale={locale} />;
}