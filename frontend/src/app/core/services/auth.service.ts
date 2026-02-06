import { Injectable, signal, computed } from '@angular/core';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: string;
  email: string;
  role: string;
}

const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';
const EMAIL_KEY = 'email';
const ROLE_KEY = 'role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userId = signal<string | null>(localStorage.getItem(USER_ID_KEY));
  private email = signal<string | null>(localStorage.getItem(EMAIL_KEY));
  private role = signal<string | null>(localStorage.getItem(ROLE_KEY));
  private token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  isAuthenticated = computed(() => !!this.token() && !!this.userId());
  currentUserId = computed(() => this.userId());
  currentEmail = computed(() => this.email());
  currentRole = computed(() => this.role());

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    this.token.set(accessToken);
  }

  login(result: AuthResult): void {
    localStorage.setItem(TOKEN_KEY, result.accessToken);
    localStorage.setItem(REFRESH_KEY, result.refreshToken);
    localStorage.setItem(USER_ID_KEY, result.userId);
    localStorage.setItem(EMAIL_KEY, result.email);
    localStorage.setItem(ROLE_KEY, result.role);
    this.token.set(result.accessToken);
    this.userId.set(result.userId);
    this.email.set(result.email);
    this.role.set(result.role);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.token.set(null);
    this.userId.set(null);
    this.email.set(null);
    this.role.set(null);
  }
}
