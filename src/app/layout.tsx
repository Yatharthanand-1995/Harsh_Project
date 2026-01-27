import type { Metadata } from 'next'
import Script from 'next/script'
import { Merriweather, Source_Sans_3 } from 'next/font/google'
import { AuthProvider } from '@/components/providers/session-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { Toaster } from 'sonner'
import './globals.css'

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Homespun - Artisan Bakery & Festive Gifts',
  description:
    'Discover artisan-baked delights and festive treasures crafted with love. From celebration cakes to Diwali hampers, Homespun brings authentic handcrafted quality to every occasion.',
  keywords: [
    'artisan bakery',
    'festive gifts',
    'celebration cakes',
    'diwali hampers',
    'handcrafted gifts',
    'indian bakery',
    'online bakery india',
  ],
  authors: [{ name: 'Homespun' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Homespun',
    title: 'Homespun - Handcrafted with Heart',
    description:
      'Where Traditions Rise. Premium artisan bakery and festive gifts delivered across India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homespun - Artisan Bakery & Festive Gifts',
    description: 'Handcrafted with love, delivered with care',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${merriweather.variable} ${sourceSans.variable} font-sans antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-right" richColors />
        </ErrorBoundary>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
