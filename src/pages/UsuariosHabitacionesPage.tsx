import { useState, useEffect } from 'react'
import { Home, Car, User, AlertCircle, Users } from 'lucide-react'
import { AsignarHabitacionModal } from '../components/AsignarHabitacionModal'
import Button from '../components/Button'
import { apiService } from '../services/api'
import { useEdificio } from '../hooks/useEdificio'

interface Usuario {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  habitacionId?: string
  habitacion?: {
    id: string
    numero: string
    piso: number
    edificio: {
      nombre: string
    }
  }
  garajes?: Array<{
    id: string
    numero: string
    piso: number
  }>
}

export default function UsuariosHabitacionesPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    conHabitacion: 0,
    sinHabitacion: 0,
    conGaraje: 0,
  })

  const { asignarUsuario, desasignarUsuario, asignarGaraje, desasignarGaraje } = useEdificio()

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    setLoading(true)
    try {
      const usuariosData = await apiService.get<Usuario[]>('/api/users')

      setUsuarios(usuariosData)

      const total = usuariosData.length
      const conHabitacion = usuariosData.filter((u: Usuario) => u.habitacionId).length
      const sinHabitacion = total - conHabitacion
      const conGaraje = usuariosData.filter((u: Usuario) => u.garajes && u.garajes.length > 0).length

      setEstadisticas({
        total,
        conHabitacion,
        sinHabitacion,
        conGaraje,
      })
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAsignar = (usuario: Usuario) => {
    setSelectedUsuario(usuario)
    setShowModal(true)
  }

  const handleConfirmarAsignacion = async (habitacionId: string, garajesIds: string[]) => {
    if (!selectedUsuario) return

    try {
      if (selectedUsuario.habitacionId && selectedUsuario.habitacionId !== habitacionId) {
        await desasignarUsuario(selectedUsuario.habitacionId)
      }

      await asignarUsuario({
        habitacionId,
        usuarioId: selectedUsuario.id,
      })

      if (selectedUsuario.garajes && selectedUsuario.garajes.length > 0) {
        await Promise.all(
          selectedUsuario.garajes.map((garaje) => desasignarGaraje(garaje.id))
        )
      }

      if (garajesIds.length > 0) {
        await Promise.all(
          garajesIds.map((garajeId) =>
            asignarGaraje({
              garajeId,
              usuarioId: selectedUsuario.id,
            })
          )
        )
      }

      await loadUsuarios()
      setShowModal(false)
      setSelectedUsuario(null)
    } catch (error) {
      console.error('Error al asignar:', error)
      alert('Error al asignar habitación y garajes. Por favor intente nuevamente.')
    }
  }

  const handleDesasignar = async (usuario: Usuario) => {
    if (!confirm(`¿Está seguro que desea desasignar la habitación de ${usuario.nombre} ${usuario.apellido}?`)) {
      return
    }

    try {
      if (usuario.garajes && usuario.garajes.length > 0) {
        await Promise.all(
          usuario.garajes.map((garaje) => desasignarGaraje(garaje.id))
        )
      }

      if (usuario.habitacionId) {
        await desasignarUsuario(usuario.habitacionId)
      }

      await loadUsuarios()
    } catch (error) {
      console.error('Error al desasignar:', error)
      alert('Error al desasignar. Por favor intente nuevamente.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          Gestión de Habitaciones y Garajes
        </h2>
        <p className="text-gray-600 mt-1">
          Asigna habitaciones y garajes a los residentes del edificio
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
              </div>
              <User className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Con Habitación</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.conHabitacion}</p>
              </div>
              <Home className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sin Habitación</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.sinHabitacion}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Con Garaje</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.conGaraje}</p>
              </div>
              <Car className="w-10 h-10 text-blue-400" />
            </div>
          </div>
        </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Habitación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Garajes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.email}</div>
                      {usuario.telefono && (
                        <div className="text-sm text-gray-500">{usuario.telefono}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.habitacion ? (
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Hab. {usuario.habitacion.numero}
                            </div>
                            <div className="text-xs text-gray-500">
                              Piso {usuario.habitacion.piso} • {usuario.habitacion.edificio.nombre}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Sin asignar</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.garajes && usuario.garajes.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-blue-600" />
                          <div className="text-sm text-gray-900">
                            {usuario.garajes.map((g) => g.numero).join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin garaje</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAsignar(usuario)}
                          size="sm"
                          variant={usuario.habitacion ? 'outline' : 'primary'}
                        >
                          {usuario.habitacion ? 'Cambiar' : 'Asignar'}
                        </Button>
                        {usuario.habitacion && (
                          <Button
                            onClick={() => handleDesasignar(usuario)}
                            size="sm"
                            variant="outline"
                          >
                            Desasignar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUsuario && (
        <AsignarHabitacionModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedUsuario(null)
          }}
          onConfirm={handleConfirmarAsignacion}
          usuarioNombre={`${selectedUsuario.nombre} ${selectedUsuario.apellido}`}
          habitacionActual={
            selectedUsuario.habitacion
              ? {
                  id: selectedUsuario.habitacion.id,
                  numero: selectedUsuario.habitacion.numero,
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
