import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPosts } from '@/lib/postService'
import BlogServer from '@/components/BlogServer'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('BlogList')
  return {
    title: t('title') || 'Blog - NYT Connections',
    description: t('description') || 'Read hints and answers for NYT Connections puzzles',
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('BlogList')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* 主要内容 */}
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            {t('title') || 'Blog'}
          </h1>
          <BlogServer locale={locale} />
        </div>
      </main>
    </div>
  )
}