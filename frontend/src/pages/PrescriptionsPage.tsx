import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';

interface PrescriptionItem {
  id: string;
  patientId?: string;
  professionalId?: string;
  description: string | null;
  filePath: string | null;
  issuedAt: string;
  createdAt: string;
}

export function PrescriptionsPage() {
  const { role } = useAuth();
  const [list, setList] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<PrescriptionItem[]>('/prescriptions')
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-page">
      <header style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>← Voltar</Link>
        <h1 style={{ fontSize: '1.25rem' }}>Receituário</h1>
      </header>
      {loading && <p>Carregando...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && list.length === 0 && <p>Nenhuma prescrição.</p>}
      {!loading && list.length > 0 && (
        <div>
          {list.map((p) => (
            <div key={p.id} className="card">
              <strong>{p.description || 'Receita'}</strong>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Emitida em {new Date(p.issuedAt).toLocaleDateString('pt-BR')}
              </p>
              {p.filePath && <a href={p.filePath} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem' }}>Abrir arquivo</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
