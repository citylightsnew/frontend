export interface Edificio {
  id: string
  nombre: string
  direccion: string
  totalPisos: number
  totalHabitaciones: number
  totalGarajes: number
  descripcion?: string
  createdAt: string
  updatedAt: string
  _count?: {
    habitaciones: number
    garajes: number
  }
}

export interface CreateEdificioDto {
  nombre: string
  direccion: string
  totalPisos: number
  totalHabitaciones: number
  totalGarajes: number
  descripcion?: string
}

export interface UpdateEdificioDto {
  nombre?: string
  direccion?: string
  totalPisos?: number
  totalHabitaciones?: number
  totalGarajes?: number
  descripcion?: string
}

export interface EstadisticasEdificio {
  edificio: {
    id: string
    nombre: string
    totalPisos: number
    totalHabitaciones: number
    totalGarajes: number
  }
  habitaciones: {
    total: number
    ocupadas: number
    disponibles: number
    porcentajeOcupacion: number
  }
  garajes: {
    total: number
    ocupados: number
    disponibles: number
    porcentajeOcupacion: number
  }
}

export interface Habitacion {
  id: string
  numero: string
  piso: number
  edificioId: string
  edificio?: Edificio
  area?: number
  dormitorios: number
  banos: number
  precio: number
  estado: 'disponible' | 'ocupada' | 'mantenimiento'
  descripcion?: string
  createdAt: string
  updatedAt: string
  usuario?: {
    id: string
    name: string
    email: string
    telephone?: string
  }
  garajes?: Garaje[]
  _count?: {
    garajes: number
  }
}

export interface CreateHabitacionDto {
  numero: string
  piso: number
  edificioId: string
  area?: number
  dormitorios?: number
  banos?: number
  estado?: 'disponible' | 'ocupada' | 'mantenimiento'
  descripcion?: string
}

export interface UpdateHabitacionDto {
  numero?: string
  piso?: number
  area?: number
  dormitorios?: number
  banos?: number
  estado?: 'disponible' | 'ocupada' | 'mantenimiento'
  descripcion?: string
}

export interface AsignarUsuarioDto {
  habitacionId: string
  usuarioId: string
}

export interface Garaje {
  id: string
  numero: string
  piso: number
  edificioId: string
  edificio?: Edificio
  habitacionId?: string
  habitacion?: Habitacion
  usuarioId?: string
  usuario?: {
    id: string
    name: string
    email: string
    telephone?: string
  }
  precio: number
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'reservado'
  descripcion?: string
  createdAt: string
  updatedAt: string
}

export interface CreateGarajeDto {
  numero: string
  piso?: number
  edificioId: string
  habitacionId?: string
  estado?: 'disponible' | 'ocupado' | 'mantenimiento' | 'reservado'
  descripcion?: string
}

export interface UpdateGarajeDto {
  numero?: string
  piso?: number
  habitacionId?: string
  estado?: 'disponible' | 'ocupado' | 'mantenimiento' | 'reservado'
  descripcion?: string
}

export interface AsignarGarajeDto {
  garajeId: string
  usuarioId?: string
  habitacionId?: string
}
