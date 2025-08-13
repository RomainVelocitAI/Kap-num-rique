'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import KapNumeriquePremium from '@/components/sections/kap-numerique-premium'
import InteractivitySection from '@/components/sections/interactivity-section'
import KapNumerikOfferSection from '@/components/sections/kap-numerik-offer'

// Import dynamique de la section modifiée
const VisualEngagementWithHero = dynamic(
  () => import('@/components/sections/visual-engagement-with-hero'),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[400px] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Chargement des animations...</div>
      </div>
    ),
  }
)

// Import dynamique des sections qui causent des problèmes
const TechnicalShowcase = dynamic(
  () => import('@/components/sections/technical-showcase'),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[400px] bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement des métriques techniques...</div>
      </div>
    ),
  }
)

export default function TestHeroInAnimation() {
  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show header after scrolling past the first viewport height
      setShowHeader(window.scrollY > window.innerHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* H1 pour le SEO - invisible mais présent pour les moteurs de recherche */}
      <h1 className="sr-only">
        Test Hero dans Animation - Création de Sites Web Professionnels à La Réunion - Kap Numérique
      </h1>
      {showHeader && <Header />}
      <main>
        <KapNumeriquePremium />
        <Suspense fallback={
          <div className="min-h-[400px] bg-black flex items-center justify-center">
            <div className="text-white text-2xl">Chargement...</div>
          </div>
        }>
          <VisualEngagementWithHero />
          <TechnicalShowcase />
        </Suspense>
        <InteractivitySection />
        <KapNumerikOfferSection />
      </main>
    </>
  )
}