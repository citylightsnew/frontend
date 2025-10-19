export type RoleCategoria = 'superusuario' | 'trabajador' | 'residente';

export interface User {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  roleName: string;
  role?: {
    id: string;
    name: string;
    description: string;
    categoria: RoleCategoria;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface Verify2FARequest {
  email: string;
  code: string;
}

export interface Check2FAStatusRequest {
  email: string;
  requestId: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface LoginResponse {
  access_token?: string;
  user?: User;
  requiresTwoFactor?: boolean;
  usePushNotification?: boolean;
  message?: string;
  requestId?: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  email: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}

export interface Check2FAStatusResponse {
  status: 'pending' | 'approved' | 'rejected';
  approved?: boolean;
  message: string;
  access_token?: string;
  user?: User;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<VerifyEmailResponse>;
  verify2FA: (data: Verify2FARequest) => Promise<LoginResponse>;
  check2FAStatus: (data: Check2FAStatusRequest) => Promise<Check2FAStatusResponse>;
  resendCode: (data: ResendCodeRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  getProfile: () => Promise<User>;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  categoria: RoleCategoria;
  createdAt: string;
  updatedAt?: string;
}

export interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceInfo?: {
    platform: string;
    model: string;
    brand: string;
    version: string;
  };
  fcmToken?: string;
  isActive: boolean;
  lastUsedAt: string;
  createdAt: string;
}

export const API_BASE_URL = 'http://localhost:4000/api';

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// ===== TIPOS DE FORMULARIOS =====
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  telephone: string;
}

export interface VerifyEmailFormData {
  code: string;
}

export interface TwoFactorFormData {
  code: string;
}

export interface InputProps {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

export interface PollingConfig {
  requestId: string;
  email: string;
  intervalMs?: number;
  timeoutMs?: number;
  onApproved: (response: Check2FAStatusResponse) => void;
  onRejected: () => void;
  onTimeout: () => void;
  onError: (error: string) => void;
}
