import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quiz dos 5 Elementos | Descubra o que está desalinhado no seu relacionamento',
  description:
    'Descubra em 3 minutos qual dos 5 Elementos está desalinhado no seu relacionamento e por que vocês parecem falar línguas diferentes.',
  keywords: [
    'relacionamento',
    'casal',
    'terapia',
    'comunicação',
    '5 elementos',
    'Jaya Roberta',
  ],
  authors: [{ name: 'Jaya Roberta' }],
  metadataBase: new URL('https://quiz-5-elementos-claude.vercel.app'),
  openGraph: {
    title: 'Por Que Vocês Falam Mas Ninguém Se Sente Ouvido?',
    description:
      'Descubra em 3 minutos qual elemento está desalinhado no seu relacionamento.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Quiz dos 5 Elementos',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Quiz dos 5 Elementos - Jaya Roberta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Por Que Vocês Falam Mas Ninguém Se Sente Ouvido?',
    description:
      'Descubra em 3 minutos qual elemento está desalinhado no seu relacionamento.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans">
        <main className="flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
