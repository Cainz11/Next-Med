import { Link } from 'react-router-dom';
import { useAuth } from '../core/AuthContext';
import { PATIENT_NAV, PROFESSIONAL_NAV } from '../config/nav';

export function DashboardPage() {
  const { fullName, email, role } = useAuth();
  const navItems = role === 'Professional' ? PROFESSIONAL_NAV : PATIENT_NAV;
  const items = navItems.filter((item) => item.to !== '/dashboard');

  return (
    <div className="app-page">
      <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Olá, {fullName?.trim() ? fullName : email}!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{role === 'Patient' ? 'Paciente' : 'Profissional'}</p>

      {/* Em desktop o menu lateral já existe; em mobile os cards são o acesso principal */}
      <p className="dashboard-hint">
        Use o menu ao lado para acessar Agenda, Prontuário, Notificações e demais seções.
      </p>
      <nav className="dashboard-cards">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="card card-clickable dashboard-card" style={{ color: 'inherit' }}>
            {item.icon && <span className="dashboard-card__icon" aria-hidden>{item.icon}</span>}
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>
    </div>
  );
}
