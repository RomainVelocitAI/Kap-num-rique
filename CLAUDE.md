# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kap Numérique is a Next.js 15 application for a digital development agency in La Réunion. The project uses TypeScript, Tailwind CSS, and incorporates 3D graphics with Three.js and React Three Fiber.

## Commands

```bash
# Development
npm run dev        # Start development server on http://localhost:3000

# Building & Production
npm run build      # Build for production
npm run start      # Start production server

# Code Quality
npm run lint       # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript (non-strict mode)
- **Styling**: Tailwind CSS with custom design system
- **UI Libraries**: 
  - Radix UI for accessible components
  - Framer Motion for animations
  - GSAP for advanced animations
  - Lucide React for icons
- **3D Graphics**: Three.js with React Three Fiber and Drei
- **Analytics**: Vercel Analytics
- **SEO**: next-seo

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Homepage
│   ├── api/               # API routes
│   └── test*/             # Test pages for development
├── components/            
│   ├── layout/            # Layout components (Header, etc.)
│   └── sections/          # Page sections
├── lib/                   # Utility functions
├── styles/               
│   └── globals.css        # Global styles and Tailwind imports
└── types/                 # TypeScript type definitions
```

### Design System

The project uses a comprehensive color system defined in Tailwind config:
- **Primary**: Blue palette (#0066CC) 
- **Secondary**: Red palette (#FF6B6B)
- **Accent**: Gold palette (#FFD700)

Three font families are configured:
- **Sans** (Inter): Default body text
- **Serif** (Playfair Display): Headings and emphasis
- **Display** (Bebas Neue): Large display text

Custom animations are defined for common UI patterns (fade, slide, scale, float, glow, shimmer).

### Key Configuration

**Next.js Config** (`next.config.js`):
- React Strict Mode enabled
- Image optimization for Unsplash
- CSS optimization enabled
- Console removal in production
- Security headers configured

**TypeScript** (`tsconfig.json`):
- Target: ES2017
- Strict mode: **disabled**
- Module resolution: Node
- JSX: Preserve

### Performance & SEO

The project is optimized for SEO with:
- Comprehensive metadata in layout.tsx
- Open Graph and Twitter cards
- Google site verification ready
- Security headers
- Font display swap for performance

## Development Notes

- The project uses CSS custom properties for font variables
- Tailwind's container is centered with custom breakpoints
- The color system uses HSL values with CSS variables for theme flexibility
- TypeScript strict mode is disabled - be mindful of type safety

## Communication Memories

- Si je te montre des log apres que tu m'ai dit que quelque chose est ok c est que ca ne l est pas ne soit pas bete !
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

      
      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.