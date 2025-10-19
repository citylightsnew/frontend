import { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, Users, AlertCircle, UserCircle } from 'lucide-react';
import { Button, Alert } from '../';
import type { AreaComun } from '../../services/areasComunesService';
import { reservasService } from '../../services/reservasService';
import userService from '../../services/userService';
import type { User } from '../../types';

interface ModalNuevaReservaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  areas: AreaComun[];
  selectedDate?: { start: Date; end: Date } | null;
  areaIdPreselected?: string;
}

export default function ModalNuevaReserva({
  isOpen,
  onClose,
  onSuccess,
  areas,
  selectedDate,
  areaIdPreselected,
}: ModalNuevaReservaProps) {
  const [areaId, setAreaId] = useState(areaIdPreselected || '');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costoEstimado, setCostoEstimado] = useState(0);
  
  // Para admin: seleccionar usuario residente
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  const areaSeleccionada = areas.find(a => a.id === areaId);

  // Validaciones de fecha y hora
  const isToday = fecha === new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Calcular hora mínima para inicio
  const minHoraInicio = isToday ? currentTime : '00:00';

  // Calcular hora mínima para fin (debe ser mayor a hora inicio)
  const calcularMinHoraFin = () => {
    if (!horaInicio) return '00:00';
    const [hours, minutes] = horaInicio.split(':').map(Number);
    const nextMinutes = minutes + 1;
    if (nextMinutes >= 60) {
      return `${(hours + 1).toString().padStart(2, '0')}:00`;
    }
    return `${hours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (selectedDate) {
      const start = new Date(selectedDate.start);
      setFecha(start.toISOString().split('T')[0]);
      setHoraInicio(start.toTimeString().slice(0, 5));
      
      const end = new Date(selectedDate.end);
      setHoraFin(end.toTimeString().slice(0, 5));
    }
  }, [selectedDate]);

  useEffect(() => {
    calcularCosto();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, fecha, horaInicio, horaFin]);

  // Cargar usuario actual y verificar si es admin
  useEffect(() => {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
      setIsAdmin(user.role?.categoria === 'superusuario' || user.role?.categoria === 'trabajador');
    }
  }, []);

  // Cargar lista de usuarios si es admin
  useEffect(() => {
    if (isAdmin && isOpen) {
      const loadUsuarios = async () => {
        try {
          const response = await userService.getAllUsers();
          // Filtrar solo residentes
          const residentes = response.data.filter(
            u => u.role?.categoria === 'residente'
          );
          setUsuarios(residentes);
        } catch (err) {
          console.error('Error al cargar usuarios:', err);
        }
      };
      loadUsuarios();
    }
  }, [isAdmin, isOpen]);

  const calcularCosto = () => {
    if (!areaSeleccionada || !fecha || !horaInicio || !horaFin) {
      setCostoEstimado(0);
      return;
    }

    const inicio = new Date(`${fecha}T${horaInicio}`);
    const fin = new Date(`${fecha}T${horaFin}`);
    const horas = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);

    if (horas > 0) {
      const costo = horas * areaSeleccionada.costoHora;
      const costoTotal = areaSeleccionada.costoEntrega 
        ? costo + areaSeleccionada.costoEntrega 
        : costo;
      setCostoEstimado(costoTotal);
    } else {
      setCostoEstimado(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!areaId || !fecha || !horaInicio || !horaFin) {
      setError('⚠️ Por favor complete todos los campos requeridos');
      return;
    }

    const inicio = new Date(`${fecha}T${horaInicio}`);
    const fin = new Date(`${fecha}T${horaFin}`);
    const ahora = new Date();

    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      setError('📅 No puedes hacer reservas para fechas pasadas');
      return;
    }

    // Validar que la hora de inicio no sea en el pasado (si es hoy)
    if (inicio < ahora) {
      setError('⏰ No puedes hacer reservas para horas que ya pasaron. La hora de inicio debe ser en el futuro.');
      return;
    }

    // Validar que la hora de fin sea posterior a la hora de inicio
    if (fin <= inicio) {
      setError('⏱️ La hora de fin debe ser posterior a la hora de inicio. Por favor ajusta los horarios.');
      return;
    }

    // Validar duración mínima (al menos 30 minutos)
    const duracionMinutos = (fin.getTime() - inicio.getTime()) / (1000 * 60);
    if (duracionMinutos < 30) {
      setError('⏳ La reserva debe tener una duración mínima de 30 minutos');
      return;
    }

    // Verificar que haya un costo calculado
    if (costoEstimado <= 0) {
      setError('Error al calcular el costo de la reserva');
      return;
    }

    try {
      setLoading(true);

      // Obtener datos del usuario actual
      const userStr = localStorage.getItem('auth_user');
      if (!userStr) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }
      const currentUser = JSON.parse(userStr);

      // Determinar el usuario para la reserva
      let usuarioIdFinal = currentUserId;
      let usuarioNombre = currentUser.name;
      let usuarioEmail = currentUser.email;
      let usuarioRol = currentUser.role?.name || 'Residente';

      if (isAdmin) {
        // Si es admin y no seleccionó un usuario, debe seleccionar uno
        if (!usuarioSeleccionadoId) {
          setError('Por favor selecciona un residente para la reserva');
          setLoading(false);
          return;
        }
        usuarioIdFinal = usuarioSeleccionadoId;
        
        // Buscar datos del usuario seleccionado
        const usuarioSeleccionado = usuarios.find(u => u.id === usuarioSeleccionadoId);
        if (usuarioSeleccionado) {
          usuarioNombre = usuarioSeleccionado.name;
          usuarioEmail = usuarioSeleccionado.email;
          usuarioRol = usuarioSeleccionado.role?.name || 'Residente';
        }
      }

      console.log('📝 Creando reserva:', {
        areaId,
        usuarioId: usuarioIdFinal,
        usuarioNombre,
        usuarioEmail,
        usuarioRol,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        costo: costoEstimado,
        notas,
        isAdminCreating: isAdmin
      });

      // Verificar disponibilidad
      const disponible = await reservasService.checkDisponibilidad(
        areaId,
        inicio.toISOString(),
        fin.toISOString()
      );

      if (!disponible) {
        setError('El área no está disponible en el horario seleccionado');
        return;
      }

      // Crear reserva
      await reservasService.createReserva({
        areaId,
        usuarioId: usuarioIdFinal,
        usuarioNombre,
        usuarioEmail,
        usuarioRol,
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
        costo: costoEstimado,
        notas: notas || undefined,
      });

      console.log('✅ Reserva creada exitosamente');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Overlay 
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500/75"
          onClick={onClose}
        ></div>
        */}

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Nueva Reserva</h3>
                <p className="text-sm text-gray-600">Solicita el uso de un área común</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Alert de error */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Seleccionar Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área Común *
              </label>
              <select
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione un área</option>
                {areas.filter(a => a.activa).map(area => (
                  <option key={area.id} value={area.id}>
                    {area.nombre} - {area.costoHora} Bs/hora
                  </option>
                ))}
              </select>
            </div>

            {/* Seleccionar Usuario (solo para admin) */}
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCircle size={16} className="inline mr-2" />
                  Residente *
                </label>
                <select
                  value={usuarioSeleccionadoId}
                  onChange={(e) => setUsuarioSeleccionadoId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione un residente</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.name} ({usuario.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona el residente para quien se creará la reserva
                </p>
              </div>
            )}

            {/* Info del área seleccionada */}
            {areaSeleccionada && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-600" />
                    <span className="text-gray-700">
                      Capacidad: <strong>{areaSeleccionada.capacidad} personas</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-blue-600" />
                    <span className="text-gray-700">
                      <strong>{areaSeleccionada.costoHora} Bs/hora</strong>
                    </span>
                  </div>
                  {areaSeleccionada.horaApertura && areaSeleccionada.horaCierre && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-gray-700">
                        Horario: {areaSeleccionada.horaApertura} - {areaSeleccionada.horaCierre}
                      </span>
                    </div>
                  )}
                  {areaSeleccionada.requiereEntrega && areaSeleccionada.costoEntrega && (
                    <div className="flex items-center gap-2 col-span-2">
                      <AlertCircle size={16} className="text-orange-600" />
                      <span className="text-orange-700">
                        Requiere entrega de llaves (+{areaSeleccionada.costoEntrega} Bs)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Fecha *
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ Solo puedes hacer reservas desde hoy en adelante
              </p>
            </div>

            {/* Horas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-2" />
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                  min={minHoraInicio}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {isToday && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⏰ Mínimo: {minHoraInicio} (hora actual)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-2" />
                  Hora de Fin *
                </label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                  min={calcularMinHoraFin()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {horaInicio && (
                  <p className="text-xs text-blue-600 mt-1">
                    ⏰ Mínimo: {calcularMinHoraFin()}
                  </p>
                )}
              </div>
            </div>
            
            {/* Validaciones visuales */}
            {horaInicio && horaFin && horaFin <= horaInicio && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">
                    ⚠️ La hora de fin debe ser posterior a la hora de inicio
                  </span>
                </div>
              </div>
            )}
            
            {fecha && horaInicio && (() => {
              const inicio = new Date(`${fecha}T${horaInicio}`);
              const ahora = new Date();
              return inicio < ahora;
            })() && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">
                    ⏰ Esta fecha y hora ya pasaron. Selecciona una hora futura.
                  </span>
                </div>
              </div>
            )}

            {/* Costo Estimado y Duración */}
            {costoEstimado > 0 && fecha && horaInicio && horaFin && horaFin > horaInicio && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-green-600" />
                      <span className="text-gray-700 font-medium">Costo Estimado:</span>
                    </div>
                    <span className="text-2xl font-bold text-green-900">
                      {costoEstimado.toFixed(2)} Bs
                    </span>
                  </div>
                  {(() => {
                    const inicio = new Date(`${fecha}T${horaInicio}`);
                    const fin = new Date(`${fecha}T${horaFin}`);
                    const horas = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
                    const horasEnteras = Math.floor(horas);
                    const minutos = Math.round((horas - horasEnteras) * 60);
                    
                    return (
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                          Duración: {horasEnteras > 0 && `${horasEnteras}h `}
                          {minutos > 0 && `${minutos}min`}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (Opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Agrega cualquier información adicional..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Info importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tu reserva quedará pendiente de aprobación por un administrador</li>
                    <li>Recibirás una notificación cuando sea aprobada o rechazada</li>
                    <li>El pago se realizará una vez aprobada la reserva</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                fullWidth
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={!areaId || !fecha || !horaInicio || !horaFin}
              >
                Solicitar Reserva
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
