import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 创建 Supabase 服务端客户端
 *
 * 用于 Server Components、Server Actions 和 Route Handlers
 * 使用 cookie-based 认证，自动处理会话管理
 *
 * @returns Supabase 服务端客户端实例
 *
 * @example
 * ```typescript
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function getPuzzles() {
 *   const supabase = await createClient();
 *   const { data, error } = await supabase
 *     .from('puzzles')
 *     .select('*');
 *   return data;
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll 方法在 Server Component 中被调用时会抛出错误
            // 如果有 middleware 处理会话刷新，可以安全地忽略此错误
          }
        },
      },
    }
  );
}
