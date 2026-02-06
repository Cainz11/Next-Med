import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface ProfessionalItem {
  id: string;
  userId: string;
  fullName: string;
  crm: string | null;
  specialty: string | null;
  phone: string | null;
  averageRating: number;
}

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="app-page">
      <header style="margin-bottom: 1rem">
        <a routerLink="/dashboard" class="btn btn-ghost" style="width: auto; padding: 0.5rem">← Voltar</a>
        <h1 style="font-size: 1.25rem">Profissionais</h1>
      </header>
      @if (loading) { <p>Carregando...</p> }
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (!loading && !error && list.length === 0) { <p>Nenhum profissional cadastrado.</p> }
      @if (!loading && list.length > 0) {
        <div>
          @for (p of list; track p.id) {
            <div class="card">
              <strong>{{ p.fullName }}</strong>
              @if (p.specialty) { <p style="margin: 0.25rem 0 0; font-size: 0.875rem">{{ p.specialty }}</p> }
              @if (p.crm) { <p style="margin: 0; font-size: 0.75rem; color: var(--text-muted)">{{ p.crm }}</p> }
              <p style="margin: 0.25rem 0 0; font-size: 0.875rem">★ {{ p.averageRating.toFixed(1) }}</p>
              @if (auth.currentRole() === 'Patient') {
                <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem">
                  <a [routerLink]="['/messages']" [queryParams]="{ professionalId: p.id }" class="btn btn-secondary" style="flex: 1">Mensagem</a>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ProfessionalsComponent implements OnInit {
  auth = inject(AuthService);
  list: ProfessionalItem[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<ProfessionalItem[]>('/professionals').subscribe({
      next: (data) => (this.list = data),
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.loading = false),
    });
  }
}
