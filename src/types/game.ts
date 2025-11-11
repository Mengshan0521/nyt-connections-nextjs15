// 核心游戏类型定义
// 从17个接口精简为10个

// 单词卡片
export interface GameCard {
  content: string;
  position: number;
}

// 游戏类别（4个单词组成一个类别）
export interface GameCategory {
  title: string;
  level: number; // 0-3 for yellow, green, blue, purple
  cards: GameCard[];
  isFound?: boolean;
}

// 谜题数据（包含4个类别）
export interface Puzzle {
  id: string;
  print_date: string; // YYYY-MM-DD format
  categories: GameCategory[];
}

// 游戏数据（与Puzzle同义，用于兼容）
export type GameData = Puzzle;

// 单词瓦片（游戏网格中的单词）
export interface WordTile {
  id: string;
  text: string;
  isSelected: boolean;
  isFound: boolean;
  groupId: string;
}

// 玩家猜测
export interface GameGuess {
  cards: Array<{
    content: string;
    level: number;
  }>;
  correct: boolean;
}

// 游戏历史（本地存储）
export interface GameHistory {
  guesses: GameGuess[];
  solvedCategories: GameCategory[];
  InfiniteMode: boolean;
  cardPositions: number[];
  selectedCards: string[];
}

// 游戏状态（Zustand使用）
export interface GameState {
  id: string;
  puzzleId: string;
  words: WordTile[];
  selectedWords: string[];
  foundCategories: string[];
  categories: GameCategory[];
  mistakes: number;
  maxMistakes: number;
  isGameOver: boolean;
  isWon: boolean;
  gameMode: 'daily' | 'infinite';
  shuffleCount: number;
  startTime: Date;
  endTime?: Date;
}

// 难度级别
export type DifficultyLevel = 'yellow' | 'green' | 'blue' | 'purple';

// 难度颜色映射
export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  yellow: '#f9df6d',
  green: '#a0c35a',
  blue: '#b0c4ef',
  purple: '#ba81c5'
};

// 难度级别映射
export const DIFFICULTY_LEVELS: Record<number, DifficultyLevel> = {
  0: 'yellow',
  1: 'green',
  2: 'blue',
  3: 'purple'
};