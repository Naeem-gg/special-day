import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-cormorant" })
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-montserrat" })

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dnvites.com"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DNvites – Dearest Invites | Digital Wedding Invitations",
    template: "%s | DNvites",
  },
  description: "Create beautiful, animated digital wedding invitations in minutes. Share instantly via WhatsApp, Instagram or Email with RSVP tracking and photo galleries.",
  keywords: ["digital wedding invitation", "online wedding card", "animated wedding invite", "whatsapp wedding invitation", "RSVP tracking", "wedding photo gallery", "e-invites", "paperless invitations"],
  authors: [{ name: "DNvites Team" }],
  creator: "DNvites",
  publisher: "DNvites",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "DNvites",
    title: "DNvites – Dearest Invites | Digital Wedding Invitations",
    description: "Create beautiful, animated digital wedding invitations in minutes. Share instantly via WhatsApp, Instagram or Email.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DNvites - Digital Wedding Invitations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DNvites – Dearest Invites | Digital Wedding Invitations",
    description: "Create beautiful, animated digital wedding invitations in minutes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DNvites",
  "url": baseUrl,
  "logo": `${baseUrl}/icon.ico`,
  "sameAs": [
    "https://instagram.com/dnvites",
    "https://facebook.com/dnvites",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service",
  },
}


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
      <body className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${montserrat.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
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
