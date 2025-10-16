// src/lib/gameDataService.ts
import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/supabase'
import { GameData, GameCategory } from '@/types/game'
import { format, parse } from 'date-fns'

// 游戏数据响应接口
export interface ConnectionsGameData {
  date: string
  gameData: GameData
}

// Supabase 中存储的原始数据格式
interface RawGameData {
  status: string
  id: number
  print_date: string
  editor: string
  categories: Array<{
    title: string
    cards: Array<{
      content: string
      position: number
    }>
  }>
}

// 计算到 UTC 次日 0 点的秒数
function getSecondsUntilNextUTCMidnight(): number {
  const now = new Date()
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ))
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000)
}

/**
 * 获取游戏数据
 * @param date - 可选的日期参数 (YYYY-MM-DD 格式)
 * @returns 游戏数据或 null
 */
export async function getGameData(
  date?: string
): Promise<ConnectionsGameData | null> {
  // 计算日期
  let formattedDate: string

  // 处理日期参数
  if (date && parse(date, 'yyyy-MM-dd', new Date())) {
    formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
  } else {
    formattedDate = getCurrentUTCDateFormatted()
  }

  try {
    // 从 Supabase 获取数据
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLES.GAME_DATA)
      .select('date, gameData')
      .eq('date', formattedDate)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到记录，尝试从 NYT API 获取并插入
        console.log(`No game data found for ${formattedDate}, fetching from NYT API...`)
        return await fetchAndInsertNewGameData(formattedDate)
      } else {
        console.error('Error fetching game data from Supabase:', error)
        return null
      }
    }

    // 处理并转换数据
    return processGameData(data.gameData, data.date)
  } catch (error) {
    console.error('Error in getGameData:', error)
    return null
  }
}

/**
 * 处理游戏数据，转换为前端需要的格式
 */
function processGameData(rawGameData: RawGameData, date: string): ConnectionsGameData {
  // 转换 categories 数据，添加 level 字段
  const processedCategories: GameCategory[] = rawGameData.categories.map(
    (category, index) => ({
      title: category.title,
      level: index, // 0-3 对应 yellow, green, blue, purple
      cards: category.cards.map((card) => ({
        content: card.content,
        position: card.position,
      })),
    })
  )

  return {
    date,
    gameData: {
      id: rawGameData.id.toString(),
      print_date: rawGameData.print_date,
      categories: processedCategories,
    },
  }
}

/**
 * 从 NYT API 获取数据并插入到 Supabase
 * 注意：这是只读模式，实际上不应该执行 INSERT 操作
 * 在生产环境中，应该由管理员提前插入数据
 */
async function fetchAndInsertNewGameData(
  date: string
): Promise<ConnectionsGameData | null> {
  try {
    // 从 NYT API 获取数据
    const response = await fetch(
      `https://www.nytimes.com/svc/connections/v2/${date}.json`
    )

    if (!response.ok) {
      console.error(`NYT API returned ${response.status} for date ${date}`)
      return null
    }

    const nytData: RawGameData = await response.json()

    // ⚠️ 警告：这里会执行 INSERT 操作
    // 在真正的只读模式下，应该删除此段代码或返回 null
    // 目前保留是为了开发方便
    console.warn('⚠️ Attempting to insert data into production database')

    const supabase = await createClient()
    const newGameData = {
      date,
      gameData: nytData,
    }

    const { data, error } = await supabase
      .from(TABLES.GAME_DATA)
      .insert(newGameData)
      .select()
      .single()

    if (error) {
      console.error('Error inserting new game data:', error)
      // 即使插入失败，也返回从 NYT API 获取的数据
      return processGameData(nytData, date)
    }

    // 处理并返回数据
    return processGameData(data.gameData as RawGameData, data.date)
  } catch (error) {
    console.error('Error fetching from NYT API:', error)
    return null
  }
}

/**
 * 获取当前 UTC 日期的格式化字符串 (YYYY-MM-DD)
 */
function getCurrentUTCDateFormatted(): string {
  // 获取东十二区的当前时间（UTC+12:00）,全球最早的时间
  const dateInTimeZone = new Date().toLocaleString("en-US", {
    timeZone: "Pacific/Auckland",
  });

  // 将日期字符串转换为 Date 对象
  const date = new Date(dateInTimeZone);

  return format(date, "yyyy-MM-dd");
}
