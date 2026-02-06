import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';

interface HealthMetricItem {
  id: string;
  metricType: string;
  value: number | null;
  unit: string | null;
  notes: string | null;
  recordedAt: string;
  createdAt: string;
}

export function HealthMetricsPage() {
  const { role } = useAuth();
  const [list, setList] = useState<HealthMetricItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [metricType, setMetricType] = useState('Glicemia');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [notes, setNotes] = useState('');

  const load = () => {
    api<HealthMetricItem[]>('/health-metrics')
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setSaving(true);
    try {
      await api('/health-metrics', {
        method: 'POST',
        body: JSON.stringify({
          metricType,
          value: parseFloat(value) || null,
          unit: unit || null,
          notes: notes || null,
          recordedAt: new Date().toISOString(),
        }),
      });
      setValue('');
      setUnit('');
      setNotes('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-page">
      <header style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>← Voltar</Link>
        <h1 style={{ fontSize: '1.25rem' }}>Dados de saúde</h1>
      </header>
      {role === 'Patient' && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Registrar</h2>
          <div className="form-group">
            <label className="label">Tipo</label>
            <select className="input" value={metricType} onChange={(e) => setMetricType(e.target.value)}>
              <option value="Glicemia">Glicemia</option>
              <option value="PA">Pressão arterial</option>
              <option value="Peso">Peso</option>
              <option value="AtividadeFisica">Atividade física</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Valor</label>
            <input type="text" className="input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ex: 95 ou 120/80" />
          </div>
          <div className="form-group">
            <label className="label">Unidade (opcional)</label>
            <input className="input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="mg/dL, kg, min" />
          </div>
          <div className="form-group">
            <label className="label">Observação (opcional)</label>
            <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </form>
      )}
      {loading && <p>Carregando...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && list.length === 0 && <p>Nenhum registro.</p>}
      {!loading && list.length > 0 && (
        <div>
          {list.map((m) => (
            <div key={m.id} className="card">
              <strong>{m.metricType}</strong>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
                {m.value != null && `${m.value} ${m.unit || ''}`.trim()}
                {m.notes && ` · ${m.notes}`}
              </p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(m.recordedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
