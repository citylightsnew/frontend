import { useState } from 'react';
import { X, Calendar, Clock, DollarSign, User, Mail, Tag, MapPin, AlertCircle, Trash2 } from 'lucide-react';
import { Button, Alert } from '../';

interface Reserva {
  id: string;
  areaId: string;
  usuarioId: string;
  inicio: string;
  fin: string;
  estado: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  costo: number;
  usuarioNombre?: string;
  usuarioEmail?: string;
  notas?: string;
  motivoCancelacion?: string;
  area?: {
    id: string;
    nombre: string;
    descripcion?: string;
    capacidad: number;
  };
}

interface ModalDetalleReservaProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: Reserva | null;
  onCancelar: (id: string, motivo: string) => Promise<void>;
  isAdmin: boolean;
  currentUserId: string;
}

const ESTADO_CONFIG = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '⏳',
  },
  CONFIRMED: {
    label: 'Confirmada',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: '✓',
  },
  CANCELLED: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: '✗',
  },
  COMPLETED: {
    label: 'Completada',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: '✓',
  },
  NO_SHOW: {
    label: 'No asistió',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: '⊗',
  },
};

export default function ModalDetalleReserva({
  isOpen,
  onClose,
  reserva,
  onCancelar,
  isAdmin,
  currentUserId,
}: ModalDetalleReservaProps) {
  const [showCancelar, setShowCancelar] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !reserva) return null;

  const estadoConfig = ESTADO_CONFIG[reserva.estado];
  const isOwner = reserva.usuarioId === currentUserId;
  const canCancel = (isOwner || isAdmin) && ['PENDING', 'CONFIRMED'].includes(reserva.estado);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = () => {
    const inicio = new Date(reserva.inicio);
    const fin = new Date(reserva.fin);
    const hours = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    return `${hours} hora${hours !== 1 ? 's' : ''}`;
  };

  const handleCancelar = async () => {
    if (!motivoCancelacion.trim()) {
      setError('Por favor indica el motivo de la cancelación');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCancelar(reserva.id, motivoCancelacion);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar la reserva');
    } finally {
      setLoading(false);
    }
  };

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
                <h3 className="text-2xl font-bold text-gray-900">Detalle de Reserva</h3>
                <p className="text-sm text-gray-600">Información completa de la reserva</p>
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

          {/* Estado Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-lg ${estadoConfig.color}`}>
              <span className="text-xl">{estadoConfig.icon}</span>
              {estadoConfig.label}
            </span>
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Área */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">
                    {reserva.area?.nombre || 'Área no disponible'}
                  </h4>
                  {reserva.area?.descripcion && (
                    <p className="text-sm text-gray-600">{reserva.area.descripcion}</p>
                  )}
                  {reserva.area?.capacidad && (
                    <p className="text-sm text-gray-500 mt-1">
                      Capacidad: {reserva.area.capacidad} personas
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-blue-600" size={18} />
                  <span className="text-sm font-medium text-gray-700">Fecha</span>
                </div>
                <p className="text-gray-900 font-semibold capitalize">
                  {formatDate(reserva.inicio)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-blue-600" size={18} />
                  <span className="text-sm font-medium text-gray-700">Horario</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {formatTime(reserva.inicio)} - {formatTime(reserva.fin)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Duración: {getDuration()}
                </p>
              </div>
            </div>

            {/* Costo */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-green-600" size={20} />
                  <span className="text-gray-700 font-medium">Costo Total:</span>
                </div>
                <span className="text-2xl font-bold text-green-900">
                  {reserva.costo.toFixed(2)} Bs
                </span>
              </div>
            </div>

            {/* Solicitante */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="text-gray-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Solicitante</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="text-gray-400" size={16} />
                  <span className="text-gray-900 font-medium">
                    {reserva.usuarioNombre || 'Usuario no disponible'}
                  </span>
                </div>
                {reserva.usuarioEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-gray-600">{reserva.usuarioEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notas */}
            {reserva.notas && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="text-blue-600" size={18} />
                  <span className="text-sm font-medium text-gray-700">Notas</span>
                </div>
                <p className="text-gray-700">{reserva.notas}</p>
              </div>
            )}

            {/* Motivo de Cancelación */}
            {reserva.estado === 'CANCELLED' && reserva.motivoCancelacion && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-red-600" size={18} />
                  <span className="text-sm font-medium text-red-700">Motivo de Cancelación</span>
                </div>
                <p className="text-red-800">{reserva.motivoCancelacion}</p>
              </div>
            )}

            {/* Formulario de Cancelación */}
            {showCancelar && canCancel && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-yellow-600" size={18} />
                  <span className="text-sm font-medium text-yellow-800">
                    ¿Por qué deseas cancelar esta reserva?
                  </span>
                </div>
                <textarea
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Describe el motivo de la cancelación..."
                  rows={3}
                  className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-6 mt-6 border-t">
            {showCancelar ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCancelar(false);
                    setMotivoCancelacion('');
                    setError(null);
                  }}
                  fullWidth
                  disabled={loading}
                >
                  Volver
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleCancelar}
                  fullWidth
                  loading={loading}
                >
                  Confirmar Cancelación
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                >
                  Cerrar
                </Button>
                {canCancel && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setShowCancelar(true)}
                    fullWidth
                    icon={<Trash2 size={18} />}
                  >
                    Cancelar Reserva
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
