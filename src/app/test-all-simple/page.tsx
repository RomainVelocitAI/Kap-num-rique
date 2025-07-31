'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/layout/Header'
import HeroClient from '../../components/sections/hero-client'
import KapNumeriquePremium from '../../components/sections/kap-numerique-premium'
import TechnicalShowcaseSimple from '../../components/sections/technical-showcase-simple'
import VisualEngagementSectionSimple from '../../components/sections/visual-engagement-section-simple'
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
          <TechnicalShowcaseSimple />
          <VisualEngagementSectionSimple />
          <InteractivitySection />
        </div>
      </main>
    </>
  )
}