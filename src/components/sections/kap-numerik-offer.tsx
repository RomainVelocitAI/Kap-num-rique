'use client'

import { motion } from 'framer-motion'
import { Check, Euro, Globe, Lock, Smartphone, BookOpen, Headphones, Calendar, Shield, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Site vitrine clé en main",
    description: "Accueil, À propos, Services, Galerie, Contact, Mentions légales, Politique de confidentialité"
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Design responsive professionnel",
    description: "Compatible ordinateur, tablette et mobile pour toucher tous vos clients"
  },
  {
    icon: <Check className="w-6 h-6" />,
    title: "Formulaire de contact intelligent",
    description: "Recevez les demandes de vos visiteurs directement par email"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "SEO de base inclus",
    description: "Titres optimisés, sitemap, indexation Google pour être visible"
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Formation à la prise en main",
    description: "PDF ou tutoriel vidéo fournis pour gérer votre site en autonomie"
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "Support technique 30 jours",
    description: "Assistance garantie pendant 1 mois après la mise en ligne"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Nom de domaine + hébergement",
    description: "Sécurisé et inclus pour 12 mois, sans frais cachés"
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Conformité RGPD intégrée",
    description: "Politique de confidentialité et gestion des cookies conforme"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function KapNumerikOfferSection() {
  return (
    <section id="offre-kap-numerik" className="py-20 bg-gradient-to-b from-primary-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-primary text-white border-0 px-4 py-2 text-sm">
            Offre Spéciale Kap Numérik
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Création d'un site Internet vitrine
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="bg-gradient-accent text-white p-6 rounded-2xl shadow-accent-lg mb-8 transform hover:scale-105 transition-transform duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Euro className="w-8 h-8" />
                <span className="text-3xl font-bold">Jusqu'à 1 200€ remboursés</span>
              </div>
              <p className="text-xl">
                Grâce au dispositif Kap Numérik de la Région Réunion
              </p>
              <p className="text-lg opacity-90 mt-2">
                (80% du montant pris en charge)
              </p>
            </motion.div>
            
            <p className="text-xl text-gray-700 font-medium">
              Une solution complète et professionnelle pour digitaliser votre entreprise
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-100 group hover:border-primary-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                    <div className="text-primary group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold text-gray-900">
              Conformité totale avec les exigences Kap Numérik
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Mentions légales obligatoires</h4>
                <p className="text-sm text-gray-600">Selon la loi pour la confiance dans l'économie numérique</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">RGPD intégré</h4>
                <p className="text-sm text-gray-600">Politique de confidentialité + bandeau cookies complet</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Logos officiels</h4>
                <p className="text-sm text-gray-600">Région Réunion + Union Européenne intégrés</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <p className="text-sm text-secondary-700 italic text-center">
              « Ce site a été cofinancé par l'Union Européenne »
            </p>
            <p className="text-xs text-secondary-600 text-center mt-1">
              Mention obligatoire intégrée dans le footer de votre site
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-accent-700" />
              <p className="text-lg font-semibold text-accent-800">
                Offre limitée dans le temps
              </p>
            </div>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Le dispositif Kap Numérik est soumis à des plafonds budgétaires. 
              Ne manquez pas cette opportunité de digitaliser votre entreprise avec 80% de remboursement !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:bg-gradient-primary-reverse text-white shadow-primary-lg transition-all duration-300">
                <Link href="#contact">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Demander un devis gratuit
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <Link href="#faq">
                  En savoir plus sur Kap Numérik
                </Link>
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            * Sous réserve d'éligibilité et dans la limite des fonds disponibles
          </p>
        </motion.div>
      </div>
    </section>
  )
}