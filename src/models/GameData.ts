// 卡片接口
export interface Card {
  content: string
  position: number
}

// 类别接口
export interface Category {
  title: string
  cards: Card[]
}

// 游戏数据接口
export interface GameData {
  status: string
  id: number
  print_date: string
  editor: string
  categories: Category[]
}

export interface ConnectionsGameData {
  date: string
  gameData: GameData
}

// 游戏历史记录接口
export interface GameHistory {
  guesses: Array<{
    cards: Array<{
      content: string
      level: number
    }>
    correct: boolean
  }>
  solvedCategories: Category[]
  InfiniteMode: boolean
  cardPositions: number[]
  selectedCards: string[]
}