'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { Component as HeroSection } from '@/components/sections/horizon-hero-section'
import KapNumeriquePremium from '@/components/sections/kap-numerique-premium'
import TechnicalShowcase from '@/components/sections/technical-showcase'

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
        <HeroSection />
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