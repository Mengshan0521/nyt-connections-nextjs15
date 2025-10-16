import { createClient } from '@/lib/supabase/server'
import { TABLES } from '@/lib/supabase'

// Game-specific data operations
export const gameDataOperations = {
  // Get today's game
  getTodaysGame: async () => {
    const today = new Date().toISOString().split('T')[0]
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLES.PUZZLES)
      .select('*')
      .eq('date', today)
      .single()

    if (error) {
      console.error('Error fetching today\'s game:', error)
      return null
    }

    return data
  },

  // Get user's game progress
  getUserProgress: async (userId: string, puzzleId: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLES.USER_PROGRESS)
      .select('*')
      .eq('user_id', userId)
      .eq('puzzle_id', puzzleId)
      .single()

    if (error) {
      console.error('Error fetching user progress:', error)
      return null
    }

    return data
  },

  // Save user progress
  saveUserProgress: async (userId: string, puzzleId: string, progress: any) => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLES.USER_PROGRESS)
      .upsert({
        user_id: userId,
        puzzle_id: puzzleId,
        ...progress,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,puzzle_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving user progress:', error)
      throw error
    }

    return data
  },

  // Get user statistics
  getUserStats: async (userId: string) => {
    const supabase = await createClient()
    const { data, error} = await supabase
      .from(TABLES.USER_PROGRESS)
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user stats:', error)
      return null
    }

    return data
  }
}

// Data validation helpers
export const dataValidation = {
  // Validate game data
  validateGameData: (data: any): boolean => {
    return (
      data &&
      typeof data === 'object' &&
      data.date &&
      Array.isArray(data.categories) &&
      data.categories.length === 4 &&
      data.categories.every((cat: any) =>
        Array.isArray(cat.words) && cat.words.length === 4
      )
    )
  },

  // Validate user session
  validateSession: (session: any): boolean => {
    return (
      session &&
      typeof session === 'object' &&
      session.user_id &&
      session.puzzle_id &&
      session.created_at
    )
  },

  // Sanitize input data
  sanitize: (data: any): any => {
    // Remove any potentially harmful properties
    const { __proto__, constructor, prototype, ...safeData } = data
    return safeData
  }
}