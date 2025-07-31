'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, ThumbsUp, ThumbsDown, RotateCw, AlertCircle, Cookie } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
}

interface ConsentBannerProps {
  onAccept: () => void
  onDecline: () => void
}

function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-3 md:mx-4 mb-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3"
    >
      <div className="flex items-start gap-2">
        <Cookie className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs md:text-sm text-gray-700 mb-2">
            Pour améliorer votre expérience, ce chatbot utilise un cookie pour mémoriser notre conversation. 
            Aucune donnée personnelle n'est collectée.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="px-3 py-2 md:py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors touch-manipulation active:scale-95"
            >
              J'accepte
            </button>
            <button
              onClick={onDecline}
              className="px-3 py-2 md:py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors touch-manipulation active:scale-95"
            >
              Je refuse
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const suggestedQuestions = [
  "Qu'est-ce que la subvention Kap Numérique ?",
  "Qui peut bénéficier de la subvention ?",
  "Combien coûte un site web ?",
  "Comment vous contacter ?"
]

const AiChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! 👋 Je suis votre assistant virtuel. Posez-moi vos questions sur nos services ou le dispositif Kap Numérique.",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConsent, setShowConsent] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<{ [key: string]: 'up' | 'down' | null }>({})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle mobile keyboard visibility
  useEffect(() => {
    const handleFocus = () => {
      // On mobile, ensure the input is visible when keyboard appears
      if (window.innerWidth < 768 && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 300)
      }
    }

    const input = inputRef.current
    if (input) {
      input.addEventListener('focus', handleFocus)
      return () => input.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    setError(null)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          consentGiven: consentGiven,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Vérifier si le consentement est requis
      if (data.requiresConsent) {
        setShowConsent(true)
        setPendingMessage(textToSend)
        // Retirer le message de consentement automatique
        return
      }

      // Save session ID for future messages
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId)
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
    } catch (err) {
      console.error('Chat error:', err)
      setError("Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.")
      
      // Fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Je suis temporairement indisponible. En attendant, vous pouvez nous contacter directement au 0693 91 91 91 ou par email à contact@kap-numerique.re",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleConsent = async (accepted: boolean) => {
    setShowConsent(false)
    setConsentGiven(accepted)

    if (accepted) {
      // Ajouter un message de confirmation
      const confirmMessage: Message = {
        id: Date.now().toString(),
        text: "Merci ! Je peux maintenant mémoriser notre conversation pour une meilleure expérience. Comment puis-je vous aider ?",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, confirmMessage])

      // Renvoyer le message en attente si il y en a un
      if (pendingMessage) {
        setTimeout(() => {
          handleSend(pendingMessage)
          setPendingMessage(null)
        }, 500)
      }
    } else {
      const declineMessage: Message = {
        id: Date.now().toString(),
        text: "Pas de problème ! Je peux quand même répondre à vos questions, mais je ne pourrai pas me souvenir de notre conversation si vous revenez plus tard. Comment puis-je vous aider ?",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, declineMessage])
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    setTimeout(() => handleSend(question), 100)
  }

  const handleFeedback = async (messageId: string, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type
    }))

    // Send rating to API if we have a session
    if (sessionId && feedback[messageId] !== type) {
      try {
        await fetch('/api/chatbot/conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId,
            rating: type === 'up' ? 5 : 1,
          }),
        })
      } catch (err) {
        console.error('Failed to save rating:', err)
      }
    }
  }

  const resetChat = () => {
    setMessages([{
      id: '1',
      text: "Bonjour ! 👋 Je suis votre assistant virtuel. Posez-moi vos questions sur nos services ou le dispositif Kap Numérique.",
      sender: 'bot',
      timestamp: new Date()
    }])
    setFeedback({})
    // Note: on ne réinitialise pas sessionId et consentGiven pour garder la session
    setError(null)
    setShowConsent(false)
    setPendingMessage(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] md:h-[600px] max-h-[80vh]">
      {/* Header */}
      <div className="bg-primary text-white p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold">Assistant Kap Numérique</h4>
            <p className="text-xs text-white/80">En ligne • Répond instantanément</p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
          title="Nouvelle conversation"
        >
          <RotateCw className="w-4 h-4 md:w-4 md:h-4" />
        </button>
      </div>

      {/* Consent Banner */}
      {showConsent && (
        <ConsentBanner
          onAccept={() => handleConsent(true)}
          onDecline={() => handleConsent(false)}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 overscroll-contain -webkit-overflow-scrolling-touch">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                </div>
                
                {message.sender === 'bot' && message.id !== '1' && (
                  <div className="flex items-center gap-2 mt-1 px-2">
                    <button
                      onClick={() => handleFeedback(message.id, 'up')}
                      className={`p-1.5 md:p-1 rounded transition-colors touch-manipulation ${
                        feedback[message.id] === 'up'
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 md:w-3 md:h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'down')}
                      className={`p-1.5 md:p-1 rounded transition-colors touch-manipulation ${
                        feedback[message.id] === 'down'
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5 md:w-3 md:h-3" />
                    </button>
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 order-2">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-3">
              <div className="flex gap-1">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && !showConsent && (
        <div className="px-3 md:px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs px-3 py-2 md:py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors touch-manipulation active:bg-gray-300"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-3 md:px-4 pb-2">
          <div className="flex items-center gap-2 p-2 bg-red-50 text-red-600 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={isTyping || showConsent}
            className="flex-1 px-4 py-3 md:py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-sm touch-manipulation"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            enterKeyHint="send"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping || showConsent}
            className={`p-3 md:p-2 rounded-full transition-all touch-manipulation min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center ${
              inputValue.trim() && !isTyping && !showConsent
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Propulsé par l'IA • Réponses instantanées 24/7
          {consentGiven && (
            <>
              {' • '}
              <Cookie className="w-3 h-3 inline mr-1" />
              Session mémorisée
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default AiChatbot