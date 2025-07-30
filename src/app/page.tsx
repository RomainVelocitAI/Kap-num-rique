'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { Component as HeroSection } from '@/components/sections/horizon-hero-section'
import KapNumeriquePremium from '@/components/sections/kap-numerique-premium'

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
        <KapNumeriquePremium />
      </main>
    </>
  )
}