import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../';
import type { Reserva, CreateReservaDto, UpdateReservaDto, AreaComun } from '../../types/booking.types';

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReservaDto | UpdateReservaDto) => Promise<void>;
  reserva?: Reserva;
  areas: AreaComun[];
  title?: string;
}

export default function ReservaModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  reserva,
  areas,
  title,
}: ReservaModalProps) {
  const [formData, setFormData] = useState<CreateReservaDto>({
    areaId: 0,
    inicio: '',
    fin: '',
    cantidadPersonas: 1,
    motivoEvento: '',
    notasEspeciales: '',
    requiereEquipoAdicional: false,
    equipoSolicitado: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reserva) {
      setFormData({
        areaId: reserva.areaId,
        inicio: reserva.inicio.slice(0, 16), // Format for datetime-local
        fin: reserva.fin.slice(0, 16),
        cantidadPersonas: reserva.cantidadPersonas || 1,
        motivoEvento: reserva.motivoEvento || '',
        notasEspeciales: reserva.notasEspeciales || '',
        requiereEquipoAdicional: reserva.requiereEquipoAdicional || false,
        equipoSolicitado: reserva.equipoSolicitado || '',
      });
    } else {
      // Reset form for new reservation
      setFormData({
        areaId: areas[0]?.id || 0,
        inicio: '',
        fin: '',
        cantidadPersonas: 1,
        motivoEvento: '',
        notasEspeciales: '',
        requiereEquipoAdicional: false,
        equipoSolicitado: '',
      });
    }
    setError(null);
  }, [reserva, areas, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.areaId) {
      setError('Debe seleccionar un área');
      return;
    }
    if (!formData.inicio || !formData.fin) {
      setError('Las fechas de inicio y fin son requeridas');
      return;
    }
    if (new Date(formData.inicio) >= new Date(formData.fin)) {
      setError('La fecha de fin debe ser posterior a la de inicio');
      return;
    }
    if (formData.cantidadPersonas && formData.cantidadPersonas < 1) {
      setError('La cantidad de personas debe ser al menos 1');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (reserva ? 'Editar Reserva' : 'Nueva Reserva')}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Área Común */}
          <div>
            <label htmlFor="areaId" className="block text-sm font-medium text-gray-700 mb-1">
              Área Común *
            </label>
            <select
              id="areaId"
              name="areaId"
              value={formData.areaId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccione un área</option>
              {areas.filter(a => a.activa).map(area => (
                <option key={area.id} value={area.id}>
                  {area.nombre} - Capacidad: {area.capacidad} - Bs. {area.costoHora}/hora
                </option>
              ))}
            </select>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="inicio" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora Inicio *
              </label>
              <input
                type="datetime-local"
                id="inicio"
                name="inicio"
                value={formData.inicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="fin" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora Fin *
              </label>
              <input
                type="datetime-local"
                id="fin"
                name="fin"
                value={formData.fin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Cantidad de Personas */}
          <div>
            <label htmlFor="cantidadPersonas" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de Personas
            </label>
            <input
              type="number"
              id="cantidadPersonas"
              name="cantidadPersonas"
              value={formData.cantidadPersonas}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Motivo del Evento */}
          <div>
            <label htmlFor="motivoEvento" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo del Evento
            </label>
            <input
              type="text"
              id="motivoEvento"
              name="motivoEvento"
              value={formData.motivoEvento}
              onChange={handleChange}
              placeholder="Ej: Reunión familiar, Cumpleaños, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Notas Especiales */}
          <div>
            <label htmlFor="notasEspeciales" className="block text-sm font-medium text-gray-700 mb-1">
              Notas Especiales
            </label>
            <textarea
              id="notasEspeciales"
              name="notasEspeciales"
              value={formData.notasEspeciales}
              onChange={handleChange}
              rows={3}
              placeholder="Requerimientos adicionales, consideraciones especiales, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Equipo Adicional */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiereEquipoAdicional"
                name="requiereEquipoAdicional"
                checked={formData.requiereEquipoAdicional}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="requiereEquipoAdicional" className="text-sm font-medium text-gray-700">
                Requiere equipo adicional
              </label>
            </div>

            {formData.requiereEquipoAdicional && (
              <input
                type="text"
                id="equipoSolicitado"
                name="equipoSolicitado"
                value={formData.equipoSolicitado}
                onChange={handleChange}
                placeholder="Especifique el equipo necesario"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        </div>

        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Guardando...' : reserva ? 'Actualizar' : 'Crear Reserva'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
