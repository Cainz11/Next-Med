import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';
import { useToast } from '../components/ToastContext';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';

interface ClinicalNoteItem {
  id: string;
  appointmentId: string | null;
  patientId: string;
  professionalId: string;
  content: string;
  noteType: string;
  createdAt: string;
  updatedAt: string | null;
  professionalName: string | null;
}

interface PatientOption {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
}

const NOTE_TYPE_LABEL: Record<string, string> = {
  Evolution: 'Evolução',
  Anamnesis: 'Anamnese',
  Conduct: 'Conduta',
};

function formatNoteDate(d: string) {
  const date = new Date(d);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function ClinicalNotesPage() {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');
  const { role } = useAuth();
  const { addToast } = useToast();
  const [notes, setNotes] = useState<ClinicalNoteItem[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(patientIdParam || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newNoteType, setNewNoteType] = useState('Evolution');

  useEffect(() => {
    if (patientIdParam) setSelectedPatientId(patientIdParam);
  }, [patientIdParam]);

  useEffect(() => {
    if (role === 'Professional') {
      api<PatientOption[]>('/patients?all=true')
        .then(setPatients)
        .catch(() => setPatients([]));
    }
  }, [role]);

  useEffect(() => {
    if (role === 'Professional' && selectedPatientId) {
      setLoading(true);
      setError('');
      api<ClinicalNoteItem[]>('/clinical-notes?patientId=' + selectedPatientId)
        .then(setNotes)
        .catch((e) => { setError(e.message); addToast(e.message, 'error'); })
        .finally(() => setLoading(false));
    } else {
      setNotes([]);
    }
  }, [role, selectedPatientId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !newContent.trim()) return;
    setSaving(true);
    setError('');
    try {
      await api('/clinical-notes', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatientId,
          appointmentId: null,
          content: newContent.trim(),
          noteType: newNoteType,
        }),
      });
      addToast('Evolução registrada com sucesso.');
      setNewContent('');
      const list = await api<ClinicalNoteItem[]>('/clinical-notes?patientId=' + selectedPatientId);
      setNotes(list);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (role !== 'Professional') {
    return (
      <div className="app-page">
        <PageHeader title="Prontuário" backTo="/dashboard" />
        <EmptyState
          icon="🔒"
          title="Acesso restrito"
          description="Apenas profissionais de saúde podem acessar o prontuário e registrar evoluções."
        />
      </div>
    );
  }

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="app-page">
      <PageHeader title="Prontuário / Evolução" backTo="/dashboard" />
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <label className="label" htmlFor="patient-select">Paciente</label>
        <select
          id="patient-select"
          className="input"
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          aria-describedby="patient-hint"
        >
          <option value="">Selecione um paciente para ver o prontuário</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.fullName} · {p.email}</option>
          ))}
        </select>
        <p id="patient-hint" className="form-hint">Lista inclui todos os pacientes cadastrados.</p>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {selectedPatientId && (
        <>
          <form onSubmit={handleCreate} className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Nova evolução</h2>
            <p className="form-hint" style={{ marginBottom: '1rem' }}>Paciente: {selectedPatient?.fullName}</p>
            <div className="form-group">
              <label className="label" htmlFor="note-type">Tipo</label>
              <select id="note-type" className="input" value={newNoteType} onChange={(e) => setNewNoteType(e.target.value)}>
                <option value="Evolution">Evolução</option>
                <option value="Anamnesis">Anamnese</option>
                <option value="Conduct">Conduta</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label" htmlFor="note-content">Conteúdo</label>
              <textarea
                id="note-content"
                className="input"
                rows={5}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Registre a evolução do atendimento, queixas, exame físico, conduta..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Registrar evolução'}
            </button>
          </form>

          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 600 }}>Histórico do paciente</h2>
          {loading && (
            <div className="card skeleton skeleton-card" />
          )}
          {!loading && notes.length === 0 && (
            <EmptyState
              icon="📝"
              title="Nenhuma evolução ainda"
              description="Registre a primeira evolução usando o formulário acima."
            />
          )}
          {!loading && notes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notes.map((n) => (
                <article key={n.id} className="card" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`badge ${n.noteType === 'Evolution' ? 'badge-success' : n.noteType === 'Anamnesis' ? 'badge-warning' : 'badge-muted'}`}>
                      {NOTE_TYPE_LABEL[n.noteType] ?? n.noteType}
                    </span>
                    <time dateTime={n.createdAt} style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {formatNoteDate(n.createdAt)}
                    </time>
                  </div>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.9375rem' }}>{n.content}</p>
                  {n.professionalName && (
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dr(a). {n.professionalName}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {!selectedPatientId && patients.length > 0 && (
        <EmptyState
          icon="👤"
          title="Selecione um paciente"
          description="Escolha um paciente no campo acima para visualizar o prontuário e registrar evoluções."
        />
      )}

      {!selectedPatientId && patients.length === 0 && (
        <EmptyState
          icon="📋"
          title="Nenhum paciente cadastrado"
          description="Os pacientes que você atender (mensagens, receitas ou exames) aparecerão aqui para registro de prontuário."
        />
      )}
    </div>
  );
}
