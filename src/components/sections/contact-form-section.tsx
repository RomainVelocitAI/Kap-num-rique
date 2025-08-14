'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, ArrowRight, Check, Mail, Phone, User, Globe, MessageSquare } from 'lucide-react'

export interface FormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  company: string
  projectType: string[]
  description: string
  budget: string
  consent: boolean
}

const projectTypes = [
  { id: 'vitrine', label: 'Site Vitrine' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'corporate', label: 'Site Corporate' },
  { id: 'booking', label: 'Réservation en ligne' },
  { id: 'blog', label: 'Blog / Magazine' },
  { id: 'custom', label: 'Sur mesure' }
]

const budgetRanges = [
  { id: 'small', label: '< 1 000€', value: '< 1 000€' },
  { id: 'medium', label: '1 000€ - 3 000€', value: '1 000€ - 3 000€' },
  { id: 'large', label: '3 000€ - 10 000€', value: '3 000€ - 10 000€' },
  { id: 'enterprise', label: '> 10 000€', value: '> 10 000€' },
  { id: 'undefined', label: 'À définir', value: 'À définir' }
]

export function ContactFormSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: '',
    projectType: [],
    description: '',
    budget: '',
    consent: false
  })
  const [errors, setErrors] = useState<{
    email?: string
    phone?: string
  }>({})

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  // Phone validation regex (accepts various formats for La Réunion)
  const phoneRegex = /^(?:\+262|0262|262|0)[\s.-]?[6-7][\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}[\s.-]?[0-9]{2}$/

  const validateEmail = (email: string): boolean => {
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s-]/g, '')
    return phoneRegex.test(cleanPhone)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFormData(prev => ({ ...prev, email }))
    
    if (email && !validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Email invalide' }))
    } else {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value
    setFormData(prev => ({ ...prev, phone }))
    
    if (phone && !validatePhone(phone)) {
      setErrors(prev => ({ ...prev, phone: 'Téléphone invalide' }))
    } else {
      setErrors(prev => ({ ...prev, phone: undefined }))
    }
  }

  const handleProjectToggle = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: prev.projectType.includes(projectId)
        ? prev.projectType.filter(id => id !== projectId)
        : [...prev.projectType, projectId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://n8n.srv765302.hstgr.cloud/webhook-test/1e9835c0-8db0-4378-a161-65117ffed364', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'Kap Numérique',
          submittedAt: new Date().toISOString(),
          projectType: formData.projectType.join(', ')
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        console.error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToStep2 = formData.firstName && formData.lastName && formData.phone && formData.email && 
    !errors.email && !errors.phone && validateEmail(formData.email) && validatePhone(formData.phone)
  const canSubmit = formData.projectType.length > 0 && formData.description && formData.budget

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      section.style.setProperty('--mouse-x', `${x}`)
      section.style.setProperty('--mouse-y', `${y}`)
    }

    section.addEventListener('mousemove', handleMouseMove)
    return () => section.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (isSubmitted) {
    return (
      <section id="contact" ref={sectionRef} className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-20 bg-white rounded-2xl shadow-xl"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Merci pour votre demande !
            </h3>
            <p className="text-gray-600">
              Nous avons bien reçu votre projet. Notre équipe vous contactera dans les plus brefs délais pour établir votre devis gratuit.
            </p>
            <p className="text-sm text-primary mt-4 font-semibold">
              Subvention Kap Numérik : jusqu'à 80% de prise en charge !
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
      />
      
      {/* Interactive glow effect */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), rgba(0, 102, 204, 0.06), transparent 40%)`
        }}
      />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              DEVIS GRATUIT & SUBVENTION 80%
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Obtenez votre site web professionnel
              <span className="block text-primary mt-2">financé jusqu'à 80% 🚀</span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Remplissez ce formulaire pour recevoir un devis gratuit et découvrir comment bénéficier de la subvention Kap Numérik.
            </p>
          </motion.div>

          {/* Form container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative group"
          >
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            
            {/* Form container */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 border border-white/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Progress indicator */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep === 1 ? "bg-primary text-white" : "bg-primary/20 text-primary"
                    }`}>
                      1
                    </div>
                    <div className={`w-20 h-1 transition-all ${
                      currentStep === 2 ? "bg-primary" : "bg-gray-300"
                    }`} />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep === 2 ? "bg-primary text-white" : "bg-gray-300 text-gray-500"
                    }`}>
                      2
                    </div>
                  </div>
                </div>

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Vos informations</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400"
                            placeholder="Jean"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400"
                            placeholder="Dupont"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 ${
                              errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="0692 12 34 56"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleEmailChange}
                            className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 ${
                              errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="jean.dupont@gmail.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entreprise
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400"
                          placeholder="Nom de votre entreprise (optionnel)"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!canProceedToStep2}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all ${
                        canProceedToStep2
                          ? "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Continuer
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Project Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">Votre projet</h3>

                    {/* Project Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type de site souhaité *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {projectTypes.map((project) => (
                          <motion.button
                            key={project.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleProjectToggle(project.id)}
                            className={`relative px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                              formData.projectType.includes(project.id)
                                ? "border-primary bg-primary/10 text-primary shadow-sm"
                                : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {project.label}
                            {formData.projectType.includes(project.id) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Budget estimé *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {budgetRanges.map((budget) => (
                          <motion.button
                            key={budget.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData(prev => ({ ...prev, budget: budget.value }))}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                              formData.budget === budget.value
                                ? "border-primary bg-primary/10 text-primary shadow-sm"
                                : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {budget.label}
                          </motion.button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Avec Kap Numérik, votre reste à charge sera de 20% seulement !
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare className="inline-block w-4 h-4 mr-1 mb-1" />
                        Description de votre projet *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none hover:border-gray-400"
                        placeholder="Décrivez votre projet, vos besoins, vos objectifs..."
                      />
                    </div>

                    {/* Consent */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                          className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-2 focus:ring-primary"
                        />
                        <span className="ml-3 text-sm text-gray-600">
                          J'accepte de recevoir des informations sur la subvention Kap Numérik et les offres de Kap Numérique (optionnel).
                        </span>
                      </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all"
                      >
                        Retour
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !canSubmit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all ${
                          isSubmitting || !canSubmit
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Recevoir mon devis gratuit
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}