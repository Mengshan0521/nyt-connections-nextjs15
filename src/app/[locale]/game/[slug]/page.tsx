import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format, parse, isValid } from 'date-fns';
import { Suspense } from 'react';
import GameBoard from '@/components/GameBoard';
import GameSkeleton from '@/components/skeletons/GameSkeleton';
import { generateMetadata as genMeta } from '@/config/seo';
import { getGameData } from '@/lib/services/gameDataService';
import { getTranslations } from 'next-intl/server';

interface GameParams {
  locale: string;
  slug: string;
}

/**
 * 从 slug 中提取日期
 * 支持格式：YYYY-MM-DD, YYYY/MM/DD, 或任何 Date 可解析的格式
 */
function extractDateFromSlug(slug: string): string | null {
  try {
    // 解码 URL 编码的 slug
    const decodedSlug = decodeURIComponent(slug);

    // 尝试直接解析为日期
    const dateObj = new Date(decodedSlug);

    if (isNaN(dateObj.getTime())) {
      return null;
    }

    // 返回 YYYY-MM-DD 格式
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    return null;
  }
}

/**
 * 获取当前 UTC 日期（使用 Auckland 时区，全球最早时间）
 */
function getCurrentUTCDateFormatted(): string {
  const dateInTimeZone = new Date().toLocaleString('en-US', {
    timeZone: 'Pacific/Auckland',
  });
  const date = new Date(dateInTimeZone);
  return format(date, 'yyyy-MM-dd');
}

export async function generateMetadata({
  params
}: {
  params: Promise<GameParams>
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const date = extractDateFromSlug(slug);

  if (!date) {
    return genMeta(
      'Game Not Found',
      'The requested game could not be found.',
      locale
    );
  }

  const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy');

  return genMeta(
    `NYT Connections - ${formattedDate}`,
    `Play the NYT Connections word puzzle game from ${formattedDate}. Find groups of four words that share something in common.`,
    `/game/${slug}`,
    locale,
    date
  );
}

export default async function GameArchivePage({
  params
}: {
  params: Promise<GameParams>
}) {
  const { locale, slug } = await params;
  const date = extractDateFromSlug(slug);

  // 验证日期有效性
  if (!date) {
    notFound();
  }

  // 不允许访问未来的日期
  const today = getCurrentUTCDateFormatted();
  if (new Date(date) > new Date(today)) {
    notFound();
  }

  // 获取指定日期的游戏数据
  const gameDataResponse = await getGameData(date);

  if (!gameDataResponse) {
    notFound();
  }

  const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-center my-8 text-3xl font-extrabold leading-9 tracking-tight text-heading-400 dark:text-heading-400 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        Connections - {formattedDate}
      </h1>

      <Suspense fallback={<GameSkeleton />}>
        <GameBoard gameData={gameDataResponse.gameData} />
      </Suspense>
    </div>
  );
}
