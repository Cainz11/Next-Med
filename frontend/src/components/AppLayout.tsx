import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../core/AuthContext';
import { NotificationBell } from './NotificationBell';
import { PATIENT_NAV, PROFESSIONAL_NAV } from '../config/nav';

export function AppLayout() {
  const { email, role, logout } = useAuth();
  const navItems = role === 'Professional' ? PROFESSIONAL_NAV : PATIENT_NAV;

  return (
    <div className="app-layout">
      <header className="app-layout__bar">
        <div className="app-layout__bar-left">
          <Link to="/dashboard" className="app-layout__logo" aria-label="Nexus Med - Início">
            Nexus Med
          </Link>
        </div>
        <div className="app-layout__bar-right">
          <NotificationBell />
          <span className="app-layout__user" title={email}>
            {role === 'Patient' ? 'Paciente' : 'Profissional'}
          </span>
          <button type="button" className="btn btn-ghost app-layout__logout" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <aside className="app-layout__sidebar" aria-label="Navegação principal">
        <nav className="app-layout__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'app-layout__nav-link' + (isActive ? ' app-layout__nav-link--active' : '')
              }
              end={item.to === '/dashboard'}
            >
              {item.icon && <span className="app-layout__nav-icon" aria-hidden>{item.icon}</span>}
              <span className="app-layout__nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-layout__main">
        <div className="app-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
