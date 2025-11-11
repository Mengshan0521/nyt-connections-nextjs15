'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameCategory, WordTile, Puzzle } from '@/types/game';

interface GameStore {
  gameState: GameState | null;
  currentPuzzle: Puzzle | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGameState: (gameState: GameState) => void;
  setCurrentPuzzle: (puzzle: Puzzle) => void;
  selectWord: (wordId: string) => void;
  deselectWord: (wordId: string) => void;
  submitGuess: () => void;
  shuffleWords: () => void;
  resetGame: () => void;
  startNewGame: (puzzle: Puzzle, gameMode: 'daily' | 'infinite') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const createInitialGameState = (puzzle: Puzzle, gameMode: 'daily' | 'infinite'): GameState => {
  const words: WordTile[] = puzzle.categories.flatMap((category, categoryIndex) =>
    category.cards.map((card, cardIndex) => ({
      id: `${categoryIndex}-${cardIndex}`,
      text: card.content,
      isSelected: false,
      isFound: false,
      groupId: category.title,
    }))
  );

  // Shuffle words for the game
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  return {
    id: `game-${Date.now()}`,
    puzzleId: puzzle.id,
    selectedWords: [],
    foundCategories: [],
    mistakes: 0,
    maxMistakes: 4,
    isGameOver: false,
    isWon: false,
    words: shuffledWords,
    categories: puzzle.categories.map(cat => ({ ...cat, isFound: false })),
    gameMode,
    shuffleCount: 0,
    startTime: new Date(),
  };
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      currentPuzzle: null,
      isLoading: false,
      error: null,

      setGameState: (gameState) => set({ gameState }),

      setCurrentPuzzle: (puzzle) => set({ currentPuzzle: puzzle }),

      selectWord: (wordId) => {
        const state = get();
        if (!state.gameState || state.gameState.isGameOver) return;

        const selectedWords = state.gameState.selectedWords;
        if (selectedWords.length >= 4) return;

        const updatedWords = state.gameState.words.map(word =>
          word.id === wordId ? { ...word, isSelected: true } : word
        );

        set({
          gameState: {
            ...state.gameState,
            words: updatedWords,
            selectedWords: [...selectedWords, wordId],
          },
        });
      },

      deselectWord: (wordId) => {
        const state = get();
        if (!state.gameState) return;

        const updatedWords = state.gameState.words.map(word =>
          word.id === wordId ? { ...word, isSelected: false } : word
        );

        set({
          gameState: {
            ...state.gameState,
            words: updatedWords,
            selectedWords: state.gameState.selectedWords.filter(id => id !== wordId),
          },
        });
      },

      submitGuess: () => {
        const state = get();
        if (!state.gameState || state.gameState.selectedWords.length !== 4) return;

        const { selectedWords, words, categories, mistakes, maxMistakes } = state.gameState;

        // Get the selected word texts
        const selectedWordTexts = selectedWords
          .map(id => words.find(w => w.id === id)?.text)
          .filter(Boolean) as string[];

        // Check if the selected words form a valid category
        const foundCategory = categories.find(category =>
          category.cards.every(card => selectedWordTexts.includes(card.content)) &&
          category.cards.length === selectedWordTexts.length
        );

        if (foundCategory && !state.gameState.foundCategories.includes(foundCategory.title)) {
          // Correct guess
          const updatedCategories = categories.map(cat =>
            cat.title === foundCategory.title ? { ...cat, isFound: true } : cat
          );

          const updatedWords = words.map(word =>
            selectedWords.includes(word.id) ? { ...word, isFound: true, isSelected: false } : word
          );

          const foundCategories = [...state.gameState.foundCategories, foundCategory.title];
          const isWon = foundCategories.length === categories.length;

          set({
            gameState: {
              ...state.gameState,
              words: updatedWords,
              categories: updatedCategories,
              foundCategories,
              selectedWords: [],
              isGameOver: isWon,
              isWon,
              endTime: isWon ? new Date() : undefined,
            },
          });
        } else {
          // Wrong guess
          const newMistakes = mistakes + 1;
          const isGameOver = newMistakes >= maxMistakes;

          const updatedWords = words.map(word =>
            selectedWords.includes(word.id) ? { ...word, isSelected: false } : word
          );

          set({
            gameState: {
              ...state.gameState,
              words: updatedWords,
              selectedWords: [],
              mistakes: newMistakes,
              isGameOver,
              endTime: isGameOver ? new Date() : undefined,
            },
          });
        }
      },

      shuffleWords: () => {
        const state = get();
        if (!state.gameState) return;

        const unfoundWords = state.gameState.words.filter(word => !word.isFound);
        const foundWords = state.gameState.words.filter(word => word.isFound);

        const shuffledUnfound = [...unfoundWords].sort(() => Math.random() - 0.5);
        const shuffledWords = [...shuffledUnfound, ...foundWords];

        set({
          gameState: {
            ...state.gameState,
            words: shuffledWords,
            shuffleCount: state.gameState.shuffleCount + 1,
          },
        });
      },

      resetGame: () => {
        const state = get();
        if (!state.currentPuzzle) return;

        const newGameState = createInitialGameState(state.currentPuzzle, state.gameState?.gameMode || 'daily');
        set({ gameState: newGameState, error: null });
      },

      startNewGame: (puzzle: Puzzle, gameMode: 'daily' | 'infinite') => {
        const newGameState = createInitialGameState(puzzle, gameMode);
        set({ 
          gameState: newGameState, 
          currentPuzzle: puzzle, 
          error: null 
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        gameState: state.gameState,
        currentPuzzle: state.currentPuzzle,
      }),
    }
  )
);