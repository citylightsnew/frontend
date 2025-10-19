import { Card, StatusBadge } from '../';
import { Users, DollarSign, MapPin, Clock } from 'lucide-react';
import type { AreaComun } from '../../types/booking.types';

interface AreaCardProps {
  area: AreaComun;
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AreaCard({ 
  area, 
  onClick, 
  showActions = false,
  onEdit,
  onDelete 
}: AreaCardProps) {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      footer={
        <div className="flex justify-between items-center">
          <StatusBadge status={area.activa ? 'ACTIVO' : 'INACTIVO'} />
          {showActions && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      }
    >
      {/* Image placeholder */}
      {area.imagenes && area.imagenes.length > 0 ? (
        <img 
          src={area.imagenes[0]} 
          alt={area.nombre}
          className="w-full h-40 object-cover rounded-t-lg -mt-4 -mx-4 mb-4"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg -mt-4 -mx-4 mb-4 flex items-center justify-center">
          <MapPin className="w-12 h-12 text-blue-400" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {area.nombre}
      </h3>
      
      {/* Description */}
      {area.descripcion && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {area.descripcion}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm">
            Capacidad: <strong>{area.capacidad}</strong> personas
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm">
            <strong>Bs. {area.costoHora.toFixed(2)}</strong>/hora
          </span>
        </div>

        {area.horarioInicio && area.horarioFin && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm">
              {area.horarioInicio} - {area.horarioFin}
            </span>
          </div>
        )}
      </div>

      {/* Approval badge */}
      {area.requiereAprobacion && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            Requiere aprobación
          </span>
        </div>
      )}
    </Card>
  );
}
