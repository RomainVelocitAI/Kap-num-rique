'use client'

import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import HeroClient from '../components/sections/hero-client'
import KapNumeriquePremium from '../components/sections/kap-numerique-premium'
import TechnicalShowcase from '../components/sections/technical-showcase'
import VisualEngagementSection from '../components/sections/visual-engagement-section'
import InteractivitySection from '../components/sections/interactivity-section'
import ClientOnly from '../components/ui/client-only'

export default function HomeForceShow() {
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
          <ClientOnly>
            <TechnicalShowcase />
          </ClientOnly>
          <ClientOnly>
            <VisualEngagementSection />
          </ClientOnly>
          
          {/* Force l'affichage avec des styles explicites */}
          <div style={{ 
            display: 'block !important',
            visibility: 'visible !important',
            opacity: '1 !important',
            position: 'relative',
            zIndex: 9999,
            backgroundColor: 'white',
            minHeight: '100px',
            padding: '20px'
          } as any}>
            <h2 style={{ color: 'red', fontSize: '24px', textAlign: 'center' }}>
              SECTION FORCÉE - Si vous voyez ce texte, la section se charge
            </h2>
            <InteractivitySection />
          </div>
        </div>
      </main>
    </>
  )
}