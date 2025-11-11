'use client';

import React from 'react';
import WordCard from '@/components/WordCard';

interface GameGridProps {
  words: string[];
  selectedWords: string[];
  isShaking: boolean;
  onWordSelect: (word: string) => void;
  disabled?: boolean;
}

/**
 * 4x4单词网格组件
 * 只负责渲染单词网格和点击交互
 */
export const GameGrid: React.FC<GameGridProps> = ({
  words,
  selectedWords,
  isShaking,
  onWordSelect,
  disabled = false
}) => {
  if (disabled) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-2 mb-6 max-w-2xl mx-auto">
      {words.map((word) => (
        <WordCard
          key={word}
          content={word}
          isSelected={selectedWords.includes(word)}
          onClick={() => onWordSelect(word)}
          isShaking={isShaking && selectedWords.includes(word)}
        />
      ))}
    </div>
  );
};

export default GameGrid;
