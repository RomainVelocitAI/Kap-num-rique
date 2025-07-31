'use client'

import { useState, useEffect } from 'react'
import InteractivitySection from '@/components/sections/interactivity-section'
import ClientOnly from '@/components/ui/client-only'

export default function DebugPage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
    
    // Check environment variables (only public ones)
    setEnvVars({
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
    })

    // Check if window is defined
    if (typeof window === 'undefined') {
      setError('Window is undefined - SSR issue')
    }
  }, [])

  // Test API endpoints
  const testChatbotAPI = async () => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test message',
          sessionId: 'test-session',
        }),
      })
      
      const data = await response.json()
      console.log('Chatbot API Response:', data)
      alert(`Chatbot API Response: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      console.error('Chatbot API Error:', error)
      alert(`Chatbot API Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
      
      <div className="space-y-6">
        {/* Environment Variables */}
        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <pre className="text-sm">{JSON.stringify(envVars, null, 2)}</pre>
        </section>

        {/* Component Mount Status */}
        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Component Status</h2>
          <p>Mounted: {mounted ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
        </section>

        {/* API Test */}
        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          <button 
            onClick={testChatbotAPI}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Chatbot API
          </button>
        </section>

        {/* Interactivity Section Test */}
        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Interactivity Section Test</h2>
          <p className="mb-4">Testing direct render without ClientOnly wrapper:</p>
          <div className="border-2 border-blue-500 p-4 rounded">
            <InteractivitySection />
          </div>
        </section>

        {/* Interactivity Section with ClientOnly */}
        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Interactivity Section with ClientOnly</h2>
          <p className="mb-4">Testing with ClientOnly wrapper:</p>
          <div className="border-2 border-green-500 p-4 rounded">
            <ClientOnly>
              <InteractivitySection />
            </ClientOnly>
          </div>
        </section>
      </div>
    </div>
  )
}