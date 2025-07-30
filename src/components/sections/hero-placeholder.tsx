'use client'

import { motion } from 'framer-motion'

export default function HeroPlaceholder() {
  return (
    <div className="hero-container relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Fond animé simple en CSS */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse" />
        
        {/* Points statiques pour simuler les étoiles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="hero-content relative z-10">
        <motion.div 
          className="hero-title text-[#DC143C]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          CAPTIVEZ
        </motion.div>
        
        <motion.div 
          className="hero-subtitle text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="subtitle-line">
            Un site sur mesure qui reflète votre excellence
          </p>
          <p className="subtitle-line">
            Design premium, expérience inoubliable
          </p>
        </motion.div>
      </div>

      {/* Indicateur de scroll */}
      <motion.div 
        className="scroll-progress"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '0%' }} />
        </div>
        <div className="section-counter">00 / 02</div>
      </motion.div>
    </div>
  )
}