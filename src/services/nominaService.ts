import apiService from './api';
import type {
  Empleado,
  CreateEmpleadoDto,
  UpdateEmpleadoDto,
  PagoNomina,
  CreatePagoNominaDto,
  UpdatePagoNominaDto,
  ProcesarPagoNominaDto,
  Asistencia,
  CreateAsistenciaDto,
  UpdateAsistenciaDto,
  EmpleadoFilters,
  PagoNominaFilters,
  AsistenciaFilters,
  ReporteNominaResponse,
  ReporteAsistenciaResponse,
  EmpleadoEstadisticas,
  PaginationDto,
} from '../types/nomina.types';

const BASE_URL = '/api/nomina';

// ============================================
// EMPLEADOS
// ============================================

export const empleadosService = {
  // Listar todos los empleados
  getAll: async (filters?: EmpleadoFilters): Promise<Empleado[]> => {
    return apiService.get<Empleado[]>(`${BASE_URL}/empleados`, filters as Record<string, unknown>);
  },

  // Obtener empleado por ID
  getById: async (id: string): Promise<Empleado> => {
    return apiService.get<Empleado>(`${BASE_URL}/empleados/${id}`);
  },

  // Empleados por departamento
  getByDepartamento: async (departamento: string): Promise<Empleado[]> => {
    return apiService.get<Empleado[]>(`${BASE_URL}/empleados/departamento/${departamento}`);
  },

  // Empleados activos
  getActivos: async (): Promise<Empleado[]> => {
    return apiService.get<Empleado[]>(`${BASE_URL}/empleados/activos`);
  },

  // Crear empleado
  create: async (data: CreateEmpleadoDto): Promise<Empleado> => {
    return apiService.post<Empleado>(`${BASE_URL}/empleados`, data);
  },

  // Actualizar empleado
  update: async (id: string, data: UpdateEmpleadoDto): Promise<Empleado> => {
    return apiService.patch<Empleado>(`${BASE_URL}/empleados/${id}`, data);
  },

  // Cambiar estado de empleado
  changeEstado: async (id: string, estado: string): Promise<Empleado> => {
    return apiService.patch<Empleado>(`${BASE_URL}/empleados/${id}/estado`, { estado });
  },

  // Eliminar empleado
  delete: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/empleados/${id}`);
  },

  // Obtener estadísticas del empleado
  getEstadisticas: async (id: string): Promise<EmpleadoEstadisticas> => {
    return apiService.get<EmpleadoEstadisticas>(`${BASE_URL}/empleados/${id}/estadisticas`);
  },
};

// ============================================
// PAGOS NÓMINA
// ============================================

export const pagosNominaService = {
  // Listar todos los pagos
  getAll: async (filters?: PagoNominaFilters): Promise<PagoNomina[]> => {
    return apiService.get<PagoNomina[]>(`${BASE_URL}/pagos`, filters as Record<string, unknown>);
  },

  // Obtener pago por ID
  getById: async (id: string): Promise<PagoNomina> => {
    return apiService.get<PagoNomina>(`${BASE_URL}/pagos/${id}`);
  },

  // Pagos por empleado
  getByEmpleado: async (empleadoId: string, pagination?: PaginationDto): Promise<PagoNomina[]> => {
    return apiService.get<PagoNomina[]>(`${BASE_URL}/pagos/empleado/${empleadoId}`, pagination as Record<string, unknown>);
  },

  // Pagos por período
  getByPeriodo: async (periodo: string): Promise<PagoNomina[]> => {
    return apiService.get<PagoNomina[]>(`${BASE_URL}/pagos/periodo/${periodo}`);
  },

  // Pagos pendientes
  getPendientes: async (): Promise<PagoNomina[]> => {
    return apiService.get<PagoNomina[]>(`${BASE_URL}/pagos/pendientes`);
  },

  // Crear pago
  create: async (data: CreatePagoNominaDto): Promise<PagoNomina> => {
    return apiService.post<PagoNomina>(`${BASE_URL}/pagos`, data);
  },

  // Actualizar pago
  update: async (id: string, data: UpdatePagoNominaDto): Promise<PagoNomina> => {
    return apiService.patch<PagoNomina>(`${BASE_URL}/pagos/${id}`, data);
  },

  // Procesar pago
  procesar: async (data: ProcesarPagoNominaDto): Promise<PagoNomina> => {
    return apiService.post<PagoNomina>(`${BASE_URL}/pagos/procesar`, data);
  },

  // Rechazar pago
  rechazar: async (id: string, motivo: string): Promise<PagoNomina> => {
    return apiService.post<PagoNomina>(`${BASE_URL}/pagos/${id}/rechazar`, { motivo });
  },

  // Eliminar pago
  delete: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/pagos/${id}`);
  },

  // Generar planilla mensual
  generarPlanilla: async (periodo: string): Promise<PagoNomina[]> => {
    return apiService.post<PagoNomina[]>(`${BASE_URL}/pagos/generar-planilla`, { periodo });
  },

  // Descargar comprobante
  downloadComprobante: async (id: string): Promise<Blob> => {
    const response = await apiService.getApi().get(`${BASE_URL}/pagos/${id}/comprobante`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============================================
// ASISTENCIA
// ============================================

export const asistenciaService = {
  // Listar asistencias
  getAll: async (filters?: AsistenciaFilters): Promise<Asistencia[]> => {
    return apiService.get<Asistencia[]>(`${BASE_URL}/asistencias`, filters as Record<string, unknown>);
  },

  // Obtener asistencia por ID
  getById: async (id: string): Promise<Asistencia> => {
    return apiService.get<Asistencia>(`${BASE_URL}/asistencias/${id}`);
  },

  // Asistencias por empleado
  getByEmpleado: async (empleadoId: string, filters?: AsistenciaFilters): Promise<Asistencia[]> => {
    return apiService.get<Asistencia[]>(`${BASE_URL}/asistencias/empleado/${empleadoId}`, filters as Record<string, unknown>);
  },

  // Asistencias por fecha
  getByFecha: async (fecha: string): Promise<Asistencia[]> => {
    return apiService.get<Asistencia[]>(`${BASE_URL}/asistencias/fecha/${fecha}`);
  },

  // Crear asistencia
  create: async (data: CreateAsistenciaDto): Promise<Asistencia> => {
    return apiService.post<Asistencia>(`${BASE_URL}/asistencias`, data);
  },

  // Actualizar asistencia
  update: async (id: string, data: UpdateAsistenciaDto): Promise<Asistencia> => {
    return apiService.patch<Asistencia>(`${BASE_URL}/asistencias/${id}`, data);
  },

  // Marcar entrada
  marcarEntrada: async (empleadoId: string): Promise<Asistencia> => {
    return apiService.post<Asistencia>(`${BASE_URL}/asistencias/entrada`, { empleadoId });
  },

  // Marcar salida
  marcarSalida: async (empleadoId: string): Promise<Asistencia> => {
    return apiService.post<Asistencia>(`${BASE_URL}/asistencias/salida`, { empleadoId });
  },

  // Eliminar asistencia
  delete: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/asistencias/${id}`);
  },
};

// ============================================
// REPORTES
// ============================================

export const reportesNominaService = {
  // Reporte de nómina
  getReporteNomina: async (periodo: string): Promise<ReporteNominaResponse> => {
    return apiService.get<ReporteNominaResponse>(`${BASE_URL}/reportes/nomina`, { periodo });
  },

  // Reporte de asistencia
  getReporteAsistencia: async (fechaDesde: string, fechaHasta: string): Promise<ReporteAsistenciaResponse> => {
    return apiService.get<ReporteAsistenciaResponse>(`${BASE_URL}/reportes/asistencia`, {
      fechaDesde,
      fechaHasta,
    });
  },

  // Reporte por departamento
  getReporteDepartamento: async (departamento: string, periodo: string): Promise<ReporteNominaResponse> => {
    return apiService.get<ReporteNominaResponse>(`${BASE_URL}/reportes/departamento/${departamento}`, { periodo });
  },

  // Descargar reporte en PDF
  downloadReportePdf: async (tipo: string, periodo: string): Promise<Blob> => {
    const response = await apiService.getApi().get(`${BASE_URL}/reportes/${tipo}/pdf`, {
      params: { periodo },
      responseType: 'blob',
    });
    return response.data;
  },

  // Descargar reporte en Excel
  downloadReporteExcel: async (tipo: string, periodo: string): Promise<Blob> => {
    const response = await apiService.getApi().get(`${BASE_URL}/reportes/${tipo}/excel`, {
      params: { periodo },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Exportar todo como nominaService
export const nominaService = {
  empleados: empleadosService,
  pagos: pagosNominaService,
  asistencias: asistenciaService,
  reportes: reportesNominaService,
};

export default nominaService;
