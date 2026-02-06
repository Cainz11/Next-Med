import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface MyProfileDto {
  role: string;
  email: string;
  fullName: string;
  dateOfBirth?: string | null;
  phone?: string | null;
  documentNumber?: string | null;
  crm?: string | null;
  specialty?: string | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-page">
      <h1 class="page-title">Meu perfil</h1>
      <p class="page-subtitle">{{ auth.currentEmail() }} · {{ auth.currentRole() === 'Patient' ? 'Paciente' : 'Profissional' }}</p>

      @if (loading && !profile) {
        <p>Carregando...</p>
      }
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (message) { <p class="profile-success">{{ message }}</p> }

      @if (profile && !loading) {
        <form (ngSubmit)="save()" class="profile-form">
          <div class="form-group">
            <label class="label">E-mail</label>
            <input type="email" class="input" [value]="profile.email" disabled />
            <span class="input-hint">O e-mail não pode ser alterado aqui.</span>
          </div>
          <div class="form-group">
            <label class="label">Nome completo</label>
            <input type="text" class="input" [(ngModel)]="fullName" name="fullName" required />
          </div>
          <div class="form-group">
            <label class="label">Telefone</label>
            <input type="tel" class="input" [(ngModel)]="phone" name="phone" placeholder="(11) 99999-9999" />
          </div>

          @if (profile.role === 'Patient') {
            <div class="form-group">
              <label class="label">Data de nascimento</label>
              <input type="date" class="input" [(ngModel)]="dateOfBirth" name="dateOfBirth" />
            </div>
            <div class="form-group">
              <label class="label">CPF (opcional)</label>
              <input type="text" class="input" [(ngModel)]="documentNumber" name="documentNumber" placeholder="000.000.000-00" />
            </div>
          }
          @if (profile.role === 'Professional') {
            <div class="form-group">
              <label class="label">CRM</label>
              <input type="text" class="input" [(ngModel)]="crm" name="crm" placeholder="CRM/UF" />
            </div>
            <div class="form-group">
              <label class="label">Especialidade</label>
              <input type="text" class="input" [(ngModel)]="specialty" name="specialty" placeholder="Ex: Clínico geral" />
            </div>
          }

          <button type="submit" class="btn btn-primary" [disabled]="saving">{{ saving ? 'Salvando...' : 'Salvar alterações' }}</button>
        </form>
      }
    </div>
  `,
  styles: [`
    .profile-form { max-width: 100%; }
    .input-hint { font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-1); display: block; }
    .profile-success { color: var(--success); font-size: var(--text-sm); margin-bottom: var(--space-4); }
    input:disabled { opacity: 0.8; cursor: not-allowed; }
  `],
})
export class ProfileComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  profile: MyProfileDto | null = null;
  fullName = '';
  dateOfBirth = '';
  phone = '';
  documentNumber = '';
  crm = '';
  specialty = '';
  loading = true;
  saving = false;
  error = '';
  message = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.get<MyProfileDto>('/profile').subscribe({
      next: (data) => {
        this.profile = data;
        this.fullName = data.fullName ?? '';
        this.phone = data.phone ?? '';
        this.dateOfBirth = data.dateOfBirth != null ? String(data.dateOfBirth).slice(0, 10) : '';
        this.documentNumber = data.documentNumber ?? '';
        this.crm = data.crm ?? '';
        this.specialty = data.specialty ?? '';
      },
      error: (err) => (this.error = err?.message || 'Erro ao carregar perfil'),
      complete: () => (this.loading = false),
    });
  }

  save(): void {
    if (!this.profile) return;
    this.error = '';
    this.message = '';
    this.saving = true;
    const body = this.profile.role === 'Patient'
      ? {
          fullName: this.fullName,
          dateOfBirth: this.dateOfBirth || null,
          phone: this.phone || null,
          documentNumber: this.documentNumber || null,
          crm: null,
          specialty: null,
        }
      : {
          fullName: this.fullName,
          dateOfBirth: null,
          phone: this.phone || null,
          documentNumber: null,
          crm: this.crm || null,
          specialty: this.specialty || null,
        };
    this.api.put<void>('/profile', body).subscribe({
      next: () => {
        this.message = 'Perfil atualizado com sucesso.';
        this.load();
      },
      error: (err) => (this.error = err?.message || 'Erro ao salvar'),
      complete: () => (this.saving = false),
    });
  }
}
