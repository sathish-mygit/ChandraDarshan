import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Devanagari, Noto_Sans_Tamil, Noto_Sans_Telugu } from 'next/font/google';
import AppContent from './AppContent';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: '--font-noto-devanagari',
  subsets: ['devanagari'],
  weight: ['400', '600', '700'],
});

const notoTelugu = Noto_Sans_Telugu({
  variable: '--font-noto-telugu',
  subsets: ['telugu'],
  weight: ['400', '600', '700'],
});

const notoTamil = Noto_Sans_Tamil({
  variable: '--font-noto-tamil',
  subsets: ['tamil'],
  weight: ['400', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'Chandra Darshan',
  description:
    'Daily Indian lunar calendar — moon phase, tithi, paksha, and maasa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${notoDevanagari.variable} ${notoTelugu.variable} ${notoTamil.variable} min-h-full antialiased`}
      >
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}
