'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles, FileText, Zap } from 'lucide-react'
import AutomatedForm from './automated-form'

const InteractivitySection = () => {

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Formulaires Intelligents</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-gray-900">
            Collectez les informations{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              intelligemment
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des formulaires dynamiques qui s'adaptent automatiquement aux réponses 
            de vos visiteurs pour une expérience personnalisée et optimisée.
          </p>
        </motion.div>


        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Formulaires Dynamiques
                  </h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-900">Logique conditionnelle :</span> Les 
                      questions s'adaptent automatiquement selon les réponses précédentes
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-900">Validation en temps réel :</span> Détection 
                      instantanée des erreurs pour une meilleure expérience utilisateur
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-900">Intégrations multiples :</span> Connexion 
                      directe avec vos outils CRM, email marketing et bases de données
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Avantages</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">Formulaires intelligents</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Expérience utilisateur optimisée</p>
                </div>
              </div>

              <AutomatedForm />
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Collectez efficacement les informations de vos visiteurs avec des formulaires intelligents
          </p>
          <button className="px-8 py-4 bg-gradient-primary hover:bg-gradient-primary-reverse text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 shadow-primary">
            <Send className="w-5 h-5" />
            Voir plus d'exemples
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default InteractivitySection