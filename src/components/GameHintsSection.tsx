'use client';

import React from 'react';
import { GameData } from '@/types/game';
import { useTranslations } from 'next-intl';

interface GameHintsSectionProps {
  gameData: GameData;
  additionalGames?: GameData[];
}

const GameHintsSection: React.FC<GameHintsSectionProps> = ({
  gameData,
  additionalGames = []
}) => {
  const t = useTranslations('GameBoard');

  // 格式化日期为显示格式 (如: "September 30, 2025")
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 渲染单个游戏提示卡片
  const renderGameHintCard = (game: GameData, index: number) => (
    <div key={`${game.print_date}-${index}`} className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-2 text-gray-900">
        NYT Connections Hint {formatDateForDisplay(game.print_date)}
      </h3>
      <div className="text-sm text-gray-500 mb-3">{game.print_date}</div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {game.categories.flatMap(cat =>
          cat.cards.map(card => card.content)
        ).map((word, wordIndex) => (
          <span key={wordIndex} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-medium">
            {word}
          </span>
        ))}
      </div>
      <p className="text-gray-600 text-sm">
        Join me for today's whimsical journey through words in our latest challenge!
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">🧠 Brain training games</span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">🎮 Puzzle game downloads</span>
      </div>
    </div>
  );

  return (
    <div className="border-t pt-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900">
        {t('GameHintsAnswers')}
      </h2>

      <div className="space-y-8">
        {/* 主游戏数据 */}
        {renderGameHintCard(gameData, 0)}

        {/* 额外的游戏数据 */}
        {additionalGames.map((game, index) => renderGameHintCard(game, index + 1))}
      </div>
    </div>
  );
};

export default GameHintsSection;
