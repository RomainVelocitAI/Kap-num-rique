'use client'

import { motion } from 'framer-motion'
import { Sparkles, MousePointer2, Eye, TrendingUp, Zap, ArrowRight } from 'lucide-react'
import InteractiveArrowDemo from '../ui/interactive-arrow-demo'
import ClientOnly from '../ui/client-only'

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

export default function VisualEngagementSection() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 text-gray-900 py-24 overflow-hidden min-h-screen">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#199CB7]/10 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#DA6530]/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '3s' }} />
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
            className="inline-flex items-center gap-2 text-[#199CB7] font-mono text-sm uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-4 h-4" />
            L'engagement visuel en 2025
            <Sparkles className="w-4 h-4" />
          </motion.span>
          
          <motion.h2 
            variants={fadeInUpVariants}
            className="font-display text-5xl lg:text-7xl mb-6"
          >
            Votre site doit <span className="text-gradient bg-gradient-to-r from-[#199CB7] to-[#DA6530]">BOUGER</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUpVariants}
            className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
          >
            En 2025, un site statique ne suffit plus. Les utilisateurs attendent des expériences 
            <span className="text-gray-900 font-semibold"> immersives</span>, 
            <span className="text-gray-900 font-semibold"> interactives</span> et 
            <span className="text-gray-900 font-semibold"> mémorables</span>. 
            Découvrez comment captiver votre audience dès la première seconde.
          </motion.p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#199CB7] to-[#DA6530] rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <ClientOnly
                fallback={
                  <div className="h-[600px] flex items-center justify-center bg-gray-50">
                    <p className="text-gray-600">Chargement de la démonstration...</p>
                  </div>
                }
              >
                <InteractiveArrowDemo />
              </ClientOnly>
            </div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-600 mt-4 text-sm"
          >
            👆 Bougez votre souris et observez la magie opérer
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
            className="bg-gradient-to-br from-[#199CB7]/10 to-[#199CB7]/5 border border-[#199CB7]/30 rounded-xl p-8"
          >
            <h3 className="text-2xl font-serif mb-4 text-[#199CB7]">Micro-interactions</h3>
            <p className="text-gray-700 mb-4">
              Chaque clic, chaque survol est une opportunité de surprendre. Les micro-interactions 
              créent une connexion émotionnelle instantanée avec vos visiteurs.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#199CB7] flex-shrink-0 mt-0.5" />
                <span>Boutons qui réagissent au survol</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#199CB7] flex-shrink-0 mt-0.5" />
                <span>Transitions fluides entre les états</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#199CB7] flex-shrink-0 mt-0.5" />
                <span>Feedback visuel instantané</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            variants={fadeInUpVariants}
            className="bg-gradient-to-br from-[#DA6530]/10 to-[#DA6530]/5 border border-[#DA6530]/30 rounded-xl p-8"
          >
            <h3 className="text-2xl font-serif mb-4 text-[#DA6530]">Animations narratives</h3>
            <p className="text-gray-700 mb-4">
              Racontez votre histoire avec du mouvement. Les animations guident l'œil et créent 
              un parcours visuel captivant qui maintient l'attention.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#DA6530] flex-shrink-0 mt-0.5" />
                <span>Apparitions progressives au scroll</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#DA6530] flex-shrink-0 mt-0.5" />
                <span>Parallaxe et effets de profondeur</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#DA6530] flex-shrink-0 mt-0.5" />
                <span>Storytelling visuel immersif</span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            variants={fadeInUpVariants}
            className="bg-gradient-to-br from-[#8B1431]/10 to-[#8B1431]/5 border border-[#8B1431]/30 rounded-xl p-8"
          >
            <h3 className="text-2xl font-serif mb-4 text-[#8B1431]">Expériences 3D</h3>
            <p className="text-gray-700 mb-4">
              Plongez vos visiteurs dans un univers tridimensionnel. Les éléments 3D créent 
              une expérience unique et mémorable qui vous démarque.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#8B1431] flex-shrink-0 mt-0.5" />
                <span>Modèles 3D interactifs</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#8B1431] flex-shrink-0 mt-0.5" />
                <span>Environnements immersifs</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#8B1431] flex-shrink-0 mt-0.5" />
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
            Prêt à faire <span className="text-gradient bg-gradient-to-r from-[#199CB7] to-[#DA6530]">bouger</span> votre site ?
          </motion.h3>
          <motion.p 
            variants={fadeInUpVariants}
            className="text-gray-700 mb-8 max-w-2xl mx-auto"
          >
            Ne laissez plus vos visiteurs s'ennuyer. Offrez-leur une expérience web qui 
            captive, engage et convertit. Avec Kap Numérique, transformez votre vision en réalité interactive.
          </motion.p>
          <motion.div
            variants={fadeInUpVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="bg-gradient-to-r from-[#8B1431] to-[#DA6530] text-white font-medium py-4 px-8 rounded-lg hover:shadow-lg hover:shadow-[#8B1431]/25 transition-all duration-300 inline-flex items-center gap-2">
              Découvrir nos créations interactives
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}