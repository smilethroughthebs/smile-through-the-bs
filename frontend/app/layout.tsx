/**
 * ==============================================
 * VARLIXO - ROOT LAYOUT
 * ==============================================
 * Main layout wrapper for the entire application.
 */

import './globals.css';
import { Manrope } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

// Initialize Manrope font
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

// Metadata
export const metadata = {
  title: 'Varlixo - Intelligent Investment Platform',
  description: 'The future of intelligent investing. Secure, scalable, and built for growth. Start your investment journey with Varlixo today.',
  keywords: 'investment, crypto, trading, finance, returns, passive income',
  openGraph: {
    title: 'Varlixo - Intelligent Investment Platform',
    description: 'The future of intelligent investing. Secure, scalable, and built for growth.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid #2a2a3e',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#00d4aa',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
