import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../core/api';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../components/ToastContext';

interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string | null;
  type: string;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

function groupByDate(items: NotificationItem[]) {
  const groups: { label: string; items: NotificationItem[] }[] = [];
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 864e5).toDateString();
  const byDate = new Map<string, NotificationItem[]>();
  items.forEach((n) => {
    const d = new Date(n.createdAt).toDateString();
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(n);
  });
  const sortedDates = Array.from(byDate.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  sortedDates.forEach((d) => {
    let label = new Date(d).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
    if (d === today) label = 'Hoje';
    else if (d === yesterday) label = 'Ontem';
    groups.push({ label, items: byDate.get(d)! });
  });
  return groups;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const load = () => {
    setError('');
    api<{ items: NotificationItem[]; unreadCount: number }>('/notifications?unreadOnly=false&take=50')
      .then((data) => {
        setItems(data.items);
        setUnreadCount(data.unreadCount);
      })
      .catch((e) => { setError(e.message); addToast(e.message, 'error'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkAsRead = async (id: string) => {
    const item = items.find((n) => n.id === id);
    setMarkingId(id);
    try {
      await api('/notifications/' + id + '/read', { method: 'POST' });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      if (item?.relatedEntityType === 'Appointment' && item.relatedEntityId) {
        navigate('/appointments');
      }
    } catch {
      load();
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api('/notifications/mark-all-read', { method: 'POST' });
      addToast('Todas as notificações foram marcadas como lidas.');
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Erro ao marcar.', 'error');
    }
  };

  const groups = groupByDate(items);

  return (
    <div className="app-page">
      <PageHeader
        title="Notificações"
        backTo="/dashboard"
        right={
          unreadCount > 0 ? (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
              onClick={handleMarkAllRead}
            >
              Marcar todas como lidas
            </button>
          ) : null
        }
      />

      {error && <p className="error-msg">{error}</p>}

      {loading && (
        <>
          <div className="card skeleton skeleton-card" />
          <div className="card skeleton skeleton-card" />
          <div className="card skeleton skeleton-card" />
        </>
      )}

      {!loading && items.length === 0 && (
        <EmptyState
          icon="🔔"
          title="Nenhuma notificação"
          description="Quando você agendar ou cancelar consultas, ou receber mensagens, os avisos aparecerão aqui."
        />
      )}

      {!loading && items.length > 0 && (
        <section aria-label="Lista de notificações">
          {groups.map((g) => (
            <div key={g.label} style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                {g.label}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {g.items.map((n) => (
                  <div
                    key={n.id}
                    className={`card ${!n.isRead ? 'card-clickable' : ''}`}
                    style={{
                      marginBottom: 0,
                      opacity: n.isRead ? 0.88 : 1,
                      borderLeft: !n.isRead ? '3px solid var(--primary)' : undefined,
                    }}
                    onClick={() => !n.isRead && !markingId && handleMarkAsRead(n.id)}
                    onKeyDown={(e) => e.key === 'Enter' && !n.isRead && !markingId && handleMarkAsRead(n.id)}
                    role={!n.isRead ? 'button' : undefined}
                    tabIndex={!n.isRead ? 0 : undefined}
                    aria-label={n.isRead ? undefined : `Marcar como lida: ${n.title}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '0.9375rem' }}>{n.title}</strong>
                        {n.body && <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.body}</p>}
                      </div>
                      {!n.isRead && (
                        <span className="badge badge-success" style={{ flexShrink: 0 }}>Nova</span>
                      )}
                    </div>
                    <time dateTime={n.createdAt} style={{ display: 'block', marginTop: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(n.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
