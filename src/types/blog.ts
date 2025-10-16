export interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  post_date: string
  groups: BlogGroup[]
  words: Word[]
  conclusion_paragraph?: string
}

export interface BlogGroup {
  categories?: string[]
  hint_explanation?: string
  answers_explanation?: string
}

export interface Word {
  word: string
  explain: string
}

export interface BlogPostResponse {
  posts: BlogPost[]
  totalPosts: number
  currentPage: number
  totalPages: number
}