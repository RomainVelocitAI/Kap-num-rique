'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, User, Mail, Building, Phone, MessageSquare, Sparkles } from 'lucide-react'

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  projectType: string
  budget: string
  message: string
}

const AutomatedForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const steps = [
    {
      id: 'contact',
      title: 'Vos coordonnées',
      fields: ['name', 'email']
    },
    {
      id: 'company',
      title: 'Votre entreprise',
      fields: ['company', 'phone']
    },
    {
      id: 'project',
      title: 'Votre projet',
      fields: ['projectType', 'budget']
    },
    {
      id: 'details',
      title: 'Plus de détails',
      fields: ['message']
    }
  ]

  const projectTypes = [
    'Site vitrine',
    'E-commerce',
    'Application web',
    'Refonte de site',
    'Autre'
  ]

  const budgets = [
    'Moins de 2 000€',
    '2 000€ - 5 000€',
    '5 000€ - 10 000€',
    'Plus de 10 000€'
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields
    return currentFields.every(field => formData[field as keyof FormData].trim() !== '')
  }

  const handleNext = () => {
    if (isStepValid() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStepValid()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'name': return <User className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'company': return <Building className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'message': return <MessageSquare className="w-4 h-4" />
      default: return <Sparkles className="w-4 h-4" />
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Merci {formData.name} !</h3>
        <p className="text-gray-600">
          Nous avons bien reçu votre demande. Un expert vous contactera dans les 24h.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-xs font-medium ${
                index <= currentStep ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentStep === 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre nom complet
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {getFieldIcon('name')}
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {getFieldIcon('email')}
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="jean@entreprise.com"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de votre entreprise
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {getFieldIcon('company')}
                    </div>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Mon Entreprise SARL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {getFieldIcon('phone')}
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="0692 12 34 56"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de projet
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {projectTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('projectType', type)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          formData.projectType === type
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget estimé
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {budgets.map(budget => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => handleInputChange('budget', budget)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          formData.budget === budget
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Décrivez votre projet
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    {getFieldIcon('message')}
                  </div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    rows={5}
                    placeholder="Parlez-nous de votre projet, vos objectifs, vos délais..."
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'invisible'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Retour
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isStepValid()
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isStepValid() || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isStepValid() && !isSubmitting
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AutomatedForm