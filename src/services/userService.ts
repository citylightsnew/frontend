import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../types';
import type { User, ApiErrorResponse } from '../types';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  roleId: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  telephone?: string;
  roleId?: string;
  twoFactorEnabled?: boolean;
  verified?: boolean;
}

export interface PaginatedUsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

class UserService {
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

  async getAllUsers(): Promise<PaginatedUsersResponse> {
    try {
      const response: AxiosResponse<User[]> = await this.api.get('/users');
      
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

  async getUserById(id: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.post('/users', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      const response: AxiosResponse<User> = await this.api.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.api.delete(`/users/${id}`);
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

export const userService = new UserService();
export default userService;
