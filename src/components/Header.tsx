'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { headerNavLinks } from '@/i18n/routing'

interface HeaderProps {
  title?: string
  showBackToHome?: boolean
}

export default function Header({ title, showBackToHome = false }: HeaderProps) {
  const t = useTranslations('Header')
  const pathname = usePathname()

  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label={t(`headerTitle`)}
            prefetch={true}
          >
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <Image src="/logo.svg" alt="Connections Logo" width={40} height={40} />
              </div>
              {typeof t(`headerTitle`) === "string" ? (
                <div className="hidden h-6 text-2xl font-semibold sm:block">
                  {t(`headerTitle`)}
                </div>
              ) : (
                t(`headerTitle`)
              )}
            </div>
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-4">
              {headerNavLinks
                .filter(link => link.href !== '/')
                .map(link => {
                  const isActive = pathname === link.href || pathname?.startsWith(`/${link.title}`)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      className={`text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      {t(link.title)}
                    </Link>
                  )
                })}
            </nav>
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}