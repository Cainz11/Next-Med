import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CardComponent],
  template: `
    <div class="app-page">
      <h1 class="page-title">Olá!</h1>
      <p class="page-subtitle">{{ auth.currentEmail() }} · {{ auth.currentRole() === 'Patient' ? 'Paciente' : 'Profissional' }}</p>

      @if (auth.currentRole() === 'Patient') {
        <nav class="app-dashboard-nav">
          <app-card [routerLink]="'/profile'" cardTitle="Meu perfil" cardDescription="Editar nome, telefone, data de nascimento, CPF" cardIcon="person" />
          <app-card [routerLink]="'/prescriptions'" cardTitle="Receituário" cardDescription="Ver receitas e prescrições" cardIcon="description" />
          <app-card [routerLink]="'/exams'" cardTitle="Exames" cardDescription="Ver e enviar exames" cardIcon="science" />
          <app-card [routerLink]="'/health-metrics'" cardTitle="Dados de saúde" cardDescription="Glicemia, PA, atividade física" cardIcon="monitor_heart" />
          <app-card [routerLink]="'/messages'" cardTitle="Mensagens" cardDescription="Conversar com profissionais" cardIcon="chat_bubble" />
          <app-card [routerLink]="'/professionals'" cardTitle="Profissionais" cardDescription="Buscar médicos e avaliar" cardIcon="medical_services" />
          <app-card [routerLink]="'/lgpd'" cardTitle="Privacidade e dados" cardDescription="Exportar dados, excluir conta" cardIcon="shield" />
        </nav>
      }
      @if (auth.currentRole() === 'Professional') {
        <nav class="app-dashboard-nav">
          <app-card [routerLink]="'/profile'" cardTitle="Meu perfil" cardDescription="Editar nome, CRM, especialidade, telefone" cardIcon="person" />
          <app-card [routerLink]="'/patients'" cardTitle="Pacientes" cardDescription="Visualizar pacientes e emitir receitas ou exames" cardIcon="people" />
          <app-card [routerLink]="'/prescriptions'" cardTitle="Prescrições" cardDescription="Emitir e listar receitas" cardIcon="description" />
          <app-card [routerLink]="'/exams'" cardTitle="Exames" cardDescription="Solicitar e ver exames dos pacientes" cardIcon="science" />
          <app-card [routerLink]="'/messages'" cardTitle="Mensagens" cardDescription="Conversas com pacientes" cardIcon="chat_bubble" />
          <app-card [routerLink]="'/lgpd'" cardTitle="Privacidade e dados" cardDescription="Exportar dados, excluir conta" cardIcon="shield" />
        </nav>
      }
    </div>
  `,
  styles: [`
    .app-dashboard-nav { display: flex; flex-direction: column; gap: var(--space-3); }
  `],
})
export class DashboardComponent {
  auth = inject(AuthService);
}
