import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import '../styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false, // Pas critique pour le FCP
  fallback: ['Georgia', 'serif'],
})

const bebas = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  preload: true, // Utilisé dans le Hero
  fallback: ['Impact', 'sans-serif'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://kap-numerique.re'),
  title: {
    default: 'Kap Numérique - Votre Partenaire Digital à La Réunion',
    template: '%s | Kap Numérique'
  },
  description: 'Dispositif d\'aide au développement numérique à La Réunion. Créez votre site web professionnel avec notre accompagnement premium.',
  keywords: ['kap numérique', 'développement web', 'la réunion', 'site internet', 'aide numérique', 'transformation digitale'],
  authors: [{ name: 'Kap Numérique' }],
  creator: 'Kap Numérique',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://kap-numerique.re',
    siteName: 'Kap Numérique',
    title: 'Kap Numérique - Votre Partenaire Digital à La Réunion',
    description: 'Dispositif d\'aide au développement numérique à La Réunion. Créez votre site web professionnel avec notre accompagnement premium.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kap Numérique - Développement Digital à La Réunion',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kap Numérique - Votre Partenaire Digital à La Réunion',
    description: 'Dispositif d\'aide au développement numérique à La Réunion.',
    creator: '@kapnumerique',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://kap-numerique.re',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} ${bebas.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}