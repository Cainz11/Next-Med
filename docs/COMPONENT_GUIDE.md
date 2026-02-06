# 🧩 Guia de Componentes - Nexus Med

> Referência rápida de componentes, padrões de uso e exemplos de código

## 📋 Índice

- [Botões](#botões)
- [Inputs e Formulários](#inputs-e-formulários)
- [Cards](#cards)
- [Navegação](#navegação)
- [Feedback e Alertas](#feedback-e-alertas)
- [Tipografia](#tipografia)
- [Layout](#layout)
- [Estados](#estados)

---

## 🔘 Botões

### Primary Button

**Uso**: Ação principal da tela (submit, enviar, salvar).

```tsx
<button type="submit" className="btn btn-primary">
  Entrar
</button>
```

**CSS**:
```css
.btn-primary {
  background: var(--primary);
  color: #fff;
}
```

**Quando usar**:
- ✅ Login/cadastro
- ✅ Salvar formulário
- ✅ Enviar mensagem
- ❌ Ações destrutivas (use danger)
- ❌ Cancelar (use secondary)

---

### Secondary Button

**Uso**: Ações secundárias, alternativas.

```tsx
<button type="button" className="btn btn-secondary">
  Cancelar
</button>
```

**CSS**:
```css
.btn-secondary {
  background: var(--border);
  color: var(--text);
}
```

**Quando usar**:
- ✅ Cancelar operação
- ✅ Ação alternativa
- ✅ Voltar
- ❌ Ação principal (use primary)

---

### Ghost Button

**Uso**: Ações terciárias, links de ação.

```tsx
<button type="button" className="btn btn-ghost">
  Sair
</button>
```

**CSS**:
```css
.btn-ghost {
  background: transparent;
  color: var(--primary);
}
```

**Quando usar**:
- ✅ Logout
- ✅ Ações menos importantes
- ✅ Links de navegação
- ❌ Ação principal (use primary)

---

### Button States

```tsx
{/* Loading */}
<button className="btn btn-primary" disabled>
  Carregando...
</button>

{/* Disabled */}
<button className="btn btn-primary" disabled>
  Indisponível
</button>

{/* Com ícone */}
<button className="btn btn-primary">
  <span>→</span> Próximo
</button>
```

---

## 📝 Inputs e Formulários

### Input Básico

```tsx
<div className="form-group">
  <label className="label" htmlFor="email">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="input"
    placeholder="seu@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</div>
```

**Anatomia**:
- `form-group`: Container do input (margin-bottom)
- `label`: Label associado ao input (for/htmlFor)
- `input`: Campo de entrada (padding, border, focus)

---

### Input com Erro

```tsx
<div className="form-group">
  <label className="label" htmlFor="password">
    Senha
  </label>
  <input
    type="password"
    id="password"
    className="input"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ borderColor: error ? '#B91C1C' : undefined }}
  />
  {error && <div className="error-msg">{error}</div>}
</div>
```

**Estados**:
- **Default**: Border `#E2E8F0`
- **Focus**: Border `var(--primary)` + shadow
- **Error**: Border `#B91C1C` + mensagem
- **Disabled**: Opacity 0.6 + cursor not-allowed

---

### Select / Dropdown

```tsx
<div className="form-group">
  <label className="label" htmlFor="role">
    Tipo de usuário
  </label>
  <select
    id="role"
    className="input"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="">Selecione...</option>
    <option value="Patient">Paciente</option>
    <option value="Professional">Profissional</option>
  </select>
</div>
```

---

### Textarea

```tsx
<div className="form-group">
  <label className="label" htmlFor="message">
    Mensagem
  </label>
  <textarea
    id="message"
    className="input"
    rows={4}
    placeholder="Digite sua mensagem..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
</div>
```

---

### Formulário Completo

```tsx
<form onSubmit={handleSubmit}>
  <div className="form-group">
    <label className="label" htmlFor="name">Nome completo</label>
    <input
      type="text"
      id="name"
      className="input"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label className="label" htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      className="input"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>

  {error && <div className="error-msg">{error}</div>}

  <button type="submit" className="btn btn-primary" disabled={loading}>
    {loading ? 'Salvando...' : 'Salvar'}
  </button>
</form>
```

---

## 🃏 Cards

### Card Simples

```tsx
<div className="card">
  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
    Título do Card
  </h3>
  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
    Descrição ou conteúdo do card.
  </p>
</div>
```

---

### Card Interativo (Link)

```tsx
<Link
  to="/prescriptions"
  className="card"
  style={{
    display: 'block',
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer'
  }}
>
  <strong>Receituário</strong>
  <p style={{
    margin: 0,
    fontSize: '0.875rem',
    color: 'var(--text-muted)'
  }}>
    Ver receitas e prescrições
  </p>
</Link>
```

**Hover**: Box-shadow aumenta automaticamente.

---

### Card com Badge/Tag

```tsx
<div className="card">
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  }}>
    <strong>Dipirona 500mg</strong>
    <span style={{
      background: '#CCFBF1',
      color: '#0D9488',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600
    }}>
      Ativo
    </span>
  </div>
  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
    6/6h · Dr. João Silva
  </p>
</div>
```

---

### Card com Ícone

```tsx
<div className="card">
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'var(--primary)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      flexShrink: 0
    }}>
      💊
    </div>
    <div style={{ flex: 1 }}>
      <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
        Nova receita
      </strong>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Você recebeu uma nova prescrição médica.
      </p>
    </div>
  </div>
</div>
```

---

## 🧭 Navegação

### Header com Logout

```tsx
<header style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem'
}}>
  <span className="logo" style={{ marginBottom: 0, fontSize: '1.25rem' }}>
    Nexus Med
  </span>
  <button
    type="button"
    className="btn btn-ghost"
    onClick={logout}
    style={{ width: 'auto', padding: '0.5rem' }}
  >
    Sair
  </button>
</header>
```

---

### Voltar

```tsx
<Link
  to="/dashboard"
  style={{
    color: 'var(--primary)',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  }}
>
  ← Voltar
</Link>
```

---

### Bottom Navigation (Proposta)

```tsx
<nav style={{
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  maxWidth: 'var(--max-width)',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-around',
  background: 'white',
  borderTop: '1px solid var(--border)',
  padding: '0.5rem',
  paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
}}>
  <Link
    to="/dashboard"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.5rem',
      color: 'var(--primary)',  // Ativo
      textDecoration: 'none',
      fontSize: '0.75rem',
      fontWeight: 600
    }}
  >
    <span style={{ fontSize: '1.5rem' }}>🏠</span>
    Início
  </Link>

  <Link
    to="/messages"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.5rem',
      color: 'var(--text-secondary)',  // Inativo
      textDecoration: 'none',
      fontSize: '0.75rem'
    }}
  >
    <span style={{ fontSize: '1.5rem' }}>💬</span>
    Mensagens
  </Link>

  {/* ... mais itens */}
</nav>
```

---

## 🔔 Feedback e Alertas

### Mensagem de Erro Inline

```tsx
{error && (
  <div className="error-msg">
    {error}
  </div>
)}
```

**CSS**:
```css
.error-msg {
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

---

### Alert Box (Proposta)

```tsx
{/* Sucesso */}
<div style={{
  background: '#CCFBF1',
  borderLeft: '4px solid #0D9488',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center'
}}>
  <span style={{ fontSize: '1.25rem' }}>✓</span>
  <span style={{ color: '#0D9488', fontWeight: 500 }}>
    Operação realizada com sucesso!
  </span>
</div>

{/* Erro */}
<div style={{
  background: '#FEE2E2',
  borderLeft: '4px solid #B91C1C',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center'
}}>
  <span style={{ fontSize: '1.25rem' }}>✕</span>
  <span style={{ color: '#B91C1C', fontWeight: 500 }}>
    Ocorreu um erro. Tente novamente.
  </span>
</div>

{/* Atenção */}
<div style={{
  background: '#FEF3C7',
  borderLeft: '4px solid #D97706',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem',
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center'
}}>
  <span style={{ fontSize: '1.25rem' }}>⚠</span>
  <span style={{ color: '#D97706', fontWeight: 500 }}>
    Atenção: Esta ação não pode ser desfeita.
  </span>
</div>
```

---

### Toast Notification (Futuro)

```tsx
// Usando react-hot-toast ou similar
import toast from 'react-hot-toast';

// Sucesso
toast.success('Receita criada com sucesso!');

// Erro
toast.error('Erro ao salvar dados');

// Info
toast('Processando...');
```

---

## ✍️ Tipografia

### Headings

```tsx
{/* H1 - Título da página */}
<h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
  Dashboard
</h1>

{/* H2 - Seção */}
<h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
  Receitas recentes
</h2>

{/* H3 - Subtítulo */}
<h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
  Dipirona 500mg
</h3>
```

---

### Body Text

```tsx
{/* Texto normal */}
<p style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: 1.5 }}>
  Este é um parágrafo de texto corpo com tamanho padrão.
</p>

{/* Texto secundário */}
<p style={{
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5
}}>
  Informação adicional ou descrição secundária.
</p>

{/* Caption / small */}
<p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
  Legendas, timestamps, hints.
</p>
```

---

### Links

```tsx
<Link
  to="/path"
  style={{
    color: 'var(--primary)',
    textDecoration: 'underline',
    fontWeight: 500
  }}
>
  Saiba mais
</Link>
```

---

### Strong / Bold

```tsx
<p>
  Este é um texto com <strong>destaque importante</strong> inline.
</p>
```

---

## 📐 Layout

### Página Padrão

```tsx
<div className="app-page">
  {/* Header */}
  <header style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  }}>
    <span className="logo">Nexus Med</span>
    <button className="btn btn-ghost" onClick={logout}>
      Sair
    </button>
  </header>

  {/* Title */}
  <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
    Título da Página
  </h1>

  {/* Content */}
  <div>
    {/* Cards, listas, formulários... */}
  </div>
</div>
```

**CSS**:
```css
.app-page {
  padding: 1.25rem;
  padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
}
```

---

### Grid de Cards

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1rem'
}}>
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

---

### Flex Row

```tsx
<div style={{
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  justifyContent: 'space-between'
}}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

### Flex Column (Stack)

```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
}}>
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

---

## 🔄 Estados

### Loading

```tsx
{loading && (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <p>Carregando...</p>
  </div>
)}
```

---

### Empty State

```tsx
{!loading && data.length === 0 && (
  <div style={{
    textAlign: 'center',
    padding: '3rem 1rem',
    color: 'var(--text-secondary)'
  }}>
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
      Nenhum item encontrado
    </h3>
    <p style={{ fontSize: '0.875rem' }}>
      Você ainda não tem receitas cadastradas.
    </p>
  </div>
)}
```

---

### Error State

```tsx
{error && (
  <div style={{
    background: '#FEE2E2',
    border: '1px solid #B91C1C',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem 0'
  }}>
    <strong style={{ color: '#B91C1C' }}>Erro</strong>
    <p style={{ color: '#B91C1C', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
      {error}
    </p>
    <button
      className="btn btn-secondary"
      onClick={retry}
      style={{ marginTop: '0.75rem' }}
    >
      Tentar novamente
    </button>
  </div>
)}
```

---

## 🎨 Helpers CSS

### Spacing Utilities

```css
/* Margin */
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }

.mt-2 { margin-top: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }

/* Padding */
.p-0 { padding: 0; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
```

---

### Text Utilities

```css
/* Alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Weight */
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* Size */
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
```

---

### Color Utilities

```css
.text-primary { color: var(--primary); }
.text-secondary { color: var(--text-secondary); }
.text-error { color: var(--error); }
.text-success { color: var(--color-nexus-green); }

.bg-surface { background: var(--surface); }
.bg-card { background: var(--surface-card); }
```

---

## 📱 Padrões Mobile

### Safe Area (iOS)

```css
/* Sempre usar para padding bottom */
.app-page {
  padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
}

/* Para bottom nav fixo */
.bottom-nav {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
```

---

### Touch Targets

```css
/* Mínimo 44x44px para áreas tocáveis */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.25rem;
}

.nav-item {
  min-height: 48px;
  min-width: 48px;
}
```

---

### Viewport Height

```css
/* Usar dvh em vez de vh para mobile */
body {
  min-height: 100dvh;  /* Dynamic viewport height */
}

/* Evita problemas com barra de endereço */
```

---

## 🚀 Boas Práticas

### ✅ Fazer

- Usar classes CSS existentes (`.btn`, `.card`, `.input`)
- Seguir os tokens de design (cores, espaçamento)
- Manter consistência visual
- Testar em dispositivos móveis
- Garantir contraste mínimo (WCAG AA)
- Usar labels em todos os inputs
- Feedback para ações do usuário

### ❌ Evitar

- Criar estilos inline complexos (use classes)
- Hardcoded colors/sizes (use tokens)
- Ignorar estados (loading, error, empty)
- Botões/links muito pequenos (<44px)
- Texto sem contraste adequado
- Inputs sem labels
- Ações sem feedback

---

## 📚 Recursos

- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**: Design tokens completos
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: Arquitetura do projeto
- **/design-system**: Showcase interativo no app

---

**Última atualização**: Fevereiro 2026  
**Versão**: 1.0.0  
**Mantido por**: Equipe Nexus Med
