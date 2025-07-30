'use client'

import dynamic from 'next/dynamic'
import HeroPlaceholder from './hero-placeholder'

// Dynamic import avec ssr: false pour éviter l'hydratation
const HeroThreeJS = dynamic(() => import('./horizon-hero-section'), {
  ssr: false,
  loading: () => <HeroPlaceholder />
})

export default function HeroOptimized() {
  return <HeroThreeJS />
}