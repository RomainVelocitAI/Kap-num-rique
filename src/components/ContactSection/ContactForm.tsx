import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Mail, Phone, User, Briefcase, Image, Globe, MessageSquare, Send, ArrowRight, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  company: string
  niche: string
  hasVisuals: string
  hasLogo: string
  currentWebsite: string
  timeline: string
  description: string
  consent: boolean
}

interface ContactFormProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  onSubmit?: () => void
}

export function ContactForm({ formData, setFormData, onSubmit }: ContactFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
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
    // Remove spaces and dashes for validation
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'Kap Numérique',
          submittedAt: new Date().toISOString()
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        setIsSubmitted(true)
        if (onSubmit) {
          onSubmit()
        }
      } else {
        console.error('Form submission failed:', result.error)
        // Optionnel : afficher un message d'erreur à l'utilisateur
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToStep2 = formData.firstName && formData.lastName && formData.phone && formData.email && 
    !errors.email && !errors.phone && validateEmail(formData.email) && validatePhone(formData.phone)
  const canSubmit = formData.niche && formData.hasVisuals && formData.hasLogo && formData.timeline && formData.description

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Merci pour votre demande !
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Nous avons bien reçu votre projet. Notre équipe vous contactera dans les plus brefs délais avec une proposition sur mesure et les détails de la subvention Kap Numérik.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
            currentStep === 1 
              ? "bg-primary text-white" 
              : "bg-primary/20 text-primary"
          )}>
            1
          </div>
          <div className={cn(
            "w-20 h-1 transition-all",
            currentStep === 2 
              ? "bg-primary" 
              : "bg-gray-300"
          )} />
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
            currentStep === 2 
              ? "bg-primary text-white" 
              : "bg-gray-300 text-gray-500"
          )}>
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
                <motion.input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  whileFocus={{ scale: 1.01 }}
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
                <motion.input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  whileFocus={{ scale: 1.01 }}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400"
                  placeholder="Payet"
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
                <motion.input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  whileFocus={{ scale: 1.01 }}
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400",
                    errors.phone ? "border-red-500" : "border-gray-300"
                  )}
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
                <motion.input
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  whileFocus={{ scale: 1.01 }}
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400",
                    errors.email ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="jean.payet@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => setCurrentStep(2)}
            disabled={!canProceedToStep2}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all",
              canProceedToStep2
                ? "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre projet de site web</h3>

          {/* Company & Niche */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline-block w-4 h-4 mr-1 mb-1" />
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 text-sm"
                placeholder="Ma société SARL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline-block w-4 h-4 mr-1 mb-1" />
                Votre secteur d'activité *
              </label>
              <input
                type="text"
                required
                value={formData.niche}
                onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 text-sm"
                placeholder="Ex: Restaurant, Plomberie, Immobilier..."
              />
            </div>
          </div>

          {/* Visuals Questions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Image className="inline-block w-4 h-4 mr-1 mb-1" />
                Avez-vous des visuels ? *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Oui', 'Non', 'Partiellement'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, hasVisuals: option }))}
                    className={cn(
                      "px-2 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all",
                      formData.hasVisuals === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Image className="inline-block w-4 h-4 mr-1 mb-1" />
                Avez-vous un logo ? *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Oui', 'Non', 'À créer'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, hasLogo: option }))}
                    className={cn(
                      "px-2 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all",
                      formData.hasLogo === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Website & Timeline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline-block w-4 h-4 mr-1 mb-1" />
                Site web actuel
              </label>
              <input
                type="text"
                value={formData.currentWebsite}
                onChange={(e) => setFormData(prev => ({ ...prev, currentWebsite: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-gray-400 text-sm"
                placeholder="www.monsite.re (si existant)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Délai souhaité *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Urgent', '1 mois', '2-3 mois'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, timeline: option }))}
                    className={cn(
                      "px-2 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                      formData.timeline === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline-block w-4 h-4 mr-1 mb-1" />
              Description *
            </label>
            <motion.textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              whileFocus={{ scale: 1.01 }}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none hover:border-gray-400 text-sm"
              placeholder="Décrivez brièvement votre projet..."
            />
          </div>

          {/* Consent */}
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                className="mt-0.5 w-4 h-4 text-primary rounded border-gray-300 focus:ring-2 focus:ring-primary"
              />
              <span className="ml-2.5 text-xs text-gray-600 leading-relaxed">
                J'accepte de recevoir des informations sur la subvention Kap Numérik (optionnel).
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
              className={cn(
                "flex-1 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all",
                isSubmitting || !canSubmit
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </form>
  )
}