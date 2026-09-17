import { lightTheme } from '@muneo/design-system';
import '@muneo/design-system/styles/global.css';
import { GoogleTagManager } from '@next/third-parties/google';
import { type Metadata, type Viewport } from 'next';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { PageViewTracker } from '@/components/analytics';
import { FloatingChatLauncher } from '@/components/FloatingChatLauncher';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_TITLE_TEMPLATE,
  SITE_URL,
} from '@/constants/seo';
import { QueryProvider } from './providers/QueryProvider';
// 본문 폰트는 unicode-range로 쪼갠 서브셋을 쓴다. 전체 가변 폰트(2MB) 대신 화면에 쓰인 글자가 속한 조각만 받는다.
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';

// 디스플레이 폰트는 일부 제목(500·700)에만 쓰인다. 루트 레이아웃에서 preload하면 로그인 등
// 쓰지 않는 페이지까지 모두 내려받으므로, 실제로 렌더될 때만 받도록 preload를 끈다.
const paperlogy = localFont({
  src: [
    { path: './fonts/Paperlogy-5Medium.woff2', weight: '500' },
    { path: './fonts/Paperlogy-7Bold.woff2', weight: '700' },
  ],
  variable: '--font-paperlogy',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE_DEFAULT, template: SITE_TITLE_TEMPLATE },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  manifest: '/site.webmanifest',
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'ko_KR',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: DEFAULT_OG_IMAGE_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={`${lightTheme} ${paperlogy.variable}`} data-scroll-behavior="smooth">
      <body>
        <QueryProvider>
          {children}
          <FloatingChatLauncher />
        </QueryProvider>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        <Suspense>
          <PageViewTracker />
        </Suspense>
      </body>
    </html>
  );
};

export default RootLayout;
