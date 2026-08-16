import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ThemeScript } from '@/components/ThemeScript';
import { absoluteUrl, siteConfig } from '@/site.config';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: absoluteUrl('/'),
    types: {
      'application/rss+xml': absoluteUrl('/rss.xml'),
    },
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.title,
    locale: siteConfig.locale,
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 테마 스크립트가 하이드레이션 전에 data-theme 을 바꾸므로 경고를 억제한다.
    <html lang={siteConfig.lang} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a href="#content" className="skipLink">
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="content" className="main">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
