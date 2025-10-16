'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { format, parse } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useFormatter } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface BlogListProps {
  posts: any[]
  locale: string
}

const BlogList: React.FC<BlogListProps> = ({ posts, locale }) => {
  const t = useTranslations('BlogList')
  const formatter = useFormatter()

  const item = {
    hidden: { opacity: 0, x: -25 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        animate="show"
        className="space-y-8"
        variants={item}
      >
        {posts.map((p) => {
          const { post_date, id, description } = p
          return (
            <motion.article
              key={post_date}
              variants={item}
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
            >
              <dl className="grid  gap-4">
                <dt className="sr-only">{`NYT Connections Hint ${post_date}`}</dt>
               

                  <div className="space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link
                          href={`/blog/NYT-Connections-Hint-${format(
                                          parse(post_date, 'yyyy-MM-dd', new Date()),
                                          'MMMM-dd-yyyy'
                                        )}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          <span>{`NYT Connections Hint ${formatDateWithIntl(post_date, locale)}`}</span>
                        </Link>
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-sm font-medium px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: 'var(--hover-bg)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {description!.length > 149
                        ? `${description!.substring(0, 149)}...`
                        : description}
                    </div>
                  </div>
              </dl>
            </motion.article>
          )
        })}
      </motion.div>
    </div>
  )
}

function formatDateWithIntl(dateString: string, locale: string): string {
  try {
    const date = parse(dateString, 'yyyy-MM-dd', new Date())
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return formatter.format(date)
  } catch {
    return dateString
  }
}

export default BlogList