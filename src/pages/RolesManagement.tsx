import { useState, useEffect } from 'react';
import { Button, Alert, Input, Spinner } from '../components';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { roleService, type Role, type CreateRoleRequest, type UpdateRoleRequest } from '../services/roleService';

export default function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  
  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: '',
    description: '',
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roleService.getAllRoles();
      setRoles(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (role: Role) => {
    setModalMode('edit');
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (modalMode === 'create') {
        await roleService.createRole(formData);
        setSuccess('Rol creado exitosamente');
      } else if (selectedRole) {
        const updateData: UpdateRoleRequest = {
          name: formData.name,
          description: formData.description,
        };
        
        await roleService.updateRole(selectedRole.id, updateData);
        setSuccess('Rol actualizado exitosamente');
      }
      
      handleCloseModal();
      await loadRoles();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar rol');
    }
  };

  const handleOpenDeleteModal = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setRoleToDelete(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setError(null);
      setSuccess(null);
      await roleService.deleteRole(roleToDelete.id);
      setSuccess('Rol eliminado exitosamente');
      handleCloseDeleteModal();
      await loadRoles();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar rol');
      handleCloseDeleteModal();
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Roles</h2>
          <p className="text-gray-600 mt-1">Administra los roles del sistema</p>
        </div>
        <Button onClick={handleOpenCreateModal} icon={<Plus size={20} />}>
          Nuevo Rol
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} className="mb-4" />
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron roles
          </div>
        ) : (
          filteredRoles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              
              {role.createdAt && (
                <p className="text-xs text-gray-400 mb-4">
                  Creado: {new Date(role.createdAt).toLocaleDateString('es-ES')}
                </p>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEditModal(role)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar rol"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(role)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar rol"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'create' ? 'Crear Rol' : 'Editar Rol'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del rol
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ej: admin, user, moderator"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe los permisos y responsabilidades de este rol"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="submit" fullWidth>
                  {modalMode === 'create' ? 'Crear' : 'Guardar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal} fullWidth>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && roleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              ¿Eliminar rol?
            </h3>
            
            <p className="text-sm text-gray-600 text-center mb-4">
              Esta acción no se puede deshacer. Se eliminará permanentemente este rol del sistema.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-red-900 mb-1">⚠️ Advertencia</p>
              <p className="text-xs text-red-700">
                Los usuarios que tengan este rol asignado podrían quedar sin acceso o perder sus permisos.
              </p>
            </div>

            {/* Información del rol a eliminar */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 mb-1">{roleToDelete.name}</p>
                <p className="text-xs text-gray-600">{roleToDelete.description}</p>
              </div>
              {roleToDelete.createdAt && (
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Creado:</span>{' '}
                  {new Date(roleToDelete.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleConfirmDelete} 
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Sí, eliminar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCloseDeleteModal}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
