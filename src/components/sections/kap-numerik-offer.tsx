'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Euro, Globe, Lock, Smartphone, BookOpen, Headphones, Calendar, Shield, CreditCard, Zap, Crown, ChevronRight, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const features = [
  {
    icon: Globe,
    title: "Site vitrine clé en main",
    description: "Design professionnel et moderne",
    highlight: "COMPLET"
  },
  {
    icon: Smartphone,
    title: "Design responsive premium",
    description: "Pixel-perfect sur tous les écrans",
    highlight: "100%"
  },
  {
    icon: Zap,
    title: "Performance maximale",
    description: "Score 90+ garanti",
    highlight: "RAPIDE"
  },
  {
    icon: Shield,
    title: "SEO & Sécurité intégrés",
    description: "1ère page Google visée",
    highlight: "TOP"
  },
  {
    icon: BookOpen,
    title: "Formation VIP incluse",
    description: "Maîtrisez votre site à 100%",
    highlight: "OFFERT"
  },
  {
    icon: Headphones,
    title: "Support premium 90 jours",
    description: "Ligne directe avec nos experts",
    highlight: "EXCLUSIF"
  },
  {
    icon: Globe,
    title: "Hébergement professionnel",
    description: "12 mois offerts, SSL inclus",
    highlight: "GRATUIT"
  },
  {
    icon: Lock,
    title: "Conformité totale",
    description: "RGPD, mentions légales, tout",
    highlight: "CERTIFIÉ"
  }
]

