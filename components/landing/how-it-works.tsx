export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Créez votre compte',
      description: 'Inscription simple et rapide avec un code d\'invitation. Vos données sont immédiatement sécurisées.',
      icon: '🚀'
    },
    {
      number: '2',
      title: 'Ajoutez vos compteurs',
      description: 'Créez vos emplacements et ajoutez vos compteurs. Électricité, eau, gaz ou personnalisé.',
      icon: '📊'
    },
    {
      number: '3',
      title: 'Enregistrez vos relevés',
      description: 'Ajoutez un relevé en quelques secondes. Directement depuis le tableau de bord!',
      icon: '✏️'
    },
    {
      number: '4',
      title: 'Suivez vos consommations',
      description: 'Visualisez votre historique et vos consommations calculées automatiquement.',
      icon: '📈'
    }
  ]

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comment ça marche?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quatre étapes simples pour commencer à suivre vos compteurs
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines (hidden on mobile) */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border-2 border-transparent hover:border-blue-200">
                {/* Number badge */}
                <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">{step.icon}</div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
