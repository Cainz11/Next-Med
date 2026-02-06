import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface Conversation {
  id: string;
  patientId: string;
  professionalId: string;
  patientName?: string;
  professionalName?: string;
  lastMessageAt: string | null;
  createdAt: string;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="app-page">
      <header style="margin-bottom: 1rem">
        <a routerLink="/dashboard" class="btn btn-ghost" style="width: auto; padding: 0.5rem">← Voltar</a>
        <h1 style="font-size: 1.25rem">Mensagens</h1>
      </header>
      @if (loading) { <p>Carregando...</p> }
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (!loading && !error && conversations.length === 0) {
        <p>{{ auth.currentRole() === 'Patient' ? 'Nenhuma conversa. Vá em Profissionais para iniciar uma conversa.' : 'Nenhuma conversa. Seus pacientes podem iniciar pelo app ou você pode abrir a partir de Pacientes.' }}</p>
      }
      @if (!loading && conversations.length > 0) {
        <div>
          @for (c of conversations; track c.id) {
            <a [routerLink]="['/messages', c.id]" class="card" style="display: block; color: inherit">
              <strong>{{ c.professionalName || c.patientName || 'Conversa' }}</strong>
              <p style="margin: 0; font-size: 0.875rem; color: var(--text-muted)">{{ (c.lastMessageAt || c.createdAt) | date:'dd/MM/yyyy HH:mm' }}</p>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class MessagesComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);
  conversations: Conversation[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    const professionalId = this.route.snapshot.queryParamMap.get('professionalId');
    const patientId = this.route.snapshot.queryParamMap.get('patientId');
    if (professionalId && this.auth.currentRole() === 'Patient') {
      this.loading = true;
      this.api.post<{ id: string }>('/messages/conversations', { professionalId }).subscribe({
        next: (c) => this.router.navigate(['/messages', c.id]),
        error: (err) => (this.error = err?.message || ''),
        complete: () => (this.loading = false),
      });
      return;
    }
    if (patientId && this.auth.currentRole() === 'Professional') {
      this.loading = true;
      this.api.post<{ id: string }>('/messages/conversations/with-patient', { patientId }).subscribe({
        next: (c) => this.router.navigate(['/messages', c.id]),
        error: (err) => (this.error = err?.message || ''),
        complete: () => (this.loading = false),
      });
      return;
    }
    this.api.get<Conversation[]>('/messages/conversations').subscribe({
      next: (data) => (this.conversations = data),
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.loading = false),
    });
  }
}
