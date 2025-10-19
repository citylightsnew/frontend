import { useState, useEffect, useCallback } from 'react';
import { paymentsService } from '../services/paymentsService';
import type {
  PagoReserva,
  PagoDano,
  Factura,
  CreatePagoReservaDto,
  CreatePagoDanoDto,
  GenerateFacturaDto,
  AnularFacturaDto,
  PagoFilters,
  FacturaFilters,
} from '../types/payments.types';

export const usePagosReserva = (filters?: PagoFilters) => {
  const [pagos, setPagos] = useState<PagoReserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsService.pagosReserva.getAll(filters);
      setPagos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createPago = async (data: CreatePagoReservaDto) => {
    try {
      setLoading(true);
      setError(null);
      const newPago = await paymentsService.pagosReserva.create(data);
      setPagos((prev) => [...prev, newPago]);
      return newPago;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmPago = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const confirmed = await paymentsService.pagosReserva.confirm(id);
      setPagos((prev) => prev.map((p) => (p.id === id ? confirmed : p)));
      return confirmed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refundPago = async (id: string, monto?: number) => {
    try {
      setLoading(true);
      setError(null);
      const refunded = await paymentsService.pagosReserva.refund(id, monto);
      setPagos((prev) => prev.map((p) => (p.id === id ? refunded : p)));
      return refunded;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reembolsar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePago = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await paymentsService.pagosReserva.delete(id);
      setPagos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  return {
    pagos,
    loading,
    error,
    refetch: fetchPagos,
    createPago,
    confirmPago,
    refundPago,
    deletePago,
  };
};

export const usePagosDano = (filters?: PagoFilters) => {
  const [pagos, setPagos] = useState<PagoDano[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsService.pagosDano.getAll(filters);
      setPagos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pagos de daño');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createPago = async (data: CreatePagoDanoDto) => {
    try {
      setLoading(true);
      setError(null);
      const newPago = await paymentsService.pagosDano.create(data);
      setPagos((prev) => [...prev, newPago]);
      return newPago;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear pago de daño');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmPago = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const confirmed = await paymentsService.pagosDano.confirm(id);
      setPagos((prev) => prev.map((p) => (p.id === id ? confirmed : p)));
      return confirmed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refundPago = async (id: string, monto?: number) => {
    try {
      setLoading(true);
      setError(null);
      const refunded = await paymentsService.pagosDano.refund(id, monto);
      setPagos((prev) => prev.map((p) => (p.id === id ? refunded : p)));
      return refunded;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reembolsar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  return {
    pagos,
    loading,
    error,
    refetch: fetchPagos,
    createPago,
    confirmPago,
    refundPago,
  };
};

export const useFacturas = (filters?: FacturaFilters) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFacturas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsService.facturas.getAll(filters);
      setFacturas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const generateFactura = async (data: GenerateFacturaDto) => {
    try {
      setLoading(true);
      setError(null);
      const newFactura = await paymentsService.facturas.generate(data);
      setFacturas((prev) => [...prev, newFactura]);
      return newFactura;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar factura');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const anularFactura = async (id: string, data: AnularFacturaDto) => {
    try {
      setLoading(true);
      setError(null);
      const anulada = await paymentsService.facturas.anular(id, data);
      setFacturas((prev) => prev.map((f) => (f.id === id ? anulada : f)));
      return anulada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al anular factura');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await paymentsService.facturas.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar PDF');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas]);

  return {
    facturas,
    loading,
    error,
    refetch: fetchFacturas,
    generateFactura,
    anularFactura,
    downloadPdf,
  };
};
