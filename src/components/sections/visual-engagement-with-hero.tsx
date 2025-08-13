'use client'

import { motion } from 'framer-motion'
import { Sparkles, MousePointer2, Eye, TrendingUp, Zap, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import ClientOnly from '../ui/client-only'

// Import dynamique du Hero modifié pour l'intégration dans l'onglet
const HeroInTab = dynamic(
  () => import('./horizon-hero-section').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Chargement du Hero 3D...</p>
      </div>
    )
  }
)

// Import du composant InteractiveArrowDemo modifié
const InteractiveArrowDemoWithHero = dynamic(
  () => import('../ui/interactive-arrow-demo-with-hero'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center bg-gray-800">
        <p className="text-gray-400">Chargement de la démonstration...</p>
      </div>
    )
  }
)

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

export default function VisualEngagementWithHero() {
  return (
    <section className="relative bg-black text-white py-24 overflow-hidden min-h-screen">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-600/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.span 
            variants={fadeInUpVariants}
            className="inline-flex items-center gap-2 text-primary-400 font-mono text-sm uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-4 h-4" />
            L'engagement visuel en 2025
            <Sparkles className="w-4 h-4" />
          </motion.span>
          
          <motion.h2 
            variants={fadeInUpVariants}
            className="font-display text-5xl lg:text-7xl mb-6"
          >
            Votre site doit <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400">BOUGER</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUpVariants}
            className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            En 2025, un site statique ne suffit plus. Les utilisateurs attendent des expériences 
            <span className="text-white font-semibold"> immersives</span>, 
            <span className="text-white font-semibold"> interactives</span> et 
            <span className="text-white font-semibold"> mémorables</span>. 
            Découvrez comment captiver votre audience dès la première seconde.
          </motion.p>
        </motion.div>

        {/* Interactive Demo avec Hero dans l'onglet Animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
              <ClientOnly
                fallback={
                  <div className="h-[600px] flex items-center justify-center bg-gray-800">
                    <p className="text-gray-400">Chargement de la démonstration...</p>
                  </div>
                }
              >
                <InteractiveArrowDemoWithHero />
              </ClientOnly>
            </div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-400 mt-4 text-sm"
          >
            👆 Explorez les différents onglets pour découvrir la puissance du mouvement
          </motion.p>
        </motion.div>


        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-3 gap-8 mb-16"
        >
          <motion.div 
            variants={fadeInUpVariants}
            className="bg-gradient-to-br from-primary-900/20 to-primary-900/10 border border-primary-800/30 rounded-xl p-8"
          >
            <h3 className="text-2xl font-serif mb-4 text-primary-300">Micro-interactions</h3>
            <p className="text-gray-300 mb-4">
              Chaque clic, chaque survol est une opportunité de surprendre. Les micro-interactions 
              créent une connexion émotionnelle instantanée avec vos visiteurs.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Boutons qui réagissent au survol</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Transitions fluides entre les états</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Feedback visuel instantané</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            variants={fadeInUpVariants}
            className="bg-gradient-to-br from-secondary-900/20 to-secondary-900/10 border border-secondary-800/30 rounded-xl p-8"
          >
            <h3 className="text-2xl font-serif mb-4 text-secondary-300">Animations narratives</h3>
            <p className="text-gray-300 mb-4">
              Racontez votre histoire avec du mouvement. Les animations guident l'œil et créent 
              un parcours visuel captivant qui maintient l'attention.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
                <span>Apparitions progressives au scroll</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
                <span>Parallaxe et effets de profondeur</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-0.5" />
                <span>Storytelling visuel immersif</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            variants={fadeInUpVariants}
            className="bg-gradient-to-br from-accent-900/20 to-accent-900/10 border border-accent-800/30 rounded-xl p-8"
          >
            <h3 className="text-2xl font-serif mb-4 text-accent-300">Expériences 3D</h3>
            <p className="text-gray-300 mb-4">
              Plongez vos visiteurs dans un univers tridimensionnel. Les éléments 3D créent 
              une expérience unique et mémorable qui vous démarque.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <span>Modèles 3D interactifs</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <span>Environnements immersifs</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <span>Visualisations de données en 3D</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h3 
            variants={fadeInUpVariants}
            className="text-3xl font-serif mb-6"
          >
            Prêt à faire <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400">bouger</span> votre site ?
          </motion.h3>
          <motion.p 
            variants={fadeInUpVariants}
            className="text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Ne laissez plus vos visiteurs s'ennuyer. Offrez-leur une expérience web qui 
            captive, engage et convertit. Avec Kap Numérique, transformez votre vision en réalité interactive.
          </motion.p>
          <motion.div
            variants={fadeInUpVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium py-4 px-8 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 inline-flex items-center gap-2">
              Découvrir nos créations interactives
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}