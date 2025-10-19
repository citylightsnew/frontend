import { useState, useEffect } from 'react';
import { Button, Alert, Input, Spinner } from '../components';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { userService } from '../services/userService';
import { roleService, type Role } from '../services/roleService';
import type { User } from '../types';
import type { CreateUserRequest, UpdateUserRequest } from '../services/userService';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    password: '',
    telephone: '',
    roleId: '',
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<'todos' | 'superusuario' | 'trabajador' | 'residente'>('todos');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersResponse, rolesResponse] = await Promise.all([
        userService.getAllUsers(),
        roleService.getAllRoles(),
      ]);

      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
    } catch (err) {
      console.error('❌ Error al cargar datos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      telephone: '',
      roleId: roles.length > 0 ? roles[0].id : '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      telephone: user.telephone || '',
      roleId: user.role?.id || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (modalMode === 'create') {
        await userService.createUser(formData);
        setSuccess('Usuario creado exitosamente');
      } else if (selectedUser) {
        const updateData: UpdateUserRequest = {
          name: formData.name,
          email: formData.email,
          telephone: formData.telephone,
          roleId: formData.roleId,
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await userService.updateUser(selectedUser.id, updateData);
        setSuccess('Usuario actualizado exitosamente');
      }
      
      handleCloseModal();
      await loadData();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar usuario');
    }
  };

  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setError(null);
      setSuccess(null);
      await userService.deleteUser(userToDelete.id);
      setSuccess('Usuario eliminado exitosamente');
      handleCloseDeleteModal();
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      handleCloseDeleteModal();
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = categoriaFilter === 'todos' || 
      user.role?.categoria === categoriaFilter;
    
    return matchesSearch && matchesCategoria;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  const stats = {
    total: users.length,
    superusuarios: users.filter(u => u.role?.categoria === 'superusuario').length,
    trabajadores: users.filter(u => u.role?.categoria === 'trabajador').length,
    residentes: users.filter(u => u.role?.categoria === 'residente').length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <Button onClick={handleOpenCreateModal} icon={<Plus size={20} />}>
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Superusuarios</p>
              <p className="text-2xl font-bold text-purple-900">{stats.superusuarios}</p>
            </div>
            <div className="text-3xl">👑</div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Trabajadores</p>
              <p className="text-2xl font-bold text-blue-900">{stats.trabajadores}</p>
            </div>
            <div className="text-3xl">👷</div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Residentes</p>
              <p className="text-2xl font-bold text-green-900">{stats.residentes}</p>
            </div>
            <div className="text-3xl">🏠</div>
          </div>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} className="mb-4" />
      )}

      <div className="mb-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="w-64">
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value as 'todos' | 'superusuario' | 'trabajador' | 'residente')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="todos">📋 Todos los usuarios</option>
            <option value="superusuario">👑 Superusuarios</option>
            <option value="trabajador">👷 Trabajadores</option>
            <option value="residente">🏠 Residentes</option>
          </select>
        </div>
      </div>

      {(searchTerm || categoriaFilter !== 'todos') && (
        <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span className="font-medium">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </span>
            {searchTerm && (
              <span className="text-blue-600">
                • Búsqueda: "{searchTerm}"
              </span>
            )}
            {categoriaFilter !== 'todos' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {categoriaFilter === 'superusuario' && '👑 Superusuarios'}
                {categoriaFilter === 'trabajador' && '👷 Trabajadores'}
                {categoriaFilter === 'residente' && '🏠 Residentes'}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoriaFilter('todos');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.roleName}
                        </span>
                        {user.role?.categoria && (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role.categoria === 'superusuario' ? 'bg-purple-100 text-purple-700' :
                            user.role.categoria === 'trabajador' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role.categoria === 'superusuario' ? 'Superusuario' :
                             user.role.categoria === 'trabajador' ? 'Trabajador' :
                             'Residente'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.telephone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.emailVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.emailVerified ? 'Verificado' : 'No verificado'}
                        </span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.twoFactorEnabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.twoFactorEnabled ? '2FA ✓' : '2FA ✗'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar usuario"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
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
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {modalMode === 'create' ? (
                    <>Contraseña <span className="text-red-500">*</span></>
                  ) : (
                    'Nueva contraseña (opcional)'
                  )}
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={modalMode === 'create' ? 'Mínimo 6 caracteres' : 'Dejar vacío para no cambiar'}
                  required={modalMode === 'create'}
                />
                {modalMode === 'edit' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Solo completa este campo si deseas cambiar la contraseña
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+591 12345678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Seleccionar rol...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Define los permisos y accesos del usuario
                </p>
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

      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              ¿Eliminar usuario?
            </h3>
            
            <p className="text-sm text-gray-600 text-center mb-4">
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario del sistema.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold">
                    {userToDelete.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{userToDelete.name}</p>
                  <p className="text-xs text-gray-500">{userToDelete.email}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="font-medium">Rol:</span> {userToDelete.roleName}</p>
                {userToDelete.telephone && (
                  <p><span className="font-medium">Teléfono:</span> {userToDelete.telephone}</p>
                )}
              </div>
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
