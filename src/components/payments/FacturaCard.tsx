import { Card, StatusBadge } from '../';
import { FileText, User, Calendar, Download, XCircle, AlertCircle } from 'lucide-react';
import type { Factura } from '../../types/payments.types';

interface FacturaCardProps {
  factura: Factura;
  onClick?: () => void;
  showActions?: boolean;
  onDownload?: () => void;
  onAnular?: () => void;
}

export default function FacturaCard({ 
  factura, 
  onClick,
  showActions = false,
  onDownload,
  onAnular,
}: FacturaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTotalItems = (): number => {
    return factura.items?.length || 0;
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      footer={
        <div className="flex justify-between items-center">
          <StatusBadge status={factura.estado} />
          {showActions && (
            <div className="flex gap-2">
              {factura.estado === 'EMITIDA' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload?.();
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnular?.();
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Anular
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      }
    >
      {/* Header with Invoice Number */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Factura N° {factura.numeroFactura}
          </h3>
        </div>
        {factura.estado === 'ANULADA' && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
            ANULADA
          </span>
        )}
      </div>

      {/* Customer Info */}
      <div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-600" />
          <p className="text-sm font-medium text-gray-900">
            {factura.razonSocial}
          </p>
        </div>
        
        <p className="text-xs text-gray-600 ml-6">
          NIT: {factura.nit}
        </p>
      </div>

      {/* Amount and Date */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-green-700">
            Bs. {factura.monto.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {factura.literal}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-1">Fecha de Emisión</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            <p className="text-sm font-medium text-gray-900">
              {formatDate(factura.fechaEmision)}
            </p>
          </div>
        </div>
      </div>

      {/* Items Summary */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-600">
            <strong>Items:</strong> {getTotalItems()}
          </p>
          <p className="text-xs text-gray-600">
            <strong>Autorización:</strong> {factura.autorizacion}
          </p>
        </div>

        {factura.items && factura.items.length > 0 && (
          <div className="space-y-1">
            {factura.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-xs text-gray-700">
                <span className="truncate flex-1">
                  {item.descripcion} x{item.cantidad}
                </span>
                <span className="font-medium ml-2">
                  Bs. {item.total.toFixed(2)}
                </span>
              </div>
            ))}
            {factura.items.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{factura.items.length - 2} más
              </p>
            )}
          </div>
        )}
      </div>

      {/* QR Code */}
      {factura.qrFiscal && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-center">
          <div className="text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded">
            📱 QR Fiscal disponible
          </div>
        </div>
      )}

      {/* Payment Info */}
      {(factura.pagoReservaId || factura.pagoDanoId) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Pago ID:</strong> {factura.pagoReservaId || factura.pagoDanoId}
          </p>
        </div>
      )}

      {/* Anulada Warning */}
      {factura.estado === 'ANULADA' && factura.motivoAnulacion && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-900">Motivo de anulación:</p>
            <p className="text-xs text-red-700">{factura.motivoAnulacion}</p>
            {factura.anuladaEn && (
              <p className="text-xs text-red-600 mt-1">
                Anulada el: {formatDate(factura.anuladaEn)}
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
