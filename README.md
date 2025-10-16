# NYT Connections Game - Next.js 15

A Next.js 15 implementation of the NYT Connections word puzzle game with internationalization support and Supabase backend.

## Features

- **Game Logic**: Complete NYT Connections game implementation
- **Internationalization**: Support for 10 languages (English, German, Spanish, French, Italian, Japanese, Korean, Portuguese, Chinese)
- **Database**: Supabase integration with row-level security
- **Analytics**: Google Analytics integration
- **Ads**: Google AdSense support
- **SEO**: Comprehensive SEO optimization with dynamic sitemaps
- **Responsive**: Mobile-friendly design with Tailwind CSS

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd nyt-connections-nextjs15
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=your-ga-id-here

# Google AdSense (Optional)
NEXT_PUBLIC_ADSENSE_ID=your-adsense-id-here

# Base URL for SEO
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database migration in `/supabase/migrations/20240101_initial_schema.sql`
3. Copy your Supabase credentials to `.env.local`

### 4. Run the Application

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Dynamic locale routing
│   ├── robots.ts          # Dynamic robots.txt
│   └── sitemap.ts         # Dynamic sitemap
├── components/            # React components
│   ├── GameBoard.tsx      # Main game component
│   ├── GameInitializer.tsx # Game initialization
│   └── ServiceProvider.tsx # Third-party services
├── features/              # Feature-based organization
│   ├── ads/              # Google AdSense integration
│   ├── analytics/        # Google Analytics integration
│   └── consent/          # Cookie consent management
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase configuration
│   └── puzzle-service.ts # Puzzle data service
├── store/                # Zustand state management
│   └── game.ts          # Game state store
├── types/                # TypeScript definitions
│   ├── game.ts          # Game-related types
│   └── global.d.ts      # Global type extensions
└── i18n/                 # Internationalization
    ├── routing.ts        # Locale routing config
    └── request.ts        # Request handling
```

## Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **Users**: User accounts and profiles
- **Puzzles**: Daily puzzles with metadata
- **Categories**: Puzzle categories with word groups
- **Game Sessions**: Individual game play sessions
- **User Progress**: Player progress tracking
- **User Stats**: Statistics and achievements
- **Game Events**: Analytics event tracking

## Game Features

### Core Gameplay
- 4x4 grid of words to categorize
- 4 categories with 4 words each
- Color-coded difficulty levels (Yellow, Green, Blue, Purple)
- Mistake tracking (max 4 mistakes allowed)
- Shuffle functionality
- Win/lose conditions

### Game Modes
- **Daily Mode**: One puzzle per day
- **Infinite Mode**: Random puzzles for unlimited play

### State Management
- Persistent game state using Zustand
- Local storage for game progress
- Real-time updates with Supabase

## Internationalization

The app supports 10 languages with automatic locale detection:

- English (default)
- German
- Spanish
- French
- Italian
- Japanese
- Korean
- Portuguese
- Chinese (Simplified)

## Third-Party Integrations

### Supabase
- PostgreSQL database
- Real-time subscriptions
- Row-level security
- File storage

### Google Analytics
- Event tracking
- User behavior analysis
- Performance metrics

### Google AdSense
- Ad unit management
- Revenue optimization
- Privacy-compliant implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Privacy & Compliance

- GDPR compliant data handling
- Cookie consent management
- Anonymous analytics collection
- No personal data collection without consent
