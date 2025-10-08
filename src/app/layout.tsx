
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
    default: 'Morty\'s Cake | Cursos de Repostería y Pastelería Gourmet',
    template: '%s | Morty\'s Cake',
  },
  description: 'Aprende repostería desde cero hasta un nivel experto con nuestros cursos online. Descubre tartas y postres personalizados para tus eventos. ¡Transforma tu pasión en arte!',
  keywords: ['cursos de repostería', 'repostería online', 'tartas personalizadas', 'pastelería gourmet', 'repostería creativa', 'tartas de boda', 'Ourense'],
  openGraph: {
    title: 'Morty\'s Cake | Cursos de Repostería y Pastelería Gourmet',
    description: 'Transforma tu pasión por la repostería en un arte. Cursos para todos los niveles, tartas personalizadas y mucho más.',
    url: 'https://mortyscake.com',
    siteName: 'Morty\'s Cake',
    images: [
      {
        url: '/image/fondo_heder.webp', // URL relativa a metadataBase
        width: 1200,
        height: 630,
        alt: 'Alumna sonriendo mientras decora una tarta de flores en un curso de repostería.',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morty\'s Cake | Cursos de Repostería y Pastelería Gourmet',
    description: 'De cero a experto en repostería con nuestros cursos prácticos. Descubre también nuestras tartas personalizadas para eventos.',
    images: ['/image/fondo_heder.webp'], // URL relativa a metadataBase
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
