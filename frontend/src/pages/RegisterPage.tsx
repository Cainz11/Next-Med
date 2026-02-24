import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../core/api';
import { useAuth } from '../core/AuthContext';
import { maskCpf, unmaskCpf, maskPhone, unmaskPhone } from '../utils/masks';
import { validatePassword } from '../utils/passwordValidation';

type Tab = 'patient' | 'professional';

export function RegisterPage() {
  const [tab, setTab] = useState<Tab>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [crm, setCrm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(maskPhone(e.target.value));
  }

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDocumentNumber(maskCpf(e.target.value));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (passwordErrors.length) setPasswordErrors(validatePassword(e.target.value).errors);
  }

  function handlePasswordBlur() {
    if (password) setPasswordErrors(validatePassword(password).errors);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const pv = validatePassword(password);
    if (!pv.valid) {
      setPasswordErrors(pv.errors);
      return;
    }
    setLoading(true);
    try {
      const phoneValue = unmaskPhone(phone);
      const docValue = unmaskCpf(documentNumber);
      const result = tab === 'patient'
        ? await authApi.registerPatient({
            email,
            password,
            fullName,
            dateOfBirth: dateOfBirth || null,
            phone: phoneValue || null,
            documentNumber: docValue || null,
          })
        : await authApi.registerProfessional({
            email,
            password,
            fullName,
            crm: crm || null,
            specialty: specialty || null,
            phone: phoneValue || null,
          });
      login(result);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="logo">Nexus Med</div>
      <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textAlign: 'center' }}>Cadastro</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className={`btn ${tab === 'patient' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => setTab('patient')}
        >
          Paciente
        </button>
        <button
          type="button"
          className={`btn ${tab === 'professional' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => setTab('professional')}
        >
          Profissional
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Nome completo</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">E-mail</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Senha</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            required
            minLength={6}
            placeholder="Mín. 6 caracteres, uma letra e um número"
          />
          {passwordErrors.length > 0 && (
            <p className="error-msg">{passwordErrors.join(' ')}</p>
          )}
        </div>
        <div className="form-group">
          <label className="label">Telefone</label>
          <input type="tel" className="input" value={phone} onChange={handlePhoneChange} placeholder="(11) 99999-9999" />
        </div>
        {tab === 'patient' && (
          <>
            <div className="form-group">
              <label className="label">Data de nascimento</label>
              <input type="date" className="input" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">CPF (opcional)</label>
              <input className="input" value={documentNumber} onChange={handleCpfChange} placeholder="000.000.000-00" maxLength={14} />
            </div>
          </>
        )}
        {tab === 'professional' && (
          <>
            <div className="form-group">
              <label className="label">CRM</label>
              <input className="input" value={crm} onChange={(e) => setCrm(e.target.value)} placeholder="CRM/UF" />
            </div>
            <div className="form-group">
              <label className="label">Especialidade</label>
              <input className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Ex: Clínico geral" />
            </div>
          </>
        )}
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
