import { notFound } from 'next/navigation';
import { format, parse } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import { queryPost } from '@/lib/postService';
import BackButton from '@/components/BackButton';
import AnswersToggle from '@/components/AnswersToggle';
import { formatDateWithIntl } from '@/components/util/DateUtils';
import { generateMetadata as genMeta } from '@/config/seo';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ISR: 24小时后过期并重新生成
export const revalidate = 86400; // 24 hours in seconds

// 允许动态参数（按需生成，不预渲染）
export const dynamicParams = true;

/**
 * 生成博客页面的SEO元数据
 */
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  // 从 slug 提取日期：NYT-Connections-Hint-October-02-2025 → 2025-10-02
  const dateMatch = slug.match(/NYT-Connections-Hint-(.+)-(\d{2})-(\d{4})$/);
  if (!dateMatch) {
    return genMeta('Blog Post Not Found', 'The requested blog post could not be found.', locale);
  }

  const [_, monthName, day, year] = dateMatch;
  const dateStr = `${monthName} ${day}, ${year}`;
  const dateObj = parse(dateStr, 'MMMM dd, yyyy', new Date());
  const postDate = format(dateObj, 'yyyy-MM-dd');

  const formattedDate = format(dateObj, 'MMMM dd, yyyy');

  return genMeta(
    `NYT Connections Hint - ${formattedDate}`,
    `Word explanations and answers for the NYT Connections puzzle from ${formattedDate}.`,
    `/blog/${slug}`,
    locale,
    postDate,
    'word game'
  );
}

// Server Component - ISR (按需生成)
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('BlogPost');

  // 从 slug 提取日期：NYT-Connections-Hint-October-02-2025 → 2025-10-02
  const dateMatch = slug.match(/NYT-Connections-Hint-(.+)-(\d{2})-(\d{4})$/);
  if (!dateMatch) {
    notFound();
  }

  const [_, monthName, day, year] = dateMatch;
  const dateStr = `${monthName} ${day}, ${year}`;
  const dateObj = parse(dateStr, 'MMMM dd, yyyy', new Date());
  const postDate = format(dateObj, 'yyyy-MM-dd');

  // 服务端获取数据
  const post = await queryPost(locale, postDate);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <BackButton />

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 style={{ color: 'var(--text-primary)' }}>
          {t('title', { date: formatDateWithIntl(dateObj, locale) })}
        </h1>

        <div className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Published on {formatDateWithIntl(dateObj, locale)}
        </div>

        <div className="mb-8">
          <h2 style={{ color: 'var(--text-primary)' }}>{t('wordExplanations')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{post.description}</p>
        </div>

        <div className="mb-8">
          <h2 style={{ color: 'var(--text-primary)' }}>{t('themeHints')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {post.groups?.map((group, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Category {index + 1}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {Array.isArray(group.categories)
                    ? group.categories.join(', ')
                    : group.categories}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 style={{ color: 'var(--text-primary)' }}>{t('wordExplanations')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {post.words?.map((word, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                }}
              >
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {word.word}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {word.explain}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 style={{ color: 'var(--text-primary)' }}>{t('themeHints')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {post.groups?.[0]?.hint_explanation}
          </p>
        </div>

        {/* Client Component - 交互式答案切换 */}
        <AnswersToggle answersExplanation={post.groups?.[0]?.answers_explanation} />

        {post.conclusion_paragraph && (
          <div className="mt-8">
            <h2 style={{ color: 'var(--text-primary)' }}>Conclusion</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{post.conclusion_paragraph}</p>
          </div>
        )}
      </article>
    </div>
  );
}