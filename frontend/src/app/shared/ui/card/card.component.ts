import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (routerLink(); as link) {
      <a [routerLink]="link" class="app-card app-card-link" [class.app-card-clickable]="true">
        @if (cardTitle(); as title) {
          <span class="app-card-icon-wrap">
            @if (cardIcon(); as icon) {
              <span class="material-icons app-card-icon" aria-hidden="true">{{ icon }}</span>
            }
            <strong class="app-card-title">{{ title }}</strong>
          </span>
          @if (cardDescription(); as desc) {
            <p class="app-card-desc">{{ desc }}</p>
          }
        } @else {
          <ng-content />
        }
      </a>
    } @else {
      <div class="app-card">
        @if (cardTitle(); as title) {
          <span class="app-card-icon-wrap">
            @if (cardIcon(); as icon) {
              <span class="material-icons app-card-icon" aria-hidden="true">{{ icon }}</span>
            }
            <strong class="app-card-title">{{ title }}</strong>
          </span>
          @if (cardDescription(); as desc) {
            <p class="app-card-desc">{{ desc }}</p>
          }
        } @else {
          <ng-content />
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .app-card {
      background: var(--surface-card);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      margin-bottom: var(--space-4);
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(0, 0, 0, 0.04);
      color: var(--text);
    }
    .app-card-link {
      display: block;
      color: var(--text);
      text-decoration: none;
    }
    .app-card-link:hover { color: var(--text); }
    .app-card-icon-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-1);
    }
    .app-card-icon {
      font-size: 1.5rem;
      color: var(--primary);
      flex-shrink: 0;
    }
    .app-card-title {
      display: block;
      font-weight: var(--font-semibold);
      font-size: var(--text-base);
      margin: 0;
    }
    .app-card-desc {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--text-muted);
      line-height: var(--leading-normal);
    }
    .app-card-clickable:hover { background: var(--surface); }
  `],
})
export class CardComponent {
  /** Se definido, o card é um link que navega para a rota informada. */
  routerLink = input<string | unknown[] | null>(null);
  /** Título do card (garante texto visível). */
  cardTitle = input<string | null>(null);
  /** Descrição/resumo (opcional). */
  cardDescription = input<string | null>(null);
  /** Nome do ícone Material Icons (ex: person, description). */
  cardIcon = input<string | null>(null);
}
