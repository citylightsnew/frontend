import { useState, useEffect, useCallback } from 'react'
import { X, Home, Car, Building2 } from 'lucide-react'
import Button from './Button'
import { useEdificio } from '../hooks/useEdificio'
import type { Habitacion, Garaje } from '../types/edificio.types'

interface AsignarHabitacionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (habitacionId: string, garajesIds: string[]) => Promise<void>
  usuarioNombre: string
  habitacionActual?: {
    id: string
    numero: string
  }
}

export function AsignarHabitacionModal({
  isOpen,
  onClose,
  onConfirm,
  usuarioNombre,
  habitacionActual,
}: AsignarHabitacionModalProps) {
  const [selectedHabitacionId, setSelectedHabitacionId] = useState<string>('')
  const [selectedGarajesIds, setSelectedGarajesIds] = useState<string[]>([])
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [garajes, setGarajes] = useState<Garaje[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { fetchHabitaciones, fetchGarajes } = useEdificio()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [habitacionesData, garajesData] = await Promise.all([
        fetchHabitaciones(),
        fetchGarajes(),
      ])

      // Filtrar solo habitaciones disponibles o la actual del usuario
      const habitacionesDisponibles = habitacionesData.filter(
        (h) => h.estado === 'disponible' || h.id === habitacionActual?.id
      )
      setHabitaciones(habitacionesDisponibles)

      // Filtrar solo garajes disponibles
      const garajesDisponibles = garajesData.filter((g) => g.estado === 'disponible')
      setGarajes(garajesDisponibles)

      // Si tiene habitación actual, preseleccionarla
      if (habitacionActual) {
        setSelectedHabitacionId(habitacionActual.id)
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchHabitaciones, fetchGarajes, habitacionActual])

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, loadData])

  const handleSubmit = async () => {
    if (!selectedHabitacionId) return

    setSubmitting(true)
    try {
      await onConfirm(selectedHabitacionId, selectedGarajesIds)
      onClose()
    } catch (error) {
      console.error('Error al asignar:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleGaraje = (garajeId: string) => {
    setSelectedGarajesIds((prev) =>
      prev.includes(garajeId)
        ? prev.filter((id) => id !== garajeId)
        : [...prev, garajeId]
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Asignar Habitación y Garajes
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Usuario: <span className="font-medium">{usuarioNombre}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando opciones disponibles...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selección de Habitación */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Seleccionar Habitación *
                </label>
                {habitaciones.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-600">No hay habitaciones disponibles</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {habitaciones.map((habitacion) => (
                      <button
                        key={habitacion.id}
                        type="button"
                        onClick={() => setSelectedHabitacionId(habitacion.id)}
                        className={`text-left border-2 rounded-lg p-4 transition-all ${
                          selectedHabitacionId === habitacion.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedHabitacionId === habitacion.id
                                ? 'bg-blue-600'
                                : 'bg-gray-200'
                            }`}
                          >
                            <Home
                              className={`w-5 h-5 ${
                                selectedHabitacionId === habitacion.id
                                  ? 'text-white'
                                  : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              Hab. {habitacion.numero}
                            </p>
                            <p className="text-xs text-gray-500">Piso {habitacion.piso}</p>
                            <div className="mt-2 flex gap-2 text-xs text-gray-600">
                              <span>{habitacion.dormitorios} dorm.</span>
                              <span>•</span>
                              <span>{habitacion.banos} baños</span>
                            </div>
                            {habitacion.area && (
                              <p className="text-xs text-gray-500 mt-1">
                                {habitacion.area.toFixed(0)} m²
                              </p>
                            )}
                            <p className="text-sm font-bold text-green-600 mt-2">
                              Bs {habitacion.precio.toLocaleString('es-BO')}/mes
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selección de Garajes (opcional) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Seleccionar Garajes (opcional)
                </label>
                {garajes.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-600">No hay garajes disponibles</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500 mb-3">
                      Selecciona uno o más garajes para este usuario
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {garajes.map((garaje) => (
                        <button
                          key={garaje.id}
                          type="button"
                          onClick={() => toggleGaraje(garaje.id)}
                          className={`border-2 rounded-lg p-3 transition-all text-center ${
                            selectedGarajesIds.includes(garaje.id)
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-green-300 bg-white'
                          }`}
                        >
                          <Car
                            className={`w-6 h-6 mx-auto mb-1 ${
                              selectedGarajesIds.includes(garaje.id)
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }`}
                          />
                          <p className="text-sm font-semibold text-gray-900">
                            {garaje.numero}
                          </p>
                          <p className="text-xs text-gray-500">
                            {garaje.piso === -1
                              ? 'S1'
                              : garaje.piso === -2
                              ? 'S2'
                              : `P${garaje.piso}`}
                          </p>
                          <p className="text-xs font-bold text-green-600 mt-1">
                            Bs {garaje.precio}/mes
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedHabitacionId || submitting}
          >
            {submitting ? 'Asignando...' : 'Asignar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
