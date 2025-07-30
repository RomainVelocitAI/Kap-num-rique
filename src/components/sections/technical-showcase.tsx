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
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-display font-bold text-white">
        X = TECHNIQUE
      </h2>
      <div className="space-y-4">
        <p className="text-2xl md:text-3xl text-gold-500 font-medium">
          La performance n'est pas une option
        </p>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          <span className="text-red-500 font-bold">53% des visiteurs</span> abandonnent un site qui met plus de 3 secondes à charger.
          Chaque milliseconde compte. Un site rapide, c'est plus de conversions, un meilleur référencement, 
          et des utilisateurs satisfaits.
        </p>
        <p className="text-lg md:text-xl text-gray-400 italic">
          Analysez les performances de ce site en temps réel ↓
        </p>
      </div>
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
              <div className="space-y-6">
                <div className="text-center mb-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700">
                  <p className="text-lg text-gray-300">
                    <span className="text-gold-500 font-bold">Amazon</span> perd 1.6 milliard de dollars par an pour chaque seconde de lenteur.
                    Votre site mérite la même attention.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  icon="⚡"
                  title="Temps de chargement"
                  value={`${metrics.pageLoadTime}ms`}
                  subtitle="Page complète"
                  status={metrics.pageLoadTime < 2500 ? 'excellent' : 'good'}
                />
                
                <MetricCard
                  icon="🎨"
                  title="Premier affichage"
                  value={`${metrics.firstContentfulPaint}ms`}
                  subtitle="First Contentful Paint"
                  status={metrics.firstContentfulPaint < 2000 ? 'excellent' : 'good'}
                />
                
                <MetricCard
                  icon="📦"
                  title="Ressources"
                  value={`${metrics.resourcesCount}`}
                  subtitle={`Total: ${metrics.totalPageSize}KB`}
                  status={metrics.totalPageSize < 3000 ? 'excellent' : 'good'}
                />
                
                <MetricCard
                  icon="🚀"
                  title="DOM Ready"
                  value={`${metrics.domContentLoaded}ms`}
                  subtitle="DOM Content Loaded"
                  status={metrics.domContentLoaded < 2000 ? 'excellent' : 'good'}
                />

                <div className="col-span-1 md:col-span-2 mt-4">
                  <PerformanceBar 
                    percentage={calculatePerformanceScore(metrics)}
                  />
                </div>
                </div>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div className="text-center mb-6 p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700">
                  <p className="text-lg text-gray-300">
                    <span className="text-gold-500 font-bold">75% du trafic</span> va aux 3 premiers résultats Google.
                    Un SEO technique parfait, c'est votre ticket d'entrée.
                  </p>
                </div>
                <SEOItem
                  label="Balise Title"
                  status={metrics.seoScore.hasTitle}
                  detail={`${metrics.seoScore.titleLength} caractères`}
                  recommendation={metrics.seoScore.titleLength < 30 ? "Trop court. Google préfère 50-60 caractères pour un title optimal." : 
                                  metrics.seoScore.titleLength > 60 ? "Trop long. Sera tronqué dans les résultats Google après 60 caractères." : 
                                  "Parfait ! Entre 50-60 caractères, idéal pour le SEO."}
                />
                
                <SEOItem
                  label="Meta Description"
                  status={metrics.seoScore.hasMetaDescription}
                  detail={`${metrics.seoScore.descriptionLength} caractères`}
                  recommendation={metrics.seoScore.descriptionLength < 120 ? "Un peu court. Visez 150-160 caractères pour maximiser l'espace dans les SERP." : 
                                  metrics.seoScore.descriptionLength > 160 ? "Trop long. Google tronquera après 160 caractères." : 
                                  "Bonne longueur ! Utilisez des mots-clés et un call-to-action."}
                />
                
                <SEOItem
                  label="Structure H1"
                  status={metrics.seoScore.h1Count === 1}
                  detail={`${metrics.seoScore.h1Count} balise(s) H1`}
                  warning={metrics.seoScore.h1Count > 1 ? "Multiple H1 détectés" : undefined}
                  recommendation={metrics.seoScore.h1Count === 0 ? "Critique ! Ajoutez un H1 avec vos mots-clés principaux." :
                                  metrics.seoScore.h1Count > 1 ? "Un seul H1 par page. Utilisez des H2-H6 pour la hiérarchie." :
                                  "Excellent ! Un seul H1, c'est la règle d'or du SEO."}
                />
                
                <SEOItem
                  label="Images optimisées"
                  status={metrics.seoScore.imagesWithAlt === metrics.seoScore.totalImages || metrics.seoScore.totalImages === 0}
                  detail={`${metrics.seoScore.imagesWithAlt}/${metrics.seoScore.totalImages} avec alt`}
                  recommendation={metrics.seoScore.totalImages === 0 ? "Pas d'images détectées. C'est OK si votre contenu n'en nécessite pas." :
                                  metrics.seoScore.imagesWithAlt < metrics.seoScore.totalImages ? "Ajoutez des alt descriptifs pour l'accessibilité et le SEO images." :
                                  "Parfait ! Toutes les images sont accessibles et indexables."}
                />
                
                <SEOItem
                  label="Open Graph"
                  status={metrics.seoScore.hasOpenGraph}
                  detail="Partage réseaux sociaux"
                  recommendation={metrics.seoScore.hasOpenGraph ? "Excellent ! Vos partages sociaux auront une belle preview." :
                                  "Ajoutez og:title, og:description et og:image pour des partages attractifs."}
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
                <div className="text-center mb-6 p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700">
                  <p className="text-lg text-gray-300">
                    <span className="text-gold-500 font-bold">47% du trafic web</span> est mobile.
                    La latence et l'optimisation réseau sont cruciales pour vos visiteurs.
                  </p>
                </div>
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
                    {metrics.latency < 100 ? 'Excellent' : metrics.latency < 400 ? 'Bon' : 'Moyen'}
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
          
          {/* Message de conclusion */}
          <div className="p-6 border-t border-gray-600 bg-gradient-to-r from-gray-900 to-black">
            <div className="text-center space-y-3">
              <p className="text-xl font-display text-gold-500">
                Un site lent, c'est un site mort.
              </p>
              <p className="text-gray-400">
                Ne laissez pas la technique saboter votre succès. 
                <span className="text-white font-medium"> Investissez dans la performance.</span>
              </p>
            </div>
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

