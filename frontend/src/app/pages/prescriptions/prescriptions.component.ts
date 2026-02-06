import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface PrescriptionItem {
  id: string;
  patientId?: string;
  professionalId?: string;
  description: string | null;
  filePath: string | null;
  issuedAt: string;
  createdAt: string;
}

interface PatientOption {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
}

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-page">
      <h1 class="page-title">Receituário</h1>
      <p class="page-subtitle">{{ auth.currentRole() === 'Patient' ? 'Suas receitas e prescrições' : 'Emitir e listar prescrições' }}</p>

      @if (auth.currentRole() === 'Professional') {
        <form (ngSubmit)="create()" class="card" style="margin-bottom: 1rem">
          <h2 style="font-size: 1rem; margin-bottom: 0.75rem">Emitir receita</h2>
          <div class="form-group">
            <label class="label">Paciente</label>
            <select class="input" [(ngModel)]="selectedPatientId" name="patientId" required>
              <option value="">— Selecione —</option>
              @for (p of patients; track p.id) {
                <option [value]="p.id">{{ p.fullName }} ({{ p.email }})</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="label">Descrição / medicamentos</label>
            <input type="text" class="input" [(ngModel)]="description" name="description" placeholder="Ex: Paracetamol 750mg, 1 cp de 8/8h" />
          </div>
          <div class="form-group">
            <label class="label">Link do arquivo (opcional)</label>
            <input type="text" class="input" [(ngModel)]="filePath" name="filePath" placeholder="URL do PDF ou anexo" />
          </div>
          @if (createError) { <p class="error-msg">{{ createError }}</p> }
          <button type="submit" class="btn btn-primary" [disabled]="saving">{{ saving ? 'Emitindo...' : 'Emitir receita' }}</button>
        </form>
      }

      @if (loading) { <p>Carregando...</p> }
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (!loading && !error && list.length === 0) { <p>Nenhuma prescrição.</p> }
      @if (!loading && list.length > 0) {
        <div>
          @for (p of list; track p.id) {
            <div class="card">
              <strong>{{ p.description || 'Receita' }}</strong>
              <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--text-muted)">Emitida em {{ p.issuedAt | date:'dd/MM/yyyy' }}</p>
              @if (p.filePath) { <a [href]="p.filePath" target="_blank" rel="noreferrer" style="font-size: 0.875rem">Abrir arquivo</a> }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PrescriptionsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);
  list: PrescriptionItem[] = [];
  patients: PatientOption[] = [];
  loading = true;
  error = '';
  saving = false;
  createError = '';
  selectedPatientId = '';
  description = '';
  filePath = '';

  ngOnInit(): void {
    const patientId = this.route.snapshot.queryParamMap.get('patientId');
    if (patientId) this.selectedPatientId = patientId;
    this.loadList();
    if (this.auth.currentRole() === 'Professional') this.loadPatients();
  }

  loadPatients(): void {
    this.api.get<PatientOption[]>('/patients?all=true').subscribe({
      next: (data) => (this.patients = data),
      error: () => (this.patients = []),
    });
  }

  loadList(): void {
    this.loading = true;
    this.api.get<PrescriptionItem[]>('/prescriptions').subscribe({
      next: (data) => (this.list = data),
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.loading = false),
    });
  }

  create(): void {
    if (!this.selectedPatientId) return;
    this.saving = true;
    this.createError = '';
    this.api
      .post<{ id: string }>('/prescriptions', {
        patientId: this.selectedPatientId,
        description: this.description || null,
        filePath: this.filePath || null,
      })
      .subscribe({
        next: () => {
          this.description = '';
          this.filePath = '';
          this.loadList();
        },
        error: (err) => (this.createError = err?.message || 'Erro ao emitir'),
        complete: () => (this.saving = false),
      });
  }
}