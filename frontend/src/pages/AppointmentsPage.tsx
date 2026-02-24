import { useEffect, useState } from 'react';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';
import { useToast } from '../components/ToastContext';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';

interface AppointmentItem {
  id: string;
  patientId: string;
  professionalId: string;
  slotId: string | null;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  appointmentType: string;
  notes: string | null;
  createdAt: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  patientName: string | null;
  professionalName: string | null;
}

interface SlotItem {
  id: string;
  professionalId: string;
  startAt: string;
  endAt: string;
  slotType: string;
  createdAt: string;
}

interface ProfessionalOption {
  id: string;
  userId: string;
  fullName: string;
  crm: string | null;
  specialty: string | null;
  phone: string | null;
  averageRating: number;
}

function formatDate(d: string) {
  const date = new Date(d);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function AppointmentsPage() {
  const { role } = useAuth();
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'list' | 'slots' | 'book'>('list');
  const [slotFrom, setSlotFrom] = useState('');
  const [slotTo, setSlotTo] = useState('');
  const [slotType, setSlotType] = useState('Presencial');
  const [bookProfessionalId, setBookProfessionalId] = useState('');
  const [bookFrom, setBookFrom] = useState('');
  const [bookTo, setBookTo] = useState('');
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState('');
  const [cancelReason, setCancelReason] = useState<Record<string, string>>({});
  const [cancelTarget, setCancelTarget] = useState<AppointmentItem | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  const loadAppointments = () =>
    api<AppointmentItem[]>('/appointments')
      .then(setAppointments)
      .catch((e) => { setError(e.message); addToast(e.message, 'error'); });

  useEffect(() => {
    loadAppointments()
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (role === 'Professional' && tab === 'slots') {
      const from = slotFrom ? new Date(slotFrom) : new Date();
      const to = slotTo ? new Date(slotTo) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      setLoadingSlots(true);
      api<SlotItem[]>('/availability-slots?from=' + from.toISOString() + '&to=' + to.toISOString())
        .then(setSlots)
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [role, tab, slotFrom, slotTo]);

  useEffect(() => {
    if (role === 'Patient' && tab === 'book') {
      api<ProfessionalOption[]>('/professionals').then(setProfessionals).catch(() => setProfessionals([]));
    }
  }, [role, tab]);

  const loadAvailableSlots = () => {
    if (!bookProfessionalId || !bookFrom || !bookTo) {
      addToast('Selecione o profissional e o período (de/até).', 'error');
      return;
    }
    setLoadingAvailable(true);
    setCreateError('');
    api<SlotItem[]>(`/appointments/available-slots?professionalId=${bookProfessionalId}&from=${new Date(bookFrom).toISOString()}&to=${new Date(bookTo).toISOString()}`)
      .then((list) => {
        setAvailableSlots(list);
        if (list.length === 0) addToast('Nenhum horário livre neste período. Tente outras datas.', 'error');
      })
      .catch((e) => { setAvailableSlots([]); addToast(e.message, 'error'); })
      .finally(() => setLoadingAvailable(false));
  };

  const handleCreateSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotFrom || !slotTo) return;
    setSaving(true);
    setCreateError('');
    try {
      const from = new Date(slotFrom);
      const to = new Date(slotTo);
      const slotsPayload: { startAt: string; endAt: string; slotType: string }[] = [];
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const start = new Date(d);
        start.setHours(9, 0, 0, 0);
        const end = new Date(d);
        end.setHours(17, 0, 0, 0);
        for (let h = start.getHours(); h < end.getHours(); h++) {
          const s = new Date(d);
          s.setHours(h, 0, 0, 0);
          const e = new Date(d);
          e.setHours(h + 1, 0, 0, 0);
          slotsPayload.push({ startAt: s.toISOString(), endAt: e.toISOString(), slotType });
        }
      }
      await api('/availability-slots', { method: 'POST', body: JSON.stringify({ slots: slotsPayload }) });
      addToast(`Horários criados: ${slotsPayload.length} slots disponíveis.`);
      setSlotFrom('');
      setSlotTo('');
      api<SlotItem[]>('/availability-slots?from=' + from.toISOString() + '&to=' + to.toISOString()).then(setSlots);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar horários.';
      setCreateError(msg);
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    setSaving(true);
    setCreateError('');
    try {
      await api('/appointments', {
        method: 'POST',
        body: JSON.stringify({ professionalId: bookProfessionalId, slotId }),
      });
      addToast('Consulta agendada com sucesso.');
      loadAppointments();
      setTab('list');
      setAvailableSlots([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao agendar.';
      setCreateError(msg);
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await api('/appointments/' + cancelTarget.id + '/cancel', {
        method: 'POST',
        body: JSON.stringify({ reason: cancelReason[cancelTarget.id] || null }),
      });
      addToast('Consulta cancelada.');
      loadAppointments();
      setCancelReason((prev) => ({ ...prev, [cancelTarget.id]: '' }));
      setCancelTarget(null);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Erro ao cancelar.', 'error');
    }
  };

  const scheduled = appointments.filter((a) => a.status === 'Scheduled');
  const pastOrCancelled = appointments.filter((a) => a.status !== 'Scheduled');

  return (
    <div className="app-page">
      <PageHeader
        title={role === 'Patient' ? 'Minhas consultas' : 'Agenda'}
        backTo="/dashboard"
      />
      {role === 'Professional' && (
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'list'}
            onClick={() => setTab('list')}
          >
            Consultas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'slots'}
            onClick={() => setTab('slots')}
          >
            Disponibilidade
          </button>
        </div>
      )}
      {role === 'Patient' && (
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'list'}
            onClick={() => setTab('list')}
          >
            Minhas consultas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'book'}
            onClick={() => setTab('book')}
          >
            Agendar
          </button>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}
      {createError && <p className="error-msg">{createError}</p>}

      {tab === 'list' && (
        <>
          {loading && (
            <>
              <div className="card skeleton skeleton-card" />
              <div className="card skeleton skeleton-card" />
              <div className="card skeleton skeleton-card" />
            </>
          )}
          {!loading && appointments.length === 0 && (
            <EmptyState
              icon="📅"
              title="Nenhuma consulta"
              description={role === 'Patient' ? 'Agende sua primeira consulta pela aba "Agendar" e escolha um profissional e horário.' : 'Crie horários em "Disponibilidade" para que os pacientes possam agendar.'}
              action={role === 'Patient' ? <button type="button" className="btn btn-primary" onClick={() => setTab('book')}>Agendar consulta</button> : <button type="button" className="btn btn-primary" onClick={() => setTab('slots')}>Ver disponibilidade</button>}
            />
          )}
          {!loading && appointments.length > 0 && (
            <section aria-label="Lista de consultas">
              {scheduled.length > 0 && (
                <>
                  <h2 className="label" style={{ marginBottom: '0.5rem' }}>Próximas</h2>
                  {scheduled.map((a) => (
                    <div key={a.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ display: 'block' }}>{a.patientName || a.professionalName || 'Consulta'}</strong>
                          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                            {formatDate(a.scheduledAt)} · {a.durationMinutes} min · {a.appointmentType === 'Telemedicina' ? 'Online' : 'Presencial'}
                          </p>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--surface)' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Motivo do cancelamento (opcional)"
                          value={cancelReason[a.id] || ''}
                          onChange={(e) => setCancelReason((prev) => ({ ...prev, [a.id]: e.target.value }))}
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <button type="button" className="btn btn-ghost" onClick={() => setCancelTarget(a)} style={{ width: 'auto', padding: '0.5rem' }}>
                          Cancelar consulta
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {pastOrCancelled.length > 0 && (
                <>
                  <h2 className="label" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Anteriores</h2>
                  {pastOrCancelled.map((a) => (
                    <div key={a.id} className="card" style={{ opacity: 0.9 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ display: 'block' }}>{a.patientName || a.professionalName || 'Consulta'}</strong>
                          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                            {formatDate(a.scheduledAt)} · {a.durationMinutes} min
                          </p>
                          {a.status === 'Cancelled' && a.cancellationReason && (
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Motivo: {a.cancellationReason}</p>
                          )}
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </section>
          )}
        </>
      )}

      {tab === 'slots' && role === 'Professional' && (
        <>
          <form onSubmit={handleCreateSlots} className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Criar horários disponíveis</h2>
            <p className="form-hint">Blocos de 1 hora, das 9h às 17h, para cada dia no período.</p>
            <div className="form-group">
              <label className="label">Data inicial</label>
              <input type="date" className="input" value={slotFrom} onChange={(e) => setSlotFrom(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Data final</label>
              <input type="date" className="input" value={slotTo} onChange={(e) => setSlotTo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Tipo de atendimento</label>
              <select className="input" value={slotType} onChange={(e) => setSlotType(e.target.value)}>
                <option value="Presencial">Presencial</option>
                <option value="Telemedicina">Telemedicina</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Criando...' : 'Criar horários'}
            </button>
          </form>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 600 }}>Meus slots</h2>
          {loadingSlots && <div className="card skeleton skeleton-card" />}
          {!loadingSlots && slots.length === 0 && (
            <EmptyState
              icon="🕐"
              title="Nenhum horário no período"
              description='Defina as datas acima e clique em "Criar horários" para liberar sua agenda.'
            />
          )}
          {!loadingSlots && slots.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {slots.slice(0, 50).map((s) => (
                <div key={s.id} className="card" style={{ marginBottom: 0, padding: '0.75rem 1rem' }}>
                  {new Date(s.startAt).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} · {new Date(s.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} – {new Date(s.endAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {s.slotType}
                </div>
              ))}
              {slots.length > 50 && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>… e mais {slots.length - 50} horários</p>}
            </div>
          )}
        </>
      )}

      {tab === 'book' && role === 'Patient' && (
        <>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <label className="label">Profissional</label>
            <select
              className="input"
              value={bookProfessionalId}
              onChange={(e) => { setBookProfessionalId(e.target.value); setAvailableSlots([]); }}
            >
              <option value="">Selecione um profissional</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} {p.specialty ? `· ${p.specialty}` : ''} {p.crm ? `· ${p.crm}` : ''}
                </option>
              ))}
            </select>
            <div className="form-group">
              <label className="label">De (data)</label>
              <input type="date" className="input" value={bookFrom} onChange={(e) => setBookFrom(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Até (data)</label>
              <input type="date" className="input" value={bookTo} onChange={(e) => setBookTo(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary" onClick={loadAvailableSlots} disabled={loadingAvailable}>
              {loadingAvailable ? 'Buscando...' : 'Buscar horários disponíveis'}
            </button>
          </div>
          {availableSlots.length > 0 && (
            <section aria-label="Horários disponíveis">
              <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: 600 }}>Escolha um horário</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {availableSlots.map((s) => (
                  <div key={s.id} className="card card-clickable" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
                    <span style={{ fontSize: '0.9375rem' }}>
                      {new Date(s.startAt).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} às {new Date(s.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {s.slotType}
                    </span>
                    <button type="button" className="btn btn-primary" style={{ width: 'auto', flexShrink: 0 }} onClick={() => handleBookSlot(s.id)} disabled={saving}>
                      Agendar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {!bookProfessionalId && !loadingAvailable && (
            <EmptyState
              icon="👨‍⚕️"
              title="Selecione um profissional"
              description='Escolha o profissional, o período (de e até) e clique em "Buscar horários disponíveis".'
            />
          )}
        </>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        title="Cancelar consulta?"
        description={cancelTarget ? `A consulta de ${formatDate(cancelTarget.scheduledAt)} será cancelada. O outro participante será notificado.` : ''}
        confirmLabel="Sim, cancelar"
        cancelLabel="Manter consulta"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}
