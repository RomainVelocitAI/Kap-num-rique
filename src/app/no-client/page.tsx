'use client'

import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import HeroClient from '../components/sections/hero-client'
import KapNumeriquePremium from '../components/sections/kap-numerique-premium'
import InteractivitySection from '../components/sections/interactivity-section'

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
          {/* On saute directement TechnicalShowcase et VisualEngagementSection */}
          <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-10">Test Direct de la Section Interactivité</h2>
              <p className="text-center mb-10">Si cette section s'affiche, le problème vient des sections précédentes.</p>
            </div>
          </div>
          <InteractivitySection />
        </div>
      </main>
    </>
  )
}