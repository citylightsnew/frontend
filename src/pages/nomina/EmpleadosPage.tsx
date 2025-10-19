import { useState } from 'react';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { Table, StatusBadge } from '../../components';
import { useEmpleados } from '../../hooks/useNomina';
import type { Empleado } from '../../types/nomina.types';

export default function EmpleadosPage() {
  const { empleados, loading, error, changeEstado } = useEmpleados();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'all' | 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO'>('all');
  const [filterDepartamento, setFilterDepartamento] = useState('all');

  const handleCreate = () => {
    // TODO: Open create modal
    alert('Funcionalidad de crear empleado en desarrollo');
  };

  const handleEdit = (empleado: Empleado) => {
    // TODO: Open edit modal
    console.log('Edit empleado:', empleado);
    alert('Funcionalidad de editar empleado en desarrollo');
  };

  const handleChangeEstado = async (id: string, nuevoEstado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO') => {
    if (confirm(`¿Cambiar el estado del empleado a ${nuevoEstado}?`)) {
      await changeEstado(id, nuevoEstado);
    }
  };

  const filteredEmpleados = empleados?.filter(empleado => {
    const matchesSearch = empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.documento.includes(searchTerm) ||
                         empleado.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'all' || empleado.estado === filterEstado;
    const matchesDepartamento = filterDepartamento === 'all' || empleado.departamento === filterDepartamento;
    
    return matchesSearch && matchesEstado && matchesDepartamento;
  });

  const departamentos = Array.from(new Set(empleados?.map(e => e.departamento) || []));

  const getEstadisticas = () => {
    if (!empleados) return { total: 0, activos: 0, inactivos: 0, suspendidos: 0 };
    
    return {
      total: empleados.length,
      activos: empleados.filter(e => e.estado === 'ACTIVO').length,
      inactivos: empleados.filter(e => e.estado === 'INACTIVO').length,
      suspendidos: empleados.filter(e => e.estado === 'SUSPENDIDO').length,
    };
  };

  const stats = getEstadisticas();

  const columns = [
    {
      key: 'documento',
      label: 'Documento',
      render: (_value: unknown, empleado: Empleado) => (
        <span className="font-mono text-sm">{empleado.documento}</span>
      ),
    },
    {
      key: 'nombre',
      label: 'Nombre Completo',
      render: (_value: unknown, empleado: Empleado) => (
        <div>
          <p className="font-medium text-gray-900">
            {empleado.nombre} {empleado.apellido}
          </p>
          <p className="text-xs text-gray-500">{empleado.email}</p>
        </div>
      ),
    },
    {
      key: 'cargo',
      label: 'Cargo',
      render: (_value: unknown, empleado: Empleado) => (
        <div>
          <p className="font-medium text-gray-900">{empleado.cargo}</p>
          <p className="text-xs text-gray-500">{empleado.departamento}</p>
        </div>
      ),
    },
    {
      key: 'salarioBase',
      label: 'Salario',
      render: (_value: unknown, empleado: Empleado) => (
        <span className="font-semibold text-green-700">
          Bs. {empleado.salarioBase.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_value: unknown, empleado: Empleado) => (
        <StatusBadge status={empleado.estado} />
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_value: unknown, empleado: Empleado) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(empleado);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Editar
          </button>
          {empleado.estado === 'ACTIVO' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleChangeEstado(empleado.id, 'INACTIVO');
              }}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              Desactivar
            </button>
          )}
          {empleado.estado === 'INACTIVO' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleChangeEstado(empleado.id, 'ACTIVO');
              }}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Activar
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Empleados</h1>
        <p className="text-gray-600">Gestiona la información de los empleados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-600" />
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <p className="text-sm text-gray-600">Total Empleados</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
          <p className="text-sm text-green-700">Activos</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-600">{stats.inactivos}</p>
          <p className="text-sm text-gray-700">Inactivos</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-red-600">{stats.suspendidos}</p>
          <p className="text-sm text-red-700">Suspendidos</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, CI o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as typeof filterEstado)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="INACTIVO">Inactivos</option>
              <option value="SUSPENDIDO">Suspendidos</option>
            </select>

            <select
              value={filterDepartamento}
              onChange={(e) => setFilterDepartamento(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los departamentos</option>
              {departamentos.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table
          data={filteredEmpleados as unknown as Record<string, unknown>[] || []}
          columns={columns as unknown as { key: string; label: string; render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode }[]}
          onRowClick={(row) => handleEdit(row as unknown as Empleado)}
          loading={loading}
          emptyMessage={
            searchTerm || filterEstado !== 'all' || filterDepartamento !== 'all'
              ? 'No se encontraron empleados con los filtros aplicados'
              : 'No hay empleados registrados. Comienza agregando uno nuevo.'
          }
          striped
          hoverable
        />
      </div>

      {/* Results Count */}
      {!loading && filteredEmpleados && filteredEmpleados.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Mostrando {filteredEmpleados.length} de {empleados?.length || 0} empleados
        </div>
      )}
    </div>
  );
}
