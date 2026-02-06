import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="app-shell-header">
        <a routerLink="/dashboard" class="app-shell-logo">Nexus Med</a>
        <div class="app-shell-header-actions">
          <a routerLink="/profile" class="app-shell-profile-link" aria-label="Meu perfil">Perfil</a>
          <button type="button" class="app-shell-logout" (click)="logout()" aria-label="Sair">Sair</button>
        </div>
      </header>
      <main class="app-shell-main app-page-with-nav">
        <router-outlet />
      </main>
      <nav class="app-shell-nav" aria-label="Navegação principal">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="app-shell-nav-item">
          <span class="material-icons app-shell-nav-icon" aria-hidden="true">home</span>
          <span class="app-shell-nav-label">Início</span>
        </a>
        <a routerLink="/prescriptions" routerLinkActive="active" class="app-shell-nav-item">
          <span class="material-icons app-shell-nav-icon" aria-hidden="true">description</span>
          <span class="app-shell-nav-label">Receituário</span>
        </a>
        <a routerLink="/exams" routerLinkActive="active" class="app-shell-nav-item">
          <span class="material-icons app-shell-nav-icon" aria-hidden="true">science</span>
          <span class="app-shell-nav-label">Exames</span>
        </a>
        <a routerLink="/messages" routerLinkActive="active" class="app-shell-nav-item">
          <span class="material-icons app-shell-nav-icon" aria-hidden="true">chat_bubble</span>
          <span class="app-shell-nav-label">Mensagens</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }
    .app-shell-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3) var(--space-5);
      border-bottom: 1px solid var(--border);
      background: var(--surface-card);
      flex-shrink: 0;
    }
    .app-shell-logo {
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--primary);
      letter-spacing: -0.02em;
    }
    .app-shell-logout {
      padding: var(--space-2) var(--space-3);
      color: var(--primary);
      font-weight: var(--font-medium);
      font-size: var(--text-sm);
      border-radius: var(--radius-md);
    }
    .app-shell-header-actions { display: flex; align-items: center; gap: var(--space-2); }
    .app-shell-profile-link { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--primary); text-decoration: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); }
    .app-shell-profile-link:hover { background: var(--primary-muted); }
    .app-shell-logout:hover { background: var(--primary-muted); }
    .app-shell-main {
      flex: 1;
      overflow: auto;
    }
    .app-shell-nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: var(--nav-height);
      padding-bottom: var(--safe-bottom);
      background: var(--surface-card);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }
    .app-shell-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      padding: var(--space-2);
      color: var(--text-muted);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      text-decoration: none;
      border-radius: var(--radius-md);
      min-width: 64px;
    }
    .app-shell-nav-item:hover { color: var(--primary); background: var(--primary-muted); }
    .app-shell-nav-item.active { color: var(--primary); }
    .app-shell-nav-item.active .app-shell-nav-icon { color: var(--primary); }
    .app-shell-nav-icon { font-size: 1.5rem; }
  `],
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
