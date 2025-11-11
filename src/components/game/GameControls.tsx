'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface GameControlsProps {
  canSubmit: boolean;
  canClear: boolean;
  mistakes: number;
  isInfiniteMode: boolean;
  onShuffle: () => void;
  onClear: () => void;
  onSubmit: () => void;
}

/**
 * 游戏控制按钮组件
 * 只负责渲染Shuffle、Clear、Submit按钮
 */
export const GameControls: React.FC<GameControlsProps> = ({
  canSubmit,
  canClear,
  mistakes,
  isInfiniteMode,
  onShuffle,
  onClear,
  onSubmit
}) => {
  const t = useTranslations('GameBoard');

  return (
    <div className="text-center space-y-4 max-w-2xl mx-auto">
      <div className="mb-2 sm:mb-0">
        <span>
          {t('MistakesRemaining')}: <strong>{isInfiniteMode ? '∞' : mistakes}</strong>
        </span>
      </div>

      <div className="flex justify-center space-x-3">
        <button
          onClick={onShuffle}
          className="bg-white border border-black text-black h-12 rounded-[32px] px-4 w-auto text-sm sm:text-base whitespace-nowrap"
        >
          {t('Shuffle')}
        </button>

        <button
          onClick={onClear}
          disabled={!canClear}
          className={`
            h-12 rounded-[32px] px-4 w-auto text-sm sm:text-base whitespace-nowrap border
            ${canClear
              ? "text-black border-black bg-white"
              : "text-[#7f7f7f] border-[#7f7f7f] bg-white"
            }
          `}
        >
          {t('DeselectAll')}
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`
            h-12 rounded-[32px] px-4 w-auto text-sm sm:text-base whitespace-nowrap border
            ${canSubmit
              ? "text-black border-black bg-white"
              : "text-[#7f7f7f] border-[#7f7f7f] bg-white"
            }
          `}
        >
          {t('Submit')}
        </button>
      </div>
    </div>
  );
};

export default GameControls;
