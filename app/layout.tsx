import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fitmarkly — Match the role without making things up',
  description:
    'A truth-first resume matcher with evidence-linked requirements and reviewable edits.',
  metadataBase: new URL('https://fitmarkly.nex3sss.chatgpt.site'),
  openGraph: {
    title: 'Fitmarkly — Match the role without making things up',
    description:
      'Truth-first role matching with source-linked evidence and reviewable edits.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Fitmarkly — Match the role without making things up.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitmarkly — Match the role without making things up',
    description:
      'Truth-first role matching with source-linked evidence and reviewable edits.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
