import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="{{ type() }}"
      [disabled]="disabled()"
      [attr.aria-busy]="loading()"
      class="app-btn app-btn-{{ variant() }}"
      [class.app-btn-block]="block()"
      [class.app-btn-sm]="size() === 'sm'"
    >
      @if (loading()) {
        <span class="app-btn-spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    .app-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-md);
      font-weight: var(--font-semibold);
      font-size: var(--text-base);
      transition: opacity 0.2s, background-color 0.2s;
    }
    .app-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .app-btn-block { width: 100%; }
    .app-btn-sm { padding: var(--space-2) var(--space-3); font-size: var(--text-sm); }
    .app-btn-primary { background: var(--primary); color: #fff; }
    .app-btn-primary:hover:not(:disabled) { background: var(--primary-hover); }
    .app-btn-secondary { background: var(--border); color: var(--text); }
    .app-btn-ghost { background: transparent; color: var(--primary); }
    .app-btn-ghost:hover:not(:disabled) { background: var(--primary-muted); }
    .app-btn-danger { background: var(--error); color: #fff; }
    .app-btn-spinner {
      width: 1em; height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: var(--radius-full);
      animation: app-spin 0.6s linear infinite;
    }
    @keyframes app-spin { to { transform: rotate(360deg); } }
  `],
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  loading = input(false);
  block = input(false);
  size = input<'sm' | 'md'>('md');
}
