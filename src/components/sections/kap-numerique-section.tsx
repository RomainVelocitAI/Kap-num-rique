'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Euro, Users, Zap, Target, HeartHandshake, Award } from 'lucide-react'

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

export default function KapNumeriqueSection() {
  return (
    <section className="relative bg-white text-gray-900 py-24 overflow-hidden min-h-screen" style={{ position: 'relative', zIndex: 10, backgroundColor: 'white' }}>
      {/* Overlay to hide any bleed from hero */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-white" style={{ marginTop: '-1px' }} />
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '3s' }} />
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
            className="inline-block text-primary-600 font-mono text-sm uppercase tracking-wider mb-4"
          >
            Dispositif d'aide régionale
          </motion.span>
          
          <motion.h2 
            variants={fadeInUpVariants}
            className="font-display text-5xl lg:text-7xl mb-6"
          >
            KAP <span className="text-gradient bg-gradient-to-r from-primary-500 to-secondary-500">NUMÉRIQUE</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUpVariants}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Jusqu'à <span className="text-primary-600 font-bold">3 200€</span> pour développer votre présence digitale à La Réunion 🇷🇪
          </motion.p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left column - What is Kap Numérique */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUpVariants} className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-lg">
              <h3 className="font-serif text-2xl mb-4 flex items-center gap-3">
                <Zap className="text-primary-600" />
                C'est quoi le Kap Numérique ?
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Le Kap Numérique est une aide régionale pouvant aller jusqu'à 3 200€, destinée aux entreprises réunionnaises qui souhaitent booster leur présence en ligne.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Elle permet de financer des prestations comme la création ou refonte de site web, la publicité en ligne, ou la stratégie de communication digitale.
              </p>
            </motion.div>

            <motion.div variants={fadeInUpVariants} className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-lg">
              <h3 className="font-serif text-2xl mb-4 flex items-center gap-3">
                <Target className="text-primary-600" />
                Êtes-vous éligible ?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-600">Entreprises basées à La Réunion</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-600">Moins de 20 salariés</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-600">CA inférieur à 1 000 000€</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-600">Projet digital concret (site web, visibilité, publicité)</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Right column - Amount and support */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUpVariants} className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-lg">
              <h3 className="font-serif text-2xl mb-6 flex items-center gap-3">
                <Euro className="text-primary-600" />
                Montant de la subvention
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-500 mb-2">80%</div>
                  <div className="text-sm text-gray-400">du devis HT</div>
                  <div className="text-xs text-gray-500 mt-2">0 à 9 salariés</div>
                </div>
                <div className="text-center p-6 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-secondary-500 mb-2">50%</div>
                  <div className="text-sm text-gray-400">du devis HT</div>
                  <div className="text-xs text-gray-500 mt-2">10 à 19 salariés</div>
                </div>
              </div>
              
              <p className="text-center text-gray-600 text-sm mt-4">
                Plafond maximal : <span className="text-primary-600 font-bold">3 200€</span>
              </p>
            </motion.div>

            <motion.div variants={fadeInUpVariants} className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-lg">
              <h3 className="font-serif text-2xl mb-4 flex items-center gap-3">
                <HeartHandshake className="text-primary-600" />
                Kap Numérique vous accompagne
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                De l'audit à la réalisation, nous vous guidons à chaque étape. Nos experts vous conseillent, structurent votre projet et assurent la mise en œuvre de votre stratégie digitale avec méthode et efficacité.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                Monter mon dossier
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom features */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-4 gap-6"
        >
          {[
            { icon: Award, title: "Agence référencée", desc: "Officiellement référencée Kap Numérique" },
            { icon: Users, title: "+100 clients", desc: "TPE, PME et indépendants accompagnés" },
            { icon: HeartHandshake, title: "100% Local", desc: "Né ici, pour les entreprises d'ici" },
            { icon: Zap, title: "Efficaces", desc: "On explique tout, simplement" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariants}
              className="text-center p-6 glass-effect rounded-xl"
            >
              <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
              <h4 className="font-medium mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}