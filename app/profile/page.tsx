'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

interface HouseholdInfo {
  id?: string
  number_of_people: number | null
  property_type: 'house' | 'apartment' | ''
  house_size_m2: number | null
  peb_rating: string
  year_of_construction: number | null
  heating_type: string
  has_solar_panels: boolean
  has_electric_car: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<HouseholdInfo>({
    number_of_people: null,
    property_type: '',
    house_size_m2: null,
    peb_rating: '',
    year_of_construction: null,
    heating_type: '',
    has_solar_panels: false,
    has_electric_car: false
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    } else if (user) {
      loadHouseholdInfo()
    }
  }, [user, authLoading])

  const loadHouseholdInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('household_info')
        .select('*')
        .eq('user_id', user!.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (data) {
        setFormData({
          id: data.id,
          number_of_people: data.number_of_people,
          property_type: data.property_type || '',
          house_size_m2: data.house_size_m2,
          peb_rating: data.peb_rating || '',
          year_of_construction: data.year_of_construction,
          heating_type: data.heating_type || '',
          has_solar_panels: data.has_solar_panels || false,
          has_electric_car: data.has_electric_car || false
        })
      }
    } catch (err) {
      console.error('Error loading household info:', err)
      setError('Erreur lors du chargement des informations')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const dataToSave = {
        user_id: user!.id,
        number_of_people: formData.number_of_people,
        property_type: formData.property_type || null,
        house_size_m2: formData.house_size_m2,
        peb_rating: formData.peb_rating || null,
        year_of_construction: formData.year_of_construction,
        heating_type: formData.heating_type || null,
        has_solar_panels: formData.has_solar_panels,
        has_electric_car: formData.has_electric_car
      }

      if (formData.id) {
        // Update existing record
        const { error } = await supabase
          .from('household_info')
          .update(dataToSave)
          .eq('id', formData.id)

        if (error) throw error
      } else {
        // Insert new record
        const { error } = await supabase
          .from('household_info')
          .insert([dataToSave])

        if (error) throw error
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await loadHouseholdInfo() // Reload to get the ID
    } catch (err: any) {
      console.error('Error saving household info:', err)
      setError(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof HouseholdInfo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Retour au tableau de bord
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Situation personnelle</h1>
          <p className="text-gray-600">
            Ces informations permettent de comparer votre consommation avec les moyennes nationales
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Number of People */}
            <div>
              <label htmlFor="number_of_people" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de personnes dans le foyer *
              </label>
              <input
                type="number"
                id="number_of_people"
                min="1"
                max="20"
                value={formData.number_of_people || ''}
                onChange={(e) => handleChange('number_of_people', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 3"
              />
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-2">
                Type d'habitation *
              </label>
              <select
                id="property_type"
                value={formData.property_type}
                onChange={(e) => handleChange('property_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez...</option>
                <option value="house">Maison</option>
                <option value="apartment">Appartement</option>
              </select>
            </div>

            {/* House Size */}
            <div>
              <label htmlFor="house_size_m2" className="block text-sm font-medium text-gray-700 mb-2">
                Surface habitable (m²) *
              </label>
              <input
                type="number"
                id="house_size_m2"
                min="10"
                max="10000"
                step="0.01"
                value={formData.house_size_m2 || ''}
                onChange={(e) => handleChange('house_size_m2', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 120"
              />
            </div>

            {/* PEB Rating */}
            <div>
              <label htmlFor="peb_rating" className="block text-sm font-medium text-gray-700 mb-2">
                Certificat PEB (Performance Énergétique)
              </label>
              <select
                id="peb_rating"
                value={formData.peb_rating}
                onChange={(e) => handleChange('peb_rating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez...</option>
                <option value="A++">A++ (Très basse consommation)</option>
                <option value="A+">A+ (Très basse consommation)</option>
                <option value="A">A (Basse consommation)</option>
                <option value="B">B (Bonne performance)</option>
                <option value="C">C (Performance moyenne)</option>
                <option value="D">D (Performance moyenne)</option>
                <option value="E">E (Faible performance)</option>
                <option value="F">F (Très faible performance)</option>
                <option value="G">G (Très faible performance)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Le certificat PEB indique la performance énergétique de votre habitation
              </p>
            </div>

            {/* Year of Construction */}
            <div>
              <label htmlFor="year_of_construction" className="block text-sm font-medium text-gray-700 mb-2">
                Année de construction
              </label>
              <input
                type="number"
                id="year_of_construction"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.year_of_construction || ''}
                onChange={(e) => handleChange('year_of_construction', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 1995"
              />
            </div>

            {/* Heating Type */}
            <div>
              <label htmlFor="heating_type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de chauffage
              </label>
              <select
                id="heating_type"
                value={formData.heating_type}
                onChange={(e) => handleChange('heating_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionnez...</option>
                <option value="electric">Électrique</option>
                <option value="gas">Gaz naturel</option>
                <option value="fuel_oil">Mazout</option>
                <option value="heat_pump">Pompe à chaleur</option>
                <option value="wood">Bois/Pellets</option>
                <option value="solar">Solaire thermique</option>
                <option value="other">Autre</option>
              </select>
            </div>

            {/* Solar Panels */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_solar_panels"
                checked={formData.has_solar_panels}
                onChange={(e) => handleChange('has_solar_panels', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="has_solar_panels" className="ml-2 block text-sm text-gray-700">
                Panneaux solaires photovoltaïques
              </label>
            </div>

            {/* Electric Car */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_electric_car"
                checked={formData.has_electric_car}
                onChange={(e) => handleChange('has_electric_car', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="has_electric_car" className="ml-2 block text-sm text-gray-700">
                Véhicule électrique (recharge à domicile)
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <p className="text-green-700">✓ Informations enregistrées avec succès</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? 'Enregistrement...' : (formData.id ? 'Mettre à jour' : 'Enregistrer')}
              </button>

              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Confidentialité</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Ces informations sont utilisées uniquement pour calculer des comparaisons avec les moyennes nationales.
                  Elles ne sont pas partagées avec des tiers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
