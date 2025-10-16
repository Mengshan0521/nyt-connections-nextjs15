/**
 * Supabase 工具函数和常量定义（只读模式）
 *
 * ⚠️ 重要提示：
 * 1. 不要直接从此文件导入客户端实例
 * 2. 请使用专用的客户端创建函数：
 *    - 服务端：import { createClient } from '@/lib/supabase/server'
 *    - 客户端：import { createClient } from '@/lib/supabase/client'
 * 3. 此文件仅包含只读操作（SELECT 查询），不包含修改操作
 * 4. 如需修改数据，请联系数据库管理员
 */

// ============================================
// 常量定义
// ============================================

/**
 * 数据库表名常量
 * 使用常量可以避免拼写错误，提供类型安全
 */
export const TABLES = {
  // Game-related tables
  PUZZLES: 'puzzles',
  CATEGORIES: 'categories',
  GAME_SESSIONS: 'game_sessions',
  USER_PROGRESS: 'user_progress',
  USERS: 'users',
  // Blog-related tables (production database)
  POST: 'post',
  WORDS: 'words',
  GROUPS: 'groups',
  GAME_DATA: 'game_data',
} as const;

/**
 * 实时频道名称
 * 用于 Supabase Realtime 订阅
 */
export const CHANNELS = {
  GAME_UPDATES: 'game_updates',
  PUZZLE_CHANGES: 'puzzle_changes',
} as const;

// ============================================
// 错误处理
// ============================================

/**
 * Supabase 错误处理工具函数
 * 统一处理 Supabase 返回的错误信息
 *
 * @param error - Supabase 错误对象
 * @returns 格式化的错误消息
 */
export const handleSupabaseError = (error: {
  message?: string;
  code?: string;
  details?: string;
}) => {
  console.error('Supabase error:', error);
  return error.message || 'An unknown error occurred';
};

// ============================================
// 只读查询操作（服务端）
// ============================================

/**
 * 根据 ID 查询单条记录
 *
 * @param table - 表名
 * @param id - 记录 ID
 * @returns 查询结果
 *
 * @example
 * ```typescript
 * import { getRecordById } from '@/lib/supabase';
 * const puzzle = await getRecordById('puzzles', '123');
 * ```
 */
export const getRecordById = async (table: string, id: string) => {
  // 动态导入以避免在模块顶层使用服务端函数
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

/**
 * 分页查询数据
 *
 * @param table - 表名
 * @param page - 页码（从 1 开始）
 * @param pageSize - 每页数量
 * @param filters - 过滤条件（Supabase filter 语法）
 * @param orderBy - 排序字段
 * @returns 分页结果，包含数据、总数、页码等信息
 *
 * @example
 * ```typescript
 * import { getPaginatedData } from '@/lib/supabase';
 * const result = await getPaginatedData('puzzles', 1, 10, undefined, 'created_at');
 * console.log(result.data); // 第一页的 10 条数据
 * console.log(result.totalPages); // 总页数
 * ```
 */
export const getPaginatedData = async (
  table: string,
  page: number = 1,
  pageSize: number = 10,
  filters?: string,
  orderBy?: string
) => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from(table).select('*', { count: 'exact' });

  if (filters) {
    query = query.or(filters);
  }

  if (orderBy) {
    query = query.order(orderBy);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) throw error;

  return {
    data,
    count,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
};

/**
 * 获取所有记录（带可选过滤和排序）
 *
 * @param table - 表名
 * @param filters - 过滤条件
 * @param orderBy - 排序字段
 * @param limit - 最大返回数量（默认 1000）
 * @returns 查询结果数组
 *
 * @example
 * ```typescript
 * import { getAllRecords } from '@/lib/supabase';
 * const puzzles = await getAllRecords('puzzles', undefined, 'created_at', 50);
 * ```
 */
export const getAllRecords = async (
  table: string,
  filters?: string,
  orderBy?: string,
  limit: number = 1000
) => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  let query = supabase.from(table).select('*').limit(limit);

  if (filters) {
    query = query.or(filters);
  }

  if (orderBy) {
    query = query.order(orderBy);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

/**
 * 计数查询
 *
 * @param table - 表名
 * @param filters - 过滤条件
 * @returns 符合条件的记录总数
 *
 * @example
 * ```typescript
 * import { countRecords } from '@/lib/supabase';
 * const total = await countRecords('puzzles');
 * ```
 */
export const countRecords = async (table: string, filters?: string) => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  let query = supabase.from(table).select('*', { count: 'exact', head: true });

  if (filters) {
    query = query.or(filters);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count || 0;
};

// ============================================
// 类型安全的查询构建器（服务端）
// ============================================

/**
 * 创建 puzzles 表的查询构建器
 * 注意：此函数必须在服务端环境中使用
 *
 * @example
 * ```typescript
 * import { fromPuzzles } from '@/lib/supabase';
 * const { data } = await (await fromPuzzles()).select('*').limit(10);
 * ```
 */
export const fromPuzzles = async () => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  return supabase.from(TABLES.PUZZLES);
};

export const fromCategories = async () => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  return supabase.from(TABLES.CATEGORIES);
};

export const fromGameSessions = async () => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  return supabase.from(TABLES.GAME_SESSIONS);
};

export const fromUserProgress = async () => {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  return supabase.from(TABLES.USER_PROGRESS);
};

// ============================================
// 连接检查
// ============================================

/**
 * 检查 Supabase 数据库连接
 * 通过查询 puzzles 表来验证连接是否正常
 *
 * @returns 连接是否成功
 */
export const checkSupabaseConnection = async () => {
  try {
    const count = await countRecords(TABLES.PUZZLES);
    console.log('Supabase connection successful, puzzles count:', count);
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};
