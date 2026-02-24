import { Link } from 'react-router-dom';
import { useAuth } from '../core/AuthContext';

export function DashboardPage() {
  const { email, role } = useAuth();

  return (
    <div className="app-page">
      <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Olá!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{email} · {role === 'Patient' ? 'Paciente' : 'Profissional'}</p>

      {role === 'Patient' && (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/appointments" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Consultas</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Agendar e ver minhas consultas</p>
          </Link>
          <Link to="/notifications" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Notificações</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ver avisos e lembretes</p>
          </Link>
          <Link to="/prescriptions" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Receituário</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ver receitas e prescrições</p>
          </Link>
          <Link to="/exams" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Exames</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ver e enviar exames</p>
          </Link>
          <Link to="/health-metrics" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Dados de saúde</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Glicemia, PA, atividade física</p>
          </Link>
          <Link to="/messages" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Mensagens</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Conversar com profissionais</p>
          </Link>
          <Link to="/professionals" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Profissionais</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Buscar médicos e avaliar</p>
          </Link>
          <Link to="/lgpd" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Privacidade e dados</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Exportar dados, excluir conta</p>
          </Link>
        </nav>
      )}

      {role === 'Professional' && (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/appointments" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Agenda</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Disponibilidade e consultas</p>
          </Link>
          <Link to="/clinical-notes" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Prontuário</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Evoluções e anotações por paciente</p>
          </Link>
          <Link to="/notifications" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Notificações</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ver avisos</p>
          </Link>
          <Link to="/prescriptions" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Prescrições</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Emitir e listar receitas</p>
          </Link>
          <Link to="/exams" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Exames</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ver exames dos pacientes</p>
          </Link>
          <Link to="/messages" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Mensagens</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Conversas com pacientes</p>
          </Link>
          <Link to="/lgpd" className="card" style={{ display: 'block', color: 'inherit' }}>
            <strong>Privacidade e dados</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Exportar dados, excluir conta</p>
          </Link>
        </nav>
      )}
    </div>
  );
}
