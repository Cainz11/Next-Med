import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { AuthResult } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="app-page">
      <div class="logo">Nexus Med</div>
      <h1 style="font-size: 1.25rem; margin-bottom: 0.5rem; text-align: center">Cadastro</h1>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem">
        <button type="button" class="btn" [class.btn-primary]="tab === 'patient'" [class.btn-secondary]="tab !== 'patient'" style="flex: 1" (click)="tab = 'patient'">Paciente</button>
        <button type="button" class="btn" [class.btn-primary]="tab === 'professional'" [class.btn-secondary]="tab !== 'professional'" style="flex: 1" (click)="tab = 'professional'">Profissional</button>
      </div>
      <form (ngSubmit)="onSubmit()" autocomplete="on">
        <div class="form-group">
          <label class="label" for="reg-fullName">Nome completo</label>
          <input id="reg-fullName" type="text" class="input" [(ngModel)]="fullName" name="fullName" required autocomplete="name" />
        </div>
        <div class="form-group">
          <label class="label" for="reg-email">E-mail</label>
          <input id="reg-email" type="email" class="input" [(ngModel)]="email" name="email" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label class="label" for="reg-password">Senha</label>
          <input id="reg-password" type="password" class="input" [(ngModel)]="password" name="password" required minlength="6" autocomplete="new-password" />
        </div>
        <div class="form-group">
          <label class="label" for="reg-phone">Telefone</label>
          <input id="reg-phone" type="tel" class="input" [(ngModel)]="phone" name="phone" placeholder="(11) 99999-9999" autocomplete="tel" />
        </div>
        @if (tab === 'patient') {
          <div class="form-group">
            <label class="label" for="reg-dateOfBirth">Data de nascimento</label>
            <input id="reg-dateOfBirth" type="date" class="input" [(ngModel)]="dateOfBirth" name="dateOfBirth" />
          </div>
          <div class="form-group">
            <label class="label" for="reg-documentNumber">CPF (opcional)</label>
            <input id="reg-documentNumber" type="text" class="input" [(ngModel)]="documentNumber" name="documentNumber" placeholder="000.000.000-00" inputmode="numeric" />
          </div>
        }
        @if (tab === 'professional') {
          <div class="form-group">
            <label class="label" for="reg-crm">CRM</label>
            <input id="reg-crm" type="text" class="input" [(ngModel)]="crm" name="crm" placeholder="CRM/UF" />
          </div>
          <div class="form-group">
            <label class="label" for="reg-specialty">Especialidade</label>
            <input id="reg-specialty" type="text" class="input" [(ngModel)]="specialty" name="specialty" placeholder="Ex: Clínico geral" />
          </div>
        }
        @if (error) { <p class="error-msg">{{ error }}</p> }
        <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Cadastrando...' : 'Cadastrar' }}</button>
      </form>
      <p style="margin-top: 1rem; text-align: center; font-size: 0.875rem">Já tem conta? <a routerLink="/login">Entrar</a></p>
    </div>
  `,
})
export class RegisterComponent {
  tab: 'patient' | 'professional' = 'patient';
  email = '';
  password = '';
  fullName = '';
  dateOfBirth = '';
  phone = '';
  documentNumber = '';
  crm = '';
  specialty = '';
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
    const path = this.tab === 'patient' ? '/auth/register/patient' : '/auth/register/professional';
    const body = this.tab === 'patient'
      ? { email: this.email, password: this.password, fullName: this.fullName, dateOfBirth: this.dateOfBirth || null, phone: this.phone || null, documentNumber: this.documentNumber || null }
      : { email: this.email, password: this.password, fullName: this.fullName, crm: this.crm || null, specialty: this.specialty || null, phone: this.phone || null };
    this.api.post<AuthResult>(path, body).subscribe({
      next: (result) => {
        this.auth.login(result);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err?.message || 'Falha no cadastro';
      },
      complete: () => (this.loading = false),
    });
  }
}
