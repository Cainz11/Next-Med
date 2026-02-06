/**
 * Base URL da API.
 * - Desenvolvimento: /api (proxy do Vite para localhost:5053)
 * - Produção (Vercel): defina VITE_API_URL nas variáveis de ambiente
 *   Ex: https://sua-api.railway.app ou https://nexus-med-api.azurewebsites.net
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (refreshed.ok) {
        const data = await refreshed.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return api(path, options);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText || 'Erro na requisição');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: string;
  email: string;
  role: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerPatient: (data: RegisterPatientRequest) =>
    api<AuthResult>('/auth/register/patient', { method: 'POST', body: JSON.stringify(data) }),
  registerProfessional: (data: RegisterProfessionalRequest) =>
    api<AuthResult>('/auth/register/professional', { method: 'POST', body: JSON.stringify(data) }),
};

export interface RegisterPatientRequest {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth?: string | null;
  phone?: string | null;
  documentNumber?: string | null;
}

export interface RegisterProfessionalRequest {
  email: string;
  password: string;
  fullName: string;
  crm?: string | null;
  specialty?: string | null;
  phone?: string | null;
}
