'use client'

import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import HeroClient from '../components/sections/hero-client'
import KapNumeriquePremium from '../components/sections/kap-numerique-premium'
import TechnicalShowcase from '../components/sections/technical-showcase'
import VisualEngagementSection from '../components/sections/visual-engagement-section'
import InteractivitySection from '../components/sections/interactivity-section'
import ClientOnly from '../components/ui/client-only'
import ClientOnlySafe from '../components/ui/client-only-safe'

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
      {showHeader && <Header />}
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
          <InteractivitySection />
          <ClientOnly>
            <TechnicalShowcase />
          </ClientOnly>
          <ClientOnly>
            <VisualEngagementSection />
          </ClientOnly>
        </div>
      </main>
    </>
  )
}