import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../core/api';

interface Conversation {
  id: string;
  patientId: string;
  professionalId: string;
  patientName?: string;
  professionalName?: string;
  lastMessageAt: string | null;
  createdAt: string;
}

export function MessagesPage() {
  const [searchParams] = useSearchParams();
  const professionalId = searchParams.get('professionalId');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (professionalId) {
      api<{ id: string }>('/messages/conversations', {
        method: 'POST',
        body: JSON.stringify({ professionalId }),
      })
        .then((c) => {
          window.location.href = `/messages/${c.id}`;
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
      return;
    }
    api<Conversation[]>('/messages/conversations')
      .then(setConversations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [professionalId]);

  return (
    <div className="app-page">
      <header style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>← Voltar</Link>
        <h1 style={{ fontSize: '1.25rem' }}>Mensagens</h1>
      </header>
      {loading && <p>Carregando...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && conversations.length === 0 && (
        <p>Nenhuma conversa. Vá em Profissionais (paciente) para iniciar uma conversa.</p>
      )}
      {!loading && conversations.length > 0 && (
        <div>
          {conversations.map((c) => (
            <Link key={c.id} to={`/messages/${c.id}`} className="card" style={{ display: 'block', color: 'inherit' }}>
              <strong>{c.professionalName || c.patientName || 'Conversa'}</strong>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString('pt-BR') : new Date(c.createdAt).toLocaleString('pt-BR')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
