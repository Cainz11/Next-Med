import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const API_BASE = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${API_BASE}${path}`).pipe(
      catchError((err) => this.handleError(err, path, 'GET'))
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${API_BASE}${path}`, body).pipe(
      catchError((err) => this.handleError(err, path, 'POST', body))
    );
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${API_BASE}${path}`, body).pipe(
      catchError((err) => this.handleError(err, path, 'PUT', body))
    );
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}${path}`).pipe(
      catchError((err) => this.handleError(err, path, 'DELETE'))
    );
  }

  private handleError(err: { status?: number; error?: { message?: string } }, path: string, method: string, body?: unknown): Observable<never> {
    if (err.status === 401) {
      const refresh = this.auth.getRefreshToken();
      if (refresh) {
        return this.http.post<{ accessToken: string; refreshToken: string }>(`${API_BASE}/auth/refresh`, { refreshToken: refresh }).pipe(
          switchMap((data) => {
            this.auth.setTokens(data.accessToken, data.refreshToken);
            const opts = body !== undefined ? { body } : {};
            return this.http.request<unknown>(method, `${API_BASE}${path}`, opts as object) as Observable<never>;
          }),
          catchError(() => {
            this.auth.logout();
            window.location.href = '/login';
            return throwError(() => new Error('Sessão expirada'));
          })
        );
      }
      this.auth.logout();
      window.location.href = '/login';
      return throwError(() => new Error('Sessão expirada'));
    }
    const message = err?.error?.message || 'Erro na requisição';
    return throwError(() => new Error(message));
  }
}
