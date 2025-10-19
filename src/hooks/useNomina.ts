import { useState, useEffect, useCallback } from 'react';
import { nominaService } from '../services/nominaService';
import type {
  Empleado,
  CreateEmpleadoDto,
  UpdateEmpleadoDto,
  PagoNomina,
  CreatePagoNominaDto,
  ProcesarPagoNominaDto,
  Asistencia,
  CreateAsistenciaDto,
  UpdateAsistenciaDto,
  EmpleadoFilters,
  PagoNominaFilters,
  AsistenciaFilters,
} from '../types/nomina.types';


export const useEmpleados = (filters?: EmpleadoFilters) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpleados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nominaService.empleados.getAll(filters);
      setEmpleados(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createEmpleado = async (data: CreateEmpleadoDto) => {
    try {
      setLoading(true);
      setError(null);
      const newEmpleado = await nominaService.empleados.create(data);
      setEmpleados((prev) => [...prev, newEmpleado]);
      return newEmpleado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear empleado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmpleado = async (id: string, data: UpdateEmpleadoDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEmpleado = await nominaService.empleados.update(id, data);
      setEmpleados((prev) => prev.map((emp) => (emp.id === id ? updatedEmpleado : emp)));
      return updatedEmpleado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar empleado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeEstado = async (id: string, estado: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEmpleado = await nominaService.empleados.changeEstado(id, estado);
      setEmpleados((prev) => prev.map((emp) => (emp.id === id ? updatedEmpleado : emp)));
      return updatedEmpleado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmpleado = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await nominaService.empleados.delete(id);
      setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar empleado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  return {
    empleados,
    loading,
    error,
    refetch: fetchEmpleados,
    createEmpleado,
    updateEmpleado,
    changeEstado,
    deleteEmpleado,
  };
};

export const usePagosNomina = (filters?: PagoNominaFilters) => {
  const [pagos, setPagos] = useState<PagoNomina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nominaService.pagos.getAll(filters);
      setPagos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createPago = async (data: CreatePagoNominaDto) => {
    try {
      setLoading(true);
      setError(null);
      const newPago = await nominaService.pagos.create(data);
      setPagos((prev) => [...prev, newPago]);
      return newPago;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const procesarPago = async (data: ProcesarPagoNominaDto) => {
    try {
      setLoading(true);
      setError(null);
      const procesado = await nominaService.pagos.procesar(data);
      setPagos((prev) => prev.map((p) => (p.id === data.pagoId ? procesado : p)));
      return procesado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rechazarPago = async (id: string, motivo: string) => {
    try {
      setLoading(true);
      setError(null);
      const rechazado = await nominaService.pagos.rechazar(id, motivo);
      setPagos((prev) => prev.map((p) => (p.id === id ? rechazado : p)));
      return rechazado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar pago');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generarPlanilla = async (periodo: string) => {
    try {
      setLoading(true);
      setError(null);
      const nuevasPagos = await nominaService.pagos.generarPlanilla(periodo);
      setPagos((prev) => [...prev, ...nuevasPagos]);
      return nuevasPagos;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar planilla');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadComprobante = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await nominaService.pagos.downloadComprobante(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al descargar comprobante');
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
    procesarPago,
    rechazarPago,
    generarPlanilla,
    downloadComprobante,
  };
};

export const useAsistencias = (filters?: AsistenciaFilters) => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAsistencias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nominaService.asistencias.getAll(filters);
      setAsistencias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar asistencias');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createAsistencia = async (data: CreateAsistenciaDto) => {
    try {
      setLoading(true);
      setError(null);
      const newAsistencia = await nominaService.asistencias.create(data);
      setAsistencias((prev) => [...prev, newAsistencia]);
      return newAsistencia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear asistencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAsistencia = async (id: string, data: UpdateAsistenciaDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAsistencia = await nominaService.asistencias.update(id, data);
      setAsistencias((prev) => prev.map((a) => (a.id === id ? updatedAsistencia : a)));
      return updatedAsistencia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar asistencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const marcarEntrada = async (empleadoId: string) => {
    try {
      setLoading(true);
      setError(null);
      const asistencia = await nominaService.asistencias.marcarEntrada(empleadoId);
      setAsistencias((prev) => [...prev, asistencia]);
      return asistencia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar entrada');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const marcarSalida = async (empleadoId: string) => {
    try {
      setLoading(true);
      setError(null);
      const asistencia = await nominaService.asistencias.marcarSalida(empleadoId);
      setAsistencias((prev) =>
        prev.map((a) => (a.empleadoId === empleadoId && !a.horaSalida ? asistencia : a))
      );
      return asistencia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar salida');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAsistencia = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await nominaService.asistencias.delete(id);
      setAsistencias((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar asistencia');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, [fetchAsistencias]);

  return {
    asistencias,
    loading,
    error,
    refetch: fetchAsistencias,
    createAsistencia,
    updateAsistencia,
    marcarEntrada,
    marcarSalida,
    deleteAsistencia,
  };
};
