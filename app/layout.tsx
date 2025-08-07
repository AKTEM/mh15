// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'The Maple Epoch - Breaking News & Latest Updates',
  description:
    'Stay informed with real-time coverage of breaking news, politics, business, technology, health, sports, and entertainment.',
  keywords: 'news, breaking news, politics, business, technology, health, sports, entertainment, world news',
  authors: [{ name: 'The Maple Epoch Editorial Team' }],
  creator: 'The Maple Epoch',
  publisher: 'The Maple Epoch',
  openGraph: {
    title: 'The Maple Epoch - Breaking News & Latest Updates',
    description:
      'Stay informed with real-time coverage of breaking news, politics, business, technology, health, sports, and entertainment.',
    url: 'https://mapleepoch.com',
    siteName: 'The Maple Epoch',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Maple Epoch News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Maple Epoch - Breaking News & Latest Updates',
    description:
      'Stay informed with real-time coverage of breaking news, politics, business, technology, health, sports, and entertainment.',
    images: ['/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}






