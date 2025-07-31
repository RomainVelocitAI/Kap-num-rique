'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Header from '../../components/layout/Header'
import HeroClient from '../../components/sections/hero-client'
import KapNumeriquePremium from '../../components/sections/kap-numerique-premium'
import InteractivitySection from '../../components/sections/interactivity-section'

// Import dynamique de TechnicalShowcase avec options spécifiques
const TechnicalShowcase = dynamic(
  () => import('../../components/sections/technical-showcase'),
  {
    ssr: true, // On garde le SSR activé
    loading: () => (
      <div className="py-20 bg-black text-white text-center">
        <h2 className="text-3xl">Chargement de Technical Showcase...</h2>
      </div>
    ),
  }
)

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
          <Suspense fallback={
            <div className="py-20 bg-black text-white text-center">
              <h2 className="text-3xl">Chargement...</h2>
            </div>
          }>
            <TechnicalShowcase />
          </Suspense>
          {/* On teste si InteractivitySection s'affiche après TechnicalShowcase */}
          <div className="py-10 bg-red-500 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold">MARQUEUR APRÈS TECHNICAL SHOWCASE</h2>
              <p>Si vous voyez ce marqueur rouge, TechnicalShowcase est bien rendu.</p>
            </div>
          </div>
          <InteractivitySection />
        </div>
      </main>
    </>
  )
}