// Static data for SSG optimization
export const staticGameConfig = {
  maxMistakes: 4,
  shuffleCount: 3,
  categoriesPerPuzzle: 4,
  wordsPerCategory: 4,
  totalWords: 16,
  infiniteMode: true,
}

export const staticSEOData = {
  siteName: 'NYT Connections Game',
  description: 'Play the daily word categorization puzzle game',
  keywords: ['connections', 'word game', 'puzzle', 'nyt', 'word categorization'],
  author: 'NYT Connections Team',
  twitterHandle: '@nytconnections',
}

export const staticNavigation = {
  mainNav: [
    { title: 'About', href: '/about' },
    { title: 'Privacy', href: '/privacy' },
    { title: 'Blog', href: '/blog' },
    { title: 'Game', href: '/' },
  ],
  footerNav: [
    { title: 'About', href: '/about' },
    { title: 'Privacy', href: '/privacy' },
    { title: 'Blog', href: '/blog' },
    { title: 'Legal', href: '/legal' },
  ]
}

// Generate static paths for blog posts (for SSG)
export function generateStaticBlogPaths() {
  // This would typically come from your database or CMS
  // For now, return empty array to be populated with actual data
  return []
}

// Generate static game data (for SSG)
export async function generateStaticGameData() {
  // This could pre-generate game data for known dates
  // For now, return null to rely on runtime data fetching
  return null
}