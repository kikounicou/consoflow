import Link from 'next/link'
import { Logo } from '@/components/logo'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={false} href={undefined} />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 animate-pulse">
            <span className="mr-2">✨</span>
            Gérez vos compteurs intelligemment
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Suivez vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">compteurs</span>
            <br />
            en toute simplicité
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            L'application tout-en-un pour suivre vos consommations d'électricité, d'eau et de gaz.
            Simple, rapide et sécurisée.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Commencer gratuitement
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 shadow hover:shadow-md"
            >
              Découvrir les fonctionnalités
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Gratuit</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-1">⚡</div>
              <div className="text-sm text-gray-600">Instantané</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">🔒</div>
              <div className="text-sm text-gray-600">Sécurisé</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">∞</div>
              <div className="text-sm text-gray-600">Compteurs illimités</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  )
}
