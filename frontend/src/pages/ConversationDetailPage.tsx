import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';

interface MessageItem {
  id: string;
  senderUserId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    if (!id) return;
    api<MessageItem[]>(`/messages/conversations/${id}/messages?take=100`)
      .then((list) => setMessages([...(list || [])].reverse()))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !content.trim()) return;
    setSending(true);
    setError('');
    try {
      await api('/messages/send', {
        method: 'POST',
        body: JSON.stringify({ conversationId: id, content: content.trim() }),
      });
      setContent('');
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar');
    } finally {
      setSending(false);
    }
  }

  if (!id) return null;

  return (
    <div className="app-page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ marginBottom: '0.75rem', flexShrink: 0 }}>
        <Link to="/messages" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>← Conversas</Link>
        <h1 style={{ fontSize: '1.25rem' }}>Conversa</h1>
      </header>
      {error && <p className="error-msg">{error}</p>}
      {loading && <p>Carregando...</p>}
      <div style={{ flex: 1, overflow: 'auto', marginBottom: '1rem' }}>
        {!loading && messages.length === 0 && <p>Nenhuma mensagem. Envie a primeira.</p>}
        {messages.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{
              marginBottom: '0.5rem',
              marginLeft: m.senderUserId === userId ? '2rem' : 0,
              marginRight: m.senderUserId !== userId ? '2rem' : 0,
              background: m.senderUserId === userId ? 'var(--primary)' : 'var(--surface)',
              color: m.senderUserId === userId ? '#fff' : 'var(--text)',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.875rem' }}>{m.content}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', opacity: 0.8 }}>
              {new Date(m.sentAt).toLocaleString('pt-BR')}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ flexShrink: 0, display: 'flex', gap: '0.5rem' }}>
        <input
          className="input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite uma mensagem..."
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !content.trim()} style={{ width: 'auto' }}>
          Enviar
        </button>
      </form>
    </div>
  );
}
