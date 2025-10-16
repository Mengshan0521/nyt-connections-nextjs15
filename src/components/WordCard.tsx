'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface WordCardProps {
  content: string;
  isSelected: boolean;
  onClick: () => void;
  isShaking: boolean;
}

const WordCard: React.FC<WordCardProps> = React.memo(({
  content,
  isSelected,
  onClick,
  isShaking,
}) => {
  const contentRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(16);

  // 检查文本是否溢出并动态调整字体大小
  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      let currentFontSize = 16; // 重置为初始字体大小
      element.style.fontSize = `${currentFontSize}px`;

      // 如果文本溢出，逐步减小字体直到适应容器（最小 8px）
      while (element.scrollWidth > element.offsetWidth && currentFontSize > 8) {
        currentFontSize--;
        element.style.fontSize = `${currentFontSize}px`;
      }

      setFontSize(currentFontSize);
    }
  }, []);

  // 在内容变化和窗口大小变化时检查溢出
  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [content, checkOverflow]);

  return (
    <motion.button
      onClick={onClick}
      className={`
        h-16 sm:h-20 rounded shadow-sm
        px-2 py-1 flex items-center justify-center
        transition-colors duration-300
        ${isSelected ? 'bg-[#5a594e] text-white' : 'bg-[#efefe6] text-black'}
        ${isShaking ? 'animate-pulse' : ''}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isShaking ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <span
        ref={contentRef}
        className="inline-block w-full text-center font-semibold transition-opacity duration-300 ease-in-out"
        style={{ fontSize: `${fontSize}px` }}
      >
        {content}
      </span>
    </motion.button>
  );
});

WordCard.displayName = 'WordCard';

export default WordCard;
