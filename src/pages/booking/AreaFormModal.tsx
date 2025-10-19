import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import { areasComunesService, type AreaComun } from '../../services/areasComunesService';

interface AreaFormModalProps {
  area: AreaComun | null;
  onClose: () => void;
  onSave: () => void;
}

const DIAS_SEMANA = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' },
];

export const AreaFormModal: React.FC<AreaFormModalProps> = ({ area, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [costoHora, setCostoHora] = useState('');
  const [requiereEntrega, setRequiereEntrega] = useState(false);
  const [costoEntrega, setCostoEntrega] = useState('');
  const [horaApertura, setHoraApertura] = useState('08:00');
  const [horaCierre, setHoraCierre] = useState('20:00');
  const [diasDisponibles, setDiasDisponibles] = useState<string[]>([]);
  const [imagenes, setImagenes] = useState<string[]>(['']);

  // Cargar datos si es edición
  useEffect(() => {
    if (area) {
      setNombre(area.nombre);
      setDescripcion(area.descripcion || '');
      setCapacidad(area.capacidad.toString());
      setCostoHora(area.costoHora.toString());
      setRequiereEntrega(area.requiereEntrega);
      setCostoEntrega(area.costoEntrega?.toString() || '');
      setHoraApertura(area.horaApertura || '08:00');
      setHoraCierre(area.horaCierre || '20:00');
      setDiasDisponibles(area.diasDisponibles || []);
      setImagenes(area.imagenes && area.imagenes.length > 0 ? area.imagenes : ['']);
    }
  }, [area]);

  // Validación
  const validateForm = (): string | null => {
    if (!nombre.trim()) return 'El nombre es requerido';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    
    const capacidadNum = parseInt(capacidad);
    if (isNaN(capacidadNum) || capacidadNum <= 0) {
      return 'La capacidad debe ser un número positivo';
    }
    
    const costoHoraNum = parseFloat(costoHora);
    if (isNaN(costoHoraNum) || costoHoraNum < 0) {
      return 'El costo por hora debe ser un número positivo o cero';
    }
    
    if (requiereEntrega) {
      const costoEntregaNum = parseFloat(costoEntrega);
      if (isNaN(costoEntregaNum) || costoEntregaNum <= 0) {
        return 'El costo de entrega es requerido cuando se requiere entrega';
      }
    }
    
    if (!horaApertura || !horaCierre) {
      return 'Las horas de apertura y cierre son requeridas';
    }
    
    if (horaApertura >= horaCierre) {
      return 'La hora de cierre debe ser posterior a la hora de apertura';
    }
    
    if (diasDisponibles.length === 0) {
      return 'Debe seleccionar al menos un día disponible';
    }
    
    return null;
  };

  // Manejar días disponibles
  const toggleDia = (dia: string) => {
    setDiasDisponibles(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  // Manejar imágenes
  const updateImagen = (index: number, value: string) => {
    const newImagenes = [...imagenes];
    newImagenes[index] = value;
    setImagenes(newImagenes);
  };

  const addImagen = () => {
    setImagenes([...imagenes, '']);
  };

  const removeImagen = (index: number) => {
    if (imagenes.length > 1) {
      setImagenes(imagenes.filter((_, i) => i !== index));
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        capacidad: parseInt(capacidad),
        costoHora: parseFloat(costoHora),
        requiereEntrega,
        costoEntrega: requiereEntrega ? parseFloat(costoEntrega) : undefined,
        horaApertura,
        horaCierre,
        diasDisponibles,
        imagenes: imagenes.filter(img => img.trim() !== ''),
      };

      if (area) {
        // Actualizar área existente
        await areasComunesService.updateArea(area.id, formData);
      } else {
        // Crear nueva área
        await areasComunesService.createArea(formData);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el área');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {area ? 'Editar Área Común' : 'Nueva Área Común'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Salón de Eventos"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción detallada del área..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad (personas) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50"
                  required
                />
              </div>
            </div>

            {/* Costos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Costos</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo por Hora ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={costoHora}
                  onChange={(e) => setCostoHora(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50.00"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requiereEntrega"
                  checked={requiereEntrega}
                  onChange={(e) => setRequiereEntrega(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="requiereEntrega" className="ml-2 text-sm font-medium text-gray-700">
                  Requiere pago de entrega
                </label>
              </div>

              {requiereEntrega && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo de Entrega ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={costoEntrega}
                    onChange={(e) => setCostoEntrega(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100.00"
                    required={requiereEntrega}
                  />
                </div>
              )}
            </div>

            {/* Horarios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Horarios de Disponibilidad</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Apertura <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={horaApertura}
                    onChange={(e) => setHoraApertura(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de Cierre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={horaCierre}
                    onChange={(e) => setHoraCierre(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Disponibles <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DIAS_SEMANA.map((dia) => (
                    <label
                      key={dia.value}
                      className={`flex items-center justify-center px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                        diasDisponibles.includes(dia.value)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={diasDisponibles.includes(dia.value)}
                        onChange={() => toggleDia(dia.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{dia.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Imágenes</h3>
              <p className="text-sm text-gray-600">
                Ingresa las URLs de las imágenes del área común
              </p>
              
              <div className="space-y-3">
                {imagenes.map((imagen, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={imagen}
                        onChange={(e) => updateImagen(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    {imagenes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImagen(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addImagen}
                icon={<Upload size={16} />}
              >
                Agregar Imagen
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : area ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
