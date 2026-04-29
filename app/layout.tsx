import type React from 'react'
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat, Cinzel } from 'next/font/google'
import './globals.css'
import 'react-loading-skeleton/dist/skeleton.css'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
})
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
})
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dnvites.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'DNvites – Premium Digital Wedding Invitations & RSVP',
    template: '%s | DNvites',
  },
  description:
    'Create stunning, animated digital wedding invitations in minutes. Share instantly via WhatsApp, Instagram or Email with live RSVP tracking, music, and photo galleries. Start for free!',
  keywords: [
    'digital wedding invitation',
    'online wedding card maker',
    'animated wedding invite',
    'whatsapp wedding invitation india',
    'RSVP tracking wedding',
    'wedding photo gallery online',
    'e-invites for wedding',
    'paperless wedding invitations',
    'save the date digital card',
    'indian wedding cards online',
  ],
  authors: [{ name: 'DNvites Team' }],
  creator: 'DNvites',
  publisher: 'DNvites',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  themeColor: '#D4AF37',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'DNvites',
    title: 'DNvites – Premium Digital Wedding Invitations & RSVP',
    description:
      'Create stunning, animated digital wedding invitations in minutes. Share instantly via WhatsApp, Instagram or Email.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'DNvites - Digital Wedding Invitations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DNvites – Premium Digital Wedding Invitations & RSVP',
    description: 'Create stunning, animated digital wedding invitations in minutes. The modern way to invite.',
    images: ['/logo.png'],
    creator: '@dnvites',
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
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DNvites',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: ['https://instagram.com/dnvites', 'https://facebook.com/dnvites'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DNvites',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/invite/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DNvites',
    operatingSystem: 'All',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
    },
  },
]

import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${cinzel.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
          {/* Temporary script to clear zombie service workers from previous projects on localhost */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (let registration of registrations) {
                      registration.unregister();
                      console.log('Successfully unregistered zombie service worker:', registration);
                    }
                    if (registrations.length > 0) window.location.reload();
                  });
                }
              `,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
