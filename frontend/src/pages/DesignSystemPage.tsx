import { useState } from 'react';
import { Link } from 'react-router-dom';

export function DesignSystemPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colors = {
    primary: [
      { name: 'Nexus Blue', hex: '#0B6E99', desc: 'Principal' },
      { name: 'Nexus Blue 80', hex: '#0D84B8', desc: 'Hover/Ativo' },
      { name: 'Nexus Blue 20', hex: '#E6F2F7', desc: 'Background' },
    ],
    secondary: [
      { name: 'Nexus Green', hex: '#0D9488', desc: 'Sucesso/Saúde' },
      { name: 'Nexus Green 20', hex: '#CCFBF1', desc: 'Background' },
    ],
    neutrals: [
      { name: 'Surface', hex: '#F8FAFC', desc: 'Background geral' },
      { name: 'Surface Card', hex: '#FFFFFF', desc: 'Cards' },
      { name: 'Text Primary', hex: '#0F172A', desc: 'Texto principal' },
      { name: 'Text Secondary', hex: '#64748B', desc: 'Texto secundário' },
      { name: 'Border', hex: '#E2E8F0', desc: 'Bordas' },
    ],
    semantic: [
      { name: 'Success', hex: '#0D9488', desc: '✓ Sucesso', icon: '✓' },
      { name: 'Warning', hex: '#D97706', desc: '⚠ Atenção', icon: '⚠' },
      { name: 'Error', hex: '#B91C1C', desc: '✕ Erro', icon: '✕' },
      { name: 'Info', hex: '#0B6E99', desc: 'ℹ Info', icon: 'ℹ' },
    ],
    current: [
      { name: 'Primary (atual)', hex: '#0f766e', desc: 'Teal' },
      { name: 'Primary Light', hex: '#14b8a6', desc: 'Teal claro' },
      { name: 'Surface', hex: '#f0fdfa', desc: 'Background' },
    ],
  };

  const typography = [
    { name: 'H1 - Título Principal', size: '36px', weight: 'Bold', rem: '2.25rem' },
    { name: 'H2 - Seção', size: '24px', weight: 'Bold', rem: '1.5rem' },
    { name: 'H3 - Subsecção', size: '20px', weight: 'Semibold', rem: '1.25rem' },
    { name: 'Body - Texto corpo', size: '16px', weight: 'Normal', rem: '1rem' },
    { name: 'Small - Secundário', size: '14px', weight: 'Normal', rem: '0.875rem' },
    { name: 'Caption - Legendas', size: '12px', weight: 'Normal', rem: '0.75rem' },
  ];

  const spacing = [
    { name: 'space-1', value: '4px', rem: '0.25rem' },
    { name: 'space-2', value: '8px', rem: '0.5rem' },
    { name: 'space-3', value: '12px', rem: '0.75rem' },
    { name: 'space-4', value: '16px', rem: '1rem' },
    { name: 'space-5', value: '20px', rem: '1.25rem' },
    { name: 'space-6', value: '24px', rem: '1.5rem' },
    { name: 'space-8', value: '32px', rem: '2rem' },
    { name: 'space-10', value: '40px', rem: '2.5rem' },
    { name: 'space-12', value: '48px', rem: '3rem' },
  ];

  const ColorCard = ({ name, hex, desc, icon }: any) => {
    const isLight = ['#FFFFFF', '#F8FAFC', '#E6F2F7', '#CCFBF1', '#E2E8F0', '#f0fdfa'].includes(hex);
    const textColor = isLight ? '#0F172A' : '#FFFFFF';
    const borderStyle = isLight ? '1px solid #E2E8F0' : 'none';

    return (
      <div
        onClick={() => copyToClipboard(hex, name)}
        style={{
          background: hex,
          color: textColor,
          padding: '1.5rem',
          borderRadius: '12px',
          cursor: 'pointer',
          border: borderStyle,
          transition: 'transform 0.2s, box-shadow 0.2s',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div>
          {icon && <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>}
          <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{desc}</div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{name}</div>
          <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
            {hex}
            {copiedColor === name && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>✓ Copiado!</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '1.25rem', paddingBottom: '2rem', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem' }}>
        <Link
          to="/dashboard"
          style={{
            color: '#0B6E99',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          ← Voltar ao Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
          Design System
        </h1>
        <p style={{ color: '#64748B', margin: 0 }}>Sistema de design do Nexus Med</p>
      </header>

      {/* Paleta de Cores Primárias */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          🎨 Cores Primárias
        </h2>
        <p style={{ color: '#64748B', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Clique para copiar o código da cor
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {colors.primary.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Cores Secundárias */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          💚 Cores Secundárias
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {colors.secondary.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Cores Neutras */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          ⚪ Cores Neutras
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {colors.neutrals.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Cores Semânticas */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          🚦 Cores Semânticas (Feedback)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {colors.semantic.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Paleta Atual (Implementada) */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          🔄 Paleta Atual (Implementada)
        </h2>
        <div
          style={{
            background: '#FEF3C7',
            border: '2px solid #D97706',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <strong style={{ color: '#92400E' }}>Migração Recomendada</strong>
          </div>
          <p style={{ color: '#92400E', fontSize: '0.875rem', margin: 0 }}>
            As cores abaixo estão atualmente em uso. Recomenda-se migrar para a paleta proposta acima.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {colors.current.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* Tipografia */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          ✍️ Tipografia
        </h2>
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {typography.map((type, index) => (
            <div
              key={index}
              style={{
                paddingBottom: '1.5rem',
                marginBottom: index < typography.length - 1 ? '1.5rem' : 0,
                borderBottom: index < typography.length - 1 ? '1px solid #E2E8F0' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: type.size,
                  fontWeight: type.weight === 'Bold' ? 700 : type.weight === 'Semibold' ? 600 : 400,
                  color: '#0F172A',
                  marginBottom: '0.5rem',
                }}
              >
                {type.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748B', fontFamily: 'monospace' }}>
                {type.size} ({type.rem}) · {type.weight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Espaçamento */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          📏 Espaçamento (8pt Grid)
        </h2>
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {spacing.map((space) => (
            <div
              key={space.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ minWidth: '100px', fontFamily: 'monospace', fontSize: '0.875rem', color: '#0F172A' }}>
                {space.name}
              </div>
              <div
                style={{
                  background: '#0B6E99',
                  height: '24px',
                  width: space.value,
                  borderRadius: '4px',
                }}
              />
              <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                {space.value} ({space.rem})
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Componentes - Botões */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          🔘 Botões
        </h2>
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.5rem' }}>Primary</div>
            <button className="btn btn-primary">Entrar</button>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.5rem' }}>Secondary</div>
            <button className="btn btn-secondary">Cancelar</button>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.5rem' }}>Ghost</div>
            <button className="btn btn-ghost">Sair</button>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.5rem' }}>Disabled</div>
            <button className="btn btn-primary" disabled>
              Desabilitado
            </button>
          </div>
        </div>
      </section>

      {/* Componentes - Inputs */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          📝 Inputs
        </h2>
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div className="form-group">
            <label className="label">Label do campo</label>
            <input type="text" className="input" placeholder="Placeholder..." />
          </div>
          <div className="form-group">
            <label className="label">Campo com erro</label>
            <input
              type="text"
              className="input"
              placeholder="valor@invalido"
              style={{ borderColor: '#B91C1C' }}
            />
            <div className="error-msg">Este campo é obrigatório</div>
          </div>
          <div className="form-group">
            <label className="label">Campo desabilitado</label>
            <input type="text" className="input" placeholder="Desabilitado" disabled style={{ opacity: 0.6 }} />
          </div>
        </div>
      </section>

      {/* Componentes - Cards */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          🃏 Cards
        </h2>
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Card Padrão</h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
            Este é um card padrão com título e descrição. Usado para agrupar conteúdo relacionado.
          </p>
        </div>
        <div className="card" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Card Interativo</h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>Clicável com hover effect</p>
            </div>
            <span style={{ fontSize: '1.5rem' }}>→</span>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          🔔 Alerts (Proposta)
        </h2>
        <div
          style={{
            background: '#CCFBF1',
            borderLeft: '4px solid #0D9488',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>✓</span>
          <span style={{ color: '#0D9488', fontWeight: 500 }}>Operação realizada com sucesso!</span>
        </div>
        <div
          style={{
            background: '#FEE2E2',
            borderLeft: '4px solid #B91C1C',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>✕</span>
          <span style={{ color: '#B91C1C', fontWeight: 500 }}>Ocorreu um erro. Tente novamente.</span>
        </div>
        <div
          style={{
            background: '#FEF3C7',
            borderLeft: '4px solid #D97706',
            padding: '1rem',
            borderRadius: '8px',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>⚠</span>
          <span style={{ color: '#D97706', fontWeight: 500 }}>Atenção: Esta ação não pode ser desfeita.</span>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem 0', color: '#64748B', fontSize: '0.875rem' }}>
        <p>
          📚 Documentação completa em <code style={{ background: '#E2E8F0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>/docs/DESIGN_SYSTEM.md</code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          Nexus Med Design System · v2.0.0 · Fevereiro 2026
        </p>
      </footer>
    </div>
  );
}
