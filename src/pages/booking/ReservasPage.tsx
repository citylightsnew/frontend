import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { Calendar, Filter, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

import { Button, Alert, Spinner } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { reservasService, type Reserva, type ReservaCalendarEvent } from '../../services/reservasService';
import { areasComunesService, type AreaComun } from '../../services/areasComunesService';
import ModalNuevaReserva from '../../components/booking/ModalNuevaReserva';
import ModalDetalleReserva from '../../components/booking/ModalDetalleReserva';
import ModalAprobarReserva from '../../components/booking/ModalAprobarReserva';

export default function ReservasPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const calendarRef = useRef<FullCalendar>(null);

  const [events, setEvents] = useState<ReservaCalendarEvent[]>([]);
  const [areas, setAreas] = useState<AreaComun[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [areaFilter, setAreaFilter] = useState<string>(searchParams.get('area') || '');
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  const [showNuevaReserva, setShowNuevaReserva] = useState(false);
  const [showDetalleReserva, setShowDetalleReserva] = useState(false);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ start: Date; end: Date } | null>(null);

  const isAdmin = user?.roleName === 'admin';

  useEffect(() => {
    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (areas.length > 0) {
      loadReservas();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaFilter, estadoFilter]);

  // Abrir modal automáticamente si viene con parámetro area en la URL
  useEffect(() => {
    const areaParam = searchParams.get('area');
    if (areaParam && areas.length > 0 && !showNuevaReserva) {
      console.log('🎯 Área pre-seleccionada desde URL:', areaParam);
      setShowNuevaReserva(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas.length, searchParams]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando datos iniciales...');
      
      const areasData = await areasComunesService.getActiveAreas();
      console.log('✅ Áreas cargadas:', areasData.length);
      setAreas(areasData);
      
      await loadReservas();
    } catch (err) {
      console.error('❌ Error al cargar datos iniciales:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar datos iniciales';
      setError(errorMsg);
      setAreas([]); // Asegurar que areas no quede undefined
      setReservas([]); // Asegurar que reservas no quede undefined
    } finally {
      setLoading(false);
    }
  };

  const loadReservas = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando reservas...', { isAdmin, userId: user?.id });
      
      const data = isAdmin 
        ? await reservasService.getAllReservas()
        : await reservasService.getMisReservas();
      
      console.log('✅ Reservas cargadas:', data.length);
      
      let filtered = data;
      if (areaFilter) {
        filtered = filtered.filter(r => r.areaId === areaFilter);
        console.log('🔍 Filtrado por área:', areaFilter, '→', filtered.length, 'reservas');
      }
      if (estadoFilter) {
        filtered = filtered.filter(r => r.estado === estadoFilter);
        console.log('🔍 Filtrado por estado:', estadoFilter, '→', filtered.length, 'reservas');
      }
      
      setReservas(filtered);
      
      const calendarEvents: ReservaCalendarEvent[] = [];
      
      // Generar eventos de reservas y sus períodos de limpieza
      filtered.forEach(reserva => {
        const colors = reservasService.getColorByEstado(reserva.estado);
        
        // Evento de la reserva
        calendarEvents.push({
          id: reserva.id,
          title: `${reserva.area?.nombre || 'Área'} - ${reserva.usuarioNombre || 'Usuario'}`,
          start: reserva.inicio,
          end: reserva.fin,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: '#374151',
          extendedProps: { reserva },
        });
        
        // Evento de limpieza (1 hora después de la reserva) - solo para reservas confirmadas
        if (reserva.estado === 'CONFIRMED') {
          const finReserva = new Date(reserva.fin);
          const finLimpieza = new Date(finReserva.getTime() + 60 * 60 * 1000); // +1 hora
          
          calendarEvents.push({
            id: `limpieza-${reserva.id}`,
            title: `🧹 Limpieza - ${reserva.area?.nombre || 'Área'}`,
            start: finReserva.toISOString(),
            end: finLimpieza.toISOString(),
            backgroundColor: '#e5e7eb', // gris más oscuro
            borderColor: '#9ca3af', // gris medio
            textColor: '#4b5563', // texto gris oscuro
            display: 'auto', // Mostrar como evento normal
            extendedProps: { 
              esLimpieza: true,
              reservaOriginal: reserva 
            },
          });
        }
      });
      
      setEvents(calendarEvents);
      console.log('📅 Eventos del calendario:', calendarEvents.length, '(incluyendo limpieza)');
    } catch (err) {
      console.error('❌ Error al cargar reservas:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar reservas';
      setError(errorMsg);
      setReservas([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Tanto admin como residente pueden crear reservas
    setSelectedDate({ start: selectInfo.start, end: selectInfo.end });
    setShowNuevaReserva(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // No abrir modal si es un evento de limpieza
    if (clickInfo.event.extendedProps.esLimpieza) {
      return;
    }
    
    const reserva = clickInfo.event.extendedProps.reserva as Reserva;
    setSelectedReserva(reserva);
    if (isAdmin && reserva.estado === 'PENDING') {
      setShowAprobarModal(true);
    } else {
      setShowDetalleReserva(true);
    }
  };

  const handleAprobar = async (reservaId: string) => {
    try {
      setError(null);
      await reservasService.aprobarReserva(reservaId);
      setSuccess('Reserva aprobada exitosamente');
      setShowAprobarModal(false);
      setSelectedReserva(null);
      await loadReservas();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar reserva');
    }
  };

  const handleRechazar = async (reservaId: string, motivo: string) => {
    try {
      setError(null);
      await reservasService.rechazarReserva(reservaId, motivo);
      setSuccess('Reserva rechazada');
      setShowAprobarModal(false);
      setSelectedReserva(null);
      await loadReservas();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar reserva');
    }
  };

  const handleCancelar = async (reservaId: string, motivo: string) => {
    try {
      setError(null);
      await reservasService.cancelarReserva(reservaId, motivo);
      setSuccess('Reserva cancelada');
      setShowDetalleReserva(false);
      setSelectedReserva(null);
      await loadReservas();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar reserva');
    }
  };

  const getEstadisticas = () => {
    const total = reservas.length;
    const pending = reservas.filter(r => r.estado === 'PENDING').length;
    const confirmed = reservas.filter(r => r.estado === 'CONFIRMED').length;
    const cancelled = reservas.filter(r => r.estado === 'CANCELLED').length;
    const completed = reservas.filter(r => r.estado === 'COMPLETED').length;
    return { total, pending, confirmed, cancelled, completed };
  };

  const stats = getEstadisticas();

  // Convertir Reserva del servicio al formato del modal
  const convertReservaForModal = (reserva: Reserva) => ({
    ...reserva,
    usuarioNombre: reserva.usuarioNombre || undefined,
    usuarioEmail: reserva.usuarioEmail || undefined,
    notas: reserva.notas || undefined,
    motivoCancelacion: reserva.motivoCancelacion || undefined,
    area: reserva.area ? {
      id: reserva.area.id,
      nombre: reserva.area.nombre,
      descripcion: reserva.area.descripcion || undefined,
      capacidad: 0, // El servicio no devuelve capacidad, usar 0 como placeholder
    } : undefined,
  });

  // Estado de carga inicial
  if (loading && reservas.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Cargando reservas...</p>
      </div>
    );
  }

  // Estado de error crítico (sin poder cargar nada)
  if (error && reservas.length === 0 && areas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={loadInitialData} fullWidth>
              Reintentar
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'} fullWidth>
              Volver al Dashboard
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Si el problema persiste, contacta al administrador
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdmin ? 'Gestión de Reservas' : 'Mis Reservas'}
          </h1>
          <p className="text-gray-600">
            {isAdmin ? 'Administra las solicitudes de reserva de áreas comunes' : 'Solicita y gestiona tus reservas de áreas comunes'}
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} className="mb-4" onClose={() => setError(null)} />
        )}
        {success && (
          <Alert type="success" message={success} className="mb-4" onClose={() => setSuccess(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Confirmadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600">Completadas</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todas las áreas</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="CANCELLED">Cancelada</option>
                <option value="COMPLETED">Completada</option>
              </select>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant={viewMode === 'calendar' ? 'primary' : 'outline'} onClick={() => setViewMode('calendar')}>
                <Calendar className="w-4 h-4 mr-2" />Calendario
              </Button>
              <Button variant={viewMode === 'list' ? 'primary' : 'outline'} onClick={() => setViewMode('list')}>
                Lista
              </Button>
            </div>
            <Button variant="primary" onClick={() => setShowNuevaReserva(true)}>
              <Plus className="w-4 h-4 mr-2" />Nueva Reserva
            </Button>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <>
            {/* Leyenda de limpieza */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <div className="text-blue-600 text-xl">ℹ️</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Períodos de Limpieza Automáticos
                </h3>
                <p className="text-sm text-blue-700">
                  Cada reserva confirmada incluye automáticamente <strong>1 hora de limpieza</strong> después del horario reservado. 
                  Los bloques grises 🧹 en el calendario representan estos períodos de mantenimiento durante los cuales el área no está disponible para nuevas reservas.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale={esLocale}
                events={events}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              nowIndicator={true}
              businessHours={{
                daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                startTime: '06:00',
                endTime: '22:00'
              }}
            />
          </div>
          </>
        )}

        {viewMode === 'list' && (
          <>
            {/* Leyenda de limpieza para vista de lista */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <div className="text-blue-600 text-xl">ℹ️</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Períodos de Limpieza Automáticos
                </h3>
                <p className="text-sm text-blue-700">
                  Las filas grises con 🧹 representan los períodos de limpieza de <strong>1 hora</strong> que se agregan automáticamente después de cada reserva confirmada.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservas.map(reserva => {
                    const colors = reservasService.getColorByEstado(reserva.estado);
                    const finReserva = new Date(reserva.fin);
                    const finLimpieza = new Date(finReserva.getTime() + 60 * 60 * 1000);
                    
                    return (
                      <>
                        <tr key={reserva.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{reserva.area?.nombre || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reserva.usuarioNombre || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(reserva.inicio).toLocaleString('es-ES')}</div>
                            <div className="text-sm text-gray-500">hasta {new Date(reserva.fin).toLocaleString('es-ES')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" style={{ backgroundColor: colors.bg, borderColor: colors.border, borderWidth: '1px' }}>
                              {reserva.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bs. {reserva.costo?.toFixed(2) || '0.00'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedReserva(reserva); if (isAdmin && reserva.estado === 'PENDING') { setShowAprobarModal(true); } else { setShowDetalleReserva(true); } }}>
                              Ver detalles
                            </Button>
                          </td>
                        </tr>
                        
                        {/* Fila de limpieza - solo para reservas confirmadas */}
                        {reserva.estado === 'CONFIRMED' && (
                          <tr key={`limpieza-${reserva.id}`} className="bg-gray-50">
                            <td className="px-6 py-2 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-500 flex items-center">
                                <span className="mr-2">🧹</span>
                                {reserva.area?.nombre || 'Área'} - Limpieza
                              </div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <div className="text-sm text-gray-500 italic">Mantenimiento</div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{finReserva.toLocaleString('es-ES')}</div>
                              <div className="text-sm text-gray-400">hasta {finLimpieza.toLocaleString('es-ES')}</div>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                                LIMPIEZA
                              </span>
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">-</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-400">
                              <span className="text-xs italic">1 hora reservada</span>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
      </div>

      <ModalNuevaReserva 
        isOpen={showNuevaReserva} 
        onClose={() => { 
          setShowNuevaReserva(false); 
          setSelectedDate(null); 
        }} 
        onSuccess={async () => {
          setSuccess('Reserva creada exitosamente');
          setShowNuevaReserva(false);
          setSelectedDate(null);
          await loadReservas();
          setTimeout(() => setSuccess(null), 3000);
        }}
        areas={areas} 
        selectedDate={selectedDate}
        areaIdPreselected={searchParams.get('area') || undefined}
      />

      {selectedReserva && (
        <>
          <ModalDetalleReserva 
            isOpen={showDetalleReserva} 
            onClose={() => { 
              setShowDetalleReserva(false); 
              setSelectedReserva(null); 
            }} 
            reserva={convertReservaForModal(selectedReserva)}
            onCancelar={handleCancelar}
            isAdmin={isAdmin}
            currentUserId={user?.id || ''}
          />
          <ModalAprobarReserva 
            isOpen={showAprobarModal} 
            onClose={() => { 
              setShowAprobarModal(false); 
              setSelectedReserva(null); 
            }} 
            reserva={convertReservaForModal(selectedReserva)}
            onAprobar={handleAprobar}
            onRechazar={handleRechazar}
          />
        </>
      )}
    </div>
  );
}
