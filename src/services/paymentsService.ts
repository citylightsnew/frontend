import apiService from './api';
import type {
  PagoReserva,
  CreatePagoReservaDto,
  UpdatePagoReservaDto,
  PagoDano,
  CreatePagoDanoDto,
  UpdatePagoDanoDto,
  Factura,
  GenerateFacturaDto,
  AnularFacturaDto,
  PagoFilters,
  FacturaFilters,
  PaginationDto,
  EstadisticasPagosResponse,
  EstadisticasFacturasResponse,
} from '../types/payments.types';

const BASE_URL = '/api/payments';

// ============================================
// PAGOS RESERVA
// ============================================

export const pagosReservaService = {
  // Listar todos los pagos
  getAll: async (filters?: PagoFilters): Promise<PagoReserva[]> => {
    return apiService.get<PagoReserva[]>(`${BASE_URL}/reservas`, filters as Record<string, unknown>);
  },

  // Obtener pago por ID
  getById: async (id: string): Promise<PagoReserva> => {
    return apiService.get<PagoReserva>(`${BASE_URL}/reservas/${id}`);
  },

  // Pagos por usuario
  getByUser: async (usuarioId: string, pagination?: PaginationDto): Promise<PagoReserva[]> => {
    return apiService.get<PagoReserva[]>(`${BASE_URL}/reservas/usuario/${usuarioId}`, pagination as Record<string, unknown>);
  },

  // Pago por reserva
  getByReserva: async (reservaId: string): Promise<PagoReserva> => {
    return apiService.get<PagoReserva>(`${BASE_URL}/reservas/reserva/${reservaId}`);
  },

  // Crear pago
  create: async (data: CreatePagoReservaDto): Promise<PagoReserva> => {
    return apiService.post<PagoReserva>(`${BASE_URL}/reservas`, data);
  },

  // Actualizar pago
  update: async (id: string, data: UpdatePagoReservaDto): Promise<PagoReserva> => {
    return apiService.patch<PagoReserva>(`${BASE_URL}/reservas/${id}`, data);
  },

  // Confirmar pago
  confirm: async (id: string): Promise<PagoReserva> => {
    return apiService.post<PagoReserva>(`${BASE_URL}/reservas/${id}/confirm`);
  },

  // Reembolsar pago
  refund: async (id: string, monto?: number): Promise<PagoReserva> => {
    return apiService.post<PagoReserva>(`${BASE_URL}/reservas/${id}/refund`, { monto });
  },

  // Eliminar pago
  delete: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/reservas/${id}`);
  },
};

// ============================================
// PAGOS DAÑO
// ============================================

export const pagosDanoService = {
  // Listar todos los pagos
  getAll: async (filters?: PagoFilters): Promise<PagoDano[]> => {
    return apiService.get<PagoDano[]>(`${BASE_URL}/danos`, filters as Record<string, unknown>);
  },

  // Obtener pago por ID
  getById: async (id: string): Promise<PagoDano> => {
    return apiService.get<PagoDano>(`${BASE_URL}/danos/${id}`);
  },

  // Pagos por usuario
  getByUser: async (usuarioId: string, pagination?: PaginationDto): Promise<PagoDano[]> => {
    return apiService.get<PagoDano[]>(`${BASE_URL}/danos/usuario/${usuarioId}`, pagination as Record<string, unknown>);
  },

  // Pagos por reserva
  getByReserva: async (reservaId: string, pagination?: PaginationDto): Promise<PagoDano[]> => {
    return apiService.get<PagoDano[]>(`${BASE_URL}/danos/reserva/${reservaId}`, pagination as Record<string, unknown>);
  },

  // Crear pago por daño
  create: async (data: CreatePagoDanoDto): Promise<PagoDano> => {
    return apiService.post<PagoDano>(`${BASE_URL}/danos`, data);
  },

  // Actualizar pago
  update: async (id: string, data: UpdatePagoDanoDto): Promise<PagoDano> => {
    return apiService.post<PagoDano>(`${BASE_URL}/danos/${id}`, data);
  },

  // Confirmar pago
  confirm: async (id: string): Promise<PagoDano> => {
    return apiService.post<PagoDano>(`${BASE_URL}/danos/${id}/confirm`);
  },

  // Reembolsar pago
  refund: async (id: string, monto?: number): Promise<PagoDano> => {
    return apiService.post<PagoDano>(`${BASE_URL}/danos/${id}/refund`, { monto });
  },

  // Eliminar pago
  delete: async (id: string): Promise<{ message: string }> => {
    return apiService.delete(`${BASE_URL}/danos/${id}`);
  },
};

// ============================================
// FACTURAS
// ============================================

export const facturasService = {
  // Listar todas las facturas
  getAll: async (filters?: FacturaFilters): Promise<Factura[]> => {
    return apiService.get<Factura[]>(`${BASE_URL}/facturas`, filters as Record<string, unknown>);
  },

  // Obtener factura por ID
  getById: async (id: string): Promise<Factura> => {
    return apiService.get<Factura>(`${BASE_URL}/facturas/${id}`);
  },

  // Buscar por número de factura
  getByNumero: async (numeroFactura: number): Promise<Factura> => {
    return apiService.get<Factura>(`${BASE_URL}/facturas/numero/${numeroFactura}`);
  },

  // Buscar por NIT
  getByNit: async (nit: string, pagination?: PaginationDto): Promise<Factura[]> => {
    return apiService.get<Factura[]>(`${BASE_URL}/facturas/nit/${nit}`, pagination as Record<string, unknown>);
  },

  // Generar factura desde pago
  generate: async (data: GenerateFacturaDto): Promise<Factura> => {
    return apiService.post<Factura>(`${BASE_URL}/facturas/generate`, data);
  },

  // Anular factura
  anular: async (id: string, data: AnularFacturaDto): Promise<Factura> => {
    return apiService.post<Factura>(`${BASE_URL}/facturas/${id}/anular`, data);
  },

  // Descargar PDF de factura
  downloadPdf: async (id: string): Promise<Blob> => {
    const response = await apiService.getApi().get(`${BASE_URL}/facturas/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============================================
// ESTADÍSTICAS
// ============================================

export const paymentsStatsService = {
  // Estadísticas de pagos
  getPagosStats: async (): Promise<EstadisticasPagosResponse> => {
    return apiService.get<EstadisticasPagosResponse>(`${BASE_URL}/estadisticas/pagos`);
  },

  // Estadísticas de facturas
  getFacturasStats: async (): Promise<EstadisticasFacturasResponse> => {
    return apiService.get<EstadisticasFacturasResponse>(`${BASE_URL}/estadisticas/facturas`);
  },
};

// Exportar todo como paymentsService
export const paymentsService = {
  pagosReserva: pagosReservaService,
  pagosDano: pagosDanoService,
  facturas: facturasService,
  stats: paymentsStatsService,
};

export default paymentsService;
