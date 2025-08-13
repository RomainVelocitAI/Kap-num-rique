'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Import dynamique du composant 3D pour éviter les erreurs SSR
const Hero3DContent = dynamic(
  () => import('./horizon-hero-3d-content'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <h3 className="text-4xl font-bold text-gold-500 mb-4">
              Chargement...
            </h3>
            <p className="text-gray-300 text-lg">
              L'expérience 3D arrive
            </p>
          </div>
        </div>
      </div>
    )
  }
)

export default function HorizonHeroTab() {
  return (
    <div className="w-full h-full relative">
      <Hero3DContent />
    </div>
  )
}