import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../core/api';
import { useAuth } from '../core/AuthContext';

const DEFAULT_CONSENT_PURPOSE = 'Uso de dados de saúde no app Nexus Med';

interface ConsentStatus {
  accepted: boolean | null;
  recordedAt: string | null;
}

export function LgpdPage() {
  const { logout } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [consentPurpose, setConsentPurpose] = useState(DEFAULT_CONSENT_PURPOSE);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus | null>(null);
  const [loadingConsentStatus, setLoadingConsentStatus] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api<ConsentStatus>(`/lgpd/consent-status?purpose=${encodeURIComponent(DEFAULT_CONSENT_PURPOSE)}`)
      .then(setConsentStatus)
      .catch(() => setConsentStatus({ accepted: null, recordedAt: null }))
      .finally(() => setLoadingConsentStatus(false));
  }, []);

  async function handleExport() {
    setError('');
    setExporting(true);
    try {
      const data = await api<object>('/lgpd/export-my-data');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus-med-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Exportação concluída. O arquivo foi baixado.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao exportar');
    } finally {
      setExporting(false);
    }
  }

  async function handleConsent(accepted: boolean) {
    setError('');
    try {
      await api('/lgpd/consent', {
        method: 'POST',
        body: JSON.stringify({ purpose: consentPurpose, accepted }),
      });
      setMessage(accepted ? 'Consentimento registrado.' : 'Registro de não consentimento salvo.');
      setConsentStatus({ accepted, recordedAt: new Date().toISOString() });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao registrar');
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza? Todos os seus dados serão excluídos e você será deslogado.')) return;
    setError('');
    setDeleting(true);
    try {
      await api('/lgpd/my-account', { method: 'DELETE' });
      logout();
      window.location.href = '/login';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir conta');
      setDeleting(false);
    }
  }

  return (
    <div className="app-page">
      <header style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem' }}>← Voltar</Link>
        <h1 style={{ fontSize: '1.25rem' }}>Privacidade e dados (LGPD)</h1>
      </header>
      {message && <p style={{ color: 'var(--primary)' }}>{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Exportar meus dados</h2>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
          Baixe uma cópia de todos os seus dados em formato JSON.
        </p>
        <button type="button" className="btn btn-primary" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exportando...' : 'Exportar dados'}
        </button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Consentimento</h2>
        {loadingConsentStatus ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Carregando...</p>
        ) : consentStatus?.accepted === true ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
            Você já registrou seu consentimento para esta finalidade
            {consentStatus.recordedAt
              ? ` em ${new Date(consentStatus.recordedAt).toLocaleDateString('pt-BR')}.`
              : '.'}
          </p>
        ) : (
          <>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
              Registre seu consentimento para tratamento de dados.
            </p>
            <div className="form-group">
              <label className="label">Finalidade</label>
              <input className="input" value={consentPurpose} onChange={(e) => setConsentPurpose(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-primary" onClick={() => handleConsent(true)}>Aceitar</button>
              <button type="button" className="btn btn-secondary" onClick={() => handleConsent(false)}>Recusar</button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Excluir minha conta</h2>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
          Exclui permanentemente sua conta e dados. Esta ação não pode ser desfeita.
        </p>
        <button type="button" className="btn btn-ghost" style={{ color: 'var(--error)' }} onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Excluindo...' : 'Excluir minha conta'}
        </button>
      </div>
    </div>
  );
}
