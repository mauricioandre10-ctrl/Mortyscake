
import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Lato as FontSans, Pacifico as FontHeadline, Playfair_Display as FontCardTitle } from 'next/font/google';
import { Analytics } from '@/components/Analytics';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CookieBanner } from '@/components/CookieBanner';
import WhatsAppButton from '@/components/WhatsAppButton';
import InstagramButton from '@/components/InstagramButton';
import { Providers } from '@/components/providers';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';


const fontSans = FontSans({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '700'],
});

const fontHeadline = FontHeadline({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  weight: '400',
});

const fontCardTitle = FontCardTitle({
  subsets: ['latin'],
  variable: '--font-card-title',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mortyscake.com'),
  title: {
    default: 'Cursos de Repostería Online y en Vivo | Transforma tu Pasión en Arte',
    template: '%s | Cursos de Repostería',
  },
  description: 'Aprende repostería desde cero hasta un nivel experto con nuestros cursos online y en vivo. Únete a nuestra comunidad y convierte tu pasión en arte.',
  keywords: ['cursos de repostería', 'repostería online', 'repostería en vivo', 'aprender repostería', 'tartas', 'pasteles', 'diseño de pasteles', 'repostería gourmet'],
  openGraph: {
    title: 'Cursos de Repostería Online y en Vivo | Pastelería de Morty',
    description: 'Transforma tu pasión por la repostería en un arte. Cursos para todos los niveles, impartidos por expertos y con acceso a una comunidad vibrante.',
    url: 'https://mortyscake.com',
    siteName: 'Cursos de Repostería de Morty',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Alumna sonriendo mientras decora un pastel en un curso de repostería online.',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos de Repostería Online y en Vivo | Pastelería de Morty',
    description: 'De cero a experto en repostería con nuestros cursos prácticos. Aprende, crea y comparte tu pasión.',
    images: ['/twitter-image.jpg'],
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
  icons: null,
};

export const viewport: Viewport = {
  themeColor: '#F3EAD9',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontSans.variable,
          fontHeadline.variable,
          fontCardTitle.variable
        )}
      >
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
        <CookieBanner />
        <WhatsAppButton />
        <InstagramButton />
      </body>
    </html>
  );
}
