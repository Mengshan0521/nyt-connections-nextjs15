'use client'

// 导入必要的模块和组件
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Globe } from 'lucide-react'

// 支持的语言列表
const languages = [
  { name: 'English', code: 'en', iso: 'en-US', dir: 'ltr' },
  { name: 'Deutsch', code: 'de', iso: 'de-DE', dir: 'ltr' },
  { name: 'español', code: 'es', iso: 'es-ES', dir: 'ltr' },
  { name: 'Français', code: 'fr', iso: 'fr-FR', dir: 'ltr' },
  { name: 'Italiano', code: 'it', iso: 'it-IT', dir: 'ltr' },
  { name: '日本語', code: 'ja', iso: 'ja-JP', dir: 'ltr' },
  { name: '한국인', code: 'ko', iso: 'ko-KR', dir: 'ltr' },
  { name: 'Português', code: 'pt', iso: 'pt-PT', dir: 'ltr' },
  { name: '中文', code: 'zh-cn', iso: 'zh-CN', dir: 'ltr' },
]

// 语言切换组件
export function LanguageToggle() {
  // 获取当前语言环境
  const locale = useLocale()
  // 获取路由器和当前路径
  const router = useRouter()
  const pathname = usePathname()
  // 控制下拉菜单是否打开的状态
  const [isOpen, setIsOpen] = useState(false)

  // 处理语言切换逻辑
  const handleLanguageChange = (newLocale: string) => {
    // 移除当前语言环境并添加新的语言环境
    const segments = pathname.split('/')
    const localeIndex = segments.findIndex(segment => 
      languages.some(lang => lang.code === segment)
    )
    
    let newPath
    if (localeIndex !== -1) {
      // 如果找到语言环境，则替换为新的语言环境
      segments[localeIndex] = newLocale
      newPath = segments.join('/')
    } else {
      // 如果没有找到语言环境，则在路径前添加新的语言环境
      newPath = `/${newLocale}${pathname}`
    }
    
    // 导航到新的路径
    router.push(newPath)
    // 关闭下拉菜单
    setIsOpen(false)
  }

  // 获取当前语言信息
  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <div className="relative">
      {/* 语言切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1"
        title="Change language"
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm font-medium">
          {currentLanguage?.name}
        </span>
      </button>
      
      {/* 语言选择下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  language.code === locale 
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {language.name}
              </button>
            ))}
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