export function Features() {
  const features = [
    {
      icon: '⚡',
      title: 'Suivi multi-compteurs',
      description: 'Suivez tous vos compteurs d\'électricité, d\'eau, de gaz et même des compteurs personnalisés en un seul endroit.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: '📊',
      title: 'Calculs automatiques',
      description: 'Consommation calculée automatiquement entre deux relevés. Fini les calculs manuels!',
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: '📍',
      title: 'Multi-emplacements',
      description: 'Gérez plusieurs lieux: maison principale, résidence secondaire, bureau... Tout est organisé.',
      color: 'from-green-400 to-teal-500'
    },
    {
      icon: '📈',
      title: 'Historique complet',
      description: 'Tous vos relevés sont conservés et accessibles. Analysez vos consommations dans le temps.',
      color: 'from-pink-400 to-red-500'
    },
    {
      icon: '🔒',
      title: 'Sécurité garantie',
      description: 'Vos données sont protégées avec une sécurité de niveau bancaire (RLS). Chaque utilisateur voit uniquement ses propres données.',
      color: 'from-indigo-400 to-blue-500'
    },
    {
      icon: '⚙️',
      title: 'Interface intuitive',
      description: 'Ajoutez un relevé en quelques secondes. Interface simple et rapide, accessible partout.',
      color: 'from-purple-400 to-pink-500'
    }
  ]

  return (
    <div id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une solution complète pour gérer vos compteurs et suivre vos consommations
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 mb-5 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
