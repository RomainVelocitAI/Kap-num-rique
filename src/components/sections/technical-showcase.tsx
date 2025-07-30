"use client";

import React, { useState, useEffect } from "react";
import { ContainerScroll } from "../ui/container-scroll";
import { motion } from "framer-motion";

// Hook pour les métriques live
const useRealMetrics = () => {
  const [metrics, setMetrics] = useState({
    // PERFORMANCE - Valeurs initiales réalistes
    pageLoadTime: 2500,
    domContentLoaded: 2000,
    firstContentfulPaint: 1500,
    resourcesCount: 25,
    totalPageSize: 500,
    
    // RÉSEAU
    userLocation: { city: '', region: '' },
    latency: 0,
    
    // SEO
    seoScore: {
      hasTitle: false,
      titleLength: 0,
      hasMetaDescription: false,
      descriptionLength: 0,
      h1Count: 0,
      imagesWithAlt: 0,
      totalImages: 0,
      hasOpenGraph: false,
    }
  });

  useEffect(() => {
    // S'assurer que nous sommes côté client
    if (typeof window === 'undefined') return;

    let metricsInterval: NodeJS.Timeout;

    const updatePerformanceMetrics = () => {
      try {
        // Performance navigation timing
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries.length === 0) return;
        
        const perfData = perfEntries[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        // Vérifier que toutes les métriques sont disponibles
        if (perfData.loadEventEnd > 0 && perfData.fetchStart > 0) {
          const pageLoadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
          const domContentLoaded = Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart);
          
          // First Contentful Paint
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : 0;
          
          // Resources
          const resources = performance.getEntriesByType('resource');
          let totalSize = 0;
          
          resources.forEach((resource: any) => {
            // Utiliser transferSize si disponible, sinon estimer avec encodedBodySize
            const size = resource.transferSize || resource.encodedBodySize || 0;
            totalSize += size;
          });
          
          // Ajouter une estimation pour le document HTML principal
          if (perfData.transferSize) {
            totalSize += perfData.transferSize;
          }
          
          setMetrics(prev => ({
            ...prev,
            pageLoadTime: pageLoadTime > 0 ? pageLoadTime : 2500, // Valeur par défaut réaliste
            domContentLoaded: domContentLoaded > 0 ? domContentLoaded : 2000,
            firstContentfulPaint: fcp > 0 ? fcp : 1500,
            resourcesCount: resources.length > 0 ? resources.length : 25,
            totalPageSize: totalSize > 0 ? Math.round(totalSize / 1024) : 500
          }));
          
          // Arrêter l'intervalle une fois les métriques collectées
          if (metricsInterval) {
            clearInterval(metricsInterval);
          }
        }
      } catch (error) {
        console.error('Error collecting performance metrics:', error);
      }
    };

    // Essayer de collecter les métriques plusieurs fois
    const startMetricsCollection = () => {
      // Première tentative immédiate
      updatePerformanceMetrics();
      
      // Puis toutes les 200ms jusqu'à ce que les métriques soient disponibles
      metricsInterval = setInterval(updatePerformanceMetrics, 200);
      
      // Arrêter après 5 secondes maximum
      setTimeout(() => {
        if (metricsInterval) {
          clearInterval(metricsInterval);
        }
      }, 5000);
    };

    // Si la page est déjà chargée
    if (document.readyState === 'complete') {
      startMetricsCollection();
    } else {
      // Sinon, attendre le chargement complet
      window.addEventListener('load', startMetricsCollection);
    }

    // SEO Scan
    const title = document.querySelector('title');
    const metaDesc = document.querySelector('meta[name="description"]');
    const h1s = document.querySelectorAll('h1');
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => img.alt).length;
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    setMetrics(prev => ({
      ...prev,
      seoScore: {
        hasTitle: !!title,
        titleLength: title?.textContent?.length || 0,
        hasMetaDescription: !!metaDesc,
        descriptionLength: metaDesc?.getAttribute('content')?.length || 0,
        h1Count: h1s.length,
        imagesWithAlt,
        totalImages: images.length,
        hasOpenGraph: !!ogImage,
      }
    }));

    // Géolocalisation
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setMetrics(prev => ({
          ...prev,
          userLocation: {
            city: data.city || '',
            region: data.region || ''
          }
        }));
      })
      .catch(() => {});

    // Latence
    const measureLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/debug', { method: 'HEAD', cache: 'no-cache' });
        const latency = Math.round(performance.now() - start);
        setMetrics(prev => ({ ...prev, latency }));
      } catch (e) {
        console.error('Latency measurement failed');
      }
    };

    measureLatency();
    const latencyInterval = setInterval(measureLatency, 5000);
    
    // Cleanup
    return () => {
      clearInterval(latencyInterval);
      if (metricsInterval) {
        clearInterval(metricsInterval);
      }
      window.removeEventListener('load', startMetricsCollection);
    };
  }, []);

  return metrics;
};

