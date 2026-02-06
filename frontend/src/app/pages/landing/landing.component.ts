import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing">
      <div class="landing-bg" aria-hidden="true">
        <div class="landing-gradient"></div>
        <div class="landing-glow landing-glow-1"></div>
        <div class="landing-glow landing-glow-2"></div>
        <div class="landing-glow landing-glow-3"></div>
      </div>
      <div class="landing-content">
        <div class="landing-logo-wrap">
          <span class="landing-icon" aria-hidden="true">
            <span class="material-icons">medical_services</span>
          </span>
          <h1 class="landing-title">Nexus Med</h1>
          <p class="landing-tagline">Sua saúde e seu médico, mais perto de você.</p>
        </div>
        <div class="landing-actions">
          <a routerLink="/login" class="landing-btn landing-btn-primary">Entrar</a>
          <a routerLink="/register" class="landing-btn landing-btn-secondary">Criar conta</a>
        </div>
        <p class="landing-footer">Pacientes e profissionais de saúde em um só lugar.</p>
      </div>
    </div>
  `,
  styles: [`
    .landing {
      position: relative;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-8) var(--space-5);
      overflow: hidden;
      max-width: 100%;
      margin: 0;
      background: linear-gradient(160deg, #0f766e 0%, #134e4a 40%, #0c4a46 100%);
    }

    .landing-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .landing-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.35), transparent),
                  radial-gradient(ellipse 60% 40% at 100% 50%, rgba(94, 234, 212, 0.15), transparent),
                  radial-gradient(ellipse 50% 30% at 0% 80%, rgba(20, 184, 166, 0.2), transparent);
      animation: landing-fade 8s ease-in-out infinite alternate;
    }

    .landing-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.4;
      animation: landing-float 12s ease-in-out infinite;
    }

    .landing-glow-1 {
      width: 200px;
      height: 200px;
      background: var(--primary-light);
      top: 10%;
      left: 20%;
      animation-delay: 0s;
    }

    .landing-glow-2 {
      width: 160px;
      height: 160px;
      background: rgba(255, 255, 255, 0.12);
      top: 50%;
      right: 10%;
      animation-delay: -4s;
    }

    .landing-glow-3 {
      width: 120px;
      height: 120px;
      background: var(--primary-light);
      bottom: 20%;
      left: 15%;
      animation-delay: -8s;
    }

    @keyframes landing-fade {
      from { opacity: 0.8; }
      to { opacity: 1; }
    }

    @keyframes landing-float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(15px, -20px) scale(1.05); }
      66% { transform: translate(-10px, 10px) scale(0.95); }
    }

    .landing-content {
      position: relative;
      z-index: 1;
      text-align: center;
      width: 100%;
      max-width: 320px;
    }

    .landing-logo-wrap {
      margin-bottom: var(--space-10);
    }

    .landing-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      margin-bottom: var(--space-6);
      animation: landing-icon-in 0.8s ease-out;
    }

    .landing-icon .material-icons {
      font-size: 2.5rem;
      color: #fff;
    }

    .landing-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.03em;
      margin: 0 0 var(--space-3);
      animation: landing-text-in 0.6s ease-out 0.2s both;
    }

    .landing-tagline {
      font-size: var(--text-lg);
      color: rgba(255, 255, 255, 0.9);
      line-height: var(--leading-relaxed);
      margin: 0;
      animation: landing-text-in 0.6s ease-out 0.35s both;
    }

    .landing-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-8);
      animation: landing-text-in 0.6s ease-out 0.5s both;
    }

    .landing-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4) var(--space-6);
      border-radius: var(--radius-xl);
      font-weight: 700;
      font-size: var(--text-base);
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .landing-btn:active {
      transform: scale(0.98);
    }

    .landing-btn-primary {
      background: #fff;
      color: var(--primary);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    }

    .landing-btn-primary:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .landing-btn-secondary {
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
      border: 2px solid rgba(255, 255, 255, 0.4);
    }

    .landing-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .landing-footer {
      font-size: var(--text-sm);
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      animation: landing-text-in 0.6s ease-out 0.65s both;
    }
  `],
})
export class LandingComponent {}
