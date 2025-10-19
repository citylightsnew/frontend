import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../types';

export type EstadoReserva = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Reserva {
  id: string;
  areaId: string;
  usuarioId: string;
  inicio: string;
  fin: string;
  estado: EstadoReserva;
  costo: number;
  usuarioNombre: string | null;
  usuarioEmail: string | null;
  usuarioRol: string | null;
  estadoEntrega: string;
  fechaEntrega: string | null;
  fechaRecepcion: string | null;
  costoEntrega: number | null;
  pagoEntrega: boolean;
  notas: string | null;
  creadoEn: string;
  actualizadoEn: string;
  canceladoEn: string | null;
  canceladoPor: string | null;
  motivoCancelacion: string | null;
  // Relación con área
  area?: {
    id: string;
    nombre: string;
    descripcion: string | null;
    costoHora: number;
    imagenes: string[];
  };
}

export interface CreateReservaRequest {
  areaId: string;
  usuarioId: string; // ID del usuario que hace la reserva
  usuarioNombre: string; // Nombre del usuario
  usuarioEmail: string; // Email del usuario
  usuarioRol: string; // Rol del usuario
  inicio: string; // ISO 8601 format
  fin: string;    // ISO 8601 format
  costo: number;  // Costo total de la reserva
  notas?: string;
}

export interface UpdateReservaRequest {
  estado?: EstadoReserva;
  notas?: string;
  motivoCancelacion?: string;
}

export interface ReservaCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor?: string;
  display?: 'auto' | 'background' | 'none';
  extendedProps: {
    reserva?: Reserva;
    esLimpieza?: boolean;
    reservaOriginal?: Reserva;
  };
}

class ReservasService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/booking`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Obtener todas las reservas (admin)
  async getAllReservas(): Promise<Reserva[]> {
    const response = await this.api.get<Reserva[]>('/reservas');
    return response.data;
  }

  // Obtener reservas del usuario actual
  async getMisReservas(): Promise<Reserva[]> {
    // Obtener el usuario del token o localStorage
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) {
      console.error('❌ No se encontró usuario en localStorage');
      throw new Error('Usuario no autenticado');
    }
    
    const user = JSON.parse(userStr);
    console.log('👤 Usuario obtenido:', user);
    
    const response = await this.api.get<Reserva[]>(`/reservas/usuario/${user.id}`);
    return response.data;
  }

  // Obtener reservas por área
  async getReservasByArea(areaId: string): Promise<Reserva[]> {
    const response = await this.api.get<Reserva[]>(`/reservas/area/${areaId}`);
    return response.data;
  }

  // Obtener una reserva por ID
  async getReservaById(id: string): Promise<Reserva> {
    const response = await this.api.get<Reserva>(`/reservas/${id}`);
    return response.data;
  }

  // Crear una nueva reserva
  async createReserva(data: CreateReservaRequest): Promise<Reserva> {
    const response = await this.api.post<Reserva>('/reservas', data);
    return response.data;
  }

  // Actualizar reserva (cambiar estado, agregar notas)
  async updateReserva(id: string, data: UpdateReservaRequest): Promise<Reserva> {
    const response = await this.api.put<Reserva>(`/reservas/${id}`, data);
    return response.data;
  }

  // Aprobar reserva (admin)
  async aprobarReserva(id: string): Promise<Reserva> {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) throw new Error('Usuario no autenticado');
    const user = JSON.parse(userStr);
    
    const response = await this.api.patch<Reserva>(`/reservas/${id}/aprobar`, {
      aprobadoPor: user.id
    });
    return response.data;
  }

  // Rechazar reserva (admin)
  async rechazarReserva(id: string, motivo: string): Promise<Reserva> {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) throw new Error('Usuario no autenticado');
    const user = JSON.parse(userStr);
    
    const response = await this.api.patch<Reserva>(`/reservas/${id}/rechazar`, {
      rechazadoPor: user.id,
      motivoRechazo: motivo
    });
    return response.data;
  }

  // Cancelar reserva (usuario o admin)
  async cancelarReserva(id: string, motivo?: string): Promise<Reserva> {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) throw new Error('Usuario no autenticado');
    const user = JSON.parse(userStr);
    
    const response = await this.api.post<Reserva>(`/reservas/${id}/cancel`, {
      canceladoPor: user.id,
      motivoCancelacion: motivo
    });
    return response.data;
  }

  // Obtener reservas para el calendario (rango de fechas)
  async getReservasCalendar(inicio: string, fin: string, areaId?: string): Promise<ReservaCalendarEvent[]> {
    const body: { inicio: string; fin: string; areaId?: string; usuarioId?: string } = { inicio, fin };
    if (areaId) body.areaId = areaId;
    
    const response = await this.api.post<Reserva[]>('/reservas/calendar', body);
    
    // Transformar a eventos de calendario
    return response.data.map(reserva => this.reservaToCalendarEvent(reserva));
  }

  // Verificar disponibilidad antes de crear reserva
  async checkDisponibilidad(areaId: string, inicio: string, fin: string): Promise<boolean> {
    const response = await this.api.post<{ disponible: boolean }>('/reservas/check-disponibilidad', {
      areaId,
      inicio,
      fin
    });
    return response.data.disponible;
  }

  // Obtener estadísticas de reservas (admin)
  async getEstadisticas(): Promise<{
    total: number;
    pendientes: number;
    confirmadas: number;
    canceladas: number;
    ingresoTotal: number;
  }> {
    const response = await this.api.get('/reservas/estadisticas');
    return response.data;
  }

  // Helper: Transformar reserva a evento de calendario
  private reservaToCalendarEvent(reserva: Reserva): ReservaCalendarEvent {
    const colors = this.getColorByEstado(reserva.estado);

    return {
      id: reserva.id,
      title: `${reserva.area?.nombre || 'Área'} - ${reserva.usuarioNombre || 'Usuario'}`,
      start: reserva.inicio,
      end: reserva.fin,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      extendedProps: {
        reserva,
      },
    };
  }

  // Helper: Obtener colores por estado (público para usar en componentes)
  getColorByEstado(estado: EstadoReserva): { bg: string; border: string } {
    const colorMap: Record<EstadoReserva, { bg: string; border: string }> = {
      PENDING: { bg: '#FEF3C7', border: '#F59E0B' },      // Amarillo
      CONFIRMED: { bg: '#D1FAE5', border: '#10B981' },    // Verde
      CANCELLED: { bg: '#FEE2E2', border: '#EF4444' },    // Rojo
      COMPLETED: { bg: '#E0E7FF', border: '#6366F1' },    // Índigo
      NO_SHOW: { bg: '#F3F4F6', border: '#6B7280' },      // Gris
    };

    return colorMap[estado] || colorMap.PENDING;
  }
}

export const reservasService = new ReservasService();
