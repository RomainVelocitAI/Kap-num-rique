'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeaderDigiqo from '../components/layout/HeaderDigiqo'
import FooterDigiqo from '../components/layout/FooterDigiqo'
import HeroClient from '../components/sections/hero-client'
import KapNumeriquePremium from '../components/sections/kap-numerique-premium'
import InteractivitySection from '../components/sections/interactivity-section'
import KapNumerikOfferSection from '../components/sections/kap-numerik-offer'

// Import dynamique des sections qui causent des problèmes
const TechnicalShowcase = dynamic(
  () => import('../components/sections/technical-showcase'),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-2xl">Chargement des métriques techniques...</div>
      </div>
    ),
  }
)

const VisualEngagementSection = dynamic(
  () => import('../components/sections/visual-engagement-section'),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-700 text-2xl">Chargement des animations...</div>
      </div>
    ),
  }
)

export default function Home() {
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
        Création de Sites Web Professionnels à La Réunion - Kap Numérique - Développement Digital
      </h1>
      {showHeader && <HeaderDigiqo />}
      <main>
        <HeroClient />
        {/* Masque pour cacher le canvas Three.js après le Hero */}
        <div 
          className="relative bg-white" 
          style={{ 
            zIndex: 10, 
            marginTop: '-1px',
            boxShadow: '0 -50px 100px 50px rgba(255,255,255,1)'
          }}
        >
          <KapNumeriquePremium />
          <Suspense fallback={
            <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
              <div className="text-gray-700 text-2xl">Chargement...</div>
            </div>
          }>
            <VisualEngagementSection />
            <TechnicalShowcase />
          </Suspense>
          <InteractivitySection />
          <KapNumerikOfferSection />
        </div>
      </main>
      <FooterDigiqo />
    </>
  )
}