import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface PatientItem {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="app-page">
      <h1 class="page-title">Pacientes</h1>
      @if (auth.currentRole() !== 'Professional') {
        <p class="page-subtitle">Acesso restrito a profissionais.</p>
      } @else {
        <p class="page-subtitle">Pacientes com quem você já interagiu (prescrições, conversas ou exames).</p>

      @if (loading) { <p>Carregando...</p> }
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (!loading && !error && list.length === 0) {
        <div class="card">
          <p>Nenhum paciente ainda. Ao emitir receitas, solicitar exames ou conversar, eles aparecerão aqui.</p>
          <a routerLink="/prescriptions" class="btn btn-primary" style="margin-top: 0.75rem">Emitir primeira receita</a>
        </div>
      }
      @if (!loading && list.length > 0) {
        <div class="patients-list">
          @for (p of list; track p.id) {
            <div class="card patient-card">
              <strong>{{ p.fullName }}</strong>
              <p class="patient-email">{{ p.email }}</p>
              @if (p.phone) { <p class="patient-phone">{{ p.phone }}</p> }
              <div class="patient-actions">
                <a [routerLink]="['/messages']" [queryParams]="{ patientId: p.id }" class="btn btn-secondary" style="flex: 1">Mensagem</a>
                <a [routerLink]="['/prescriptions']" [queryParams]="{ patientId: p.id }" class="btn btn-secondary" style="flex: 1">Receita</a>
                <a [routerLink]="['/exams']" [queryParams]="{ patientId: p.id }" class="btn btn-secondary" style="flex: 1">Exame</a>
              </div>
            </div>
          }
        </div>
      }
      }
    </div>
  `,
  styles: [`
    .patients-list { display: flex; flex-direction: column; gap: var(--space-3); }
    .patient-card strong { display: block; margin-bottom: var(--space-1); }
    .patient-email, .patient-phone { margin: 0; font-size: var(--text-sm); color: var(--text-muted); }
    .patient-actions { display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap; }
  `],
})
export class PatientsComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  list: PatientItem[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    if (this.auth.currentRole() === 'Professional') this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.get<PatientItem[]>('/patients').subscribe({
      next: (data) => (this.list = data),
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.loading = false),
    });
  }
}