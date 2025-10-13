import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import {
  API_BASE_URL,
} from '../types';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  Verify2FARequest,
  Check2FAStatusRequest,
  ResendCodeRequest,
  LoginResponse,
  RegisterResponse,
  VerifyEmailResponse,
  Check2FAStatusResponse,
  User,
  ApiErrorResponse,
} from '../types';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 segundos timeout
    });

    this.api.interceptors.request.use((config) => {
      const token = this.getStoredToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (config.headers && !config.headers['User-Agent']) {
        config.headers['User-Agent'] = navigator.userAgent;
      }
      
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearStoredAuth();
          // Redirigir solo si no estamos ya en login/register
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register') &&
              !window.location.pathname.includes('/verify-email')) {
            window.location.href = '/login?expired=true';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem('auth_user');
    return userData ? JSON.parse(userData) : null;
  }

  private storeAuth(token: string, user: User): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private clearStoredAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response: AxiosResponse<RegisterResponse> = await this.api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const response: AxiosResponse<VerifyEmailResponse> = await this.api.post('/auth/verify-email', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resendCode(data: ResendCodeRequest): Promise<{ message: string }> {
    try {
      const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/resend-code', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
      const data = response.data;

      if (data.access_token && data.user) {
        this.storeAuth(data.access_token, data.user);
      }

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verify2FA(data: Verify2FARequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/verify-2fa', data);
      const responseData = response.data;

      if (responseData.access_token && responseData.user) {
        this.storeAuth(responseData.access_token, responseData.user);
      }

      return responseData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async check2FAStatus(data: Check2FAStatusRequest): Promise<Check2FAStatusResponse> {
    try {
      const response: AxiosResponse<Check2FAStatusResponse> = await this.api.post('/auth/check-2fa-status', data);
      const responseData = response.data;

      if (responseData.status === 'approved' && responseData.access_token && responseData.user) {
        this.storeAuth(responseData.access_token, responseData.user);
      }

      return responseData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response: AxiosResponse<{ user: User; message: string }> = await this.api.get('/auth/profile');
      return response.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    this.clearStoredAuth();
  }


  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  getCurrentUser(): User | null {
    return this.getStoredUser();
  }

  getCurrentToken(): string | null {
    return this.getStoredToken();
  }

  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.roleName === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isUser(): boolean {
    return this.hasRole('user');
  }


  startPolling(
    requestId: string,
    email: string,
    options: {
      intervalMs?: number;
      timeoutMs?: number;
      onApproved: (response: Check2FAStatusResponse) => void;
      onRejected: () => void;
      onTimeout: () => void;
      onError: (error: string) => void;
    }
  ): () => void {
    const intervalMs = options.intervalMs || 2000; 
    const timeoutMs = options.timeoutMs || 120000; 
    
    const timeoutId = window.setTimeout(() => {
      stopPolling();
      options.onTimeout();
    }, timeoutMs);

    const intervalId = window.setInterval(async () => {
      try {
        const response = await this.check2FAStatus({ requestId, email });
        
        if (response.status === 'approved') {
          stopPolling();
          options.onApproved(response);
        } else if (response.status === 'rejected') {
          stopPolling();
          options.onRejected();
        }
        
      } catch (error) {
        console.error('Error en polling 2FA:', error);
        options.onError(error instanceof Error ? error.message : 'Error de conexión');
      }
    }, intervalMs);

    function stopPolling() {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    }

    return stopPolling;
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

export const authService = new AuthService();
export default authService;
