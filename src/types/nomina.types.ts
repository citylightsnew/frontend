export const EstadoEmpleado = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
  SUSPENDIDO: 'SUSPENDIDO',
  VACACIONES: 'VACACIONES',
} as const;

export type EstadoEmpleado = typeof EstadoEmpleado[keyof typeof EstadoEmpleado];

export const TipoPagoNomina = {
  SALARIO: 'SALARIO',
  BONO: 'BONO',
  AGUINALDO: 'AGUINALDO',
  HORAS_EXTRA: 'HORAS_EXTRA',
  COMISION: 'COMISION',
} as const;

export type TipoPagoNomina = typeof TipoPagoNomina[keyof typeof TipoPagoNomina];

export const EstadoPagoNomina = {
  PENDIENTE: 'PENDIENTE',
  PROCESANDO: 'PROCESANDO',
  PAGADO: 'PAGADO',
  RECHAZADO: 'RECHAZADO',
} as const;

export type EstadoPagoNomina = typeof EstadoPagoNomina[keyof typeof EstadoPagoNomina];

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  documento: string;
  tipoDocumento: string;
  fechaNacimiento: string;
  direccion?: string;
  cargo: string;
  departamento: string;
  salarioBase: number;
  fechaIngreso: string;
  fechaSalida?: string;
  estado: EstadoEmpleado;
  cuentaBancaria?: string;
  banco?: string;
  afiliacionSocial?: string;
  afiliacionSalud?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateEmpleadoDto {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  documento: string;
  tipoDocumento: string;
  fechaNacimiento: string;
  direccion?: string;
  cargo: string;
  departamento: string;
  salarioBase: number;
  fechaIngreso: string;
  cuentaBancaria?: string;
  banco?: string;
  afiliacionSocial?: string;
  afiliacionSalud?: string;
}

export type UpdateEmpleadoDto = Partial<CreateEmpleadoDto>;

export interface PagoNomina {
  id: string;
  empleadoId: string;
  periodo: string;
  tipoPago: TipoPagoNomina;
  montoBase: number;
  bonos: number;
  deducciones: number;
  horasExtra: number;
  montoTotal: number;
  estado: EstadoPagoNomina;
  fechaPago?: string;
  metodoPago?: string;
  comprobante?: string;
  notas?: string;
  creadoEn: string;
  actualizadoEn: string;
  empleado?: Empleado;
}

export interface CreatePagoNominaDto {
  empleadoId: string;
  periodo: string;
  tipoPago: TipoPagoNomina;
  montoBase: number;
  bonos?: number;
  deducciones?: number;
  horasExtra?: number;
  metodoPago?: string;
  notas?: string;
}

export type UpdatePagoNominaDto = Partial<CreatePagoNominaDto>;

export interface ProcesarPagoNominaDto {
  pagoId: string;
  metodoPago: string;
  comprobante?: string;
}

export interface Asistencia {
  id: string;
  empleadoId: string;
  fecha: string;
  horaEntrada?: string;
  horaSalida?: string;
  horasTrabajadas?: number;
  horasExtra?: number;
  tipo: 'PRESENTE' | 'AUSENTE' | 'PERMISO' | 'VACACION' | 'FALTA';
  observaciones?: string;
  creadoEn: string;
  actualizadoEn: string;
  empleado?: Empleado;
}

export interface CreateAsistenciaDto {
  empleadoId: string;
  fecha: string;
  horaEntrada?: string;
  horaSalida?: string;
  tipo: 'PRESENTE' | 'AUSENTE' | 'PERMISO' | 'VACACION' | 'FALTA';
  observaciones?: string;
}

export type UpdateAsistenciaDto = Partial<CreateAsistenciaDto>;

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface EmpleadoFilters extends PaginationDto {
  estado?: EstadoEmpleado;
  departamento?: string;
  cargo?: string;
  busqueda?: string;
}

export interface PagoNominaFilters extends PaginationDto {
  empleadoId?: string;
  periodo?: string;
  tipoPago?: TipoPagoNomina;
  estado?: EstadoPagoNomina;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface AsistenciaFilters extends PaginationDto {
  empleadoId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  tipo?: string;
}

export interface ReporteNominaResponse {
  periodo: string;
  totalEmpleados: number;
  empleadosActivos: number;
  totalPagado: number;
  totalBonos: number;
  totalDeducciones: number;
  totalHorasExtra: number;
  pagosPendientes: number;
  pagosProcesados: number;
  pagosPorDepartamento: Array<{
    departamento: string;
    cantidad: number;
    monto: number;
  }>;
  pagosPorTipo: Array<{
    tipo: TipoPagoNomina;
    cantidad: number;
    monto: number;
  }>;
}

export interface ReporteAsistenciaResponse {
  periodo: string;
  totalEmpleados: number;
  diasLaborales: number;
  totalPresencias: number;
  totalAusencias: number;
  totalPermisos: number;
  totalVacaciones: number;
  totalHorasExtra: number;
  promedioAsistencia: number;
  empleadosConMayorAsistencia: Array<{
    empleadoId: string;
    nombre: string;
    diasPresente: number;
    porcentaje: number;
  }>;
}

export interface EmpleadoEstadisticas {
  empleadoId: string;
  nombre: string;
  totalPagos: number;
  totalMonto: number;
  promedioMensual: number;
  ultimoPago?: PagoNomina;
  diasTrabajados: number;
  horasExtra: number;
}
