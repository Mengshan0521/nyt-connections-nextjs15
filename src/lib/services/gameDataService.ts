// src/lib/services/gameDataService.ts
// 负责：1) 从缓存获取数据 2) 更新缓存
// 不负责：数据转换、API调用

import { createClient } from '@/lib/supabase/server';
import { TABLES } from '@/lib/supabase';
import { nytApiClient } from './nytApiClient';
import { transformGameData } from './dataTransformer';
import { getTestGameData } from '@/lib/testGameData';

export interface GameDataResponse {
  date: string;
  gameData: any; // 转换后的数据
}

/**
 * 获取游戏数据
 * 1. 先从Supabase缓存获取
 * 2. 如果没有，调用NYT API
 * 3. 更新缓存
 * 4. 返回转换后的数据
 */
export async function getGameData(date?: string): Promise<GameDataResponse | null> {
  const formattedDate = date || getCurrentDateFormatted();

  try {
    const supabase = await createClient();

    // 1. 先从缓存获取
    const { data: cachedData, error: cacheError } = await supabase
      .from(TABLES.GAME_DATA)
      .select('date, gameData')
      .eq('date', formattedDate)
      .single();

    if (cachedData) {
      // 缓存中有数据，直接转换并返回
      return transformGameData(cachedData.gameData, cachedData.date);
    }

    if (cacheError && cacheError.code !== 'PGRST116') {
      // 数据库错误但不是"没有记录"错误
      console.error('Error fetching from cache:', cacheError);
      return null;
    }

    // 2. 缓存中没有，从NYT API获取
    console.log(`No cached data for ${formattedDate}, fetching from NYT API...`);
    const freshData = await nytApiClient.fetchGameData(formattedDate);

    if (freshData) {
      // 3. 更新缓存（只读模式下可以跳过这一步）
      try {
        await supabase
          .from(TABLES.GAME_DATA)
          .insert({
            date: formattedDate,
            gameData: freshData
          });
      } catch (insertError) {
        // 插入失败不影响返回数据
        console.warn('Failed to update cache:', insertError);
      }

      // 4. 转换并返回数据
      return transformGameData(freshData, formattedDate);
    }

    // 5. API也失败了，返回测试数据
    console.warn('Using fallback test data');
    const testData = getTestGameData();
    return {
      date: formattedDate,
      gameData: testData.gameData
    };

  } catch (error) {
    console.error('Error in getGameData:', error);
    // 即使出错也返回测试数据，保证游戏可玩
    console.warn('Using fallback test data due to error');
    const testData = getTestGameData();
    return {
      date: formattedDate,
      gameData: testData.gameData
    };
  }
}

/**
 * 获取当前日期（UTC+12时区）
 */
function getCurrentDateFormatted(): string {
  const dateInTimeZone = new Date().toLocaleString("en-US", {
    timeZone: "Pacific/Auckland",
  });
  const date = new Date(dateInTimeZone);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
