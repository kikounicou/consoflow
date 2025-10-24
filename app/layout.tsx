import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'ConsoFlow - Smart Meter Tracking',
  description: 'Suivez vos consommations d\'électricité, d\'eau et de gaz avec ConsoFlow. Simple, rapide et sécurisé.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
