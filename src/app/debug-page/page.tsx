'use client'

import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import HeroClient from '../components/sections/hero-client'
import KapNumeriquePremium from '../components/sections/kap-numerique-premium'
import TechnicalShowcase from '../components/sections/technical-showcase'
import VisualEngagementSection from '../components/sections/visual-engagement-section'
import InteractivitySection from '../components/sections/interactivity-section'
import ClientOnly from '../components/ui/client-only'

// Composant de debug qui log les erreurs
const DebugSection = ({ name, children }: { name: string; children: React.ReactNode }) => {
  useEffect(() => {
    console.log(`[DEBUG] Section ${name} montée`)
    return () => console.log(`[DEBUG] Section ${name} démontée`)
  }, [name])

  try {
    return <>{children}</>
  } catch (error) {
    console.error(`[ERROR] Erreur dans la section ${name}:`, error)
    return (
      <div className="p-10 bg-red-50 border border-red-500">
        <h3 className="text-red-700 font-bold">Erreur dans {name}</h3>
        <p className="text-red-600">{String(error)}</p>
      </div>
    )
  }
}

export default function HomeDebug() {
  const [showHeader, setShowHeader] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Error boundary global
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[GLOBAL ERROR]', event)
      setErrors(prev => [...prev, `${event.message} at ${event.filename}:${event.lineno}`])
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

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
      
      {/* Affichage des erreurs globales */}
      {errors.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-50">
          <h3 className="font-bold">Erreurs détectées:</h3>
          {errors.map((error, i) => (
            <p key={i} className="text-sm">{error}</p>
          ))}
        </div>
      )}
      
      {showHeader && <Header />}
      <main>
        <DebugSection name="HeroClient">
          <HeroClient />
        </DebugSection>
        
        <div 
          className="relative bg-white" 
          style={{ 
            zIndex: 10, 
            marginTop: '-1px',
            boxShadow: '0 -50px 100px 50px rgba(255,255,255,1)'
          }}
        >
          <DebugSection name="KapNumeriquePremium">
            <KapNumeriquePremium />
          </DebugSection>
          
          <DebugSection name="TechnicalShowcase avec ClientOnly">
            <ClientOnly>
              <TechnicalShowcase />
            </ClientOnly>
          </DebugSection>
          
          <DebugSection name="VisualEngagementSection avec ClientOnly">
            <ClientOnly>
              <VisualEngagementSection />
            </ClientOnly>
          </DebugSection>
          
          <DebugSection name="InteractivitySection SANS ClientOnly">
            <InteractivitySection />
          </DebugSection>
        </div>
      </main>
    </>
  )
}