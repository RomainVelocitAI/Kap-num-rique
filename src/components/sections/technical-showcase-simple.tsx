'use client'

import React from 'react'

export default function TechnicalShowcaseSimple() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            X = TECHNIQUE
          </h2>
          <p className="text-xl text-gold-500 mb-4">
            La performance n'est pas une option
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            <span className="text-red-500 font-bold">53% des visiteurs</span> abandonnent un site qui met plus de 3 secondes à charger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-gold-500 mb-4">Performance</h3>
            <ul className="space-y-2 text-gray-300">
              <li>⚡ Temps de chargement &lt; 2s</li>
              <li>📊 Score PageSpeed &gt; 90</li>
              <li>🚀 Optimisation automatique</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-gold-500 mb-4">SEO</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🔍 Indexation optimale</li>
              <li>📈 Balises méta dynamiques</li>
              <li>🎯 Schema.org intégré</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-gold-500 mb-4">Réseau</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🌍 CDN mondial</li>
              <li>⚡ Cache intelligent</li>
              <li>🔒 HTTPS automatique</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}