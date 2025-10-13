import type { ValidationResult } from '../types';

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, message: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'El formato del email no es válido' };
  }

  if (email.length > 254) {
    return { isValid: false, message: 'El email es demasiado largo' };
  }

  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'La contraseña es demasiado larga (máximo 128 caracteres)' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra minúscula' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un número' };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)' };
  }

  return { isValid: true };
}

export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, message: 'Confirma tu contraseña' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Las contraseñas no coinciden' };
  }

  return { isValid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name.trim()) {
    return { isValid: false, message: 'El nombre es requerido' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (name.length > 100) {
    return { isValid: false, message: 'El nombre es demasiado largo (máximo 100 caracteres)' };
  }

  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'El nombre solo puede contener letras, espacios y algunos caracteres especiales' };
  }

  return { isValid: true };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { isValid: false, message: 'El teléfono es requerido' };
  }

  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  if (!/^\+\d{1,15}$/.test(cleanPhone)) {
    return { 
      isValid: false, 
      message: 'El teléfono debe tener formato internacional (+1234567890)' 
    };
  }

  if (cleanPhone.length < 8) {
    return { isValid: false, message: 'El teléfono es demasiado corto' };
  }

  if (cleanPhone.length > 16) {
    return { isValid: false, message: 'El teléfono es demasiado largo' };
  }

  return { isValid: true };
}

export function validateCode(code: string): ValidationResult {
  if (!code.trim()) {
    return { isValid: false, message: 'El código es requerido' };
  }

  if (!/^\d{6}$/.test(code)) {
    return { isValid: false, message: 'El código debe ser de 6 dígitos' };
  }

  return { isValid: true };
}

export interface LoginFormValidation {
  email: ValidationResult;
  password: ValidationResult;
  isValid: boolean;
}

export function validateLoginForm(email: string, password: string): LoginFormValidation {
  const emailValidation = validateEmail(email);
  const passwordValidation = { isValid: !!password, message: !password ? 'La contraseña es requerida' : undefined };

  return {
    email: emailValidation,
    password: passwordValidation,
    isValid: emailValidation.isValid && passwordValidation.isValid,
  };
}

export interface RegisterFormValidation {
  name: ValidationResult;
  email: ValidationResult;
  password: ValidationResult;
  confirmPassword: ValidationResult;
  telephone: ValidationResult;
  isValid: boolean;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  telephone: string
): RegisterFormValidation {
  const nameValidation = validateName(name);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
  const telephoneValidation = validatePhone(telephone);

  return {
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
    telephone: telephoneValidation,
    isValid: 
      nameValidation.isValid &&
      emailValidation.isValid &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid &&
      telephoneValidation.isValid,
  };
}


export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}

export function isEmailFormatValid(email: string): boolean {
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return basicEmailRegex.test(email);
}

export function getPasswordStrength(password: string): {
  score: number; // 0-4
  label: 'Muy débil' | 'Débil' | 'Regular' | 'Fuerte' | 'Muy fuerte';
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
} {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
  
  const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'] as const;
  const colors = ['red', 'orange', 'yellow', 'green', 'blue'] as const;
  
  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)],
    color: colors[Math.min(score, 4)],
  };
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

export function isAlphanumericWithSpaces(str: string): boolean {
  return /^[a-zA-Z0-9\s]+$/.test(str);
}

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
