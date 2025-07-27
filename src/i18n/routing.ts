import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'de'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // 配置路径命名策略，使默认语言不显示在URL中
  localePrefix: 'as-needed'
});