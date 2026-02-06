import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

/** Unidades permitidas (enum do backend) — evita registros sem sentido */
const HEALTH_METRIC_UNITS: { value: string; label: string }[] = [
  { value: '', label: '— Nenhuma —' },
  { value: 'mg/dL', label: 'mg/dL (glicemia)' },
  { value: 'mmHg', label: 'mmHg (pressão)' },
  { value: 'kg', label: 'kg (peso)' },
  { value: 'min', label: 'min (minutos)' },
  { value: 'kcal', label: 'kcal' },
  { value: 'bpm', label: 'bpm (batimentos/min)' },
];

interface HealthMetricItem {
  id: string;
  metricType: string;
  value: number | null;
  unit: string | null;
  notes: string | null;
  recordedAt: string;
  createdAt: string;
}

@Component({
  selector: 'app-health-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="app-page">
      <header style="margin-bottom: 1rem">
        <a routerLink="/dashboard" class="btn btn-ghost" style="width: auto; padding: 0.5rem">← Voltar</a>
        <h1 style="font-size: 1.25rem">Dados de saúde</h1>
      </header>
      @if (auth.currentRole() === 'Patient') {
        <form (ngSubmit)="add()" class="card" style="margin-bottom: 1rem">
          <h2 style="font-size: 1rem; margin-bottom: 0.75rem">Registrar</h2>
          <div class="form-group">
            <label class="label">Tipo</label>
            <select class="input" [(ngModel)]="metricType" name="metricType">
              <option value="Glicemia">Glicemia</option>
              <option value="PA">Pressão arterial</option>
              <option value="Peso">Peso</option>
              <option value="AtividadeFisica">Atividade física</option>
            </select>
          </div>
          <div class="form-group">
            <label class="label">Valor</label>
            <input type="text" class="input" [(ngModel)]="value" name="value" placeholder="Ex: 95 ou 120/80" />
          </div>
          <div class="form-group">
            <label class="label">Unidade</label>
            <select class="input" [(ngModel)]="unit" name="unit">
              @for (u of unitsList; track u.value) {
                <option [value]="u.value">{{ u.label }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="label">Observação (opcional)</label>
            <input class="input" [(ngModel)]="notes" name="notes" />
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="saving">{{ saving ? 'Salvando...' : 'Salvar' }}</button>
        </form>
      }
      @if (loading) { <p>Carregando...</p> }
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (!loading && !error && list.length === 0) { <p>Nenhum registro.</p> }
      @if (!loading && list.length > 0) {
        <div>
          @for (m of list; track m.id) {
            <div class="card">
              <strong>{{ m.metricType }}</strong>
              <p style="margin: 0.25rem 0 0; font-size: 0.875rem">{{ m.value != null ? m.value + ' ' + (m.unit || '') : '' }}{{ m.notes ? ' · ' + m.notes : '' }}</p>
              <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--text-muted)">{{ m.recordedAt | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class HealthMetricsComponent implements OnInit {
  auth = inject(AuthService);
  unitsList = HEALTH_METRIC_UNITS;
  list: HealthMetricItem[] = [];
  loading = true;
  error = '';
  saving = false;
  metricType = 'Glicemia';
  value = '';
  unit = '';
  notes = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.get<HealthMetricItem[]>('/health-metrics').subscribe({
      next: (data) => (this.list = data),
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.loading = false),
    });
  }

  add(): void {
    if (!this.value.trim()) return;
    this.saving = true;
    this.api
      .post<{ id: string }>('/health-metrics', {
        metricType: this.metricType,
        value: parseFloat(this.value) || null,
        unit: this.unit.trim() || null,
        notes: this.notes || null,
        recordedAt: new Date().toISOString(),
      })
      .subscribe({
        next: () => {
          this.value = '';
          this.unit = '';
          this.notes = '';
          this.load();
        },
        error: (err) => (this.error = err?.message || ''),
        complete: () => (this.saving = false),
      });
  }
}
