
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
import { CartSheet } from '@/components/CartSheet';


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
    default: 'Morty\'s Cake | Repostería Creativa y Cursos en Ourense, Galicia',
    template: '%s | Morty\'s Cake Ourense',
  },
  description: 'Aprende repostería en Ourense con nuestros cursos online y presenciales. Descubre tartas y postres personalizados en Galicia. ¡Transforma tu pasión en arte!',
  keywords: ['cursos de repostería Ourense', 'repostería online Galicia', 'tartas personalizadas Ourense', 'pastelería gourmet Galicia', 'repostería creativa Galicia', 'tartas de boda Ourense', 'Ourense', 'Galicia'],
  openGraph: {
    title: 'Morty\'s Cake | Cursos de Repostería y Pastelería Gourmet en Ourense y Galicia',
    description: 'Transforma tu pasión por la repostería en arte con nuestros cursos en Ourense. Ofrecemos tartas personalizadas y mucho más en el corazón de Galicia.',
    url: 'https://mortyscake.com',
    siteName: 'Morty\'s Cake',
    images: [
      {
        url: '/image/fondo_heder.webp', // URL relativa a metadataBase
        width: 1200,
        height: 630,
        alt: 'Alumna sonriendo mientras decora una tarta de flores en un curso de repostería en Ourense.',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morty\'s Cake | Repostería y Cursos en Ourense y para toda Galicia',
    description: 'De cero a experto en repostería con nuestros cursos prácticos en Ourense. Descubre también nuestras tartas personalizadas para eventos en Galicia.',
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
  verification: {
    google: 'REEMPLAZA_CON_TU_CODIGO_DE_VERIFICACION',
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
          <CartSheet />
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
