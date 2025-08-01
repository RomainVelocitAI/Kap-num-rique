'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, TrendingUp, Shield, Clock, Award, Check, X, Zap, Crown, Rocket } from 'lucide-react'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function KapNumeriquePremium() {
  const sectionRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal animation
      gsap.from('.hero-word', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })

      // Numbers counter animation
      const counters = document.querySelectorAll('.counter')
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0')
        
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(counter, {
              innerText: target,
              duration: 2,
              snap: { innerText: 1 },
              ease: 'power2.out'
            })
          }
        })
      })

      // Feature cards stagger animation
      gsap.from('.feature-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 70%'
        }
      })

      // Timeline dots animation - commented out as elements don't exist
      // gsap.from('.timeline-dot', {
      //   scale: 0,
      //   opacity: 0,
      //   duration: 0.5,
      //   stagger: 0.1,
      //   ease: 'back.out(2)',
      //   scrollTrigger: {
      //     trigger: '.timeline-container',
      //     start: 'top 70%'
      //   }
      // })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging && e.type !== 'mousemove') return
    
    const container = e.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const relativeX = x - rect.left
    const percentage = (relativeX / rect.width) * 100
    
    setSliderPosition(Math.min(Math.max(percentage, 0), 100))
  }

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      style={{ position: 'relative', zIndex: 20 }}
    >
      {/* Premium separation from hero */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ y: parallaxY }}
      >
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        {/* Hero Statement */}
        <div ref={heroRef} className="text-center mb-24">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <span className="hero-word text-5xl md:text-7xl font-display text-gray-900">SITE</span>
            <span className="hero-word text-5xl md:text-7xl font-display text-gray-900">SUBVENTIONNÉ</span>
            <span className="hero-word text-6xl md:text-8xl font-display text-red-600">≠</span>
            <span className="hero-word text-5xl md:text-7xl font-display text-gray-400 line-through decoration-4">SITE BÂCLÉ</span>
          </div>
          <p className="hero-word text-xl md:text-2xl text-gray-600 mt-6 max-w-3xl mx-auto">
            <span className="font-bold text-gray-900">Nous faisons du premium.</span> Eux profitent de votre ignorance.
          </p>
          <p className="hero-word text-lg md:text-xl text-gray-500 mt-4 max-w-2xl mx-auto">
            Ce n'est pas parce que c'est financé par des aides que vous devez accepter un travail au rabais.
          </p>
        </div>

        {/* Interactive Comparison Section */}
        <div ref={comparisonRef} className="mb-32 max-w-7xl mx-auto">
          <h3 className="text-5xl md:text-8xl font-display text-center mb-16 text-gray-900 uppercase tracking-tight">
            CE QU'ILS NE VOUS <span className="text-red-600">DIRONT</span> <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">JAMAIS</span>
          </h3>
          
          <div 
            className="relative h-[700px] rounded-none overflow-hidden cursor-ew-resize shadow-2xl border-8 border-black"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleSliderMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleSliderMove}
          >
            {/* Left side - Templates Réchauffés */}
            <div className="absolute inset-0 bg-black">
              <div className="p-8 md:p-12 h-full flex flex-col">
                {/* Effet néon cassé */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-64 h-64 bg-red-600 rounded-full blur-3xl animate-pulse" />
                </div>
                
                <h4 className="text-4xl md:text-6xl font-display text-white mb-2 tracking-wider">
                  ILS VOUS FONT UN
                </h4>
                <h4 className="text-5xl md:text-7xl font-display text-red-600 mb-8 animate-pulse">
                  SITE VITRINE
                </h4>
                
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                    {/* Site template générique */}
                    <div className="bg-gray-900 border-2 border-red-600 p-4 md:p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 mb-4">
                        <X className="w-10 h-10 text-red-600" strokeWidth={3} />
                        <h5 className="font-display text-xl text-white tracking-wide">SITE TEMPLATE</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-gray-500 mb-2">COPIÉ-COLLÉ</p>
                        <p className="text-sm text-gray-400">Comme 1000 autres</p>
                      </div>
                      <p className="font-sans font-bold text-red-400 uppercase text-sm text-center">
                        Zéro personnalité
                      </p>
                    </div>

                    {/* Version obsolète */}
                    <div className="bg-gray-900 border-2 border-red-600 p-4 md:p-6 transform rotate-2 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 mb-4">
                        <X className="w-10 h-10 text-red-600" strokeWidth={3} />
                        <h5 className="font-display text-xl text-white tracking-wide">JAMAIS MIS À JOUR</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-gray-500">2019</p>
                        <p className="text-sm text-gray-400">Dernière MAJ</p>
                      </div>
                      <p className="font-sans font-bold text-red-400 uppercase text-sm text-center">
                        Technologie dépassée
                      </p>
                    </div>

                    {/* Invisible sur Google */}
                    <div className="bg-gray-900 border-2 border-red-600 p-4 md:p-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 mb-4">
                        <X className="w-10 h-10 text-red-600" strokeWidth={3} />
                        <h5 className="font-display text-xl text-white tracking-wide">ZÉRO SEO</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-gray-500">PAGE 10</p>
                        <p className="text-sm text-gray-400">sur Google</p>
                      </div>
                      <p className="font-sans font-bold text-red-400 uppercase text-sm text-center">
                        Personne ne vous trouve
                      </p>
                    </div>

                    {/* Performance catastrophique */}
                    <div className="bg-gray-900 border-2 border-red-600 p-4 md:p-6 transform rotate-1 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 mb-4">
                        <X className="w-10 h-10 text-red-600" strokeWidth={3} />
                        <h5 className="font-display text-xl text-white tracking-wide">SCORE AU ROUGE</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-4xl font-bold text-red-500">40/100</p>
                        <p className="text-sm text-gray-400">Performance</p>
                      </div>
                      <p className="font-sans font-bold text-red-400 uppercase text-sm text-center">
                        Lent comme un escargot
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-5xl font-display text-red-600 mb-2 animate-pulse">TRAVAIL BÂCLÉ</p>
                  <p className="font-sans font-bold text-gray-400 uppercase tracking-wider">
                    Parce que "c'est gratuit pour vous"
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Kap Premium */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="p-8 md:p-12 h-full flex flex-col">
                {/* Effet brillance or */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-shimmer" />
                </div>
                
                <h4 className="text-4xl md:text-6xl font-display text-black mb-2 tracking-wider">
                  NOUS CRÉONS UNE
                </h4>
                <h4 className="text-5xl md:text-7xl font-display text-white mb-8" style={{ textShadow: '3px 3px 0 #000' }}>
                  MACHINE À VENDRE
                </h4>
                
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                    {/* Design unique */}
                    <div className="bg-black text-white p-4 md:p-6 transform -rotate-2 hover:rotate-0 transition-transform shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Crown className="w-10 h-10 text-gold-400" strokeWidth={3} />
                        <h5 className="font-display text-xl tracking-wide">100% SUR MESURE</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-gold-400 mb-2">UNIQUE</p>
                        <p className="text-sm text-gold-300">Votre identité</p>
                      </div>
                      <p className="font-sans font-bold uppercase text-sm text-gold-400 text-center">
                        Créé spécialement pour vous
                      </p>
                    </div>

                    {/* 100% automatisé */}
                    <div className="bg-black text-white p-4 md:p-6 transform rotate-2 hover:rotate-0 transition-transform shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Rocket className="w-10 h-10 text-gold-400" strokeWidth={3} />
                        <h5 className="font-display text-xl tracking-wide">100% AUTOMATISÉ</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-gold-400">24/7</p>
                        <p className="text-sm text-gold-300">sans vous</p>
                      </div>
                      <p className="font-sans font-bold uppercase text-sm text-gold-400 text-center">
                        Assistant IA 24/7
                      </p>
                    </div>

                    {/* Première page Google */}
                    <div className="bg-black text-white p-4 md:p-6 transform -rotate-1 hover:rotate-0 transition-transform shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-10 h-10 text-gold-400" strokeWidth={3} />
                        <h5 className="font-display text-xl tracking-wide">TOP GOOGLE</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-gold-400">PAGE 1</p>
                        <p className="text-sm text-gold-300">garanti</p>
                      </div>
                      <p className="font-sans font-bold uppercase text-sm text-gold-400 text-center">
                        SEO intégré, vous dominez
                      </p>
                    </div>

                    {/* Score 90+ garanti */}
                    <div className="bg-black text-white p-4 md:p-6 transform rotate-1 hover:rotate-0 transition-transform shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="w-10 h-10 text-gold-400" strokeWidth={3} />
                        <h5 className="font-display text-xl tracking-wide">PERFORMANCE MAX</h5>
                      </div>
                      <div className="text-center py-4">
                        <p className="text-4xl font-bold text-green-400">90+/100</p>
                        <p className="text-sm text-gold-300">Score garanti</p>
                      </div>
                      <p className="font-sans font-bold uppercase text-sm text-gold-400 text-center">
                        Ultra rapide, Google vous adore
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-5xl font-display text-black mb-2" style={{ textShadow: '2px 2px 0 #FFD700' }}>
                    SITE QUI RAPPORTE
                  </p>
                  <p className="font-sans font-bold text-black uppercase tracking-wider">
                    Votre meilleur commercial
                  </p>
                </div>
              </div>
            </div>

            {/* Slider handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                  <path d="M8 9L5 12L8 15M16 9L19 12L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-6 py-3 rounded-full text-sm font-medium pointer-events-none">
              Glissez pour découvrir la différence
            </div>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="features-grid grid md:grid-cols-3 gap-8 mb-32 bg-gray-100 p-12 rounded-3xl">
          <h2 className="col-span-full text-4xl font-display text-center mb-12 text-gray-900">
            POURQUOI NOUS SOMMES DIFFÉRENTS
          </h2>
          {[
            {
              icon: Zap,
              title: "VITESSE ÉCLAIR",
              subtitle: "En ligne en 48h",
              description: "Site en ligne en 48h. Les autres? 3 semaines de templates.",
              accent: "text-yellow-500"
            },
            {
              icon: Shield,
              title: "GARANTIE TOTALE",
              subtitle: "100% ou remboursé",
              description: "Satisfait ou remboursé. Site premium garanti. Zéro risque.",
              accent: "text-green-500"
            },
            {
              icon: Crown,
              title: "SERVICE PREMIUM",
              subtitle: "Expert dédié",
              description: "Un expert qui connaît votre dossier par cœur. Pas 15 interlocuteurs.",
              accent: "text-purple-500"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              className="feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <feature.icon className={`w-12 h-12 ${feature.accent} mb-4`} />
              <h4 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-500 mb-3">{feature.subtitle}</p>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>


        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-3xl md:text-5xl font-display mb-6 text-gray-900">
            CHAQUE JOUR SANS SITE = CLIENTS PERDUS
          </h3>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Vos concurrents ont déjà commencé. Ne leur laissez pas vos clients.
          </p>
          
          <motion.button
            className="relative bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-xl py-6 px-12 rounded-full shadow-2xl hover:shadow-gold-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">JE VEUX UN SITE QUI CARTONNE</span>
            <Rocket className="inline-block ml-3 w-6 h-6" />
          </motion.button>
          
          <p className="mt-6 text-sm text-gray-500">
            Réponse en 24h • 100% gratuit • Sans engagement
          </p>
        </div>
      </div>
    </section>
  )
}