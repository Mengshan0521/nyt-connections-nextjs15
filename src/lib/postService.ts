import { Post } from '@/models/Post'
import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/supabase'

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

export async function getPosts(
  page: number = 1,
  pageSize: number = 5,
  locale: string = 'en'
): Promise<{ posts: Post[]; totalPosts: number }> {
  try {
    const now = getCurrentUTCDateFormatted()
    const supabase = await createClient()
    const offset = (page - 1) * pageSize
    const { data, error, count } = await supabase
      .from(TABLES.POST)
      .select('*', { count: 'exact' })
      .eq('language', locale)
      .lte('post_date', now)
      .order('post_date', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Error fetching data:', error)
      // Return demo data if database is not set up
      return getDemoData(page, pageSize, locale)
    }

    // For each post, fetch the words from the words table
    const processedPostsPromises = data.map(async (post: any) => {
      const { data: wordsData, error: wordsError } = await supabase
        .from(TABLES.WORDS)
        .select('*')
        .eq('language', locale)
        .eq('date', post.post_date)
        .order('sort', { ascending: true })

      if (wordsError) {
        console.error('Error fetching words:', wordsError)
      }

      const words = wordsData?.map((row: any) => ({
        word: row.word,
        explain: row.explain,
        date: row.date ? new Date(row.date) : new Date(),
        language: row.language || undefined,
        sort: row.sort || undefined,
      })) || []

      return {
        id: post.id,
        post_date: post.post_date,
        lang: post.language,
        tags: words.length > 0
          ? [post.post_date, ...words.map((w: any) => w.word)]
          : [post.post_date],
        description: post.description,
        intro_paragraph: post.intro_paragraph,
        words: words,
        groups: [],
        conclusion_paragraph: post.conclusion_paragraph,
      }
    })

    const processedPosts = await Promise.all(processedPostsPromises)

    return {
      posts: processedPosts as Post[],
      totalPosts: count || 0,
    }
  } catch (error) {
    console.error('Database connection error:', error)
    // Return demo data if database connection fails
    return getDemoData(page, pageSize, locale)
  }
}

function getDemoData(page: number, pageSize: number, locale: string): { posts: Post[]; totalPosts: number } {
  const demoWords = [
    { word: 'APPLE', explain: 'A red fruit', date: new Date(), sort: 1, language: locale },
    { word: 'BANANA', explain: 'A yellow fruit', date: new Date(), sort: 2, language: locale },
    { word: 'CHERRY', explain: 'A small red fruit', date: new Date(), sort: 3, language: locale },
    { word: 'DATE', explain: 'A sweet fruit', date: new Date(), sort: 4, language: locale },
    { word: 'ELDERBERRY', explain: 'A dark purple berry', date: new Date(), sort: 5, language: locale },
    { word: 'FIG', explain: 'A sweet pear-shaped fruit', date: new Date(), sort: 6, language: locale },
    { word: 'GRAPE', explain: 'A small green or purple fruit', date: new Date(), sort: 7, language: locale },
    { word: 'HONEYDEW', explain: 'A green melon', date: new Date(), sort: 8, language: locale },
    { word: 'KIWI', explain: 'A fuzzy brown fruit', date: new Date(), sort: 9, language: locale },
    { word: 'LEMON', explain: 'A yellow citrus fruit', date: new Date(), sort: 10, language: locale },
    { word: 'MANGO', explain: 'A tropical orange fruit', date: new Date(), sort: 11, language: locale },
    { word: 'NECTARINE', explain: 'A smooth-skinned peach', date: new Date(), sort: 12, language: locale },
    { word: 'ORANGE', explain: 'A citrus fruit', date: new Date(), sort: 13, language: locale },
    { word: 'PAPAYA', explain: 'A tropical fruit', date: new Date(), sort: 14, language: locale },
    { word: 'QUINCE', explain: 'A hard yellow fruit', date: new Date(), sort: 15, language: locale },
    { word: 'RASPBERRY', explain: 'A red berry', date: new Date(), sort: 16, language: locale },
  ]

  const demoPost: Post = {
    id: '1',
    post_date: getCurrentUTCDateFormatted(),
    lang: locale,
    tags: [getCurrentUTCDateFormatted(), ...demoWords.map(w => w.word)],
    description: 'Demo NYT Connections puzzle for today',
    intro_paragraph: 'This is a demo puzzle while the database is being set up.',
    words: demoWords,
    groups: [
      {
        date: new Date(),
        language: locale,
        sort: 1,
        categories: ['FRUITS'],
        wordList: ['APPLE', 'BANANA', 'CHERRY', 'DATE'],
        hint_explanation: 'These are all types of fruits.',
        answers_explanation: 'All four words represent different types of fruits.',
      },
    ],
    conclusion_paragraph: 'Great job completing this demo puzzle!',
  }

  return {
    posts: [demoPost],
    totalPosts: 1,
  }
}

export async function queryPost(
  locale: string,
  date: string
): Promise<Post | null> {
  try {
    const supabase = await createClient()
    const aQuery = supabase
      .from(TABLES.POST)
      .select('*')
      .eq('language', locale)
      .eq('post_date', date)
      .single()

    const bQuery = supabase
      .from(TABLES.WORDS)
      .select('*')
      .eq('language', locale)
      .eq('date', date)

    const cQuery = supabase
      .from(TABLES.GROUPS)
      .select('*')
      .eq('language', locale)
      .eq('date', date)

    const [aResult, bResult, cResult] = await Promise.all([
      aQuery,
      bQuery,
      cQuery,
    ])

    if (aResult.error || bResult.error || cResult.error) {
      console.error('Error fetching data')
      console.error(aResult.error)
      console.error(bResult.error)
      console.error(cResult.error)
      return null
    }

    const entity: Post = {
      id: aResult.data.id,
      post_date: aResult.data.post_date,
      lang: aResult.data.language,
      tags: aResult.data.words
        ? [aResult.data.post_date, ...aResult.data.words]
        : [aResult.data.post_date],
      description: aResult.data.description,
      intro_paragraph: aResult.data.intro_paragraph,
      words: bResult.data.map((row: any) => ({
        word: row.word,
        explain: row.explain,
        date: row.date ? new Date(row.date) : new Date(),
        language: row.language || undefined,
        sort: row.sort || undefined,
      })),
      groups: cResult.data.map((row: any) => ({
        date: new Date(row.date),
        language: row.language,
        sort: row.sort,
        categories: row.categories,
        wordList: row.words,
        hint_explanation: row.hint_explanation,
        answers_explanation: row.answers_explanation,
      })),
      conclusion_paragraph: aResult.data.conclusion_paragraph,
    }

    return entity
  } catch (error) {
    console.error('Database connection error in queryPost:', error)
    return null
  }
}

export async function getTotalPosts(
  locale: string = 'en'
): Promise<{ post_dates: string[]; totalPosts: number }> {
  try {
    const now = getCurrentUTCDateFormatted()
    const supabase = await createClient()
    const { data, error, count } = await supabase
      .from(TABLES.POST)
      .select('post_date', { count: 'exact' })
      .eq('language', locale)
      .lte('post_date', now)

    if (error) {
      console.error('Error fetching data:', error)
      return { post_dates: [], totalPosts: 0 }
    } else {
      const post_dates = data.map(item => item.post_date)
      return {
        post_dates: post_dates as string[],
        totalPosts: count || 0,
      }
    }
  } catch (error) {
    console.error('Database connection error in getTotalPosts:', error)
    return { post_dates: [], totalPosts: 0 }
  }
}

function getCurrentUTCDateFormatted(): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}