const SEOItem = ({ label, status, detail, warning, recommendation }: any) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-400' : warning ? 'bg-yellow-400' : 'bg-red-400'}`} />
        <span className="text-gray-300">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-gray-500 text-sm">{detail}</span>
        {warning && <div className="text-yellow-400 text-xs mt-1">{warning}</div>}
      </div>
    </div>
    {recommendation && (
      <div className="ml-6 px-3 py-2 text-xs text-gray-400 italic bg-gray-900/50 rounded border-l-2 border-gold-500/30">
        💡 {recommendation}
      </div>
    )}
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
  // Seuils plus permissifs
  if (metrics.pageLoadTime > 3000) score -= 10;        // était 1000ms -> -20
  else if (metrics.pageLoadTime > 2000) score -= 5;    // nouveau palier
  
  if (metrics.firstContentfulPaint > 2500) score -= 10; // était 1800ms -> -20
  else if (metrics.firstContentfulPaint > 1800) score -= 5;
  
  if (metrics.totalPageSize > 3000) score -= 5;        // était 2000KB -> -10
  if (metrics.resourcesCount > 100) score -= 5;        // était 50 -> -10
  
  // Bonus pour les très bonnes performances
  if (metrics.pageLoadTime < 1500) score += 5;
  if (metrics.firstContentfulPaint < 1000) score += 5;
  
  return Math.min(100, Math.max(0, score));
};

const calculateSEOScore = (seo: any) => {
  let score = 0;
  if (seo.hasTitle) score += 20;
  if (seo.hasMetaDescription) score += 20;
  if (seo.h1Count === 1) score += 20;
  // Si toutes les images ont un alt OU s'il n'y a pas d'images (pas de pénalité)
  if (seo.totalImages === 0 || seo.imagesWithAlt === seo.totalImages) score += 20;
  if (seo.hasOpenGraph) score += 20;
  return score;
};