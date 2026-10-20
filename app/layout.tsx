import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { withBasePath } from '@/lib/base-path'
import './globals.css'

const isGithubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true'

const noto = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-noto' })

export const metadata: Metadata = {
  title: 'APANI',
  description: '아이폰 속 기록을 따라가는 가상의 이야기',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: withBasePath('/icon-light-32x32.png'), media: '(prefers-color-scheme: light)' },
      { url: withBasePath('/icon-dark-32x32.png'), media: '(prefers-color-scheme: dark)' },
      { url: withBasePath('/icon.svg'), type: 'image/svg+xml' },
    ],
    apple: withBasePath('/apple-icon.png'),
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  themeColor: '#1c1c1e',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={noto.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && !isGithubPages && <Analytics />}
      </body>
    </html>
  )
}
