import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Battleships Online - 2-Player Naval Strategy Game',
  description: 'Play the classic Battleships game online with friends. Strategic turn-based naval combat in your browser.',
  keywords: ['battleships', 'online game', 'multiplayer', 'strategy', 'naval', 'turn-based'],
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
  openGraph: {
    title: 'Battleships Online',
    description: 'Play the classic Battleships game online with friends.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Battleships Online',
    description: 'Play the classic Battleships game online with friends.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
} 