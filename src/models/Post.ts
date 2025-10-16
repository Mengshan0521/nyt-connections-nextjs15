export interface Word {
  word: string
  explain: string
  date: Date
  language?: string
  sort?: number
}

export interface Group {
  date: Date
  language: string
  sort: number
  categories: string[]
  wordList: string[]
  hint_explanation: string
  answers_explanation: string
}

export interface Post {
  id: string
  post_date: string
  lang: string
  tags: string[]
  description: string
  intro_paragraph?: string
  words: Word[]
  groups: Group[]
  conclusion_paragraph?: string
}