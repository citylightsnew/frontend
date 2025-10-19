import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { AreaCard, AreaModal } from '../../components';
import { useAreasComunes } from '../../hooks/useBooking';
import type { AreaComun, CreateAreaComunDto, UpdateAreaComunDto } from '../../types/booking.types';

export default function AreasPage() {
  const { areas, loading, error, createArea, updateArea, deleteArea } = useAreasComunes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaComun | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const handleCreate = () => {
    setSelectedArea(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (area: AreaComun) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateAreaComunDto | UpdateAreaComunDto) => {
    if (selectedArea) {
      await updateArea(selectedArea.id, data as UpdateAreaComunDto);
    } else {
      await createArea(data as CreateAreaComunDto);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta área común?')) {
      await deleteArea(id);
    }
  };

  const filteredAreas = areas?.filter(area => {
    const matchesSearch = area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && area.activa) ||
                         (filterActive === 'inactive' && !area.activa);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Áreas Comunes</h1>
        <p className="text-gray-600">Gestiona las áreas comunes disponibles para reserva</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar áreas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Área
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAreas?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay áreas comunes</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterActive !== 'all' 
              ? 'No se encontraron áreas con los filtros aplicados'
              : 'Comienza creando tu primera área común'}
          </p>
          {!searchTerm && filterActive === 'all' && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Área
            </button>
          )}
        </div>
      )}

      {/* Areas Grid */}
      {!loading && filteredAreas && filteredAreas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onClick={() => handleEdit(area)}
              showActions
              onEdit={() => handleEdit(area)}
              onDelete={() => handleDelete(area.id)}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && areas && areas.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{areas.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {areas.filter(a => a.activa).length}
              </p>
              <p className="text-sm text-gray-600">Activas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {areas.filter(a => !a.activa).length}
              </p>
              <p className="text-sm text-gray-600">Inactivas</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <AreaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        area={selectedArea}
      />
    </div>
  );
}
