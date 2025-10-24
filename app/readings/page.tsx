'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Meter = {
  id: string
  name: string
  meter_type: {
    name: string
    unit: string
  }
}

type Reading = {
  id: string
  meter_id: string
  reading_date: string
  value: number
  notes: string | null
  photo_url: string | null
  meter: Meter
}

export default function ReadingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [readings, setReadings] = useState<Reading[]>([])
  const [meters, setMeters] = useState<Meter[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedMeter, setSelectedMeter] = useState<string>('')
  const [formData, setFormData] = useState({
    meter_id: '',
    reading_date: new Date().toISOString().split('T')[0],
    value: '',
    notes: ''
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
  }, [user, selectedMeter])

  const loadData = async () => {
    try {
      const metersRes = await supabase
        .from('meters')
        .select(`
          id,
          name,
          meter_type:meter_types(name, unit)
        `)
        .eq('is_active', true)
        .order('name')

      if (metersRes.error) throw metersRes.error
      setMeters(metersRes.data || [])

      let query = supabase
        .from('readings')
        .select(`
          *,
          meter:meters(
            id,
            name,
            meter_type:meter_types(name, unit)
          )
        `)
        .order('reading_date', { ascending: false })

      if (selectedMeter) {
        query = query.eq('meter_id', selectedMeter)
      }

      const readingsRes = await query

      if (readingsRes.error) throw readingsRes.error
      setReadings(readingsRes.data || [])
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
        meter_id: formData.meter_id,
        reading_date: new Date(formData.reading_date).toISOString(),
        value: parseFloat(formData.value),
        notes: formData.notes || null
      }

      if (editingId) {
        const { error } = await supabase
          .from('readings')
          .update(dataToSave)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('readings')
          .insert([dataToSave])

        if (error) throw error
      }

      resetForm()
      loadData()
    } catch (error: any) {
      console.error('Error saving reading:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    }
  }

  const handleEdit = (reading: Reading) => {
    setFormData({
      meter_id: reading.meter_id,
      reading_date: new Date(reading.reading_date).toISOString().split('T')[0],
      value: reading.value.toString(),
      notes: reading.notes || ''
    })
    setEditingId(reading.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce relevé?')) return

    try {
      const { error } = await supabase
        .from('readings')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadData()
    } catch (error: any) {
      console.error('Error deleting reading:', error)
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      meter_id: '',
      reading_date: new Date().toISOString().split('T')[0],
      value: '',
      notes: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateConsumption = (index: number) => {
    if (index === readings.length - 1) return null
    const current = readings[index]
    const previous = readings[index + 1]

    if (current.meter_id !== previous.meter_id) return null

    const consumption = current.value - previous.value
    const daysDiff = Math.round(
      (new Date(current.reading_date).getTime() - new Date(previous.reading_date).getTime()) / (1000 * 60 * 60 * 24)
    )

    return { consumption, daysDiff }
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
        <h1 className="text-3xl font-bold text-gray-900">Relevés</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Annuler' : '+ Nouveau relevé'}
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="filterMeter" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrer par compteur
        </label>
        <select
          id="filterMeter"
          value={selectedMeter}
          onChange={(e) => setSelectedMeter(e.target.value)}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les compteurs</option>
          {meters.map((meter) => (
            <option key={meter.id} value={meter.id}>
              {meter.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Modifier le relevé' : 'Nouveau relevé'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="meter_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Compteur *
                </label>
                <select
                  id="meter_id"
                  required
                  value={formData.meter_id}
                  onChange={(e) => setFormData({ ...formData, meter_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un compteur</option>
                  {meters.map((meter) => (
                    <option key={meter.id} value={meter.id}>
                      {meter.name} ({meter.meter_type.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reading_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date du relevé *
                </label>
                <input
                  type="date"
                  id="reading_date"
                  required
                  value={formData.reading_date}
                  onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                  Valeur *
                  {formData.meter_id && meters.find(m => m.id === formData.meter_id) && (
                    <span className="text-gray-500 ml-2">
                      ({meters.find(m => m.id === formData.meter_id)?.meter_type.unit})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  id="value"
                  required
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 12345.67"
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes supplémentaires..."
              />
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

      {readings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Aucun relevé pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ajouter votre premier relevé
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consommation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {readings.map((reading, index) => {
                  const consumption = calculateConsumption(index)
                  return (
                    <tr key={reading.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(reading.reading_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{reading.meter.name}</div>
                          <div className="text-gray-500">{reading.meter.meter_type.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.value.toLocaleString('fr-FR')} {reading.meter.meter_type.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {consumption ? (
                          <div>
                            <span className={consumption.consumption >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {consumption.consumption > 0 ? '+' : ''}{consumption.consumption.toLocaleString('fr-FR')} {reading.meter.meter_type.unit}
                            </span>
                            <div className="text-xs text-gray-500">sur {consumption.daysDiff} jour(s)</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {reading.notes ? (
                          <span className="line-clamp-2">{reading.notes}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(reading)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(reading.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
