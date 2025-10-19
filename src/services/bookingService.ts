import apiService from './api';
import type {
  AreaComun,
  CreateAreaComunDto,
  UpdateAreaComunDto,
  Reserva,
  CreateReservaDto,
  UpdateReservaDto,
  Bloqueo,
  CreateBloqueoDto,
  UpdateBloqueoDto,
  Confirmacion,
  CreateConfirmacionDto,
  UpdateConfirmacionDto,
  AuditoriaLog,
  CheckDisponibilidadDto,
  DisponibilidadResponse,
  ReservaFilters,
  AreaComunFilters,
  EstadisticasBookingResponse,
  PaginationDto,
} from '../types/booking.types';

const BASE_URL = '/api/booking';

export const areasService = {
  getAll: async (filters?: AreaComunFilters): Promise<AreaComun[]> => {
    return apiService.get<AreaComun[]>(`${BASE_URL}/areas`, filters as Record<string, unknown>);
  },

  getById: async (id: number): Promise<AreaComun> => {
    return apiService.get<AreaComun>(`${BASE_URL}/areas/${id}`);
  },

  create: async (data: CreateAreaComunDto): Promise<AreaComun> => {
    return apiService.post<AreaComun>(`${BASE_URL}/areas`, data);
  },

  update: async (id: number, data: UpdateAreaComunDto): Promise<AreaComun> => {
    return apiService.patch<AreaComun>(`${BASE_URL}/areas/${id}`, data);
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/areas/${id}`);
  },

  toggleActive: async (id: number): Promise<AreaComun> => {
    return apiService.patch<AreaComun>(`${BASE_URL}/areas/${id}/toggle-active`);
  },
};

export const reservasService = {
  getAll: async (filters?: ReservaFilters): Promise<Reserva[]> => {
    return apiService.get<Reserva[]>(`${BASE_URL}/reservas`, filters as Record<string, unknown>);
  },

  getById: async (id: number): Promise<Reserva> => {
    return apiService.get<Reserva>(`${BASE_URL}/reservas/${id}`);
  },

  getByUser: async (usuarioId: string, pagination?: PaginationDto): Promise<Reserva[]> => {
    return apiService.get<Reserva[]>(`${BASE_URL}/reservas/usuario/${usuarioId}`, pagination as Record<string, unknown>);
  },

  getByArea: async (areaId: number, pagination?: PaginationDto): Promise<Reserva[]> => {
    return apiService.get<Reserva[]>(`${BASE_URL}/reservas/area/${areaId}`, pagination as Record<string, unknown>);
  },

  create: async (data: CreateReservaDto): Promise<Reserva> => {
    return apiService.post<Reserva>(`${BASE_URL}/reservas`, data);
  },

  update: async (id: number, data: UpdateReservaDto): Promise<Reserva> => {
    return apiService.patch<Reserva>(`${BASE_URL}/reservas/${id}`, data);
  },

  confirm: async (id: number): Promise<Reserva> => {
    return apiService.post<Reserva>(`${BASE_URL}/reservas/${id}/confirmar`);
  },

  cancel: async (id: number, motivo?: string): Promise<Reserva> => {
    return apiService.post<Reserva>(`${BASE_URL}/reservas/${id}/cancelar`, { motivo });
  },

  complete: async (id: number): Promise<Reserva> => {
    return apiService.post<Reserva>(`${BASE_URL}/reservas/${id}/completar`);
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/reservas/${id}`);
  },

  checkDisponibilidad: async (data: CheckDisponibilidadDto): Promise<DisponibilidadResponse> => {
    return apiService.post<DisponibilidadResponse>(`${BASE_URL}/reservas/check-disponibilidad`, data);
  },
};

export const bloqueosService = {
  getAll: async (filters?: PaginationDto): Promise<Bloqueo[]> => {
    return apiService.get<Bloqueo[]>(`${BASE_URL}/bloqueos`, filters as Record<string, unknown>);
  },

  getById: async (id: number): Promise<Bloqueo> => {
    return apiService.get<Bloqueo>(`${BASE_URL}/bloqueos/${id}`);
  },

  getByArea: async (areaId: number): Promise<Bloqueo[]> => {
    return apiService.get<Bloqueo[]>(`${BASE_URL}/bloqueos/area/${areaId}`);
  },

  create: async (data: CreateBloqueoDto): Promise<Bloqueo> => {
    return apiService.post<Bloqueo>(`${BASE_URL}/bloqueos`, data);
  },

  update: async (id: number, data: UpdateBloqueoDto): Promise<Bloqueo> => {
    return apiService.patch<Bloqueo>(`${BASE_URL}/bloqueos/${id}`, data);
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/bloqueos/${id}`);
  },
};

export const confirmacionesService = {
  getAll: async (filters?: PaginationDto): Promise<Confirmacion[]> => {
    return apiService.get<Confirmacion[]>(`${BASE_URL}/confirmaciones`, filters as Record<string, unknown>);
  },

  getById: async (id: number): Promise<Confirmacion> => {
    return apiService.get<Confirmacion>(`${BASE_URL}/confirmaciones/${id}`);
  },

  getByReserva: async (reservaId: number): Promise<Confirmacion> => {
    return apiService.get<Confirmacion>(`${BASE_URL}/confirmaciones/reserva/${reservaId}`);
  },

  create: async (data: CreateConfirmacionDto): Promise<Confirmacion> => {
    return apiService.post<Confirmacion>(`${BASE_URL}/confirmaciones`, data);
  },

  update: async (id: number, data: UpdateConfirmacionDto): Promise<Confirmacion> => {
    return apiService.patch<Confirmacion>(`${BASE_URL}/confirmaciones/${id}`, data);
  },

  resend: async (id: number): Promise<Confirmacion> => {
    return apiService.post<Confirmacion>(`${BASE_URL}/confirmaciones/${id}/reenviar`);
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/confirmaciones/${id}`);
  },
};

export const auditoriaService = {
  getAll: async (filters?: PaginationDto): Promise<AuditoriaLog[]> => {
    return apiService.get<AuditoriaLog[]>(`${BASE_URL}/auditoria`, filters as Record<string, unknown>);
  },

  getByUser: async (usuarioId: string, pagination?: PaginationDto): Promise<AuditoriaLog[]> => {
    return apiService.get<AuditoriaLog[]>(`${BASE_URL}/auditoria/usuario/${usuarioId}`, pagination as Record<string, unknown>);
  },

  getByEntity: async (entidad: string, entidadId: string): Promise<AuditoriaLog[]> => {
    return apiService.get<AuditoriaLog[]>(`${BASE_URL}/auditoria/entidad/${entidad}/${entidadId}`);
  },
};

export const bookingStatsService = {
  getEstadisticas: async (): Promise<EstadisticasBookingResponse> => {
    return apiService.get<EstadisticasBookingResponse>(`${BASE_URL}/estadisticas`);
  },

  getEstadisticasPeriodo: async (fechaDesde: string, fechaHasta: string): Promise<EstadisticasBookingResponse> => {
    return apiService.get<EstadisticasBookingResponse>(`${BASE_URL}/estadisticas/periodo`, {
      fechaDesde,
      fechaHasta,
    });
  },
};

export const bookingService = {
  areas: areasService,
  reservas: reservasService,
  bloqueos: bloqueosService,
  confirmaciones: confirmacionesService,
  auditoria: auditoriaService,
  stats: bookingStatsService,
};

export default bookingService;
