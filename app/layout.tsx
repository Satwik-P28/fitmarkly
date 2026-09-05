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

const siteUrl = 'https://fitmarkly.nex3sss.chatgpt.site';

export const metadata: Metadata = {
  title: 'Fitmarkly — Open-source resume matcher that never invents experience',
  description:
    'Free local-first resume-to-job matcher and Jobscan alternative. Evidence-linked requirements, claim locks, and reviewable wording — no account, no upload.',
  keywords: [
    'open source jobscan alternative',
    'resume keyword matcher',
    'ATS resume checker',
    'privacy resume review',
    'local-first job search',
  ],
  authors: [{ name: 'Fitmarkly contributors' }],
  category: 'productivity',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    url: siteUrl,
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Fitmarkly',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Local-first open-source resume-to-job matcher with evidence-linked requirements.',
  url: siteUrl,
  downloadUrl: 'https://github.com/Satwik-P28/fitmarkly',
  license: 'https://opensource.org/licenses/MIT',
  isAccessibleForFree: true,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
