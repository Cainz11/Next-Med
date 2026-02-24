import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';

interface RatingSummary {
  score: number;
  comment: string | null;
  createdAt: string;
}

interface ProfessionalRating {
  userId: string;
  averageScore: number;
  totalRatings: number;
  recentRatings: RatingSummary[];
}

export function RatingsPage() {
  const { id: professionalUserId } = useParams<{ id: string }>();
  const { role } = useAuth();
  const [data, setData] = useState<ProfessionalRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [context, setContext] = useState('');

  useEffect(() => {
    if (!professionalUserId) {
      setError('Profissional não informado.');
      setLoading(false);
      return;
    }
    api<ProfessionalRating>(`/ratings/professional/${professionalUserId}?recentCount=20`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [professionalUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professionalUserId || role !== 'Patient') return;
    setSaving(true);
    setSubmitError('');
    try {
      await api('/ratings', {
        method: 'POST',
        body: JSON.stringify({
          ratedUserId: professionalUserId,
          context: context || null,
          score,
          comment: comment.trim() || null,
        }),
      });
      setComment('');
      setContext('');
      const updated = await api<ProfessionalRating>(`/ratings/professional/${professionalUserId}?recentCount=20`);
      setData(updated);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao enviar avaliação.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-page">
      <header style={{ marginBottom: '1rem' }}>
        <Link to="/professionals" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>
          ← Voltar
        </Link>
        <h1 style={{ fontSize: '1.25rem' }}>Avaliações do profissional</h1>
      </header>
      {loading && <p>Carregando...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && data && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>
              <strong>Média:</strong> ★ {data.averageScore.toFixed(1)} ({data.totalRatings} avaliações)
            </p>
          </div>
          {role === 'Patient' && (
            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Deixe sua avaliação</h2>
              <div className="form-group">
                <label className="label">Nota (1–5)</label>
                <select
                  className="input"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  required
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Contexto (opcional)</label>
                <input
                  type="text"
                  className="input"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Ex: Consulta, Telemedicina"
                />
              </div>
              <div className="form-group">
                <label className="label">Comentário (opcional)</label>
                <textarea
                  className="input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Sua opinião..."
                  rows={3}
                />
              </div>
              {submitError && <p className="error-msg">{submitError}</p>}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Enviando...' : 'Enviar avaliação'}
              </button>
            </form>
          )}
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Avaliações recentes</h2>
          {data.recentRatings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma avaliação ainda.</p>
          ) : (
            <div>
              {data.recentRatings.map((r, i) => (
                <div key={i} className="card">
                  <p style={{ margin: 0 }}>
                    ★ {r.score} · {r.createdAt ? new Date(r.createdAt).toLocaleString('pt-BR') : ''}
                  </p>
                  {r.comment && <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
