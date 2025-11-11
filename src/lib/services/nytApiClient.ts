// src/lib/services/nytApiClient.ts
// 负责：NYT API调用
// 不负责：缓存、转换

/**
 * NYT API客户端
 */
export const nytApiClient = {
  /**
   * 从NYT API获取游戏数据
   * @param date 日期，格式：YYYY-MM-DD
   * @returns 原始游戏数据或null
   */
  async fetchGameData(date: string): Promise<any | null> {
    try {
      // NYT API 数据每天更新一次，使用增量静态再生成
      const response = await fetch(
        `https://www.nytimes.com/svc/connections/v2/${date}.json`,
        {
          next: { revalidate: 86400 } // 24小时 = 86400秒
        }
      );

      if (!response.ok) {
        console.error(`NYT API returned ${response.status} for date ${date}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching from NYT API:', error);
      return null;
    }
  }
};
