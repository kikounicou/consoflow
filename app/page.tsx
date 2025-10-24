'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type MeterStats = {
  meter_id: string
  meter_name: string
  meter_type: string
  meter_type_color: string | null
  unit: string
  latest_value: number | null
  latest_date: string | null
  previous_value: number | null
  previous_date: string | null
  consumption: number | null
  days_diff: number | null
}

const METER_ICONS: { [key: string]: string } = {
  'Électricité': '⚡',
  'Eau': '💧',
  'Gaz': '🔥',
  'Personnalisé': '📈'
}

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<MeterStats[]>([])
  const [loading, setLoading] = useState(true)
  const [meterCount, setMeterCount] = useState(0)
  const [locationCount, setLocationCount] = useState(0)
  const [newReadings, setNewReadings] = useState<{ [key: string]: string }>({})
  const [savingMeterId, setSavingMeterId] = useState<string | null>(null)
  const [successMeterId, setSuccessMeterId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const loadDashboardData = async () => {
    try {
      // Charger le nombre de compteurs et emplacements
      const [metersRes, locationsRes] = await Promise.all([
        supabase.from('meters').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('locations').select('id', { count: 'exact', head: true })
      ])

      setMeterCount(metersRes.count || 0)
      setLocationCount(locationsRes.count || 0)

      // Charger les statistiques par compteur
      const { data: meters } = await supabase
        .from('meters')
        .select(`
          id,
          name,
          meter_type:meter_types(name, unit, color)
        `)
        .eq('is_active', true)

      if (!meters) {
        setLoading(false)
        return
      }

      const meterStats: MeterStats[] = await Promise.all(
        meters.map(async (meter) => {
          // Normalize meter_type which may be an array
          const meterType = Array.isArray(meter.meter_type) ? meter.meter_type[0] : meter.meter_type

          const { data: readings } = await supabase
            .from('readings')
            .select('reading_date, value')
            .eq('meter_id', meter.id)
            .order('reading_date', { ascending: false })
            .limit(2)

          const latest = readings?.[0]
          const previous = readings?.[1]

          let consumption = null
          let daysDiff = null

          if (latest && previous) {
            consumption = latest.value - previous.value
            daysDiff = Math.round(
              (new Date(latest.reading_date).getTime() - new Date(previous.reading_date).getTime()) / (1000 * 60 * 60 * 24)
            )
          }

          return {
            meter_id: meter.id,
            meter_name: meter.name,
            meter_type: meterType?.name || 'Unknown',
            meter_type_color: meterType?.color || '#3b82f6',
            unit: meterType?.unit || '',
            latest_value: latest?.value || null,
            latest_date: latest?.reading_date || null,
            previous_value: previous?.value || null,
            previous_date: previous?.reading_date || null,
            consumption,
            days_diff: daysDiff
          }
        })
      )

      setStats(meterStats)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleAddReading = async (meterId: string) => {
    const value = newReadings[meterId]
    if (!value || !value.trim()) return

    setSavingMeterId(meterId)

    try {
      const { error } = await supabase
        .from('readings')
        .insert([{
          meter_id: meterId,
          reading_date: new Date().toISOString(),
          value: parseFloat(value)
        }])

      if (error) throw error

      // Animation de succès
      setSuccessMeterId(meterId)

      // Réinitialiser le champ
      setNewReadings(prev => ({ ...prev, [meterId]: '' }))

      // Recharger les données
      await loadDashboardData()

      // Effacer l'animation après 2 secondes
      setTimeout(() => {
        setSuccessMeterId(null)
      }, 2000)
    } catch (error: any) {
      console.error('Error saving reading:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSavingMeterId(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, meterId: string) => {
    if (e.key === 'Enter') {
      handleAddReading(meterId)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  // Page pour utilisateurs non connectés - Landing Page
  if (!user) {
    const { Hero } = require('@/components/landing/hero')
    const { Features } = require('@/components/landing/features')
    const { HowItWorks } = require('@/components/landing/how-it-works')
    const { CTA } = require('@/components/landing/cta')
    const { LandingFooter } = require('@/components/landing/footer')

    return (
      <>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <LandingFooter />
      </>
    )
  }

  // Dashboard pour utilisateurs connectés
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h2>
        <p className="text-gray-600">
          Vue d'ensemble de vos compteurs et consommations
        </p>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Compteurs actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{meterCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <span className="text-2xl">📍</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Emplacements</p>
              <p className="text-2xl font-semibold text-gray-900">{locationCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Relevés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.reduce((sum, s) => sum + (s.latest_value ? 1 : 0) + (s.previous_value ? 1 : 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compteurs */}
      {stats.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de compteurs</p>
          <Link
            href="/meters"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Créer votre premier compteur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.meter_id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 relative overflow-hidden"
              style={{ borderLeftColor: stat.meter_type_color || '#6B7280' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stat.meter_name}</h3>
                  <p className="text-sm text-gray-500">{stat.meter_type}</p>
                </div>
                <span className="text-3xl">
                  {METER_ICONS[stat.meter_type] || '📊'}
                </span>
              </div>

              <div className="mb-4">
                {stat.latest_value !== null ? (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.latest_value.toLocaleString('fr-FR')} {stat.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dernier relevé: {stat.latest_date && formatDate(stat.latest_date)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Aucun relevé</p>
                )}
              </div>

              {stat.consumption !== null && (
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Consommation</p>
                  <p className={`text-md font-semibold ${
                    stat.consumption >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.consumption > 0 ? '+' : ''}{stat.consumption.toLocaleString('fr-FR')} {stat.unit}
                  </p>
                  <p className="text-xs text-gray-500">
                    sur {stat.days_diff} jour(s)
                  </p>
                </div>
              )}

              {/* Formulaire d'ajout de relevé */}
              <div className="mt-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau relevé (aujourd'hui)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={newReadings[stat.meter_id] || ''}
                    onChange={(e) => setNewReadings(prev => ({ ...prev, [stat.meter_id]: e.target.value }))}
                    onKeyPress={(e) => handleKeyPress(e, stat.meter_id)}
                    placeholder={stat.latest_value ? `Dernier: ${stat.latest_value}` : 'Valeur'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={savingMeterId === stat.meter_id}
                  />
                  <button
                    onClick={() => handleAddReading(stat.meter_id)}
                    disabled={!newReadings[stat.meter_id] || savingMeterId === stat.meter_id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {savingMeterId === stat.meter_id ? '...' : '✓'}
                  </button>
                </div>
              </div>

              {/* Animation de succès */}
              {successMeterId === stat.meter_id && (
                <div className="absolute inset-0 bg-green-50 bg-opacity-95 rounded-lg flex items-center justify-center animate-bounce-in">
                  <div className="text-center">
                    <div className="text-6xl mb-2 animate-bounce">🎉</div>
                    <p className="text-lg font-bold text-green-700">Relevé enregistré!</p>
                  </div>
                </div>
              )}

              {/* Lien vers la page de détails */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href={`/meters/${stat.meter_id}`}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <span>Voir détails et graphiques</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions rapides */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/readings"
            className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl mr-3">➕</span>
            <span className="font-medium text-gray-900">Nouveau relevé</span>
          </Link>
          <Link
            href="/meters"
            className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl mr-3">📊</span>
            <span className="font-medium text-gray-900">Gérer les compteurs</span>
          </Link>
          <Link
            href="/locations"
            className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl mr-3">📍</span>
            <span className="font-medium text-gray-900">Gérer les emplacements</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
