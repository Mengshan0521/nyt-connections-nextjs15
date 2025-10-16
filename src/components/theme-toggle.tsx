'use client'

// 导入必要的模块和组件
import { Moon, Sun, Monitor, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

// 主题选项定义
const themeOptions = [
  { value: 'light', icon: Sun, key: 'light' },
  { value: 'dark', icon: Moon, key: 'dark' },
  { value: 'system', icon: Monitor, key: 'system' }
] as const

// 主题切换组件
export function ThemeToggle() {
  // 获取当前主题和设置主题的方法
  const { theme, setTheme } = useTheme()
  // 控制组件是否已挂载的状态（防止服务端渲染时的水合错误）
  const [mounted, setMounted] = useState(false)
  // 控制下拉菜单是否打开的状态
  const [isOpen, setIsOpen] = useState(false)
  // 获取翻译函数
  const t = useTranslations('common')

  // 组件挂载后设置挂载状态
  useEffect(() => {
    setMounted(true)
  }, [])

  // 如果组件未挂载，返回null（防止服务端渲染时的水合错误）
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    )
  }

  // 处理主题切换逻辑
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  // 根据当前主题获取对应的图标
  const getCurrentIcon = () => {
    const currentOption = themeOptions.find(option => option.value === theme)
    if (!currentOption) return <Monitor className="h-5 w-5" />
    const IconComponent = currentOption.icon
    return <IconComponent className="h-5 w-5" />
  }

  // 获取当前主题的显示名称
  const getCurrentThemeName = () => {
    const currentOption = themeOptions.find(option => option.value === theme)
    return currentOption ? t(currentOption.key) : t('system')
  }

  return (
    <div className="relative">
      {/* 主题切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1"
        title={t('theme')}
        aria-label={`${t('theme')}: ${getCurrentThemeName()}`}
      >
        {getCurrentIcon()}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 主题选择下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {themeOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 ${
                    option.value === theme
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{t(option.key)}</span>
                  {option.value === theme && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 点击外部关闭下拉菜单的遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}