import { Analytics } from '@vercel/analytics/next'
import { Playfair_Display, Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TimeLux - Премиальные часы',
  description: 'Эксклюзивная коллекция швейцарских часов. Rolex, Patek Philippe, Audemars Piguet и другие люксовые бренды с гарантией подлинности.',
  keywords: 'часы, швейцарские часы, rolex, patek philippe, audemars piguet, omega, cartier',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
