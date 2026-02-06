import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';

interface ProfessionalItem {
  id: string;
  userId: string;
  fullName: string;
  crm: string | null;
  specialty: string | null;
  phone: string | null;
  averageRating: number;
}

export function ProfessionalsPage() {
  const { role } = useAuth();
  const [list, setList] = useState<ProfessionalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<ProfessionalItem[]>('/professionals')
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-page">
      <header style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>← Voltar</Link>
        <h1 style={{ fontSize: '1.25rem' }}>Profissionais</h1>
      </header>
      {loading && <p>Carregando...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && list.length === 0 && <p>Nenhum profissional cadastrado.</p>}
      {!loading && list.length > 0 && (
        <div>
          {list.map((p) => (
            <div key={p.id} className="card">
              <strong>{p.fullName}</strong>
              {p.specialty && <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>{p.specialty}</p>}
              {p.crm && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.crm}</p>}
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>★ {p.averageRating.toFixed(1)}</p>
              {role === 'Patient' && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/messages?professionalId=${p.id}`} className="btn btn-secondary" style={{ flex: 1 }}>Mensagem</Link>
                  <Link to={`/ratings/${p.userId}`} className="btn btn-ghost" style={{ flex: 1 }}>Avaliar</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
