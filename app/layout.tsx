import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "DNvites – Dearest Invites | Digital Wedding Invitations",
  description: "Create a beautiful, animated digital wedding invitation in minutes. Share with family & friends instantly via WhatsApp, Instagram or Email.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
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
