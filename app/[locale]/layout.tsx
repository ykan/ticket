import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { ThemeProvider } from 'next-themes'

import { routing } from '@/i18n/routing'
import { fonts } from '@/lib/fonts'
import { cn } from '@/lib/utils'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Ticket System',
  description: 'Ticket System',
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return (
    <ClerkProvider>
      <NextIntlClientProvider>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <html lang={locale}>
              <body className={cn(fonts, 'antialiased')}>{children}</body>
            </html>
          </ThemeProvider>
        </Providers>
      </NextIntlClientProvider>
    </ClerkProvider>
  )
}
