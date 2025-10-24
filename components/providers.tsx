'use client'

import { AuthProvider } from '@/lib/auth-context'
import { Header } from './header'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              ConsoFlow - {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}
