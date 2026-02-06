import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PrescriptionsComponent } from './pages/prescriptions/prescriptions.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { HealthMetricsComponent } from './pages/health-metrics/health-metrics.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ConversationDetailComponent } from './pages/conversation-detail/conversation-detail.component';
import { ProfessionalsComponent } from './pages/professionals/professionals.component';
import { LgpdComponent } from './pages/lgpd/lgpd.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PatientsComponent } from './pages/patients/patients.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'prescriptions', component: PrescriptionsComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'health-metrics', component: HealthMetricsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'professionals', component: ProfessionalsComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'lgpd', component: LgpdComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: 'messages/:id', component: ConversationDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'landing' },
];
