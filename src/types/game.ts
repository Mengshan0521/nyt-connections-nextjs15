export interface GameCard {
  content: string;
  position: number;
}

export interface GameCategory {
  title: string;
  level: number; // 0-3 for yellow, green, blue, purple
  cards: GameCard[];
  isFound?: boolean;
}

export interface GameData {
  id: string;
  print_date: string; // YYYY-MM-DD format
  categories: GameCategory[];
}

export interface GameGuess {
  cards: Array<{
    content: string;
    level: number;
  }>;
  correct: boolean;
}

export interface GameHistory {
  guesses: GameGuess[];
  solvedCategories: GameCategory[];
  InfiniteMode: boolean;
  cardPositions: number[];
  selectedCards: string[];
}

export interface GameState {
  gameData: GameData;
  selectedWords: string[];
  foundCategories: GameCategory[];
  mistakes: number;
  maxMistakes: number;
  isGameOver: boolean;
  isWon: boolean;
  gameMode: 'daily' | 'infinite';
  shuffleCount: number;
  startTime: Date;
  endTime?: Date;
}

export interface PuzzleData {
  id: string;
  title: string;
  date: string;
  categories: Array<{
    title: string;
    level: number;
    words: string[];
  }>;
  difficulty: 'easy' | 'medium' | 'hard';
  author?: string;
}

export interface GameStats {
  totalGames: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  averageGuesses: number;
  totalTime: number;
  winRate: number;
}

export type DifficultyLevel = 'yellow' | 'green' | 'blue' | 'purple';

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  yellow: '#f9df6d',
  green: '#a0c35a',
  blue: '#b0c4ef',
  purple: '#ba81c5'
};

export const DIFFICULTY_LEVELS: Record<number, DifficultyLevel> = {
  0: 'yellow',
  1: 'green',
  2: 'blue',
  3: 'purple'
};

export type GameAction =
  | { type: 'SELECT_WORD'; word: string }
  | { type: 'DESELECT_WORD'; word: string }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'SHUFFLE_WORDS' }
  | { type: 'RESET_GAME' }
  | { type: 'GAME_OVER'; isWon: boolean }
  | { type: 'FOUND_CATEGORY'; category: GameCategory };