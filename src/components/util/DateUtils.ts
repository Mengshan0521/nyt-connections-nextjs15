// src/components/util/DateUtils.ts

// 默认的日期格式选项
export const defaultOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

// 语言环境到 ISO 代码的映射
const localeISOMap: Record<string, string> = {
  'en': 'en-US',
  'de': 'de-DE',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'it': 'it-IT',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'pt': 'pt-PT',
  'zh-cn': 'zh-CN',
};

/**
 * 使用 Intl.DateTimeFormat 根据语言环境格式化日期
 * @param date - 要格式化的日期对象
 * @param locale - 语言环境代码 (如: 'en', 'zh-cn')
 * @param options - 可选的格式化选项
 * @returns 格式化后的日期字符串
 */
export const formatDateWithIntl = (
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = defaultOptions
): string => {
  const isoLocale = localeISOMap[locale] || 'en-US';
  const formatter = new Intl.DateTimeFormat(isoLocale, options);
  return formatter.format(date);
};

/**
 * 获取当前 UTC+12 时区的日期（全球最早时间）
 * @returns YYYY-MM-DD 格式的日期字符串
 */
export const getCurrentUTCDateFormatted = () => {
  // 获取东十二区的当前时间（UTC+12:00）,全球最早的时间
  const dateInTimeZone = new Date().toLocaleString('en-US', {
    timeZone: 'Pacific/Auckland',
  })

  // 将日期字符串转换为 Date 对象
  const date = new Date(dateInTimeZone)

  // 格式化为 YYYY-MM-DD 格式
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // JavaScript 中月份从 0 开始
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}