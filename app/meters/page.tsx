'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type MeterType = {
  id: string
  name: string
  unit: string
  icon: string | null
  color: string | null
}

type Location = {
  id: string
  name: string
}

type Meter = {
  id: string
  name: string
  serial_number: string | null
  description: string | null
  is_active: boolean
  meter_type: MeterType
  location: Location | null
}

const METER_ICONS: { [key: string]: string } = {
  'Électricité': '⚡',
  'Eau': '💧',
  'Gaz': '🔥',
  'Personnalisé': '📈'
}

export default function MetersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [meters, setMeters] = useState<Meter[]>([])
  const [meterTypes, setMeterTypes] = useState<MeterType[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    meter_type_id: '',
    location_id: '',
    serial_number: '',
    description: '',
    is_active: true
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [metersRes, typesRes, locationsRes] = await Promise.all([
        supabase
          .from('meters')
          .select(`
            *,
            meter_type:meter_types(*),
            location:locations(id, name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('meter_types')
          .select('*')
          .order('name'),
        supabase
          .from('locations')
          .select('id, name')
          .order('name')
      ])

      if (metersRes.error) throw metersRes.error
      if (typesRes.error) throw typesRes.error
      if (locationsRes.error) throw locationsRes.error

      setMeters(metersRes.data || [])
      setMeterTypes(typesRes.data || [])
      setLocations(locationsRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const dataToSave = {
        user_id: user.id,
        name: formData.name,
        meter_type_id: formData.meter_type_id,
        location_id: formData.location_id || null,
        serial_number: formData.serial_number || null,
        description: formData.description || null,
        is_active: formData.is_active
      }

      if (editingId) {
        const { error } = await supabase
          .from('meters')
          .update(dataToSave)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('meters')
          .insert([dataToSave])

        if (error) throw error
      }

      resetForm()
      loadData()
    } catch (error: any) {
      console.error('Error saving meter:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    }
  }

  const handleEdit = (meter: Meter) => {
    setFormData({
      name: meter.name,
      meter_type_id: meter.meter_type.id,
      location_id: meter.location?.id || '',
      serial_number: meter.serial_number || '',
      description: meter.description || '',
      is_active: meter.is_active
    })
    setEditingId(meter.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce compteur?')) return

    try {
      const { error } = await supabase
        .from('meters')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadData()
    } catch (error: any) {
      console.error('Error deleting meter:', error)
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      meter_type_id: '',
      location_id: '',
      serial_number: '',
      description: '',
      is_active: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mes compteurs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Annuler' : '+ Nouveau compteur'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Modifier le compteur' : 'Nouveau compteur'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du compteur *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Compteur principal"
                />
              </div>
              <div>
                <label htmlFor="meter_type_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Type de compteur *
                </label>
                <select
                  id="meter_type_id"
                  required
                  value={formData.meter_type_id}
                  onChange={(e) => setFormData({ ...formData, meter_type_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  {meterTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Emplacement
                </label>
                <select
                  id="location_id"
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Aucun emplacement</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de série
                </label>
                <input
                  type="text"
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: ABC123456"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes supplémentaires..."
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Compteur actif
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {meters.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Aucun compteur pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Créer votre premier compteur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meters.map((meter) => (
            <div
              key={meter.id}
              className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 ${
                !meter.is_active ? 'opacity-60' : ''
              }`}
              style={{ borderLeftColor: meter.meter_type.color || '#6B7280' }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{meter.name}</h3>
                  <p className="text-sm text-gray-500">{meter.meter_type.name}</p>
                </div>
                <span className="text-2xl">
                  {METER_ICONS[meter.meter_type.name] || '📊'}
                </span>
              </div>
              {meter.location && (
                <p className="text-sm text-gray-600 mb-2">📍 {meter.location.name}</p>
              )}
              {meter.serial_number && (
                <p className="text-xs text-gray-500 mb-2">S/N: {meter.serial_number}</p>
              )}
              {meter.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meter.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(meter)}
                  className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(meter.id)}
                  className="flex-1 px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
