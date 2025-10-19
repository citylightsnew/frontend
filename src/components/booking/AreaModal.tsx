import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../';
import { Upload } from 'lucide-react';
import type { AreaComun, CreateAreaComunDto, UpdateAreaComunDto } from '../../types/booking.types';

interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAreaComunDto | UpdateAreaComunDto) => Promise<void>;
  area?: AreaComun;
  title?: string;
}

export default function AreaModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  area,
  title,
}: AreaModalProps) {
  const [formData, setFormData] = useState<CreateAreaComunDto>({
    nombre: '',
    descripcion: '',
    capacidad: 0,
    costoHora: 0,
    horarioInicio: '',
    horarioFin: '',
    requiereAprobacion: false,
    imagenes: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (area) {
      setFormData({
        nombre: area.nombre,
        descripcion: area.descripcion || '',
        capacidad: area.capacidad,
        costoHora: area.costoHora,
        horarioInicio: area.horarioInicio || '',
        horarioFin: area.horarioFin || '',
        requiereAprobacion: area.requiereAprobacion || false,
        imagenes: area.imagenes || [],
      });
    } else {
      // Reset form for new area
      setFormData({
        nombre: '',
        descripcion: '',
        capacidad: 0,
        costoHora: 0,
        horarioInicio: '',
        horarioFin: '',
        requiereAprobacion: false,
        imagenes: [],
      });
    }
    setError(null);
  }, [area, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (formData.capacidad <= 0) {
      setError('La capacidad debe ser mayor a 0');
      return;
    }
    if (formData.costoHora < 0) {
      setError('El costo no puede ser negativo');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el área');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (area ? 'Editar Área Común' : 'Nueva Área Común')}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Área *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Capacidad y Costo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad *
              </label>
              <input
                type="number"
                id="capacidad"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="costoHora" className="block text-sm font-medium text-gray-700 mb-1">
                Costo por Hora (Bs.) *
              </label>
              <input
                type="number"
                id="costoHora"
                name="costoHora"
                value={formData.costoHora}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="horarioInicio" className="block text-sm font-medium text-gray-700 mb-1">
                Horario Inicio *
              </label>
              <input
                type="time"
                id="horarioInicio"
                name="horarioInicio"
                value={formData.horarioInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="horarioFin" className="block text-sm font-medium text-gray-700 mb-1">
                Horario Fin *
              </label>
              <input
                type="time"
                id="horarioFin"
                name="horarioFin"
                value={formData.horarioFin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Imagen URL */}
          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
              URL de Imagen
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="imagen"
                name="imagen"
                value={formData.imagenes?.[0] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, imagenes: value ? [value] : [] }));
                }}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                title="Subir imagen"
              >
                <Upload className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Requiere Aprobación */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiereAprobacion"
              name="requiereAprobacion"
              checked={formData.requiereAprobacion}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="requiereAprobacion" className="text-sm font-medium text-gray-700">
              Requiere aprobación administrativa
            </label>
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
            {loading ? 'Guardando...' : area ? 'Actualizar' : 'Crear'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
