# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kap Numérique is a Next.js 15 application for a digital development agency in La Réunion. The project uses TypeScript, Tailwind CSS, and incorporates 3D graphics with Three.js and React Three Fiber. It's designed as a meta-narrative website that presents itself as "your future website" to demonstrate the Kap Numérik subsidy program.

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
  - GSAP for advanced animations and scroll-driven effects
  - Lucide React for icons
- **3D Graphics**: Three.js with React Three Fiber and Drei
- **Analytics**: Vercel Analytics
- **SEO**: next-seo
- **Post-processing**: @react-three/postprocessing for visual effects

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
│   └── sections/          # Page sections (hero, kap-numerique)
├── lib/                   # Utility functions
├── styles/               
│   └── globals.css        # Global styles and Tailwind imports
└── types/                 # TypeScript type definitions
```

### Design System

The project uses a comprehensive color system defined in Tailwind config:
- **Primary**: Blue palette (#0066CC) - Used for main CTAs and links
- **Secondary**: Red palette (#FF6B6B) - Used for accents and highlights
- **Accent**: Gold palette (#FFD700) - Used for special elements
- **Gold**: Premium gold palette (#D4AF37) - Used for premium features

Three font families are configured:
- **Sans** (Inter): Default body text
- **Serif** (Playfair Display): Headings and emphasis
- **Display** (Bebas Neue): Large display text

Custom animations are defined for common UI patterns:
- `fade-in`, `fade-up`: Entrance animations
- `slide-in-right`, `slide-in-left`: Directional slides
- `scale-in`: Scale entrance
- `float`, `glow`, `shimmer`: Continuous effects
- `gradient`: Background gradient animation

### Key Configuration

**Next.js Config** (`next.config.js`):
- React Strict Mode enabled
- Image optimization for Unsplash
- CSS optimization enabled with Critters
- Console removal in production
- Security headers configured (X-Frame-Options, X-Content-Type-Options, etc.)
- Optimized imports for lucide-react and Radix UI

**TypeScript** (`tsconfig.json`):
- Target: ES2017
- Strict mode: **disabled**
- Module resolution: Node
- JSX: Preserve
- Path alias: `@/*` → `./src/*`

### Performance & SEO

The project is optimized for SEO with:
- Comprehensive metadata in layout.tsx
- Open Graph and Twitter cards
- Google site verification ready
- Security headers
- Font display swap for performance
- Metadata base URL: https://kap-numerique.re

### Key Components

**Hero Sections**:
- `horizon-hero-section.tsx`: Three.js animated hero with space/horizon theme
- Custom CSS classes for hero elements in globals.css

**Layout Components**:
- `Header.tsx`: Main navigation header

**Section Components**:
- `kap-numerique-section.tsx`: Main content sections
- `kap-numerique-premium.tsx`: Premium features section

### Development Guidelines

- The project uses CSS custom properties for font variables
- Tailwind's container is centered with custom breakpoints
- The color system uses HSL values with CSS variables for theme flexibility
- TypeScript strict mode is disabled - be mindful of type safety
- Three.js canvases have `touch-action: none` for better mobile interaction
- Smooth scrolling is enabled globally

### Meta-Narrative Concept

The site is designed to be self-aware and break the fourth wall:
- First-person narrative (the site talks about itself)
- Interactive demonstrations of features
- Real-time performance metrics display
- Backstage mode showing technical details
- Components that explain themselves

## Communication Memories

- Si je te montre des log apres que tu m'ai dit que quelque chose est ok c est que ca ne l est pas ne soit pas bete !
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

      
      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.