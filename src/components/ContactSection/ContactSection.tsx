import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { ContactForm, type FormData } from './ContactForm'
import { ContactTerminal } from './ContactTerminal'

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: '',
    niche: '',
    hasVisuals: '',
    hasLogo: '',
    currentWebsite: '',
    timeline: '',
    description: '',
    consent: false
  })
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

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

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
      
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Demande de devis subventionné
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Obtenez votre site web professionnel
              <span className="block text-primary mt-2">financé à 80% par Kap Numérik 💡</span>
            </h3>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Décrivez-nous votre projet et nous vous contacterons rapidement avec une proposition sur mesure éligible à la subvention.
            </p>
          </motion.div>

          {/* Form and Terminal container */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Form container with glassmorphism effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative group flex-1 w-full"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              
              {/* Form container */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 border border-white/50">
                <ContactForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  onSubmit={() => setIsFormSubmitted(true)}
                />
              </div>
            </motion.div>

            {/* Terminal - only visible on desktop */}
            <ContactTerminal 
              formData={formData} 
              isFormSubmitted={isFormSubmitted}
              className="hidden lg:block lg:w-[450px] xl:w-[500px] sticky top-24"
            />
          </div>

        </div>
      </div>
    </section>
  )
}