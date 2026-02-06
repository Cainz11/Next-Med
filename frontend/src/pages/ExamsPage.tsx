import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';

interface ExamItem {
  id: string;
  patientId: string;
  name: string | null;
  filePath: string | null;
  examDate: string | null;
  createdAt: string;
}

export function ExamsPage() {
  const { role } = useAuth();
  const [list, setList] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api<ExamItem[]>('/exams')
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-page">
      <header style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>← Voltar</Link>
        <h1 style={{ fontSize: '1.25rem' }}>Exames</h1>
      </header>
      {loading && <p>Carregando...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && list.length === 0 && <p>Nenhum exame.</p>}
      {!loading && list.length > 0 && (
        <div>
          {list.map((e) => (
            <div key={e.id} className="card">
              <strong>{e.name || 'Exame'}</strong>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {e.examDate ? new Date(e.examDate).toLocaleDateString('pt-BR') : 'Sem data'}
              </p>
              {e.filePath && <a href={e.filePath} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem' }}>Abrir arquivo</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
