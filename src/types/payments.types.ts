export const EstadoPago = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type EstadoPago = typeof EstadoPago[keyof typeof EstadoPago];

export const TipoPago = {
  RESERVA: 'RESERVA',
  DANO: 'DANO',
} as const;

export type TipoPago = typeof TipoPago[keyof typeof TipoPago];

export const MetodoPago = {
  STRIPE_CARD: 'STRIPE_CARD',
  STRIPE_TRANSFER: 'STRIPE_TRANSFER',
  CASH: 'CASH',
  QR_BANCARIO: 'QR_BANCARIO',
} as const;

export type MetodoPago = typeof MetodoPago[keyof typeof MetodoPago];

export const EstadoFactura = {
  EMITIDA: 'EMITIDA',
  ANULADA: 'ANULADA',
} as const;

export type EstadoFactura = typeof EstadoFactura[keyof typeof EstadoFactura];

export interface PagoReserva {
  id: string;
  reservaId: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  usuarioTelefono?: string;
  reservaArea: string;
  monto: number;
  moneda: string;
  metodoPago: MetodoPago;
  estado: EstadoPago;
  descripcion?: string;
  notas?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeRefundId?: string;
  stripeErrorMessage?: string;
  fechaPago?: string;
  fechaRefund?: string;
  fechaExpiracion?: string;
  metadata?: Record<string, unknown>;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreatePagoReservaDto {
  reservaId: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  usuarioTelefono?: string;
  reservaArea: string;
  monto: number;
  moneda?: string;
  metodoPago: MetodoPago;
  descripcion?: string;
  notas?: string;
  fechaExpiracion?: string;
  metadata?: Record<string, unknown>;
}

export type UpdatePagoReservaDto = Partial<CreatePagoReservaDto>;

export interface PagoDano {
  id: string;
  reservaId: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  usuarioTelefono?: string;
  reservaArea: string;
  monto: number;
  moneda: string;
  metodoPago: MetodoPago;
  estado: EstadoPago;
  descripcionDano: string;
  evidenciaFotos: string[];
  evaluadoPor: string;
  fechaDeteccion: string;
  descripcion?: string;
  notas?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeRefundId?: string;
  stripeErrorMessage?: string;
  fechaPago?: string;
  fechaRefund?: string;
  fechaExpiracion?: string;
  metadata?: Record<string, unknown>;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreatePagoDanoDto {
  reservaId: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  usuarioTelefono?: string;
  reservaArea: string;
  monto: number;
  moneda?: string;
  metodoPago: MetodoPago;
  descripcionDano: string;
  evidenciaFotos: string[];
  evaluadoPor: string;
  fechaDeteccion: string;
  descripcion?: string;
  notas?: string;
  fechaExpiracion?: string;
  metadata?: Record<string, unknown>;
}

export type UpdatePagoDanoDto = Partial<CreatePagoDanoDto>;

export interface ItemFactura {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Factura {
  id: string;
  numeroFactura: number;
  pagoReservaId?: string;
  pagoDanoId?: string;
  nit: string;
  razonSocial: string;
  monto: number;
  literal: string;
  emisorNit: string;
  emisorRazonSocial: string;
  codigoControl: string;
  qrFiscal: string;
  autorizacion: string;
  dosificacion: string;
  fechaEmision: string;
  estado: EstadoFactura;
  anuladaEn?: string;
  motivoAnulacion?: string;
  items: ItemFactura[];
  creadoEn: string;
  actualizadoEn: string;
  pagoReserva?: PagoReserva;
  pagoDano?: PagoDano;
}

export interface GenerateFacturaDto {
  pagoReservaId?: string;
  pagoDanoId?: string;
  nit?: string;
  razonSocial: string;
}

export interface AnularFacturaDto {
  motivoAnulacion: string;
}

export interface PaginationDto {
  page?: number;
  limit?: number;
}

export interface PagoFilters extends PaginationDto {
  usuarioId?: string;
  reservaId?: string;
  estado?: EstadoPago;
  metodoPago?: MetodoPago;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface FacturaFilters extends PaginationDto {
  nit?: string;
  estado?: EstadoFactura;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface StripeRefund {
  id: string;
  amount: number;
  status: string;
  reason?: string;
}

export interface EstadisticasPagosResponse {
  totalPagos: number;
  totalMonto: number;
  pagosPendientes: number;
  montoPendiente: number;
  pagosCompletados: number;
  montoCompletado: number;
  pagosReembolsados: number;
  montoReembolsado: number;
  metodosPopulares: Array<{
    metodo: MetodoPago;
    cantidad: number;
    monto: number;
  }>;
}

export interface EstadisticasFacturasResponse {
  totalFacturas: number;
  facturasEmitidas: number;
  facturasAnuladas: number;
  montoTotal: number;
  montoEmitido: number;
  montoAnulado: number;
}
