import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Users, Clock, DollarSign, MapPin, Calendar, 
  Plus, Edit, Power, PowerOff, Search, X
} from 'lucide-react';
import { Button, Spinner, ModalConfirm } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { areasComunesService, type AreaComun } from '../../services/areasComunesService';
import { AreaFormModal } from './AreaFormModal';

export default function AreasComunesPage() {
  const { user } = useAuth();
  const isAdmin = user?.roleName === 'admin';

  const [areas, setAreas] = useState<AreaComun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingArea, setEditingArea] = useState<AreaComun | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Estado para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [areaToToggle, setAreaToToggle] = useState<{ id: string; currentStatus: boolean } | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    loadAreas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = isAdmin 
        ? await areasComunesService.getAllAreas()
        : await areasComunesService.getActiveAreas();
      setAreas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar áreas comunes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setAreaToToggle({ id, currentStatus });
    setShowConfirmModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!areaToToggle) return;

    try {
      setToggleLoading(true);
      setError(null);
      await areasComunesService.toggleAreaStatus(areaToToggle.id, !areaToToggle.currentStatus);
      setSuccess(areaToToggle.currentStatus ? 'Área desactivada exitosamente' : 'Área activada exitosamente');
      await loadAreas();
      setTimeout(() => setSuccess(null), 3000);
      setShowConfirmModal(false);
      setAreaToToggle(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
    } finally {
      setToggleLoading(false);
    }
  };

  const handleEdit = (area: AreaComun) => {
    setEditingArea(area);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingArea(null);
    setShowModal(true);
  };

  const filteredAreas = areas.filter(area =>
    area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeAreas = areas.filter(a => a.activa).length;
  const totalCapacidad = areas.reduce((sum, a) => sum + a.capacidad, 0);
  const promedioCoste = areas.length > 0
    ? (areas.reduce((sum, a) => sum + a.costoHora, 0) / areas.length).toFixed(2)
    : '0';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Áreas Comunes</h1>
          <p className="text-gray-600 mt-2">
            Explora y reserva los espacios disponibles en el edificio
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/booking/reservas">
            <Button icon={<Calendar size={20} />}>
              Ver Reservas
            </Button>
          </Link>
          {isAdmin && (
            <Button variant="primary" icon={<Plus size={20} />} onClick={handleCreate}>
              Nueva Área
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Áreas</p>
              <p className="text-2xl font-bold text-gray-900">{areas.length}</p>
            </div>
            <Home size={32} className="text-blue-400" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Áreas Activas</p>
              <p className="text-2xl font-bold text-green-900">{activeAreas}</p>
            </div>
            <Power size={32} className="text-green-400" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Capacidad Total</p>
              <p className="text-2xl font-bold text-purple-900">{totalCapacidad}</p>
            </div>
            <Users size={32} className="text-purple-400" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg shadow p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Promedio/Hora</p>
              <p className="text-2xl font-bold text-orange-900">{promedioCoste} Bs</p>
            </div>
            <DollarSign size={32} className="text-orange-400" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X size={20} />
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar áreas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grid de áreas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <div
            key={area.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {/* Imagen */}
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
              {area.imagenes.length > 0 ? (
                <img
                  src={area.imagenes[0]}
                  alt={area.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(area.nombre);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home size={64} className="text-white opacity-50" />
                </div>
              )}
              
              {/* Badge de estado */}
              <div className="absolute top-3 right-3">
                {area.activa ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    Activa
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    Inactiva
                  </span>
                )}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{area.nombre}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {area.descripcion || 'Sin descripción disponible'}
              </p>

              {/* Información clave */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <Users size={16} className="mr-2 text-blue-500" />
                  <span>Capacidad: <strong>{area.capacidad} personas</strong></span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700">
                  <DollarSign size={16} className="mr-2 text-green-500" />
                  <span><strong>{area.costoHora} Bs/hora</strong></span>
                  {area.requiereEntrega && area.costoEntrega && (
                    <span className="ml-2 text-xs text-gray-500">
                      (+ {area.costoEntrega} Bs entrega)
                    </span>
                  )}
                </div>

                {area.horaApertura && area.horaCierre && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock size={16} className="mr-2 text-orange-500" />
                    <span>{area.horaApertura} - {area.horaCierre}</span>
                  </div>
                )}

                {area.requiereEntrega && (
                  <div className="flex items-center text-sm text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    <MapPin size={16} className="mr-2" />
                    <span>Requiere entrega de llaves</span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2">
                {area.activa ? (
                  <Link to={`/booking/reservas?area=${area.id}`} className="flex-1">
                    <Button variant="primary" fullWidth size="sm" icon={<Calendar size={16} />}>
                      Reservar
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" fullWidth size="sm" disabled>
                    No Disponible
                  </Button>
                )}

                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit size={16} />}
                      onClick={() => handleEdit(area)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={area.activa ? <PowerOff size={16} /> : <Power size={16} />}
                      onClick={() => handleToggleStatus(area.id, area.activa)}
                    >
                      {area.activa ? 'Des' : 'Act'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sin resultados */}
      {filteredAreas.length === 0 && (
        <div className="text-center py-12">
          <Home size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No se encontraron áreas comunes
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Intenta con otro término de búsqueda'
              : 'Aún no hay áreas comunes registradas'}
          </p>
        </div>
      )}

      {/* Modal de Crear/Editar Área */}
      {showModal && (
        <AreaFormModal
          area={editingArea}
          onClose={() => {
            setShowModal(false);
            setEditingArea(null);
          }}
          onSave={async () => {
            await loadAreas();
            setShowModal(false);
            setEditingArea(null);
            setSuccess(editingArea ? 'Área actualizada exitosamente' : 'Área creada exitosamente');
            setTimeout(() => setSuccess(null), 3000);
          }}
        />
      )}

      {/* Modal de Confirmación para Activar/Desactivar */}
      <ModalConfirm
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setAreaToToggle(null);
        }}
        onConfirm={confirmToggleStatus}
        title={areaToToggle?.currentStatus ? '¿Desactivar área?' : '¿Activar área?'}
        message={
          areaToToggle?.currentStatus
            ? 'Al desactivar esta área, los residentes no podrán verla ni hacer nuevas reservas.'
            : 'Al activar esta área, estará disponible para que los residentes puedan hacer reservas.'
        }
        type={areaToToggle?.currentStatus ? 'warning' : 'success'}
        confirmText={areaToToggle?.currentStatus ? 'Desactivar' : 'Activar'}
        cancelText="Cancelar"
        loading={toggleLoading}
      />
    </div>
  );
}
