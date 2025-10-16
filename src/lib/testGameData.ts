// src/lib/testGameData.ts
import { GameData } from '@/types/game'

// 基于参考网站的真实NYT Connections数据
export const testGameData: { gameData: GameData } = {
  gameData: {
    id: '1',
    print_date: '2025-09-30',
    categories: [
      {
        title: 'STIFF AND UNNATURAL',
        level: 0, // yellow - easiest
        cards: [
          { content: 'AWKWARD', position: 12 },
          { content: 'STIFF', position: 7 },
          { content: 'STILTED', position: 15 },
          { content: 'WOODEN', position: 9 }
        ]
      },
      {
        title: 'CHUCK ___',
        level: 1, // green
        cards: [
          { content: 'BERRY', position: 3 },
          { content: 'NORRIS', position: 11 },
          { content: 'ROAST', position: 14 },
          { content: 'TAYLOR', position: 6 }
        ]
      },
      {
        title: 'WORDS BEFORE "WOOD"',
        level: 2, // blue
        cards: [
          { content: 'DRIFT', position: 2 },
          { content: 'HARD', position: 5 },
          { content: 'KNOCK', position: 8 },
          { content: 'SANDAL', position: 13 }
        ]
      },
      {
        title: 'WOODY ___',
        level: 3, // purple - hardest
        cards: [
          { content: 'ALLEN', position: 0 },
          { content: 'GUTHRIE', position: 1 },
          { content: 'HARRELSON', position: 4 },
          { content: 'WOODPECKER', position: 10 }
        ]
      }
    ]
  }
}

// 额外的测试数据用于演示
export const alternateTestGameData: { gameData: GameData } = {
  gameData: {
    id: '2',
    print_date: '2025-09-29',
    categories: [
      {
        title: 'TYPES OF UNDERWEAR',
        level: 0,
        cards: [
          { content: 'BOXER', position: 8 },
          { content: 'BRIEF', position: 13 },
          { content: 'HIPSTER', position: 7 },
          { content: 'THONG', position: 15 }
        ]
      },
      {
        title: 'LED ZEPPELIN SONGS',
        level: 1,
        cards: [
          { content: 'BOHEMIAN', position: 4 },
          { content: 'HOTEL', position: 2 },
          { content: 'PUNK', position: 1 },
          { content: 'STAIRWAY', position: 3 }
        ]
      },
      {
        title: 'DEAL WITH, AS A PROBLEM',
        level: 2,
        cards: [
          { content: 'HANDLE', position: 6 },
          { content: 'MANAGE', position: 9 },
          { content: 'TACKLE', position: 11 },
          { content: 'TREAT', position: 12 }
        ]
      },
      {
        title: 'APRIL ___',
        level: 3,
        cards: [
          { content: 'FOOL', position: 10 },
          { content: 'PRANK', position: 14 },
          { content: 'SHOWER', position: 0 },
          { content: 'TRICK', position: 5 }
        ]
      }
    ]
  }
}

export function getTestGameData(): { gameData: GameData } {
  // 基于当前日期返回确定的测试数据，确保在同一天内数据一致
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % 2 === 0 ? testGameData : alternateTestGameData;
}