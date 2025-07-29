# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thrive Well Guide is a comprehensive health and wellness platform built with React, TypeScript, and Supabase. The application helps users track their fitness journey, habits, and overall well-being through personalized assessments, goal setting, and progress monitoring.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn-ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: React Context API + TanStack Query (React Query)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL with Row Level Security)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Directory Structure

```
src/
├── components/          # Feature-based component organization
│   ├── auth/           # Authentication components (login, register, password reset)
│   ├── dashboard/      # Dashboard views and widgets
│   ├── habits/         # Habit tracking functionality
│   ├── health/         # Health metrics and tracking
│   ├── motivation/     # Goal setting and motivational features
│   ├── onboarding/     # User onboarding flow
│   ├── profile/        # User profile management
│   ├── progress/       # Progress tracking and visualization
│   └── ui/            # Base UI components from shadcn-ui
├── context/           # React context providers (auth, user data)
├── hooks/             # Custom React hooks for data fetching and state
├── integrations/      # External service integrations (primarily Supabase)
├── lib/               # Utility functions and helpers
├── pages/             # Route page components
└── types/             # TypeScript type definitions
```

### Key Architectural Patterns

1. **Authentication Flow**: 
   - Uses Supabase Auth with email/password and Google OAuth
   - Auth context provider wraps the app for global auth state
   - Protected routes redirect to login when unauthenticated

2. **Data Fetching**:
   - TanStack Query for server state management
   - Custom hooks abstract Supabase queries
   - Optimistic updates for better UX

3. **Component Structure**:
   - Feature-based organization (not by component type)
   - Shared UI components from shadcn-ui library
   - Form components integrated with React Hook Form

4. **Type Safety**:
   - Comprehensive TypeScript types in `src/types/`
   - Zod schemas for runtime validation
   - Path aliases configured (`@/` maps to `./src/`)

### Database Schema

The application uses Supabase with the following key tables:
- `profiles`: User profile information and preferences
- `body_measurements`: Physical measurements and body type data
- `goals`: User-defined health and wellness goals
- `habits`: Habit tracking with streaks and completion status
- `weekly_check_ins`: Weekly progress check-ins with photos
- `motivational_reflections`: User reflections and motivation tracking
- `stress_reflections`: Stress management and coping strategies

### Supabase Integration

- Database client initialized in `src/integrations/supabase/client.ts`
- Type definitions generated in `src/integrations/supabase/types.ts`
- Row Level Security (RLS) policies enforce data access control
- Serverless functions in `supabase/functions/` for payment processing

## Important Notes

- The project uses Lovable for deployment and collaboration
- Environment variables are managed through Supabase dashboard
- All database queries should use the typed Supabase client
- Follow existing component patterns when adding new features
- Maintain consistency with the existing shadcn-ui component library