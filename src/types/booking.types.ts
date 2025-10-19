export const EstadoReserva = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type EstadoReserva = typeof EstadoReserva[keyof typeof EstadoReserva];

export const TipoConfirmacion = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH',
} as const;

export type TipoConfirmacion = typeof TipoConfirmacion[keyof typeof TipoConfirmacion];

export const EstadoConfirmacion = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
} as const;

export type EstadoConfirmacion = typeof EstadoConfirmacion[keyof typeof EstadoConfirmacion];

export interface AreaComun {
  id: number;
  nombre: string;
  descripcion?: string;
  capacidad: number;
  costoHora: number;
  activa: boolean;
  imagenes?: string[];
  horarioInicio?: string;
  horarioFin?: string;
  diasDisponibles?: string[];
  requiereAprobacion?: boolean;
  observaciones?: string;
  creadoEn: string;
  actualizadoEn: string;
  reservas?: Reserva[];
  bloqueos?: Bloqueo[];
}

export interface CreateAreaComunDto {
  nombre: string;
  descripcion?: string;
  capacidad: number;
  costoHora: number;
  activa?: boolean;
  imagenes?: string[];
  horarioInicio?: string;
  horarioFin?: string;
  diasDisponibles?: string[];
  requiereAprobacion?: boolean;
  observaciones?: string;
}

export type UpdateAreaComunDto = Partial<CreateAreaComunDto>;

export interface Reserva {
  id: number;
  areaId: number;
  usuarioId: string;
  usuarioNombre?: string;
  usuarioEmail?: string;
  usuarioTelefono?: string;
  inicio: string;
  fin: string;
  costo: number;
  estado: EstadoReserva;
  cantidadPersonas?: number;
  motivoEvento?: string;
  notasEspeciales?: string;
  requiereEquipoAdicional?: boolean;
  equipoSolicitado?: string;
  creadoEn: string;
  actualizadoEn: string;
  area?: AreaComun;
  confirmacion?: Confirmacion;
  pagosReserva?: unknown[];
  pagosDano?: unknown[];
}

export interface CreateReservaDto {
  areaId: number;
  inicio: string;
  fin: string;
  cantidadPersonas?: number;
  motivoEvento?: string;
  notasEspeciales?: string;
  requiereEquipoAdicional?: boolean;
  equipoSolicitado?: string;
}

export interface UpdateReservaDto extends Partial<CreateReservaDto> {
  estado?: EstadoReserva;
}

export interface CheckDisponibilidadDto {
  areaId: number;
  inicio: string;
  fin: string;
  excludeReservaId?: number;
}

export interface DisponibilidadResponse {
  disponible: boolean;
  motivo?: string;
  conflictos?: Reserva[];
  bloqueos?: Bloqueo[];
}

export interface Bloqueo {
  id: number;
  areaId: number;
  inicio: string;
  fin: string;
  motivo: string;
  esRecurrente: boolean;
  recurrencia?: string;
  creadoPor: string;
  creadoEn: string;
  actualizadoEn: string;
  area?: AreaComun;
}

export interface CreateBloqueoDto {
  areaId: number;
  inicio: string;
  fin: string;
  motivo: string;
  esRecurrente?: boolean;
  recurrencia?: string;
}

export type UpdateBloqueoDto = Partial<CreateBloqueoDto>;

export interface Confirmacion {
  id: number;
  reservaId: number;
  tipo: TipoConfirmacion;
  estado: EstadoConfirmacion;
  mensaje?: string;
  intentos: number;
  ultimoIntento?: string;
  confirmadoEn?: string;
  errorMensaje?: string;
  creadoEn: string;
  actualizadoEn: string;
  reserva?: Reserva;
}

export interface CreateConfirmacionDto {
  reservaId: number;
  tipo: TipoConfirmacion;
  mensaje?: string;
}

export interface UpdateConfirmacionDto {
  estado?: EstadoConfirmacion;
  confirmadoEn?: string;
  errorMensaje?: string;
}

export interface AuditoriaLog {
  id: number;
  accion: string;
  entidad: string;
  entidadId: string;
  usuarioId: string;
  usuarioNombre?: string;
  detalles?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  creadoEn: string;
}

export interface CreateAuditoriaDto {
  accion: string;
  entidad: string;
  entidadId: string;
  detalles?: Record<string, unknown>;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface ReservaFilters extends PaginationDto {
  usuarioId?: string;
  areaId?: number;
  estado?: EstadoReserva;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface AreaComunFilters extends PaginationDto {
  activa?: boolean;
  disponible?: boolean;
  capacidadMin?: number;
  capacidadMax?: number;
}

export interface ReservaConflictoResponse {
  reservaId: number;
  mensaje: string;
  conflictos: Array<{
    tipo: 'reserva' | 'bloqueo';
    inicio: string;
    fin: string;
    detalle: string;
  }>;
}

export interface EstadisticasBookingResponse {
  totalReservas: number;
  reservasActivas: number;
  reservasCompletadas: number;
  reservasCanceladas: number;
  areasMasReservadas: Array<{
    areaId: number;
    nombre: string;
    cantidad: number;
  }>;
  ingresosTotales: number;
}
