import { useState } from 'react';
import { X, Calendar, Clock, DollarSign, User, Mail, CheckCircle, XCircle, AlertCircle, MapPin } from 'lucide-react';
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
  area?: {
    id: string;
    nombre: string;
    descripcion?: string;
    capacidad: number;
  };
}

interface ModalAprobarReservaProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: Reserva | null;
  onAprobar: (id: string) => Promise<void>;
  onRechazar: (id: string, motivo: string) => Promise<void>;
}

export default function ModalAprobarReserva({
  isOpen,
  onClose,
  reserva,
  onAprobar,
  onRechazar,
}: ModalAprobarReservaProps) {
  const [accion, setAccion] = useState<'aprobar' | 'rechazar' | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !reserva) return null;

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

  const handleAprobar = async () => {
    try {
      setLoading(true);
      setError(null);
      await onAprobar(reserva.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      setError('Por favor indica el motivo del rechazo');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onRechazar(reserva.id, motivoRechazo);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAccion(null);
    setMotivoRechazo('');
    setError(null);
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Aprobar Reserva</h3>
                <p className="text-sm text-gray-600">Revisa y gestiona la solicitud</p>
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

          {/* Estado Pendiente Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-yellow-100 text-yellow-800 border-yellow-300 font-medium text-lg">
              <span className="text-xl">⏳</span>
              Pendiente de Aprobación
            </span>
          </div>

          {/* Información de la Reserva */}
          <div className="space-y-4">
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

            {/* Notas del Solicitante */}
            {reserva.notas && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-blue-600" size={18} />
                  <span className="text-sm font-medium text-gray-700">Notas del Solicitante</span>
                </div>
                <p className="text-gray-700">{reserva.notas}</p>
              </div>
            )}

            {/* Formulario de Rechazo */}
            {accion === 'rechazar' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="text-red-600" size={18} />
                  <span className="text-sm font-medium text-red-800">
                    Motivo del rechazo
                  </span>
                </div>
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Explica por qué se rechaza esta reserva..."
                  rows={3}
                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  autoFocus
                />
                <p className="text-xs text-red-600 mt-2">
                  Este mensaje será enviado al solicitante
                </p>
              </div>
            )}

            {/* Confirmación de Aprobación */}
            {accion === 'aprobar' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-sm font-medium text-green-800">
                    ¿Confirmar aprobación?
                  </span>
                </div>
                <p className="text-green-700 text-sm">
                  La reserva será confirmada y el solicitante recibirá una notificación.
                  Se procederá con el proceso de pago.
                </p>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-6 mt-6 border-t">
            {accion === null ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                >
                  Cerrar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setAccion('rechazar')}
                  fullWidth
                  icon={<XCircle size={18} />}
                >
                  Rechazar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setAccion('aprobar')}
                  fullWidth
                  icon={<CheckCircle size={18} />}
                >
                  Aprobar
                </Button>
              </>
            ) : accion === 'aprobar' ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  fullWidth
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAprobar}
                  fullWidth
                  loading={loading}
                  icon={<CheckCircle size={18} />}
                >
                  Confirmar Aprobación
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  fullWidth
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleRechazar}
                  fullWidth
                  loading={loading}
                  icon={<XCircle size={18} />}
                >
                  Confirmar Rechazo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
