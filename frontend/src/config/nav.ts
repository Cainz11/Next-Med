export interface NavItem {
  to: string;
  label: string;
  shortLabel?: string;
  icon?: string;
}

export const PATIENT_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Início', shortLabel: 'Início', icon: '🏠' },
  { to: '/appointments', label: 'Consultas', shortLabel: 'Consultas', icon: '📅' },
  { to: '/notifications', label: 'Notificações', shortLabel: 'Notif.', icon: '🔔' },
  { to: '/prescriptions', label: 'Receituário', shortLabel: 'Receitas', icon: '💊' },
  { to: '/exams', label: 'Exames', shortLabel: 'Exames', icon: '📋' },
  { to: '/health-metrics', label: 'Dados de saúde', shortLabel: 'Saúde', icon: '📈' },
  { to: '/messages', label: 'Mensagens', shortLabel: 'Mensagens', icon: '💬' },
  { to: '/professionals', label: 'Profissionais', shortLabel: 'Profissionais', icon: '👨‍⚕️' },
  { to: '/lgpd', label: 'Privacidade e dados', shortLabel: 'LGPD', icon: '🔒' },
  { to: '/design-system', label: 'Design System', shortLabel: 'Design', icon: '🎨' },
];

export const PROFESSIONAL_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Início', shortLabel: 'Início', icon: '🏠' },
  { to: '/appointments', label: 'Agenda', shortLabel: 'Agenda', icon: '📅' },
  { to: '/clinical-notes', label: 'Prontuário', shortLabel: 'Prontuário', icon: '📋' },
  { to: '/notifications', label: 'Notificações', shortLabel: 'Notif.', icon: '🔔' },
  { to: '/prescriptions', label: 'Prescrições', shortLabel: 'Receitas', icon: '💊' },
  { to: '/exams', label: 'Exames', shortLabel: 'Exames', icon: '📋' },
  { to: '/messages', label: 'Mensagens', shortLabel: 'Mensagens', icon: '💬' },
  { to: '/lgpd', label: 'Privacidade e dados', shortLabel: 'LGPD', icon: '🔒' },
  { to: '/design-system', label: 'Design System', shortLabel: 'Design', icon: '🎨' },
];
