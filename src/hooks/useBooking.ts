import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import type {
  AreaComun,
  Reserva,
  Bloqueo,
  CreateAreaComunDto,
  UpdateAreaComunDto,
  CreateReservaDto,
  UpdateReservaDto,
  CreateBloqueoDto,
  CheckDisponibilidadDto,
  DisponibilidadResponse,
  ReservaFilters,
  AreaComunFilters,
} from '../types/booking.types';

export const useAreasComunes = (filters?: AreaComunFilters) => {
  const [areas, setAreas] = useState<AreaComun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.areas.getAll(filters);
      setAreas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar áreas comunes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createArea = async (data: CreateAreaComunDto) => {
    try {
      setLoading(true);
      setError(null);
      const newArea = await bookingService.areas.create(data);
      setAreas((prev) => [...prev, newArea]);
      return newArea;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear área');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateArea = async (id: number, data: UpdateAreaComunDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedArea = await bookingService.areas.update(id, data);
      setAreas((prev) => prev.map((area) => (area.id === id ? updatedArea : area)));
      return updatedArea;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar área');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await bookingService.areas.delete(id);
      setAreas((prev) => prev.filter((area) => area.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar área');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedArea = await bookingService.areas.toggleActive(id);
      setAreas((prev) => prev.map((area) => (area.id === id ? updatedArea : area)));
      return updatedArea;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return {
    areas,
    loading,
    error,
    refetch: fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    toggleActive,
  };
};


export const useReservas = (filters?: ReservaFilters) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.reservas.getAll(filters);
      setReservas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createReserva = async (data: CreateReservaDto) => {
    try {
      setLoading(true);
      setError(null);
      const newReserva = await bookingService.reservas.create(data);
      setReservas((prev) => [...prev, newReserva]);
      return newReserva;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReserva = async (id: number, data: UpdateReservaDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedReserva = await bookingService.reservas.update(id, data);
      setReservas((prev) => prev.map((r) => (r.id === id ? updatedReserva : r)));
      return updatedReserva;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmReserva = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const confirmed = await bookingService.reservas.confirm(id);
      setReservas((prev) => prev.map((r) => (r.id === id ? confirmed : r)));
      return confirmed;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelReserva = async (id: number, motivo?: string) => {
    try {
      setLoading(true);
      setError(null);
      const cancelled = await bookingService.reservas.cancel(id, motivo);
      setReservas((prev) => prev.map((r) => (r.id === id ? cancelled : r)));
      return cancelled;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReserva = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await bookingService.reservas.delete(id);
      setReservas((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkDisponibilidad = async (data: CheckDisponibilidadDto): Promise<DisponibilidadResponse> => {
    try {
      setLoading(true);
      setError(null);
      return await bookingService.reservas.checkDisponibilidad(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar disponibilidad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  return {
    reservas,
    loading,
    error,
    refetch: fetchReservas,
    createReserva,
    updateReserva,
    confirmReserva,
    cancelReserva,
    deleteReserva,
    checkDisponibilidad,
  };
};


export const useBloqueos = (areaId?: number) => {
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBloqueos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = areaId 
        ? await bookingService.bloqueos.getByArea(areaId)
        : await bookingService.bloqueos.getAll();
      setBloqueos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar bloqueos');
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  const createBloqueo = async (data: CreateBloqueoDto) => {
    try {
      setLoading(true);
      setError(null);
      const newBloqueo = await bookingService.bloqueos.create(data);
      setBloqueos((prev) => [...prev, newBloqueo]);
      return newBloqueo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear bloqueo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBloqueo = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await bookingService.bloqueos.delete(id);
      setBloqueos((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar bloqueo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloqueos();
  }, [fetchBloqueos]);

  return {
    bloqueos,
    loading,
    error,
    refetch: fetchBloqueos,
    createBloqueo,
    deleteBloqueo,
  };
};