export default function KapNumerikOfferSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [companyType, setCompanyType] = useState('')
  const [employees, setEmployees] = useState('')
  const [revenue, setRevenue] = useState('')
  const [location, setLocation] = useState('')
  const [showResult, setShowResult] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  // Vérification d'éligibilité
  const checkEligibility = () => {
    const emp = parseInt(employees)
    const rev = parseInt(revenue)
    
    // Vérification des critères
    if (location !== 'reunion') return { eligible: false, reason: "Vous devez être domicilié à La Réunion" }
    
    if (companyType === 'entreprise') {
      if (emp >= 20) return { eligible: false, reason: "Les entreprises doivent avoir moins de 20 salariés" }
      if (emp < 10 && rev > 500000) return { eligible: false, reason: "Pour les entreprises de moins de 10 salariés, le CA doit être inférieur à 500 000€" }
      if (emp >= 10 && emp < 20 && rev > 1000000) return { eligible: false, reason: "Pour les entreprises de 10-19 salariés, le CA doit être inférieur à 1 000 000€" }
      return { eligible: true, percentage: emp < 10 ? 80 : 50, max: emp < 10 ? 1200 : 1200 }
    }
    
    if (companyType === 'association') {
      if (emp >= 10) return { eligible: false, reason: "Les associations doivent avoir moins de 10 salariés" }
      return { eligible: true, percentage: 80, max: 1200 }
    }
    
    if (companyType === 'profession-liberale') {
      if (rev > 500000) return { eligible: false, reason: "Les professions libérales doivent avoir un CA inférieur à 500 000€" }
      return { eligible: true, percentage: 80, max: 1200 }
    }
    
    return { eligible: false, reason: "Veuillez remplir tous les champs" }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResult(true)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Epic price reveal animation
      gsap.timeline({
        scrollTrigger: {
          trigger: priceRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => setIsVisible(true),
          onLeaveBack: () => setIsVisible(false)
        }
      })
      
      // Feature cards 3D effect
      gsap.utils.toArray('.premium-feature').forEach((card, i) => {
        gsap.fromTo(card as Element,
          { 
            rotationY: -15,
            z: -50,
            opacity: 0,
            scale: 0.9
          },
          {
            rotationY: 0,
            z: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card as Element,
              start: 'top 85%'
            }
          }
        )
      })

      // Floating elements
      gsap.to('.float-element', {
        y: 20,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#199CB7]/10 to-gray-50" />
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{ y: parallaxY }}
        >
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#199CB7]/20 rounded-full blur-[100px] float-element" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8B1431]/20 rounded-full blur-[100px] float-element" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#DA6530]/20 rounded-full blur-[100px] float-element" />
        </motion.div>
        
        {/* Removed grid pattern for cleaner look */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Badge className="bg-gradient-to-r from-[#199CB7] to-[#127387] text-white border-0 px-6 py-3 text-lg font-semibold">
              <Shield className="w-5 h-5 mr-2" />
              SUBVENTION D'ÉTAT KAP NUMÉRIK
            </Badge>
          </motion.div>

          <motion.h2 
            className="text-6xl md:text-8xl font-display font-bold mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-gray-900">VOTRE SITE PRO</span>
            <br />
            <span className="bg-gradient-to-r from-[#8B1431] to-[#DA6530] bg-clip-text text-transparent">
              FINANCÉ À 80%
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto"
          >
            Programme officiel de la Région Réunion et de l'Union Européenne pour accompagner 
            la transformation numérique de votre entreprise
          </motion.p>
        </div>

        {/* Epic Price Reveal */}
        <div ref={priceRef} className="mb-32">
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="relative max-w-4xl mx-auto"
              >
                {/* Price card with 3D effect */}
                <motion.div 
                  className="relative bg-gradient-to-br from-[#DA6530] via-[#DA6530] to-[#C55420] rounded-3xl p-12 shadow-2xl"
                  style={{ transformStyle: 'preserve-3d', scale }}
                  whileHover={{ 
                    rotateY: 5,
                    rotateX: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-3xl animate-shimmer" />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Crown className="w-10 h-10 text-white" />
                      <h3 className="text-3xl font-display text-white uppercase tracking-wider">
                        Subvention Kap Numérik
                      </h3>
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    
                    <div className="mb-6">
                      <motion.div 
                        className="text-8xl md:text-9xl font-display font-black text-white leading-none"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        1 200€
                      </motion.div>
                      <div className="text-3xl font-bold text-white">REMBOURSÉS</div>
                    </div>
                    
                    <div className="bg-white/95 text-gray-900 rounded-2xl p-6">
                      <p className="text-2xl font-semibold mb-2 text-[#8B1431]">
                        Soit seulement 300€ de votre poche
                      </p>
                      <p className="text-lg text-gray-700">
                        Pour un site professionnel d'une valeur de 1 500€
                      </p>
                    </div>
                  </div>

                  {/* 3D shadow */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] h-20 bg-[#DA6530]/20 rounded-full blur-xl" />
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-8 -left-8 bg-[#199CB7] text-white rounded-full p-4 shadow-lg"
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Euro className="w-8 h-8" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#199CB7] text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
                    SUBVENTION
                  </span>
                </motion.div>

                <motion.div
                  className="absolute -top-8 -right-8 bg-green-600 text-white rounded-full p-4 shadow-lg"
                  animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <Check className="w-8 h-8" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
                    ÉLIGIBLE
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium Features Grid */}
        <div className="mb-32">
          <motion.h3 
            className="text-5xl md:text-6xl font-display text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            TOUT EST <span className="text-[#DA6530]">INCLUS</span>
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="premium-feature relative"
                style={{ perspective: '1000px' }}
              >
                <div className="group h-full bg-gradient-to-br from-white to-gray-50 border border-[#199CB7]/30 rounded-2xl p-6 hover:border-[#199CB7]/50 transition-all duration-300 transform hover:scale-105 shadow-md">
                  {/* Highlight badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#DA6530] to-[#DA6530] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {feature.highlight}
                  </div>
                  
                  {/* Icon container */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#199CB7]/20 to-[#DA6530]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-[#199CB7]" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#199CB7]/0 to-[#DA6530]/0 group-hover:from-[#199CB7]/10 group-hover:to-[#DA6530]/10 rounded-2xl transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Eligibility Checker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-4xl md:text-5xl font-display text-gray-900 mb-4 text-center">
            ÊTES-VOUS ÉLIGIBLE ?
          </h3>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Vérifiez en quelques secondes si votre structure peut bénéficier de la subvention Kap Numérik
          </p>
          
          {/* Formulaire d'éligibilité */}
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-primary-500/30"
            >
              {!showResult ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type de structure */}
                  <div>
                    <label className="text-sm text-gray-600 mb-3 block">Type de structure</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'entreprise', label: 'Entreprise', icon: Globe },
                        { value: 'association', label: 'Association', icon: Shield },
                        { value: 'profession-liberale', label: 'Profession libérale', icon: BookOpen }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setCompanyType(type.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            companyType === type.value
                              ? 'border-[#199CB7] bg-[#199CB7]/10 text-gray-900'
                              : 'border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <type.icon className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-sm font-medium">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nombre de salariés */}
                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Nombre de salariés</label>
                    <input
                      type="number"
                      value={employees}
                      onChange={(e) => setEmployees(e.target.value)}
                      placeholder="Ex: 5"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-[#199CB7] focus:outline-none"
                      required
                    />
                  </div>

                  {/* Chiffre d'affaires */}
                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Chiffre d'affaires annuel (€)</label>
                    <input
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="Ex: 250000"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-[#199CB7] focus:outline-none"
                      required
                    />
                  </div>

                  {/* Localisation */}
                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Siège social</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:border-[#199CB7] focus:outline-none"
                      required
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="reunion">La Réunion</option>
                      <option value="metropole">Métropole</option>
                      <option value="autre">Autre DOM-TOM</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#8B1431] to-[#8B1431] hover:from-[#8B1431]/90 hover:to-[#8B1431]/90 text-white"
                  >
                    Vérifier mon éligibilité
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  {checkEligibility().eligible ? (
                    <>
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-500" />
                      </div>
                      <h4 className="text-3xl font-bold text-green-500 mb-4">Félicitations ! Vous êtes éligible</h4>
                      <div className="bg-green-900/20 rounded-2xl p-6 mb-6 border border-green-500/30">
                        <p className="text-xl text-gray-900 mb-2">
                          Votre site web sera subventionné à <span className="font-bold text-green-400">{checkEligibility().percentage}%</span>
                        </p>
                        <p className="text-lg text-gray-600">
                          Jusqu'à <span className="font-bold text-green-400">{checkEligibility().max}€</span> de subvention
                        </p>
                      </div>
                      <p className="text-gray-700 mb-8">
                        Soit seulement <span className="text-xl font-bold text-[#DA6530]">{1500 - checkEligibility().max}€</span> à votre charge pour un site professionnel complet
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => setShowResult(false)}
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:text-gray-900"
                        >
                          Refaire le test
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-[#DA6530] to-[#DA6530] hover:from-[#DA6530]/90 hover:to-[#DA6530]/90">
                          <Link href="#contact">
                            Demander un devis gratuit
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-10 h-10 text-red-500" />
                      </div>
                      <h4 className="text-3xl font-bold text-red-500 mb-4">Désolé, vous n'êtes pas éligible</h4>
                      <p className="text-lg text-gray-600 mb-8">{checkEligibility().reason}</p>
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={() => setShowResult(false)}
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:text-gray-900"
                        >
                          Refaire le test
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-[#199CB7] to-[#199CB7] hover:from-[#199CB7]/90 hover:to-[#199CB7]/90">
                          <Link href="#contact">
                            Voir nos autres offres
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Compliance Section Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#8B1431]/10 to-[#DA6530]/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-20 border border-[#8B1431]/30"
        >
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-12 h-12 text-[#199CB7]" />
            <h3 className="text-3xl font-display text-gray-900">
              100% CONFORME AUX EXIGENCES
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Mentions légales",
                desc: "Conformité LCEN garantie",
                icon: "✅"
              },
              {
                title: "RGPD intégré", 
                desc: "Protection des données",
                icon: "🔒"
              },
              {
                title: "Logos officiels",
                desc: "Région + Europe inclus",
                icon: "🇪🇺"
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-[#8B1431]/30">
            <p className="text-lg text-[#8B1431] italic text-center">
              « Ce site a été cofinancé par l'Union Européenne »
            </p>
            <p className="text-sm text-[#8B1431]/70 text-center mt-2">
              Mention automatiquement intégrée dans votre footer
            </p>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-4xl md:text-6xl font-display text-gray-900 mb-8">
            DÉMARREZ VOTRE <span className="text-[#DA6530]">TRANSFORMATION NUMÉRIQUE</span>
          </h3>
          
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Profitez de cette opportunité offerte par la Région Réunion et l'Union Européenne 
            pour digitaliser votre entreprise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-gradient-to-r from-[#DA6530] to-[#DA6530] hover:from-[#DA6530]/90 hover:to-[#DA6530]/90 text-white text-xl px-12 py-8 rounded-full shadow-2xl shadow-[#DA6530]/25">
                <Link href="#contact" className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  DEMANDER UN DEVIS GRATUIT
                  <ChevronRight className="w-6 h-6" />
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <p className="text-sm text-gray-500">
            Étude de votre éligibilité • Accompagnement complet • Paiement après versement de la subvention
          </p>
        </motion.div>
      </div>
    </section>
  )
}