import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'

import { ThemeProvider } from '@/app/theme/ThemeContext'
import { LocaleProvider } from '@/app/i18n/LocaleContext'
import LocaleSelect from '@/components/LocaleSelect'
import { translations } from '@/app/i18n/translations'

import '@/app/globals.css'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  preload: true,
  display: 'swap',
  weight: ['400', '500', '700'],
  fallback: [
    'Noto Sans KR',
    'Noto Sans SC',
    'Noto Sans TC',
    'Noto Sans JP',
    'Noto Sans Arabic',
    'Noto Sans Thai',
    'Noto Sans Devanagari',
    'Noto Sans Bengali',
    'system-ui',
  ],
})

export function generateMetadata({ params }: { params: { locale?: string } }): Metadata {
  const locale = params.locale || 'ko'
  const t = translations[locale as keyof typeof translations]

  return {
    title: `Faster.co.kr - ${t.title}`,
    description: t.description,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+Arabic:wght@400;500;700&family=Noto+Sans+Thai:wght@400;500;700&family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Sans+Bengali:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${notoSans.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider>
          <LocaleProvider>
            <LocaleSelect />
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
