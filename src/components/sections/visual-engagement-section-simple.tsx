'use client'

export default function VisualEngagementSection() {
  return (
    <section className="relative bg-black text-white py-24 overflow-hidden min-h-screen">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-5xl lg:text-7xl mb-6">
            Votre site doit <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400">BOUGER</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            En 2025, un site statique ne suffit plus. Les utilisateurs attendent des expériences immersives.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <p className="text-gray-400">Section Visual Engagement - Version simplifiée pour test</p>
        </div>
      </div>
    </section>
  )
}