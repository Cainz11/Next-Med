import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { AuthResult } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="app-page">
      <div class="logo">Nexus Med</div>
      <h1 style="font-size: 1.25rem; margin-bottom: 1.5rem; text-align: center">Entrar</h1>
      <form (ngSubmit)="onSubmit()" autocomplete="on">
        <div class="form-group">
          <label class="label" for="login-email">E-mail</label>
          <input id="login-email" type="email" class="input" [(ngModel)]="email" name="email" placeholder="seu@email.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label class="label" for="login-password">Senha</label>
          <input id="login-password" type="password" class="input" [(ngModel)]="password" name="password" placeholder="••••••••" required autocomplete="current-password" />
        </div>
        @if (error) { <p class="error-msg">{{ error }}</p> }
        <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Entrando...' : 'Entrar' }}</button>
      </form>
      <p style="margin-top: 1rem; text-align: center; font-size: 0.875rem">
        Não tem conta? <a routerLink="/register">Cadastre-se</a>
      </p>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.api.post<AuthResult>('/auth/login', { email: this.email, password: this.password }).subscribe({
      next: (result) => {
        this.auth.login(result);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err?.message || 'Falha no login';
      },
      complete: () => (this.loading = false),
    });
  }
}
