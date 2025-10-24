'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts'

interface MeterType {
  id: string
  name: string
  unit: string
  icon: string | null
  color: string | null
}

interface Location {
  id: string
  name: string
}

interface Meter {
  id: string
  name: string
  serial_number: string
  description: string
  meter_type: MeterType
  location: Location
}

interface Reading {
  id: string
  reading_date: string
  value: number
  notes: string
}

interface Stats {
  totalReadings: number
  firstReading: Reading | null
  lastReading: Reading | null
  totalConsumption: number
  averageConsumption: number
  minConsumption: number
  maxConsumption: number
  daysTracked: number
}

interface MonthlyData {
  month: string
  consumption: number
  average?: number
}

interface Benchmark {
  average_consumption: number
  low_consumption: number
  high_consumption: number
}

type PeriodOption = '1Y' | '2Y' | 'ALL'

export default function MeterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [meter, setMeter] = useState<Meter | null>(null)
  const [readings, setReadings] = useState<Reading[]>([])
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [filteredMonthlyData, setFilteredMonthlyData] = useState<MonthlyData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('ALL')
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null)
  const [hasHouseholdInfo, setHasHouseholdInfo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMeterData()
  }, [resolvedParams.id])

  useEffect(() => {
    filterDataByPeriod()
  }, [monthlyData, readings, selectedPeriod])

  const filterDataByPeriod = () => {
    if (selectedPeriod === 'ALL') {
      setFilteredMonthlyData(monthlyData)
      setFilteredReadings(readings)
      return
    }

    const now = new Date()
    let cutoffDate: Date

    switch (selectedPeriod) {
      case '1Y':
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), 1)
        break
      case '2Y':
        cutoffDate = new Date(now.getFullYear() - 2, now.getMonth(), 1)
        break
      default:
        setFilteredMonthlyData(monthlyData)
        setFilteredReadings(readings)
        return
    }

    // Filter monthly data
    const cutoffKey = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, '0')}`
    const filteredMonthly = monthlyData.filter(item => item.month >= cutoffKey)
    setFilteredMonthlyData(filteredMonthly)

    // Filter readings
    const filteredReads = readings.filter(reading =>
      new Date(reading.reading_date) >= cutoffDate
    )
    setFilteredReadings(filteredReads)
  }

  const loadMeterData = async () => {
    try {
      // Load meter info
      const { data: meterData, error: meterError } = await supabase
        .from('meters')
        .select(`
          id,
          name,
          serial_number,
          description,
          meter_type:meter_types(id, name, unit, icon, color),
          location:locations(id, name)
        `)
        .eq('id', resolvedParams.id)
        .single()

      if (meterError) throw meterError
      // Supabase returns related fields as arrays, fix the structure
      const normalizedMeterData = {
        ...meterData,
        meter_type: Array.isArray(meterData.meter_type) ? meterData.meter_type[0] : meterData.meter_type,
        location: Array.isArray(meterData.location) ? meterData.location[0] : meterData.location
      }
      setMeter(normalizedMeterData as any)

      // Load all readings
      const { data: readingsData, error: readingsError } = await supabase
        .from('readings')
        .select('*')
        .eq('meter_id', resolvedParams.id)
        .order('reading_date', { ascending: false })

      if (readingsError) throw readingsError
      setReadings(readingsData)

      // Calculate statistics
      if (readingsData && readingsData.length > 0) {
        calculateStats(readingsData)
        calculateMonthlyData(readingsData)
      }

      // Check if user has household info
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: householdData } = await supabase
          .from('household_info')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setHasHouseholdInfo(!!householdData)

        // Load benchmark if household info exists
        if (householdData && normalizedMeterData) {
          await loadBenchmark(normalizedMeterData.meter_type.id, householdData)
        }
      }
    } catch (error) {
      console.error('Error loading meter data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (readingsData: Reading[]) => {
    const sorted = [...readingsData].sort((a, b) =>
      new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
    )

    const consumptions: number[] = []

    for (let i = 1; i < sorted.length; i++) {
      const consumption = sorted[i].value - sorted[i - 1].value
      if (consumption > 0) {
        consumptions.push(consumption)
      }
    }

    const totalConsumption = sorted.length > 0
      ? sorted[sorted.length - 1].value - sorted[0].value
      : 0

    const firstDate = sorted[0] ? new Date(sorted[0].reading_date) : null
    const lastDate = sorted[sorted.length - 1] ? new Date(sorted[sorted.length - 1].reading_date) : null
    const daysTracked = firstDate && lastDate
      ? Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    setStats({
      totalReadings: readingsData.length,
      firstReading: sorted[0] || null,
      lastReading: sorted[sorted.length - 1] || null,
      totalConsumption,
      averageConsumption: consumptions.length > 0
        ? consumptions.reduce((a, b) => a + b, 0) / consumptions.length
        : 0,
      minConsumption: consumptions.length > 0 ? Math.min(...consumptions) : 0,
      maxConsumption: consumptions.length > 0 ? Math.max(...consumptions) : 0,
      daysTracked
    })
  }

  const calculateMonthlyData = (readingsData: Reading[]) => {
    const sorted = [...readingsData].sort((a, b) =>
      new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
    )

    // Group readings by month and keep only the last reading of each month
    const monthlyReadings = new Map<string, Reading>()

    sorted.forEach((reading) => {
      const date = new Date(reading.reading_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyReadings.set(monthKey, reading) // Will keep the last reading of each month
    })

    // Calculate consumption between consecutive months
    const sortedMonths = Array.from(monthlyReadings.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))

    const monthly: MonthlyData[] = []

    for (let i = 1; i < sortedMonths.length; i++) {
      const [currentMonth, currentReading] = sortedMonths[i]
      const [, previousReading] = sortedMonths[i - 1]

      const consumption = currentReading.value - previousReading.value

      // Include all months, even with negative consumption (e.g., solar production)
      monthly.push({
        month: currentMonth,
        consumption: consumption // Keep sign to show production vs consumption
      })
    }

    setMonthlyData(monthly)
  }

  const loadBenchmark = async (meterTypeId: string, householdData: any) => {
    const { data, error } = await supabase
      .from('consumption_benchmarks')
      .select('*')
      .eq('meter_type_id', meterTypeId)
      .or(`property_type.eq.${householdData.property_type},property_type.eq.all`)
      .gte('people_max', householdData.number_of_people)
      .lte('people_min', householdData.number_of_people)
      .gte('size_max_m2', householdData.house_size_m2)
      .lte('size_min_m2', householdData.house_size_m2)
      .limit(1)
      .single()

    if (!error && data) {
      setBenchmark(data)
    }
  }

  const getConsumption = (index: number): number | null => {
    if (index === readings.length - 1) return null
    const current = readings[index]
    const previous = readings[index + 1]
    const consumption = current.value - previous.value
    return consumption > 0 ? consumption : null
  }

  const getDaysBetween = (index: number): number | null => {
    if (index === readings.length - 1) return null
    const current = readings[index]
    const previous = readings[index + 1]
    return Math.round(
      (new Date(current.reading_date).getTime() - new Date(previous.reading_date).getTime()) /
      (1000 * 60 * 60 * 24)
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-BE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-')
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('fr-BE', {
      year: 'numeric',
      month: 'short'
    })
  }

  // Generate complete timeline for charts
  const generateCompleteTimeline = (data: Reading[]) => {
    if (data.length === 0) return []

    const sorted = [...data].sort((a, b) =>
      new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
    )

    const firstDate = new Date(sorted[0].reading_date)
    const lastDate = new Date(sorted[sorted.length - 1].reading_date)

    const timeline: (Reading | { reading_date: string; value: null })[] = []
    const current = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)

    while (current <= lastDate) {
      const monthKey = current.toISOString().split('T')[0]
      const existingReading = sorted.find(r => {
        const rDate = new Date(r.reading_date)
        return rDate.getFullYear() === current.getFullYear() &&
               rDate.getMonth() === current.getMonth()
      })

      if (existingReading) {
        timeline.push(existingReading)
      } else {
        timeline.push({ reading_date: monthKey, value: null })
      }

      current.setMonth(current.getMonth() + 1)
    }

    return timeline
  }

  // Generate season bands for background
  const generateSeasonBands = (data: Reading[]) => {
    if (data.length === 0) return []

    const sorted = [...data].sort((a, b) =>
      new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime()
    )

    const firstDate = new Date(sorted[0].reading_date)
    const lastDate = new Date(sorted[sorted.length - 1].reading_date)

    const bands: { start: string; end: string; season: string; color: string }[] = []

    const getSeason = (month: number) => {
      if (month >= 2 && month <= 4) return { name: 'Printemps', color: '#dcfce7' } // Vert très clair
      if (month >= 5 && month <= 7) return { name: 'Été', color: '#fef3c7' } // Jaune très clair
      if (month >= 8 && month <= 10) return { name: 'Automne', color: '#fed7aa' } // Orange très clair
      return { name: 'Hiver', color: '#dbeafe' } // Bleu très clair
    }

    let currentYear = firstDate.getFullYear()
    const lastYear = lastDate.getFullYear()

    while (currentYear <= lastYear) {
      // Printemps (mars-mai)
      bands.push({
        start: `${currentYear}-03-01`,
        end: `${currentYear}-05-31`,
        season: 'Printemps',
        color: '#dcfce7'
      })
      // Été (juin-août)
      bands.push({
        start: `${currentYear}-06-01`,
        end: `${currentYear}-08-31`,
        season: 'Été',
        color: '#fef3c7'
      })
      // Automne (septembre-novembre)
      bands.push({
        start: `${currentYear}-09-01`,
        end: `${currentYear}-11-30`,
        season: 'Automne',
        color: '#fed7aa'
      })
      // Hiver (décembre-février)
      bands.push({
        start: `${currentYear}-12-01`,
        end: `${currentYear + 1}-02-28`,
        season: 'Hiver',
        color: '#dbeafe'
      })

      currentYear++
    }

    return bands.filter(band => {
      const bandStart = new Date(band.start)
      const bandEnd = new Date(band.end)
      return bandStart <= lastDate && bandEnd >= firstDate
    })
  }

  // Generate season bands for monthly data
  const generateSeasonBandsForMonthly = (data: MonthlyData[]) => {
    if (data.length === 0) return []

    const months = data.map(d => d.month).sort()
    const firstMonth = months[0]
    const lastMonth = months[months.length - 1]

    const [firstYear] = firstMonth.split('-').map(Number)
    const [lastYear] = lastMonth.split('-').map(Number)

    const bands: { start: string; end: string; season: string; color: string }[] = []

    let currentYear = firstYear

    while (currentYear <= lastYear) {
      // Printemps (mars-mai)
      bands.push({
        start: `${currentYear}-03`,
        end: `${currentYear}-05`,
        season: 'Printemps',
        color: '#dcfce7'
      })
      // Été (juin-août)
      bands.push({
        start: `${currentYear}-06`,
        end: `${currentYear}-08`,
        season: 'Été',
        color: '#fef3c7'
      })
      // Automne (septembre-novembre)
      bands.push({
        start: `${currentYear}-09`,
        end: `${currentYear}-11`,
        season: 'Automne',
        color: '#fed7aa'
      })
      // Hiver (décembre-février)
      bands.push({
        start: `${currentYear}-12`,
        end: `${currentYear + 1}-02`,
        season: 'Hiver',
        color: '#dbeafe'
      })

      currentYear++
    }

    return bands.filter(band => {
      return band.start <= lastMonth && band.end >= firstMonth
    })
  }

  // Generate complete monthly timeline
  const generateCompleteMonthlyTimeline = (data: MonthlyData[]) => {
    if (data.length === 0) return []

    const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month))
    const firstMonth = sorted[0].month
    const lastMonth = sorted[sorted.length - 1].month

    const [firstYear, firstMonthNum] = firstMonth.split('-').map(Number)
    const [lastYear, lastMonthNum] = lastMonth.split('-').map(Number)

    const timeline: MonthlyData[] = []
    let current = new Date(firstYear, firstMonthNum - 1, 1)
    const end = new Date(lastYear, lastMonthNum - 1, 1)

    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
      const existingData = sorted.find(d => d.month === monthKey)

      if (existingData) {
        timeline.push(existingData)
      } else {
        timeline.push({ month: monthKey, consumption: 0 })
      }

      current.setMonth(current.getMonth() + 1)
    }

    return timeline
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (!meter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500 mb-4">Compteur non trouvé</div>
        <Link href="/" className="text-blue-600 hover:text-blue-700">
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Retour au tableau de bord
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderColor: meter.meter_type.color || '#3b82f6' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{meter.meter_type.icon}</span>
                  <h1 className="text-3xl font-bold text-gray-900">{meter.name}</h1>
                </div>
                <p className="text-gray-600 mb-1">
                  Type: <span className="font-medium">{meter.meter_type.name}</span>
                </p>
                {meter.serial_number && (
                  <p className="text-gray-600 mb-1">
                    N° série: <span className="font-mono text-sm">{meter.serial_number}</span>
                  </p>
                )}
                <p className="text-gray-600">
                  Emplacement: <span className="font-medium">{meter.location.name}</span>
                </p>
                {meter.description && (
                  <p className="text-gray-500 mt-2 text-sm">{meter.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-gray-500 text-sm mb-1">Total relevés</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalReadings}</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-gray-500 text-sm mb-1">Consommation totale</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalConsumption.toFixed(2)} {meter.meter_type.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Sur {stats.daysTracked} jours
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-gray-500 text-sm mb-1">Consommation moyenne</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.averageConsumption.toFixed(2)} {meter.meter_type.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">Par période</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-gray-500 text-sm mb-1">Dernier relevé</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.lastReading?.value.toFixed(2)} {meter.meter_type.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.lastReading && formatDate(stats.lastReading.reading_date)}
              </div>
            </div>
          </div>
        )}

        {/* Benchmark Comparison */}
        {!hasHouseholdInfo && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Complétez votre <Link href="/profile" className="font-medium underline">situation personnelle</Link> pour comparer votre consommation avec les moyennes.
                </p>
              </div>
            </div>
          </div>
        )}

        {benchmark && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Comparaison avec la moyenne</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-blue-700">Consommation basse</div>
                <div className="text-xl font-bold text-blue-900">
                  {benchmark.low_consumption} {meter.meter_type.unit}/an
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-700">Moyenne</div>
                <div className="text-xl font-bold text-blue-900">
                  {benchmark.average_consumption} {meter.meter_type.unit}/an
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-700">Consommation élevée</div>
                <div className="text-xl font-bold text-blue-900">
                  {benchmark.high_consumption} {meter.meter_type.unit}/an
                </div>
              </div>
            </div>
            {stats && (
              <div className="mt-3 text-sm text-blue-700">
                Votre consommation annuelle estimée: <span className="font-bold">
                  {((stats.totalConsumption / stats.daysTracked) * 365).toFixed(0)} {meter.meter_type.unit}/an
                </span>
              </div>
            )}
          </div>
        )}

        {/* Charts */}
        {(filteredMonthlyData.length > 0 || filteredReadings.length > 0) && (
          <>
            {/* Period Selector */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700 mr-2">Période:</span>
                {[
                  { value: '1Y' as PeriodOption, label: '1 an' },
                  { value: '2Y' as PeriodOption, label: '2 ans' },
                  { value: 'ALL' as PeriodOption, label: 'Tout' },
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period.value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
              {/* Season Legend */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-200">
                <span className="text-xs font-medium text-gray-600 mr-1">Saisons:</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dbeafe' }}></div>
                  <span className="text-xs text-gray-600">Hiver</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dcfce7' }}></div>
                  <span className="text-xs text-gray-600">Printemps</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fef3c7' }}></div>
                  <span className="text-xs text-gray-600">Été</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fed7aa' }}></div>
                  <span className="text-xs text-gray-600">Automne</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Readings History Line Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Historique des relevés (Index)</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateCompleteTimeline(filteredReadings)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="reading_date"
                      tickFormatter={(dateStr) => {
                        const date = new Date(dateStr)
                        return date.toLocaleDateString('fr-BE', { month: 'short', year: '2-digit' })
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval="preserveStartEnd"
                      minTickGap={30}
                    />
                    <YAxis
                      domain={filteredReadings.length > 0 ? (() => {
                        const values = filteredReadings.filter(r => r.value !== null).map(r => r.value)
                        if (values.length === 0) return ['auto', 'auto']
                        const min = Math.min(...values)
                        const max = Math.max(...values)
                        const padding = (max - min) * 0.1 // 10% padding
                        return [Math.floor(min - padding), Math.ceil(max + padding)]
                      })() : ['auto', 'auto']}
                    />
                    <Tooltip
                      labelFormatter={(dateStr) => formatDate(dateStr)}
                      formatter={(value: any) => {
                        if (value === null || value === undefined) return ['Pas de relevé', '']
                        return [`${Number(value).toFixed(2)} ${meter.meter_type.unit}`, 'Relevé']
                      }}
                    />
                    {/* Season bands in background */}
                    {generateSeasonBands(filteredReadings).map((band, idx) => (
                      <ReferenceArea
                        key={`season-${idx}`}
                        x1={band.start}
                        x2={band.end}
                        fill={band.color}
                        fillOpacity={0.3}
                        ifOverflow="extendDomain"
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={meter.meter_type.color || '#3b82f6'}
                      strokeWidth={2}
                      dot={{ fill: meter.meter_type.color || '#3b82f6', r: 3 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            {/* Consumption Trend Line Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Évolution de la consommation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateCompleteMonthlyTimeline(filteredMonthlyData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonthLabel}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval="preserveStartEnd"
                    minTickGap={30}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={formatMonthLabel}
                    formatter={(value: number) => {
                      if (value === 0) return ['Pas de donnée', '']
                      return [`${value > 0 ? '+' : ''}${value.toFixed(2)} ${meter.meter_type.unit}`, 'Consommation']
                    }}
                  />
                  {/* Season bands in background */}
                  {generateSeasonBandsForMonthly(filteredMonthlyData).map((band, idx) => (
                    <ReferenceArea
                      key={`season-monthly-${idx}`}
                      x1={band.start}
                      x2={band.end}
                      fill={band.color}
                      fillOpacity={0.3}
                      ifOverflow="extendDomain"
                    />
                  ))}
                  {benchmark && (
                    <ReferenceLine
                      y={benchmark.average_consumption / 12}
                      stroke="#EF4444"
                      strokeDasharray="3 3"
                      label="Moyenne"
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke={meter.meter_type.color || '#3b82f6'}
                    strokeWidth={2}
                    dot={{ fill: meter.meter_type.color || '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          </>
        )}

        {/* Readings History Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Historique des relevés</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consommation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {readings.map((reading, index) => {
                  const consumption = getConsumption(index)
                  const days = getDaysBetween(index)

                  return (
                    <tr key={reading.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(reading.reading_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reading.value.toFixed(2)} {meter.meter_type.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {consumption !== null ? (
                          <span className={consumption > 0 ? 'text-green-600' : 'text-red-600'}>
                            {consumption > 0 ? '+' : ''}{consumption.toFixed(2)} {meter.meter_type.unit}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {days !== null ? `${days} jours` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reading.notes || '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
