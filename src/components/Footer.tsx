'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { headerNavLinks } from '@/i18n/routing'

export default function Footer() {
  const t = useTranslations('Footer')

  // Only show Blog, About, Privacy in footer
  const footerLinks = headerNavLinks.filter(link =>
    ['blog', 'about', 'privacy'].includes(link.title)
  )

  return (
    <footer className="border-t mt-16" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex justify-center space-x-6 text-sm mb-4">
            {footerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {t(link.title)}
              </Link>
            ))}
          </div>
          <p className="text-xs">{t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}