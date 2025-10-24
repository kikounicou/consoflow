'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Location = {
  id: string
  name: string
  address: string | null
  created_at: string
}

export default function LocationsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', address: '' })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadLocations()
    }
  }, [user])

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLocations(data || [])
    } catch (error) {
      console.error('Error loading locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      if (editingId) {
        const { error } = await supabase
          .from('locations')
          .update({
            name: formData.name,
            address: formData.address || null
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([{
            user_id: user.id,
            name: formData.name,
            address: formData.address || null
          }])

        if (error) throw error
      }

      setFormData({ name: '', address: '' })
      setEditingId(null)
      setShowForm(false)
      loadLocations()
    } catch (error: any) {
      console.error('Error saving location:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
    }
  }

  const handleEdit = (location: Location) => {
    setFormData({ name: location.name, address: location.address || '' })
    setEditingId(location.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet emplacement?')) return

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadLocations()
    } catch (error: any) {
      console.error('Error deleting location:', error)
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', address: '' })
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
        <h1 className="text-3xl font-bold text-gray-900">Mes emplacements</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Annuler' : '+ Nouvel emplacement'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Modifier l\'emplacement' : 'Nouvel emplacement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'emplacement *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Maison principale, Bureau, etc."
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse (optionnel)
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 123 Rue Exemple, Ville"
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
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {locations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Aucun emplacement pour le moment</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Créer votre premier emplacement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                <span className="text-2xl">📍</span>
              </div>
              {location.address && (
                <p className="text-sm text-gray-600 mb-4">{location.address}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(location)}
                  className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
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
