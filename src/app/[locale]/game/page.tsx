import { Metadata } from 'next';
import GameBoard from '@/components/GameBoard';
import { generateMetadata as genMeta } from '@/config/seo';
import { getGameData } from '@/lib/gameDataService';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  return genMeta(
    'NYT Connections Game - Today',
    'Play today\'s NYT Connections word puzzle game. Find groups of four words that share something in common.',
    locale,
    '/game'
  );
}

export default async function TodaysGamePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  // 获取今日游戏数据
  const gameDataResponse = await getGameData();

  if (!gameDataResponse) {
    notFound();
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-center my-8 text-3xl font-extrabold leading-9 tracking-tight text-heading-400 dark:text-heading-400 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        Connections - Today&apos;s Game
      </h1>

      <GameBoard gameData={gameDataResponse.gameData} />
    </div>
  );
}
