import { Card, StatusBadge } from '../';
import { Calendar, Clock, MapPin, User, CreditCard } from 'lucide-react';
import type { Reserva } from '../../types/booking.types';

interface ReservaCardProps {
  reserva: Reserva;
  onClick?: () => void;
  showActions?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

export default function ReservaCard({ 
  reserva, 
  onClick,
  showActions = false,
  onConfirm,
  onCancel,
  onComplete,
}: ReservaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionButtons = () => {
    switch (reserva.estado) {
      case 'PENDING':
        return (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfirm?.();
              }}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Confirmar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel?.();
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancelar
            </button>
          </>
        );
      case 'CONFIRMED':
        return (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete?.();
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Completar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel?.();
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancelar
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      footer={
        <div className="flex justify-between items-center">
          <StatusBadge status={reserva.estado} />
          {showActions && (
            <div className="flex gap-2">
              {getActionButtons()}
            </div>
          )}
        </div>
      }
    >
      {/* Area Name */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">
          {reserva.area?.nombre || 'Área no especificada'}
        </h3>
      </div>

      {/* Date and Time */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span className="text-sm">
            {formatDate(reserva.inicio)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-sm">
            {formatTime(reserva.inicio)} - {formatTime(reserva.fin)}
          </span>
        </div>
      </div>

      {/* User Info */}
      {reserva.usuarioNombre && (
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm">{reserva.usuarioNombre}</span>
        </div>
      )}

      {/* Cost */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <CreditCard className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            Bs. {reserva.costo.toFixed(2)}
          </span>
        </div>
        {reserva.cantidadPersonas && (
          <span className="text-xs text-gray-500">
            {reserva.cantidadPersonas} personas
          </span>
        )}
      </div>

      {/* Event Details */}
      {reserva.motivoEvento && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Motivo:</strong> {reserva.motivoEvento}
          </p>
        </div>
      )}

      {/* Equipment */}
      {reserva.requiereEquipoAdicional && reserva.equipoSolicitado && (
        <div className="mt-2">
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Equipo: {reserva.equipoSolicitado}
          </span>
        </div>
      )}
    </Card>
  );
}
