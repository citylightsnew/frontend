import { useState, useCallback } from 'react'
import { edificiosService, habitacionesService, garajesService } from '../services/edificioService'
import type {
  CreateEdificioDto,
  UpdateEdificioDto,
  CreateHabitacionDto,
  UpdateHabitacionDto,
  AsignarUsuarioDto,
  CreateGarajeDto,
  UpdateGarajeDto,
  AsignarGarajeDto,
} from '../types/edificio.types'

export const useEdificio = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // EDIFICIOS
  const fetchEdificios = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await edificiosService.getAll()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar edificios')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEdificio = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await edificiosService.getById(id)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar edificio')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createEdificio = useCallback(async (data: CreateEdificioDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await edificiosService.create(data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear edificio')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEdificio = useCallback(async (id: string, data: UpdateEdificioDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await edificiosService.update(id, data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar edificio')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEdificio = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await edificiosService.delete(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar edificio')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEstadisticas = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await edificiosService.getEstadisticas(id)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // HABITACIONES
  const fetchHabitaciones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await habitacionesService.getAll()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar habitaciones')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHabitacionesByEdificio = useCallback(async (edificioId: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await habitacionesService.getByEdificio(edificioId)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar habitaciones')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createHabitacion = useCallback(async (data: CreateHabitacionDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await habitacionesService.create(data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear habitación')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateHabitacion = useCallback(async (id: string, data: UpdateHabitacionDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await habitacionesService.update(id, data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar habitación')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteHabitacion = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await habitacionesService.delete(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar habitación')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const asignarUsuario = useCallback(async (data: AsignarUsuarioDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await habitacionesService.asignarUsuario(data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar usuario')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const desasignarUsuario = useCallback(async (habitacionId: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await habitacionesService.desasignarUsuario(habitacionId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desasignar usuario')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchGarajes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await garajesService.getAll()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar garajes')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchGarajesByEdificio = useCallback(async (edificioId: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await garajesService.getByEdificio(edificioId)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar garajes')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createGaraje = useCallback(async (data: CreateGarajeDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await garajesService.create(data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear garaje')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateGaraje = useCallback(async (id: string, data: UpdateGarajeDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await garajesService.update(id, data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar garaje')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteGaraje = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await garajesService.delete(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar garaje')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const asignarGaraje = useCallback(async (data: AsignarGarajeDto) => {
    setLoading(true)
    setError(null)
    try {
      const result = await garajesService.asignar(data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar garaje')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const desasignarGaraje = useCallback(async (garajeId: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await garajesService.desasignar(garajeId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desasignar garaje')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    // Edificios
    fetchEdificios,
    fetchEdificio,
    createEdificio,
    updateEdificio,
    deleteEdificio,
    fetchEstadisticas,
    // Habitaciones
    fetchHabitaciones,
    fetchHabitacionesByEdificio,
    createHabitacion,
    updateHabitacion,
    deleteHabitacion,
    asignarUsuario,
    desasignarUsuario,
    // Garajes
    fetchGarajes,
    fetchGarajesByEdificio,
    createGaraje,
    updateGaraje,
    deleteGaraje,
    asignarGaraje,
    desasignarGaraje,
  }
}
