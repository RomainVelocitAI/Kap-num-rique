'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/layout/Header'
import HeroClient from '../../components/sections/hero-client'
import KapNumeriquePremium from '../../components/sections/kap-numerique-premium'
import VisualEngagementSection from '../../components/sections/visual-engagement-section'
import InteractivitySection from '../../components/sections/interactivity-section'

export default function Home() {
  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > window.innerHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <h1 className="sr-only">
        Création de Sites Web Professionnels à La Réunion - Kap Numérique - Développement Digital
      </h1>
      {showHeader && <Header />}
      <main>
        <HeroClient />
        <div 
          className="relative bg-white" 
          style={{ 
            zIndex: 10, 
            marginTop: '-1px',
            boxShadow: '0 -50px 100px 50px rgba(255,255,255,1)'
          }}
        >
          <KapNumeriquePremium />
          {/* On saute TechnicalShowcase */}
          <VisualEngagementSection />
          {/* On teste si InteractivitySection s'affiche après VisualEngagementSection */}
          <div className="py-10 bg-green-500 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold">MARQUEUR APRÈS VISUAL ENGAGEMENT</h2>
              <p>Si vous voyez ce marqueur vert, VisualEngagementSection est bien rendu.</p>
            </div>
          </div>
          <InteractivitySection />
        </div>
      </main>
    </>
  )
}