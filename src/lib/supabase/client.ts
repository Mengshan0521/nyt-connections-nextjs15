import { createBrowserClient } from '@supabase/ssr';

/**
 * 创建 Supabase 浏览器客户端
 *
 * 用于 Client Components，在浏览器环境中使用
 * 使用 cookie-based 认证，自动处理会话管理
 *
 * @returns Supabase 浏览器客户端实例
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { createClient } from '@/lib/supabase/client';
 *
 * export default function MyComponent() {
 *   const supabase = createClient();
 *
 *   async function fetchData() {
 *     const { data } = await supabase
 *       .from('puzzles')
 *       .select('*');
 *     console.log(data);
 *   }
 *
 *   return <button onClick={fetchData}>Fetch Data</button>;
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
