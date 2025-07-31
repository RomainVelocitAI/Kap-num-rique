'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Sparkles, FileText, Zap, Bot } from 'lucide-react'
import AutomatedForm from './automated-form'
import AiChatbot from './ai-chatbot'

const InteractivitySection = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'chat'>('form')

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
            <span className="text-sm font-medium">Interactivité Avancée</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-gray-900">
            Engagez vos visiteurs{' '}
            <span className="text-gradient bg-gradient-to-r from-primary to-accent">
              intelligemment
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des formulaires intelligents qui s'adaptent aux réponses et un assistant IA 
            disponible 24/7 pour répondre instantanément aux questions de vos visiteurs.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-full shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Formulaires Intelligents
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Assistant IA
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'form' ? (
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
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Suivi des interactions :</span> Analysez 
                        le comportement des utilisateurs pour améliorer vos formulaires
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
            ) : (
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <AiChatbot />
                </div>
                
                <div className="order-1 lg:order-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Assistant IA 24/7
                    </h3>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Réponses instantanées :</span> Plus 
                        besoin d'attendre, vos visiteurs obtiennent des réponses immédiates
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Base de connaissances :</span> Réponses 
                        personnalisées basées sur vos informations produits et services
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Multilingue :</span> Communiquez 
                        avec vos visiteurs dans leur langue préférée automatiquement
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Personnalisation complète :</span> Adaptez 
                        les réponses et le design à votre marque
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-sm text-gray-600 mb-2">Avantages</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">Support 24/7</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Vos visiteurs ne restent jamais sans réponse</p>
                  </div>
                </div>
              </div>
            )}
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
            Transformez vos visiteurs en clients avec des interactions intelligentes
          </p>
          <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
            <Send className="w-5 h-5" />
            Découvrir la démo complète
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default InteractivitySection