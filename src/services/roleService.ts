import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../types';
import type { ApiErrorResponse } from '../types';

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface PaginatedRolesResponse {
  data: Role[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

class RoleService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login?expired=true';
        }
        return Promise.reject(error);
      }
    );
  }

  async getAllRoles(): Promise<PaginatedRolesResponse> {
    try {
      const response: AxiosResponse<Role[]> = await this.api.get('/roles');
      
      return {
        data: response.data,
        meta: {
          total: response.data.length,
          page: 1,
          lastPage: 1
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRoleById(id: string): Promise<Role> {
    try {
      const response: AxiosResponse<Role> = await this.api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    try {
      const response: AxiosResponse<Role> = await this.api.post('/roles', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    try {
      const response: AxiosResponse<Role> = await this.api.patch(`/roles/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteRole(id: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        const apiError = error.response.data as ApiErrorResponse;
        return new Error(apiError.message || 'Error en el servidor');
      }

      if (error.code === 'ECONNABORTED') {
        return new Error('Tiempo de espera agotado. Verifica tu conexión.');
      }

      if (!error.response) {
        return new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
      }

      return new Error(`Error ${error.response.status}: ${error.response.statusText}`);
    }

    return error instanceof Error ? error : new Error('Error desconocido');
  }
}

export const roleService = new RoleService();
export default roleService;
