import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-lgpd',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="app-page">
      <header style="margin-bottom: 1rem">
        <a routerLink="/dashboard" class="btn btn-ghost" style="width: auto; padding: 0.5rem">← Voltar</a>
        <h1 style="font-size: 1.25rem">Privacidade e dados (LGPD)</h1>
      </header>
      @if (message) { <p style="color: var(--primary)">{{ message }}</p> }
      @if (error) { <p class="error-msg">{{ error }}</p> }

      <div class="card">
        <h2 style="font-size: 1rem; margin-bottom: 0.5rem">Exportar meus dados</h2>
        <p style="font-size: 0.875rem; margin-bottom: 0.75rem; color: var(--text-muted)">Baixe uma cópia de todos os seus dados em formato JSON.</p>
        <button type="button" class="btn btn-primary" (click)="export()" [disabled]="exporting">{{ exporting ? 'Exportando...' : 'Exportar dados' }}</button>
      </div>

      <div class="card">
        <h2 style="font-size: 1rem; margin-bottom: 0.5rem">Consentimento</h2>
        <p style="font-size: 0.875rem; margin-bottom: 0.75rem; color: var(--text-muted)">Registre seu consentimento para tratamento de dados.</p>
        <div class="form-group">
          <label class="label">Finalidade</label>
          <input class="input" [(ngModel)]="consentPurpose" />
        </div>
        <div style="display: flex; gap: 0.5rem">
          <button type="button" class="btn btn-primary" (click)="consent(true)">Aceitar</button>
          <button type="button" class="btn btn-secondary" (click)="consent(false)">Recusar</button>
        </div>
      </div>

      <div class="card">
        <h2 style="font-size: 1rem; margin-bottom: 0.5rem">Excluir minha conta</h2>
        <p style="font-size: 0.875rem; margin-bottom: 0.75rem; color: var(--text-muted)">Exclui permanentemente sua conta e dados. Esta ação não pode ser desfeita.</p>
        <button type="button" class="btn btn-ghost" style="color: var(--error)" (click)="deleteAccount()" [disabled]="deleting">{{ deleting ? 'Excluindo...' : 'Excluir minha conta' }}</button>
      </div>
    </div>
  `,
})
export class LgpdComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  message = '';
  error = '';
  exporting = false;
  deleting = false;
  consentPurpose = 'Uso de dados de saúde no app Nexus Med';

  export(): void {
    this.error = '';
    this.exporting = true;
    this.api.get<object>('/lgpd/export-my-data').subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus-med-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.message = 'Exportação concluída. O arquivo foi baixado.';
      },
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.exporting = false),
    });
  }

  consent(accepted: boolean): void {
    this.error = '';
    this.api.post('/lgpd/consent', { purpose: this.consentPurpose, accepted }).subscribe({
      next: () => (this.message = accepted ? 'Consentimento registrado.' : 'Registro de não consentimento salvo.'),
      error: (err) => (this.error = err?.message || ''),
    });
  }

  deleteAccount(): void {
    if (!confirm('Tem certeza? Todos os seus dados serão excluídos e você será deslogado.')) return;
    this.error = '';
    this.deleting = true;
    this.api.delete('/lgpd/my-account').subscribe({
      next: () => {
        this.auth.logout();
        window.location.href = '/login';
      },
      error: (err) => {
        this.error = err?.message || 'Erro ao excluir conta';
        this.deleting = false;
      },
    });
  }
}
