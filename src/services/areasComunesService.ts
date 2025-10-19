import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../types';

export interface AreaComun {
  id: string;
  nombre: string;
  descripcion: string | null;
  capacidad: number;
  costoHora: number;
  activa: boolean;
  requiereEntrega: boolean;
  costoEntrega: number | null;
  horaApertura: string | null;
  horaCierre: string | null;
  diasDisponibles: string[];
  imagenes: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateAreaComunRequest {
  nombre: string;
  descripcion?: string;
  capacidad: number;
  costoHora: number;
  requiereEntrega?: boolean;
  costoEntrega?: number;
  horaApertura?: string;
  horaCierre?: string;
  diasDisponibles?: string[];
  imagenes?: string[];
}

export interface UpdateAreaComunRequest extends Partial<CreateAreaComunRequest> {
  activa?: boolean;
}

class AreasComunesService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/booking`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getAllAreas(): Promise<AreaComun[]> {
    const response = await this.api.get<AreaComun[]>('/areas?includeInactive=true');
    return response.data;
  }

  async getActiveAreas(): Promise<AreaComun[]> {
    const response = await this.api.get<AreaComun[]>('/areas');
    return response.data;
  }

  async getAreaById(id: string): Promise<AreaComun> {
    const response = await this.api.get<AreaComun>(`/areas/${id}`);
    return response.data;
  }

  async createArea(data: CreateAreaComunRequest): Promise<AreaComun> {
    const response = await this.api.post<AreaComun>('/areas', data);
    return response.data;
  }

  async updateArea(id: string, data: UpdateAreaComunRequest): Promise<AreaComun> {
    const response = await this.api.put<AreaComun>(`/areas/${id}`, data);
    return response.data;
  }

  async deleteArea(id: string): Promise<void> {
    await this.api.delete(`/areas/${id}`);
  }

  async toggleAreaStatus(id: string, activa: boolean): Promise<AreaComun> {
    const response = await this.api.put<AreaComun>(`/areas/${id}`, { activa });
    return response.data;
  }

  async checkAvailability(areaId: string, inicio: string, fin: string): Promise<boolean> {
    const response = await this.api.get<{ disponible: boolean }>(
      `/areas/${areaId}/disponibilidad`,
      { params: { inicio, fin } }
    );
    return response.data.disponible;
  }
}

export const areasComunesService = new AreasComunesService();
