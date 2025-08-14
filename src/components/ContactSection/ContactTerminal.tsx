import { useEffect, useState } from 'react'
import { Terminal, TypingAnimation, AnimatedSpan } from '../ui/terminal'
import { motion } from 'framer-motion'

interface FormData {
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

interface ContactTerminalProps {
  formData: FormData
  isFormSubmitted?: boolean
  className?: string
}

interface TerminalMessage {
  id: string
  text: string | ((data: FormData) => string)
  delay: number
  condition: (data: FormData) => boolean
}

export function ContactTerminal({ formData, isFormSubmitted = false, className }: ContactTerminalProps) {
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([])
  const [messageHistory, setMessageHistory] = useState<Set<string>>(new Set())

  // Define the progression messages based on form completion
  const messages: TerminalMessage[] = [
    {
      id: 'init',
      text: '$ kap-numerique init --mode=subvention',
      delay: 0,
      condition: () => true
    },
    {
      id: 'welcome',
      text: '> Initialisation de votre projet web subventionné',
      delay: 800,
      condition: () => true
    },
    {
      id: 'waiting',
      text: '> En attente des informations du porteur de projet...',
      delay: 1600,
      condition: (data) => !data.firstName && !data.lastName && !data.phone && !data.email && !data.niche
    },
    {
      id: 'name_progress',
      text: '> Identification du porteur de projet en cours...',
      delay: 100,
      condition: (data) => !!(data.firstName || data.lastName) && !(data.firstName && data.lastName)
    },
    {
      id: 'name',
      text: (data) => `✓ Porteur identifié: ${data.firstName} ${data.lastName}`,
      delay: 100,
      condition: (data) => !!(data.firstName && data.lastName)
    },
    {
      id: 'contact_progress',
      text: '> Établissement du contact...',
      delay: 100,
      condition: (data) => !!(data.phone || data.email) && !(data.phone && data.email)
    },
    {
      id: 'contact',
      text: '✓ Contact établi',
      delay: 100,
      condition: (data) => !!(data.phone && data.email)
    },
    {
      id: 'niche',
      text: (data) => `✓ Secteur d'activité: ${data.niche}`,
      delay: 100,
      condition: (data) => !!data.niche
    },
    {
      id: 'company',
      text: (data) => `✓ Entreprise: ${data.company}`,
      delay: 100,
      condition: (data) => !!data.company
    },
    {
      id: 'visuals',
      text: (data) => `✓ Ressources visuelles: ${data.hasVisuals}`,
      delay: 100,
      condition: (data) => !!data.hasVisuals
    },
    {
      id: 'logo',
      text: (data) => `✓ Logo: ${data.hasLogo}`,
      delay: 100,
      condition: (data) => !!data.hasLogo
    },
    {
      id: 'timeline',
      text: (data) => `✓ Délai souhaité: ${data.timeline}`,
      delay: 100,
      condition: (data) => !!data.timeline
    },
    {
      id: 'description_progress',
      text: '> Analyse du projet...',
      delay: 100,
      condition: (data) => !!data.description && data.description.length <= 10
    },
    {
      id: 'description',
      text: '✓ Projet validé pour subvention',
      delay: 100,
      condition: (data) => !!data.description && data.description.length > 10
    },
    {
      id: 'ready',
      text: '> Éligibilité Kap Numérik confirmée à 80% !',
      delay: 500,
      condition: (data) => 
        !!(data.firstName && data.lastName && data.phone && data.email && 
           data.niche && data.hasVisuals && data.hasLogo && data.timeline &&
           data.description && data.description.length > 10 && !isFormSubmitted)
    },
    {
      id: 'form_submitted',
      text: '> Demande validée ! Calcul de votre subvention...',
      delay: 100,
      condition: () => isFormSubmitted
    },
    {
      id: 'countdown3',
      text: '> Analyse éligibilité: 100%',
      delay: 1000,
      condition: () => isFormSubmitted
    },
    {
      id: 'countdown2',
      text: '> Montant subvention: 80% confirmé',
      delay: 1500,
      condition: () => isFormSubmitted
    },
    {
      id: 'countdown1',
      text: '> Génération du devis...',
      delay: 2000,
      condition: () => isFormSubmitted
    },
    {
      id: 'countdown',
      text: '> SUCCÈS! Votre projet est éligible 🚀💰',
      delay: 2500,
      condition: () => isFormSubmitted
    }
  ]

  useEffect(() => {
    // Get messages that should be displayed based on current form data
    const activeMessages = messages.filter(msg => msg.condition(formData))
    const activeMessageIds = activeMessages.map(msg => msg.id)
    
    // Only show messages that haven't been shown before or are still valid
    const messagesToShow = activeMessageIds.filter(id => {
      // Always show if condition is true and it's not a "progress" message that was already completed
      if (id.includes('progress')) {
        // Don't show progress messages if the complete version exists
        const completeId = id.replace('_progress', '')
        return !messageHistory.has(completeId) && !activeMessageIds.includes(completeId)
      }
      return true
    })
    
    // Update displayed messages
    setDisplayedMessages(messagesToShow)
    
    // Add new messages to history
    const newHistory = new Set(messageHistory)
    messagesToShow.forEach(id => newHistory.add(id))
    setMessageHistory(newHistory)
  }, [formData, isFormSubmitted])

  // Calculate cumulative delays for proper animation timing
  const getMessageDelay = (messageId: string): number => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    if (messageIndex === -1) return 0
    
    const message = messages[messageIndex]
    const baseDelay = message.delay
    
    // Add extra delay for messages that appear after others
    const precedingMessages = displayedMessages.slice(0, displayedMessages.indexOf(messageId))
    const extraDelay = precedingMessages.length * 50
    
    return baseDelay + extraDelay
  }

  const getMessageText = (message: TerminalMessage): string => {
    if (typeof message.text === 'function') {
      return message.text(formData)
    }
    return message.text
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={className}
    >
      <Terminal className="bg-gradient-to-br from-black via-gray-900 to-black text-green-400 font-mono text-sm h-[450px] border-gray-700 shadow-2xl overflow-hidden">
        <div className="space-y-2 text-xs sm:text-sm">
          {messages.map((message) => {
            if (!displayedMessages.includes(message.id)) return null
            
            return (
              <AnimatedSpan
                key={message.id}
                delay={getMessageDelay(message.id)}
                className="block"
              >
                <TypingAnimation
                  duration={30}
                  delay={getMessageDelay(message.id)}
                  className="text-green-400"
                  style={{
                    textShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
                  }}
                >
                  {getMessageText(message)}
                </TypingAnimation>
              </AnimatedSpan>
            )
          })}
          
          {/* Blinking cursor */}
          {displayedMessages.length > 0 && (
            <motion.span 
              className="inline-block w-2 h-4 bg-green-400 ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{
                boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)'
              }}
            />
          )}
        </div>
      </Terminal>
    </motion.div>
  )
}