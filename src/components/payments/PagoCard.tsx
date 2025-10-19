import { Card, StatusBadge } from '../';
import { CreditCard, Calendar, User, Receipt, AlertCircle } from 'lucide-react';
import type { PagoReserva } from '../../types/payments.types';

interface PagoCardProps {
  pago: PagoReserva;
  onClick?: () => void;
  showActions?: boolean;
  onConfirm?: () => void;
  onRefund?: () => void;
  onDelete?: () => void;
}

export default function PagoCard({ 
  pago, 
  onClick,
  showActions = false,
  onConfirm,
  onRefund,
  onDelete,
}: PagoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMetodoPagoLabel = (metodo: string): string => {
    const labels: Record<string, string> = {
      EFECTIVO: 'Efectivo',
      TARJETA: 'Tarjeta',
      TRANSFERENCIA: 'Transferencia',
      QR: 'QR',
      STRIPE: 'Stripe',
    };
    return labels[metodo] || metodo;
  };

  const getMetodoPagoIcon = (metodo: string) => {
    switch (metodo) {
      case 'EFECTIVO':
        return '💵';
      case 'TARJETA':
      case 'STRIPE':
        return <CreditCard className="w-4 h-4" />;
      case 'TRANSFERENCIA':
        return '🏦';
      case 'QR':
        return '📱';
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getActionButtons = () => {
    switch (pago.estado) {
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
                onDelete?.();
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancelar
            </button>
          </>
        );
      case 'COMPLETED':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefund?.();
            }}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            Reembolsar
          </button>
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
          <StatusBadge status={pago.estado} />
          {showActions && (
            <div className="flex gap-2">
              {getActionButtons()}
            </div>
          )}
        </div>
      }
    >
      {/* Amount */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-green-600" />
          <h3 className="text-2xl font-bold text-green-700">
            Bs. {pago.monto.toFixed(2)}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-gray-700">
          {getMetodoPagoIcon(pago.metodoPago)}
          <span className="text-sm font-medium">
            {getMetodoPagoLabel(pago.metodoPago)}
          </span>
        </div>
      </div>

      {/* Reservation Info */}
      {pago.reservaArea && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900 font-medium">
            Reserva: {pago.reservaArea}
          </p>
          {pago.descripcion && (
            <p className="text-xs text-blue-700">
              {pago.descripcion}
            </p>
          )}
        </div>
      )}

      {/* User Info */}
      {pago.usuarioNombre && (
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm">{pago.usuarioNombre}</span>
        </div>
      )}

      {/* Payment Date */}
      <div className="flex items-center gap-2 text-gray-700 mb-3">
        <Calendar className="w-4 h-4 text-purple-600" />
        <span className="text-sm">
          {formatDate(pago.creadoEn)}
        </span>
      </div>

      {/* Transaction Reference */}
      {pago.stripeChargeId && (
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Charge:</strong> {pago.stripeChargeId.slice(0, 20)}...
          </p>
        </div>
      )}

      {/* Stripe Payment Intent */}
      {pago.stripePaymentIntentId && (
        <div className="mt-2">
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Stripe: {pago.stripePaymentIntentId.slice(0, 20)}...
          </span>
        </div>
      )}

      {/* Failed Status */}
      {pago.estado === 'FAILED' && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">
            Pago fallido. Por favor, intente nuevamente o contacte al soporte.
          </p>
        </div>
      )}

      {/* Refunded Status */}
      {pago.estado === 'REFUNDED' && pago.stripeRefundId && (
        <div className="mt-3 p-2 bg-orange-50 rounded-lg">
          <p className="text-xs text-orange-700">
            <strong>Reembolso:</strong> {pago.stripeRefundId}
          </p>
        </div>
      )}
    </Card>
  );
}
