'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { localeUtils } from '@/i18n/routing'
import { motion } from 'framer-motion'

interface NavigationProps {
  className?: string
  variant?: 'header' | 'footer' | 'mobile'
}

export function Navigation({ className = '', variant = 'header' }: NavigationProps) {
  const t = useTranslations('Header')
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const navItems = [
    { title: t('home'), href: '/' },
    { title: t('blog'), href: '/blog' },
    { title: t('about'), href: '/about' },
    { title: t('privacy'), href: '/privacy' }
  ]

  const mobileNavItems = [
    { title: t('home'), href: '/' },
    { title: t('blog'), href: '/blog' },
    { title: t('about'), href: '/about' },
    { title: t('privacy'), href: '/privacy' }
  ]

  const isActive = (href: string) => {
    // Extract locale from current path
    const currentLocale = localeUtils.extractLocaleFromPath(pathname)
    const currentPath = currentLocale ? pathname.replace(`/${currentLocale}`, '') : pathname
    
    // Remove locale from href for comparison
    const targetPath = href.replace(/^\//, '')
    
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
  }

  const renderNavItems = (items: Array<{ title: string; href: string }>) => {
    return items.map((item) => (
      <motion.div
        key={item.href}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href={item.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive(item.href)
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          }`}
        >
          {item.title}
        </Link>
      </motion.div>
    ))
  }

  if (variant === 'mobile') {
    return (
      <nav className={`space-y-2 ${className}`}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
        >
          <span className="text-lg font-semibold">Menu</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isMobileMenuOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {renderNavItems(mobileNavItems)}
          </motion.div>
        )}
      </nav>
    )
  }

  return (
    <nav className={`${className}`}>
      {variant === 'header' ? (
        <div className="flex items-center space-x-4">
          {renderNavItems(navItems)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderNavItems(navItems)}
        </div>
      )}
    </nav>
  )
}

// Breadcrumb component for better navigation
export function Breadcrumb({ items }: { items: Array<{ title: string; href?: string }> }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400">/</span>
          )}
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-900 dark:hover:text-white">
              {item.title}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Language switcher component
export function LanguageSwitcher() {
  const t = useTranslations('Header')
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = React.useState(routing.defaultLocale)

  React.useEffect(() => {
    const locale = localeUtils.extractLocaleFromPath(pathname)
    if (locale) {
      setCurrentLocale(locale)
    }
  }, [pathname])

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return
    
    const currentPath = pathname.replace(`/${currentLocale}`, '')
    const newPath = `/${newLocale}${currentPath}`
    window.location.href = newPath
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Language:</span>
      <select
        value={currentLocale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}