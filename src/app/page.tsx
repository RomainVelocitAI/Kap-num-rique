'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/layout/Header'
import HeroOptimized from '../components/sections/hero-optimized'

// Lazy load des sections non critiques
const KapNumeriquePremium = dynamic(
  () => import('../components/sections/kap-numerique-premium'),
  { 
    loading: () => <div className="animate-pulse bg-gray-100 h-96" />,
    ssr: true 
  }
)

const TechnicalShowcase = dynamic(
  () => import('../components/sections/technical-showcase'),
  { 
    loading: () => <div className="animate-pulse bg-black h-screen" />,
    ssr: false // Désactive SSR car utilise window et performance API
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
      {showHeader && <Header />}
      <main>
        <HeroOptimized />
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
          <TechnicalShowcase />
        </div>
      </main>
    </>
  )
}