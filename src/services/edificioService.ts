import apiService from './api'
import type {
  Edificio,
  CreateEdificioDto,
  UpdateEdificioDto,
  EstadisticasEdificio,
  Habitacion,
  CreateHabitacionDto,
  UpdateHabitacionDto,
  AsignarUsuarioDto,
  Garaje,
  CreateGarajeDto,
  UpdateGarajeDto,
  AsignarGarajeDto,
} from '../types/edificio.types'

const BASE_URL = '/api'

export const edificiosService = {
  getAll: async (): Promise<Edificio[]> => {
    return apiService.get<Edificio[]>(`${BASE_URL}/edificios`)
  },

  getById: async (id: string): Promise<Edificio> => {
    return apiService.get<Edificio>(`${BASE_URL}/edificios/${id}`)
  },

  create: async (data: CreateEdificioDto): Promise<Edificio> => {
    return apiService.post<Edificio>(`${BASE_URL}/edificios`, data)
  },

  update: async (id: string, data: UpdateEdificioDto): Promise<Edificio> => {
    return apiService.put<Edificio>(`${BASE_URL}/edificios/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return apiService.delete(`${BASE_URL}/edificios/${id}`)
  },

  getEstadisticas: async (id: string): Promise<EstadisticasEdificio> => {
    return apiService.get<EstadisticasEdificio>(`${BASE_URL}/edificios/${id}/estadisticas`)
  },
}

export const habitacionesService = {
  getAll: async (): Promise<Habitacion[]> => {
    return apiService.get<Habitacion[]>(`${BASE_URL}/habitaciones`)
  },

  getById: async (id: string): Promise<Habitacion> => {
    return apiService.get<Habitacion>(`${BASE_URL}/habitaciones/${id}`)
  },

  getByEdificio: async (edificioId: string): Promise<Habitacion[]> => {
    return apiService.get<Habitacion[]>(`${BASE_URL}/habitaciones/edificio/${edificioId}`)
  },

  getByEstado: async (estado: string): Promise<Habitacion[]> => {
    return apiService.get<Habitacion[]>(`${BASE_URL}/habitaciones/estado/${estado}`)
  },

  create: async (data: CreateHabitacionDto): Promise<Habitacion> => {
    return apiService.post<Habitacion>(`${BASE_URL}/habitaciones`, data)
  },

  update: async (id: string, data: UpdateHabitacionDto): Promise<Habitacion> => {
    return apiService.put<Habitacion>(`${BASE_URL}/habitaciones/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return apiService.delete(`${BASE_URL}/habitaciones/${id}`)
  },

  asignarUsuario: async (data: AsignarUsuarioDto): Promise<Habitacion> => {
    return apiService.post<Habitacion>(`${BASE_URL}/habitaciones/asignar-usuario`, data)
  },

  desasignarUsuario: async (habitacionId: string): Promise<Habitacion> => {
    return apiService.post<Habitacion>(`${BASE_URL}/habitaciones/${habitacionId}/desasignar-usuario`, {})
  },
}

export const garajesService = {
  getAll: async (): Promise<Garaje[]> => {
    return apiService.get<Garaje[]>(`${BASE_URL}/garajes`)
  },

  getById: async (id: string): Promise<Garaje> => {
    return apiService.get<Garaje>(`${BASE_URL}/garajes/${id}`)
  },

  getByEdificio: async (edificioId: string): Promise<Garaje[]> => {
    return apiService.get<Garaje[]>(`${BASE_URL}/garajes/edificio/${edificioId}`)
  },

  getByEstado: async (estado: string): Promise<Garaje[]> => {
    return apiService.get<Garaje[]>(`${BASE_URL}/garajes/estado/${estado}`)
  },

  create: async (data: CreateGarajeDto): Promise<Garaje> => {
    return apiService.post<Garaje>(`${BASE_URL}/garajes`, data)
  },

  update: async (id: string, data: UpdateGarajeDto): Promise<Garaje> => {
    return apiService.put<Garaje>(`${BASE_URL}/garajes/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return apiService.delete(`${BASE_URL}/garajes/${id}`)
  },

  asignar: async (data: AsignarGarajeDto): Promise<Garaje> => {
    return apiService.post<Garaje>(`${BASE_URL}/garajes/asignar`, data)
  },

  desasignar: async (garajeId: string): Promise<Garaje> => {
    return apiService.post<Garaje>(`${BASE_URL}/garajes/${garajeId}/desasignar`, {})
  },
}
