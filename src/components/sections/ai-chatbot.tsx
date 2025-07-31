'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, ThumbsUp, ThumbsDown, RotateCw, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [feedback, setFeedback] = useState<{ [key: string]: 'up' | 'down' | null }>({})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
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
          message: inputValue,
          sessionId: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

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

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    handleSend()
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
    setSessionId(null)
    setError(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
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
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Nouvelle conversation"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                
                {message.sender === 'bot' && message.id !== '1' && (
                  <div className="flex items-center gap-2 mt-1 px-2">
                    <button
                      onClick={() => handleFeedback(message.id, 'up')}
                      className={`p-1 rounded transition-colors ${
                        feedback[message.id] === 'up'
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'down')}
                      className={`p-1 rounded transition-colors ${
                        feedback[message.id] === 'down'
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
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
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 p-2 bg-red-50 text-red-600 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`p-2 rounded-full transition-all ${
              inputValue.trim() && !isTyping
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Propulsé par l'IA • Réponses instantanées 24/7
        </p>
      </div>
    </div>
  )
}

export default AiChatbot