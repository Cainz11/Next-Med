import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🏥', title: 'Consultas e agenda', desc: 'Agende e gerencie suas consultas em um só lugar.' },
  { icon: '📋', title: 'Prontuário digital', desc: 'Evoluções, receitas e exames sempre à mão.' },
  { icon: '🔔', title: 'Lembretes', desc: 'Notificações para não perder nenhum compromisso.' },
];

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__header">
        <span className="landing__logo">Nexus Med</span>
      </header>
      <main className="landing__main">
        <h1 className="landing__title">
          Sua saúde, <span className="landing__title-accent">conectada</span>
        </h1>
        <p className="landing__tagline">
          Para pacientes e profissionais. Agenda, prontuário, receitas e mais em um único app.
        </p>
        <div className="landing__features">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing__feature">
              <span className="landing__feature-icon" aria-hidden>{f.icon}</span>
              <div>
                <strong className="landing__feature-title">{f.title}</strong>
                <p className="landing__feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="landing__ctas">
          <Link to="/login" className="btn btn-primary landing__cta">
            Entrar
          </Link>
          <Link to="/register" className="btn btn-secondary landing__cta">
            Cadastrar
          </Link>
        </div>
      </main>
    </div>
  );
}
