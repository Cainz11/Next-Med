import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../core/api';
import { useAuth } from '../core/AuthContext';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    gradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #5eead4 100%)',
    icon: '🏥',
    text: 'Sua saúde em um só lugar',
  },
  {
    id: 2,
    gradient: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 50%, #99f6e4 100%)',
    icon: '📅',
    text: 'Agende consultas com facilidade',
  },
  {
    id: 3,
    gradient: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
    icon: '📋',
    text: 'Prontuário e receitas digitais',
  },
  {
    id: 4,
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #14b8a6 100%)',
    icon: '👨‍⚕️',
    text: 'Conecte-se com profissionais',
  },
];

const CAROUSEL_INTERVAL_MS = 5000;

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  useEffect(() => {
    const t = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % CAROUSEL_SLIDES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      login(result);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-with-carousel">
      <div className="login-carousel" aria-hidden>
        {CAROUSEL_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`login-carousel__slide ${i === carouselIndex ? 'login-carousel__slide--active' : ''}`}
            style={{ background: slide.gradient }}
          >
            <div className="login-carousel__content">
              <span className="login-carousel__icon" aria-hidden>{slide.icon}</span>
              <p className="login-carousel__text">{slide.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="login-carousel__dots" aria-hidden>
        {CAROUSEL_SLIDES.map((_, i) => (
          <span
            key={i}
            className={`login-carousel__dot ${i === carouselIndex ? 'login-carousel__dot--active' : ''}`}
          />
        ))}
      </div>

      <div className="login-auth-card">
        <Link to="/" className="btn btn-ghost" style={{ width: 'auto', padding: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          ← Voltar
        </Link>
        <div className="logo" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Nexus Med</div>
        <h1 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>Entrar</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">E-mail</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="label">Senha</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Não tem conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
