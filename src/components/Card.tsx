'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'

// 定义Card组件的props接口
interface CardProps {
  content: string // 卡片内容
  isSelected: boolean // 是否被选中
  onClick: () => void // 点击事件处理函数
  isShaking: boolean // 是否正在抖动
  isFound?: boolean // 是否已找到（为了兼容性保留）
}

const Card: React.FC<CardProps> = React.memo(({
  content,
  isSelected,
  onClick,
  isShaking,
  isFound = false,
}) => {
  const contentRef = useRef<HTMLSpanElement>(null) // 卡片内容的引用
  const [fontSize, setFontSize] = useState(16) // 默认字体大小

  // 检查文本是否溢出并调整字体大小
  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      const element = contentRef.current
      let currentFontSize = fontSize
      element.style.fontSize = `${currentFontSize}px`

      while (element.scrollWidth > element.offsetWidth && currentFontSize > 8) {
        currentFontSize--
        element.style.fontSize = `${currentFontSize}px`
      }

      setFontSize(currentFontSize)
    }
  }, [fontSize]);

  // 在组件挂载和窗口大小变化时检查文本是否溢出
  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [content, checkOverflow]);

  return (
    <button
      className={`
        w-full h-[60px] sm:w-[150px] sm:h-[80px] rounded-[6px]
        p-2 sm:p-4 text-center font-bold
        ${isSelected ? 'bg-[#5a594e] text-white' : 'bg-[#efefe6] text-black'}
        transition-colors duration-300 ease-in-out
        ${isShaking ? 'animate-shake' : ''}
      `}
      onClick={onClick}
      disabled={isFound}
    >
      <span
        ref={contentRef}
        className={`
          inline-block w-full transition-opacity duration-300 ease-in-out
          opacity-100
        `}
        style={{ fontSize: `${fontSize}px` }}
      >
        {content}
      </span>
    </button>
  )
})

Card.displayName = 'Card';

export default Card;