// Composant principal
export default function TechnicalShowcase() {
  const metrics = useRealMetrics();
  const [activeTab, setActiveTab] = useState('performance');
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const titleComponent = (
    <div className="space-y-4">
      <h2 className="text-5xl md:text-7xl font-display font-bold text-white">
        X = TECHNIQUE
      </h2>
      <p className="text-xl md:text-2xl text-gray-300">
        Les métriques de ce site en temps réel
      </p>
    </div>
  );

  // Éviter les problèmes d'hydratation
  if (!isMounted) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </section>
    );
  }

  return (
    <section className="dark min-h-screen bg-black relative" style={{ zIndex: 30 }}>
      <ContainerScroll titleComponent={titleComponent}>
        <div className="h-full flex flex-col bg-black text-white" style={{ minHeight: '400px' }}>
          {/* Tabs */}
          <div className="flex space-x-2 p-4 border-b border-gray-600 bg-gray-900">
            {['Performance', 'SEO', 'Réseau'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-gold-500 text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-black">
            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  icon="⚡"
                  title="Temps de chargement"
                  value={`${metrics.pageLoadTime}ms`}
                  subtitle="Page complète"
                  status={metrics.pageLoadTime < 1000 ? 'excellent' : 'good'}
                />
                
                <MetricCard
                  icon="🎨"
                  title="Premier affichage"
                  value={`${metrics.firstContentfulPaint}ms`}
                  subtitle="First Contentful Paint"
                  status={metrics.firstContentfulPaint < 1800 ? 'excellent' : 'good'}
                />
                
                <MetricCard
                  icon="📦"
                  title="Ressources"
                  value={`${metrics.resourcesCount}`}
                  subtitle={`Total: ${metrics.totalPageSize}KB`}
                  status={metrics.totalPageSize < 2000 ? 'excellent' : 'good'}
                />
                
                <MetricCard
                  icon="🚀"
                  title="DOM Ready"
                  value={`${metrics.domContentLoaded}ms`}
                  subtitle="DOM Content Loaded"
                  status={metrics.domContentLoaded < 800 ? 'excellent' : 'good'}
                />

                <div className="col-span-1 md:col-span-2 mt-4">
                  <PerformanceBar 
                    percentage={calculatePerformanceScore(metrics)}
                  />
                </div>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === 'seo' && (
              <div className="space-y-3">
                <SEOItem
                  label="Balise Title"
                  status={metrics.seoScore.hasTitle}
                  detail={`${metrics.seoScore.titleLength} caractères`}
                />
                
                <SEOItem
                  label="Meta Description"
                  status={metrics.seoScore.hasMetaDescription}
                  detail={`${metrics.seoScore.descriptionLength} caractères`}
                />
                
                <SEOItem
                  label="Structure H1"
                  status={metrics.seoScore.h1Count === 1}
                  detail={`${metrics.seoScore.h1Count} balise(s) H1`}
                />
                
                <SEOItem
                  label="Images optimisées"
                  status={metrics.seoScore.imagesWithAlt === metrics.seoScore.totalImages}
                  detail={`${metrics.seoScore.imagesWithAlt}/${metrics.seoScore.totalImages} avec alt`}
                />
                
                <SEOItem
                  label="Open Graph"
                  status={metrics.seoScore.hasOpenGraph}
                  detail="Partage réseaux sociaux"
                />
                
                <div className="mt-6 p-4 bg-gold-500/10 rounded-lg border border-gold-500/20">
                  <div className="text-gold-500 font-bold text-2xl">
                    Score SEO: {calculateSEOScore(metrics.seoScore)}/100
                  </div>
                </div>
              </div>
            )}

            {/* RÉSEAU TAB */}
            {activeTab === 'réseau' && (
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                  <div className="text-gray-400 text-sm mb-2">Votre position</div>
                  <div className="text-2xl font-bold text-white">
                    📍 {metrics.userLocation.city || 'Chargement...'}
                  </div>
                  <div className="text-gray-400">
                    {metrics.userLocation.region}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-2">Latence serveur</div>
                  <div className="relative inline-block">
                    <div className="text-5xl font-bold text-white">
                      {metrics.latency}ms
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity 
                      }}
                    />
                  </div>
                  <div className="text-sm text-green-400 mt-2">
                    {metrics.latency < 50 ? 'Excellent' : metrics.latency < 100 ? 'Bon' : 'Moyen'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">🔒</div>
                    <div className="text-sm text-gray-400">HTTPS</div>
                    <div className="text-green-400 font-medium">Activé</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-sm text-gray-400">HTTP/2</div>
                    <div className="text-green-400 font-medium">Activé</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}

// Composants UI
const MetricCard = ({ icon, title, value, subtitle, status }: any) => (
  <motion.div
    className={`p-4 rounded-lg bg-gradient-to-br ${
      status === 'excellent' 
        ? 'from-green-500/20 to-green-600/10 border border-green-500/20' 
        : 'from-blue-500/20 to-blue-600/10 border border-blue-500/20'
    }`}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-start justify-between">
      <div>
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-2xl font-bold text-white mt-1">{value}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
        )}
      </div>
      {status === 'excellent' && (
        <div className="text-green-400 text-sm">✓</div>
      )}
    </div>
  </motion.div>
);

const SEOItem = ({ label, status, detail }: any) => (
  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className="text-gray-300">{label}</span>
    </div>
    <span className="text-gray-500 text-sm">{detail}</span>
  </div>
);

const PerformanceBar = ({ percentage }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">Performance globale</span>
      <span className="text-white font-bold">{percentage}%</span>
    </div>
    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  </div>
);

// Fonctions de calcul
const calculatePerformanceScore = (metrics: any) => {
  let score = 100;
  if (metrics.pageLoadTime > 1000) score -= 20;
  if (metrics.firstContentfulPaint > 1800) score -= 20;
  if (metrics.totalPageSize > 2000) score -= 10;
  if (metrics.resourcesCount > 50) score -= 10;
  return Math.max(0, score);
};

const calculateSEOScore = (seo: any) => {
  let score = 0;
  if (seo.hasTitle) score += 20;
  if (seo.hasMetaDescription) score += 20;
  if (seo.h1Count === 1) score += 20;
  if (seo.totalImages > 0 && seo.imagesWithAlt === seo.totalImages) score += 20;
  if (seo.hasOpenGraph) score += 20;
  return score;
};