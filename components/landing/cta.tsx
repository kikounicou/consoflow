import Link from 'next/link'

export function CTA() {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
          <span className="mr-2">⚡</span>
          Accès sur invitation uniquement
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à maîtriser vos consommations?
        </h2>

        {/* Description */}
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Rejoignez les utilisateurs qui suivent déjà leurs compteurs avec notre solution simple et efficace.
        </p>

        {/* CTA Button */}
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
        >
          Commencer maintenant
          <span className="ml-2">→</span>
        </Link>

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-white border-opacity-20">
          <div className="flex flex-wrap justify-center items-center gap-8 text-white text-opacity-80">
            <div className="flex items-center">
              <span className="text-2xl mr-2">✓</span>
              <span>100% gratuit</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">✓</span>
              <span>Sans publicité</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">✓</span>
              <span>Données sécurisées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
    </div>
  )
}
