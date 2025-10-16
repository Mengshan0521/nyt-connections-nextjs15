// 导入必要的模块和组件
import { createClient } from '@/lib/supabase/server';
import { TABLES } from '@/lib/supabase';
import { Puzzle } from '@/types/game';

// 谜题服务类（提供谜题相关的数据操作）
export class PuzzleService {
  // 获取今日每日谜题
  static async getDailyPuzzle(): Promise<Puzzle | null> {
    try {
      // 获取今天的日期
      const today = new Date().toISOString().split('T')[0];

      // 从 Supabase 查询今日的每日谜题
      const supabase = await createClient();
      const { data: puzzle, error } = await supabase
        .from(TABLES.PUZZLES)
        .select(`
          *,
          categories (*)
        `)
        .eq('date', today)
        .eq('is_published', true)
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn('Daily puzzle not found in Supabase, falling back to sample data');
        // 如果 Supabase 中没有找到，返回备用数据
        return this.getFallbackDailyPuzzle();
      }

      // 转换数据格式
      return this.transformPuzzleData(puzzle);
    } catch (error) {
      console.error('Error fetching daily puzzle:', error);
      // 出错时返回备用数据
      return this.getFallbackDailyPuzzle();
    }
  }

  // 根据 ID 获取谜题
  static async getPuzzleById(id: string): Promise<Puzzle | null> {
    try {
      // 从 Supabase 查询指定 ID 的谜题
      const supabase = await createClient();
      const { data: puzzle, error } = await supabase
        .from(TABLES.PUZZLES)
        .select(`
          *,
          categories (*)
        `)
        .eq('id', id)
        .eq('is_published', true)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      // 转换数据格式
      return this.transformPuzzleData(puzzle);
    } catch (error) {
      console.error('Error fetching puzzle by ID:', error);
      return null;
    }
  }

  // Get random puzzle for infinite mode
  static async getRandomPuzzle(): Promise<Puzzle | null> {
    try {
      const { data: puzzles, error } = await supabase
        .from(TABLES.PUZZLES)
        .select(`
          *,
          categories (*)
        `)
        .eq('is_published', true)
        .eq('is_active', true);

      if (error) throw error;
      
      if (!puzzles || puzzles.length === 0) {
        console.warn('No puzzles found in Supabase, falling back to sample data');
        return this.getFallbackRandomPuzzle();
      }

      const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      return this.transformPuzzleData(randomPuzzle);
    } catch (error) {
      console.error('Error fetching random puzzle:', error);
      return this.getFallbackRandomPuzzle();
    }
  }

  // Get all puzzles (for admin/debug purposes)
  static async getAllPuzzles(): Promise<Puzzle[]> {
    try {
      const { data: puzzles, error } = await supabase
        .from(TABLES.PUZZLES)
        .select(`
          *,
          categories (*),
          author:users (username, display_name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      
      return puzzles ? puzzles.map(puzzle => this.transformPuzzleData(puzzle)) : [];
    } catch (error) {
      console.error('Error fetching all puzzles:', error);
      return [];
    }
  }

  // Create new puzzle (would be used in admin panel)
  static async createPuzzle(puzzle: Omit<Puzzle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Puzzle | null> {
    try {
      // Start a transaction to create puzzle and categories
      const { data: newPuzzle, error: puzzleError } = await supabase
        .from(TABLES.PUZZLES)
        .insert({
          title: puzzle.title,
          description: puzzle.description,
          date: puzzle.date,
          difficulty: puzzle.difficulty,
          is_published: puzzle.isPublished,
          is_active: true,
        })
        .select()
        .single();

      if (puzzleError) throw puzzleError;

      // Create categories
      const categoriesToInsert = puzzle.categories.map(category => ({
        puzzle_id: newPuzzle.id,
        title: category.title,
        description: category.description,
        difficulty: category.difficulty,
        words: category.words,
      }));

      const { error: categoriesError } = await supabase
        .from(TABLES.CATEGORIES)
        .insert(categoriesToInsert);

      if (categoriesError) throw categoriesError;

      // Fetch the complete puzzle with categories
      return await this.getPuzzleById(newPuzzle.id);
    } catch (error) {
      console.error('Error creating puzzle:', error);
      return null;
    }
  }

  // Update puzzle
  static async updatePuzzle(id: string, updates: Partial<Puzzle>): Promise<Puzzle | null> {
    try {
      const { error } = await supabase
        .from(TABLES.PUZZLES)
        .update({
          title: updates.title,
          description: updates.description,
          date: updates.date,
          difficulty: updates.difficulty,
          is_published: updates.isPublished,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      return await this.getPuzzleById(id);
    } catch (error) {
      console.error('Error updating puzzle:', error);
      return null;
    }
  }

  // Delete puzzle
  static async deletePuzzle(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.PUZZLES)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      return false;
    }
  }

  // Helper method to transform Supabase data to Puzzle format
  private static transformPuzzleData(data: {
    id: string;
    title: string;
    description: string;
    date: string;
    categories?: Array<{
      id: string;
      title: string;
      description: string;
      difficulty: string;
      words: string[];
    }>;
    difficulty: string;
    author?: {
      username?: string;
      display_name?: string;
    };
    is_published: boolean;
    created_at: string;
    updated_at: string;
  }): Puzzle {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      categories: (data.categories || []).map((category: {
        id: string;
        title: string;
        description: string;
        difficulty: string;
        words: string[];
      }) => ({
        id: category.id,
        title: category.title,
        description: category.description,
        difficulty: category.difficulty as 'yellow' | 'green' | 'blue' | 'purple',
        words: category.words,
        isFound: false,
      })),
      difficulty: data.difficulty as 'medium' | 'easy' | 'hard',
      author: data.author?.username || data.author?.display_name || 'Unknown',
      isPublished: data.is_published,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  // Fallback methods for when Supabase is not available
  private static getFallbackDailyPuzzle(): Puzzle | null {
    const fallbackPuzzles = this.getFallbackPuzzles();
    const today = new Date().toISOString().split('T')[0];
    const puzzleNumber = parseInt(today.split('-')[2]) % fallbackPuzzles.length;
    return fallbackPuzzles[puzzleNumber];
  }

  private static getFallbackRandomPuzzle(): Puzzle | null {
    const fallbackPuzzles = this.getFallbackPuzzles();
    const randomIndex = Math.floor(Math.random() * fallbackPuzzles.length);
    return fallbackPuzzles[randomIndex];
  }

  private static getFallbackPuzzles(): Puzzle[] {
    return [
      {
        id: 'puzzle-1',
        title: 'Daily Puzzle - January 1',
        description: 'Find the connections between these 16 words',
        date: '2024-01-01',
        categories: [
          {
            id: 'cat-1',
            title: 'Colors',
            description: 'Different colors',
            difficulty: 'yellow',
            words: ['Red', 'Blue', 'Green', 'Yellow'],
          },
          {
            id: 'cat-2',
            title: 'Fruits',
            description: 'Common fruits',
            difficulty: 'green',
            words: ['Apple', 'Banana', 'Orange', 'Grape'],
          },
          {
            id: 'cat-3',
            title: 'Animals',
            description: 'Farm animals',
            difficulty: 'blue',
            words: ['Dog', 'Cat', 'Cow', 'Pig'],
          },
          {
            id: 'cat-4',
            title: 'Metals',
            description: 'Common metals',
            difficulty: 'purple',
            words: ['Gold', 'Silver', 'Iron', 'Copper'],
          },
        ],
        difficulty: 'medium',
        author: 'Game Master',
        isPublished: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'puzzle-2',
        title: 'Daily Puzzle - January 2',
        description: 'Can you find all four groups?',
        date: '2024-01-02',
        categories: [
          {
            id: 'cat-5',
            title: 'Sports',
            description: 'Ball sports',
            difficulty: 'yellow',
            words: ['Basketball', 'Football', 'Tennis', 'Golf'],
          },
          {
            id: 'cat-6',
            title: 'Planets',
            description: 'Planets in our solar system',
            difficulty: 'green',
            words: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
          },
          {
            id: 'cat-7',
            title: 'Musical Instruments',
            description: 'Common instruments',
            difficulty: 'blue',
            words: ['Piano', 'Guitar', 'Drums', 'Violin'],
          },
          {
            id: 'cat-8',
            title: 'Weather',
            description: 'Weather phenomena',
            difficulty: 'purple',
            words: ['Rain', 'Snow', 'Wind', 'Thunder'],
          },
        ],
        difficulty: 'medium',
        author: 'Game Master',
        isPublished: true,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
    ];
  }
}