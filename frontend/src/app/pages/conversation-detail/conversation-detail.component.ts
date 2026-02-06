import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface MessageItem {
  id: string;
  senderUserId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

@Component({
  selector: 'app-conversation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="app-page" style="display: flex; flex-direction: column; height: 100%">
      <header style="margin-bottom: 0.75rem; flex-shrink: 0">
        <a routerLink="/messages" class="btn btn-ghost" style="width: auto; padding: 0.5rem">← Conversas</a>
        <h1 style="font-size: 1.25rem">Conversa</h1>
      </header>
      @if (error) { <p class="error-msg">{{ error }}</p> }
      @if (loading) { <p>Carregando...</p> }
      <div style="flex: 1; overflow: auto; margin-bottom: 1rem">
        @if (!loading && messages.length === 0) { <p>Nenhuma mensagem. Envie a primeira.</p> }
        @for (m of messages; track m.id) {
          <div
            class="card"
            [style.background]="m.senderUserId === userId ? 'var(--primary)' : 'var(--surface)'"
            [style.color]="m.senderUserId === userId ? '#fff' : 'var(--text)'"
            [style.margin-left.rem]="m.senderUserId === userId ? 2 : 0"
            [style.margin-right.rem]="m.senderUserId !== userId ? 2 : 0"
            style="margin-bottom: 0.5rem"
          >
            <p style="margin: 0; font-size: 0.875rem">{{ m.content }}</p>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; opacity: 0.8">{{ m.sentAt | date:'dd/MM/yyyy HH:mm' }}</p>
          </div>
        }
      </div>
      <form (ngSubmit)="send()" style="flex-shrink: 0; display: flex; gap: 0.5rem">
        <input class="input" [(ngModel)]="content" name="content" placeholder="Digite uma mensagem..." style="flex: 1; margin-bottom: 0" />
        <button type="submit" class="btn btn-primary" [disabled]="sending || !content.trim()" style="width: auto">Enviar</button>
      </form>
    </div>
  `,
})
export class ConversationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);
  get userId(): string | null {
    return this.auth.currentUserId() ?? null;
  }
  messages: MessageItem[] = [];
  content = '';
  loading = true;
  sending = false;
  error = '';
  conversationId = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.conversationId = id;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.get<MessageItem[]>(`/messages/conversations/${this.conversationId}/messages?take=100`).subscribe({
      next: (data) => (this.messages = (data || []).slice().reverse()),
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.loading = false),
    });
  }

  send(): void {
    if (!this.content.trim()) return;
    this.sending = true;
    this.error = '';
    this.api.post<{ id: string }>('/messages/send', { conversationId: this.conversationId, content: this.content.trim() }).subscribe({
      next: () => {
        this.content = '';
        this.load();
      },
      error: (err) => (this.error = err?.message || ''),
      complete: () => (this.sending = false),
    });
  }
}
