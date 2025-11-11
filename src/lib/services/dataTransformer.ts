// src/lib/services/dataTransformer.ts
// 负责：数据格式转换
// 不负责：API调用、缓存

import { GameData, GameCategory } from '@/types/game';
import { GameDataResponse } from './gameDataService';

// Supabase中存储的原始数据格式
interface RawGameData {
  status: string;
  id: number;
  print_date: string;
  editor: string;
  categories: Array<{
    title: string;
    cards: Array<{
      content: string;
      position: number;
    }>;
  }>;
}

/**
 * 转换游戏数据格式
 * 从: Supabase原始格式 / NYT API格式
 * 到: 前端使用的GameData格式
 */
export function transformGameData(rawData: RawGameData, date: string): GameDataResponse {
  // 转换categories，添加level字段
  // 0-3 对应 yellow, green, blue, purple
  const processedCategories: GameCategory[] = rawData.categories.map(
    (category, index) => ({
      title: category.title,
      level: index,
      cards: category.cards.map((card) => ({
        content: card.content,
        position: card.position,
      })),
    })
  );

  return {
    date,
    gameData: {
      id: rawData.id.toString(),
      print_date: rawData.print_date,
      categories: processedCategories,
    },
  };
}

/**
 * 验证游戏数据完整性
 */
export function validateGameData(data: any): data is RawGameData {
  if (!data) return false;
  if (!Array.isArray(data.categories)) return false;
  if (data.categories.length !== 4) return false; // Connections游戏总是4个类别

  for (const category of data.categories) {
    if (!category.title) return false;
    if (!Array.isArray(category.cards)) return false;
    if (category.cards.length !== 4) return false; // 每个类别4个单词

    for (const card of category.cards) {
      if (!card.content) return false;
      if (typeof card.position !== 'number') return false;
    }
  }

  return true;
}
