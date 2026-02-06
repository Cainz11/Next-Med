import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface ExamItem {
  id: string;
  patientId: string;
  name: string | null;
  filePath: string | null;
  examDate: string | null;
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
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-page">
      <h1 class="page-title">Exames</h1>
      <p class="page-subtitle">{{ auth.currentRole() === 'Patient' ? 'Seus exames' : 'Solicitar e ver exames dos pacientes' }}</p>

      @if (auth.currentRole() === 'Professional') {
        <form (ngSubmit)="create()" class="card" style="margin-bottom: 1rem">
          <h2 style="font-size: 1rem; margin-bottom: 0.75rem">Solicitar / registrar exame</h2>
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
            <label class="label">Nome do exame</label>
            <input type="text" class="input" [(ngModel)]="examName" name="examName" placeholder="Ex: Hemograma completo" />
          </div>
          <div class="form-group">
            <label class="label">Data do exame (opcional)</label>
            <input type="date" class="input" [(ngModel)]="examDate" name="examDate" />
          </div>
          <div class="form-group">
            <label class="label">Link do arquivo (opcional)</label>
            <input type="text" class="input" [(ngModel)]="filePath" name="filePath" placeholder="URL do resultado" />
          </div>
          @if (createError) { <p class="error-msg">{{ createError }}</p> }
          <button type="submit" class="btn btn-primary" [disabled]="saving">{{ saving ? 'Salvando...' : 'Registrar exame' }}</button>
        </form>
      }

      @if (loading) { <p>Carregando...</p> }
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (!loading && !error && list.length === 0) { <p>Nenhum exame.</p> }
      @if (!loading && list.length > 0) {
        <div>
          @for (e of list; track e.id) {
            <div class="card">
              <strong>{{ e.name || 'Exame' }}</strong>
              <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--text-muted)">{{ e.examDate ? (e.examDate | date:'dd/MM/yyyy') : 'Sem data' }}</p>
              @if (e.filePath) { <a [href]="e.filePath" target="_blank" rel="noreferrer" style="font-size: 0.875rem">Abrir arquivo</a> }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ExamsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);
  list: ExamItem[] = [];
  patients: PatientOption[] = [];
  loading = true;
  error = '';
  saving = false;
  createError = '';
  selectedPatientId = '';
  examName = '';
  examDate = '';
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
    this.api.get<ExamItem[]>('/exams').subscribe({
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
      .post<{ id: string }>('/exams', {
        patientId: this.selectedPatientId,
        name: this.examName || null,
        filePath: this.filePath || null,
        examDate: this.examDate ? new Date(this.examDate).toISOString() : null,
      })
      .subscribe({
        next: () => {
          this.examName = '';
          this.examDate = '';
          this.filePath = '';
          this.loadList();
        },
        error: (err) => (this.createError = err?.message || 'Erro ao registrar'),
        complete: () => (this.saving = false),
      });
  }
}