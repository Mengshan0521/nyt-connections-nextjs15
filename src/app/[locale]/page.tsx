import { Metadata } from 'next';
import GameBoard from '@/components/GameBoard';
import BlogPostsList from '@/components/BlogPostsList';
import { generateMetadata as genMeta } from '@/config/seo';
import { getGameData } from '@/lib/gameDataService';
import { getPosts } from '@/lib/postService';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  return genMeta(
    'NYT Connections Game',
    'Play the daily word categorization puzzle game',
    locale,
    undefined
  );
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('home');

  // 获取游戏数据和博客文章
  const gameDataResponse = await getGameData();
  const { posts } = await getPosts(1, 5, locale);

  return (
    <>
      {/* Connections Hints 标题 */}
      <h1 className="text-center my-8 text-3xl font-extrabold leading-9 tracking-tight text-heading-400 dark:text-heading-400 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        Connections Hints
      </h1>
      <h2 className="text-center text-3xl my-8 text-gray-700 dark:text-gray-300">
        {t('slogan')}
      </h2>



      {/* 游戏板 */}
      {gameDataResponse ? (
        <GameBoard gameData={gameDataResponse.gameData} />
      ) : (
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Loading Game...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Game data is not available at the moment.
            </p>
          </div>
        </div>
      )}

      {/* 博客文章列表 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Game Hints & Answers
        </h2>
        <BlogPostsList posts={posts} locale={locale} />
      </div>
    </>
  );
}