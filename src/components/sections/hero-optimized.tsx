'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeroPlaceholder from './hero-placeholder'

// Lazy load du composant Hero Three.js uniquement après interaction ou délai
const HeroThreeJS = dynamic(
  () => import('./horizon-hero-section').then(mod => ({ default: mod.Component })),
  {
    loading: () => <HeroPlaceholder />,
    ssr: false // Désactive le SSR pour Three.js
  }
)

export default function HeroOptimized() {
  const [shouldLoadThreeJS, setShouldLoadThreeJS] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Stratégie 1: Charger après que le FCP soit atteint (2s de délai)
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShouldLoadThreeJS(true)
      }
    }, 2000)

    // Stratégie 2: Charger immédiatement sur interaction utilisateur
    const handleInteraction = () => {
      setHasInteracted(true)
      setShouldLoadThreeJS(true)
      // Retirer les écouteurs après première interaction
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }

    window.addEventListener('scroll', handleInteraction, { passive: true })
    window.addEventListener('click', handleInteraction, { passive: true })
    window.addEventListener('touchstart', handleInteraction, { passive: true })

    // Stratégie 3: Charger quand le navigateur est idle
    if ('requestIdleCallback' in window) {
      const idleCallbackId = window.requestIdleCallback(() => {
        if (!hasInteracted && !shouldLoadThreeJS) {
          setShouldLoadThreeJS(true)
        }
      }, { timeout: 3000 })

      return () => {
        clearTimeout(timer)
        window.cancelIdleCallback(idleCallbackId)
        window.removeEventListener('scroll', handleInteraction)
        window.removeEventListener('click', handleInteraction)
        window.removeEventListener('touchstart', handleInteraction)
      }
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [hasInteracted, shouldLoadThreeJS])

  // Précharger Three.js en arrière-plan après le rendu initial
  useEffect(() => {
    if (!shouldLoadThreeJS) {
      // Préchargement des modules Three.js pour accélérer le chargement final
      const preloadModules = async () => {
        try {
          await import('three')
          await import('gsap')
        } catch (e) {
          // Silencieux, c'est juste du préchargement
        }
      }
      
      // Commencer le préchargement après 1s
      const preloadTimer = setTimeout(preloadModules, 1000)
      return () => clearTimeout(preloadTimer)
    }
  }, [shouldLoadThreeJS])

  return shouldLoadThreeJS ? <HeroThreeJS /> : <HeroPlaceholder />
}