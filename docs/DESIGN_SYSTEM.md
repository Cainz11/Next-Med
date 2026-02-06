# 🎨 Design System - Nexus Med

> Sistema de design completo: identidade visual, paleta de cores, componentes e padrões de interface

## 📋 Índice

- [Identidade Visual](#identidade-visual)
- [Paleta de Cores](#paleta-de-cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Componentes](#componentes)
- [Padrões de Interface](#padrões-de-interface)
- [Acessibilidade](#acessibilidade)
- [Responsividade](#responsividade)

---

## 🎯 Identidade Visual

### Conceito

**Nexus Med** = **Nexus** (ponto de conexão) + **Med** (médico/medicina)

### Princípios de Design

| Princípio | Aplicação | Exemplo Visual |
|-----------|-----------|----------------|
| **Confiança** 🔐 | Cores estáveis (azul), feedback claro | Azul primário em ações críticas |
| **Cuidado** 💚 | Tom acolhedor, mensagens construtivas | Verde para confirmações |
| **Clareza** 📖 | Hierarquia visual forte, labels explícitos | Tipografia escalada, contraste |
| **Inclusão** ♿ | Contraste adequado, acessibilidade | WCAG 2.2 AA compliance |

### Emoções que Queremos Transmitir

```
┌─────────────────────────────────────────────────────────────┐
│                     Espectro Emocional                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Confiança      ████████████████ 90%                         │
│  Cuidado        ████████████████ 90%                         │
│  Profissional   ███████████████  85%                         │
│  Acessível      ███████████████  85%                         │
│  Moderno        ████████████     75%                         │
│  Amigável       ████████████     75%                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌈 Paleta de Cores

### Cores Primárias

#### Nexus Blue (Confiança & Ação Principal)

```css
/* Cor primária - Azul que transmite confiança e profissionalismo */
--color-nexus-blue:      #0B6E99;  /* Principal */
--color-nexus-blue-80:   #0D84B8;  /* Hover/Ativo */
--color-nexus-blue-60:   #3D9FC9;  /* Claro */
--color-nexus-blue-20:   #E6F2F7;  /* Background sutil */
```

<div style="display: flex; gap: 1rem; margin: 1rem 0;">
  <div style="background: #0B6E99; width: 120px; height: 120px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #0B6E99
    <span style="font-size: 0.875rem; font-weight: normal;">Principal</span>
  </div>
  <div style="background: #0D84B8; width: 120px; height: 120px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #0D84B8
    <span style="font-size: 0.875rem; font-weight: normal;">80%</span>
  </div>
  <div style="background: #3D9FC9; width: 120px; height: 120px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #3D9FC9
    <span style="font-size: 0.875rem; font-weight: normal;">60%</span>
  </div>
  <div style="background: #E6F2F7; width: 120px; height: 120px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: #0B6E99; font-weight: bold; border: 1px solid #0B6E99;">
    #E6F2F7
    <span style="font-size: 0.875rem; font-weight: normal;">20%</span>
  </div>
</div>

**Uso**:
- ✅ Botões primários
- ✅ Links e navegação ativa
- ✅ Destaques importantes
- ✅ Ícones de ação

### Cores Secundárias

#### Nexus Green (Saúde & Sucesso)

```css
/* Cor secundária - Verde associado a saúde e bem-estar */
--color-nexus-green:     #0D9488;  /* Principal */
--color-nexus-green-80:  #14B8A6;  /* Hover */
--color-nexus-green-20:  #CCFBF1;  /* Background sucesso */
```

<div style="display: flex; gap: 1rem; margin: 1rem 0;">
  <div style="background: #0D9488; width: 120px; height: 120px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #0D9488
    <span style="font-size: 0.875rem; font-weight: normal;">Principal</span>
  </div>
  <div style="background: #14B8A6; width: 120px; height: 120px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #14B8A6
    <span style="font-size: 0.875rem; font-weight: normal;">80%</span>
  </div>
  <div style="background: #CCFBF1; width: 120px; height: 120px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: #0D9488; font-weight: bold; border: 1px solid #0D9488;">
    #CCFBF1
    <span style="font-size: 0.875rem; font-weight: normal;">20%</span>
  </div>
</div>

**Uso**:
- ✅ Mensagens de sucesso
- ✅ Ícones de saúde/métricas positivas
- ✅ Confirmações
- ✅ Status "concluído"

### Cores Neutras (Superfícies & Texto)

```css
/* Neutros - Base da interface */
--color-surface:         #F8FAFC;  /* Background geral */
--color-surface-card:    #FFFFFF;  /* Cards e componentes */
--color-text-primary:    #0F172A;  /* Texto principal */
--color-text-secondary:  #64748B;  /* Texto secundário/muted */
--color-border:          #E2E8F0;  /* Bordas e divisores */
--color-border-hover:    #CBD5E1;  /* Bordas em hover */
```

<div style="display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap;">
  <div style="background: #F8FAFC; width: 140px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: #0F172A; font-weight: bold; border: 1px solid #E2E8F0;">
    #F8FAFC
    <span style="font-size: 0.875rem; font-weight: normal;">Surface</span>
  </div>
  <div style="background: #FFFFFF; width: 140px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: #0F172A; font-weight: bold; border: 2px solid #E2E8F0;">
    #FFFFFF
    <span style="font-size: 0.875rem; font-weight: normal;">Card</span>
  </div>
  <div style="background: #0F172A; width: 140px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #0F172A
    <span style="font-size: 0.875rem; font-weight: normal;">Text Primary</span>
  </div>
  <div style="background: #64748B; width: 140px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #64748B
    <span style="font-size: 0.875rem; font-weight: normal;">Text Secondary</span>
  </div>
  <div style="background: #E2E8F0; width: 140px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: #0F172A; font-weight: bold;">
    #E2E8F0
    <span style="font-size: 0.875rem; font-weight: normal;">Border</span>
  </div>
</div>

### Cores Semânticas (Feedback)

```css
/* Estados e feedback */
--color-success:         #0D9488;  /* Sucesso (verde) */
--color-warning:         #D97706;  /* Atenção (laranja) */
--color-error:           #B91C1C;  /* Erro (vermelho) */
--color-info:            #0B6E99;  /* Informação (azul) */
```

<div style="display: flex; gap: 1rem; margin: 1rem 0;">
  <div style="background: #0D9488; width: 120px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #0D9488
    <span style="font-size: 0.875rem; font-weight: normal;">✓ Sucesso</span>
  </div>
  <div style="background: #D97706; width: 120px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #D97706
    <span style="font-size: 0.875rem; font-weight: normal;">⚠ Atenção</span>
  </div>
  <div style="background: #B91C1C; width: 120px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #B91C1C
    <span style="font-size: 0.875rem; font-weight: normal;">✕ Erro</span>
  </div>
  <div style="background: #0B6E99; width: 120px; height: 100px; border-radius: 12px; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; color: white; font-weight: bold;">
    #0B6E99
    <span style="font-size: 0.875rem; font-weight: normal;">ℹ Info</span>
  </div>
</div>

### Paleta Atual (Implementada)

> **Nota**: A paleta atual no código difere um pouco da proposta. Abaixo está o que está implementado:

```css
/* Cores atuais em index.css */
--primary:         #0f766e;  /* Teal */
--primary-light:   #14b8a6;  /* Teal claro */
--surface:         #f0fdfa;  /* Teal muito claro */
--text:            #134e4a;  /* Teal escuro */
--text-muted:      #5eead4;  /* Teal médio */
--border:          #99f6e4;  /* Teal claro */
```

<div style="display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap;">
  <div style="background: #0f766e; width: 120px; height: 100px; border-radius: 12px; padding: 1rem; color: white; font-weight: bold;">
    #0f766e
    <span style="font-size: 0.875rem; font-weight: normal; display: block;">Primary</span>
  </div>
  <div style="background: #14b8a6; width: 120px; height: 100px; border-radius: 12px; padding: 1rem; color: white; font-weight: bold;">
    #14b8a6
    <span style="font-size: 0.875rem; font-weight: normal; display: block;">Light</span>
  </div>
  <div style="background: #f0fdfa; width: 120px; height: 100px; border-radius: 12px; padding: 1rem; color: #0f766e; font-weight: bold; border: 1px solid #0f766e;">
    #f0fdfa
    <span style="font-size: 0.875rem; font-weight: normal; display: block;">Surface</span>
  </div>
</div>

**Recomendação**: Migrar para a paleta proposta (Nexus Blue + Nexus Green) para melhor alinhamento com a identidade de confiança médica.

---

## ✍️ Tipografia

### Família de Fontes

```css
--font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```

**Escolha**: System fonts para melhor performance e familiaridade do usuário.

**Alternativas recomendadas** (via Google Fonts):
- **Inter**: Moderna, legível, ótima para UI
- **DM Sans**: Clean, profissional
- **Plus Jakarta Sans**: Geométrica, amigável

### Escala Tipográfica

```css
/* Tamanhos (rem) */
--text-xs:    0.75rem;   /* 12px - Labels pequenas */
--text-sm:    0.875rem;  /* 14px - Texto secundário */
--text-base:  1rem;      /* 16px - Texto corpo */
--text-lg:    1.125rem;  /* 18px - Destaque */
--text-xl:    1.25rem;   /* 20px - Subtítulos */
--text-2xl:   1.5rem;    /* 24px - Títulos */
--text-3xl:   1.875rem;  /* 30px - Títulos grandes */
--text-4xl:   2.25rem;   /* 36px - Heros */
```

### Pesos de Fonte

| Peso | Valor | Uso |
|------|-------|-----|
| **Normal** | 400 | Texto corpo, parágrafos |
| **Medium** | 500 | Labels, navegação |
| **Semibold** | 600 | Botões, CTAs |
| **Bold** | 700 | Títulos, destaques |
| **Extrabold** | 800 | Logo, branding |

### Hierarquia Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    Hierarquia de Texto                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  H1 - Título Principal           36px / Bold / #0F172A      │
│                                                              │
│  H2 - Seção                      24px / Bold / #0F172A      │
│                                                              │
│  H3 - Subsecção                  20px / Semibold / #0F172A  │
│                                                              │
│  Body - Texto corpo              16px / Normal / #0F172A    │
│                                                              │
│  Small - Texto secundário        14px / Normal / #64748B    │
│                                                              │
│  Caption - Legendas, hints       12px / Normal / #64748B    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Linha de Base (Line Height)

```css
--leading-none:    1;      /* Títulos compactos */
--leading-tight:   1.25;   /* Títulos */
--leading-normal:  1.5;    /* Texto corpo (recomendado) */
--leading-relaxed: 1.75;   /* Texto longo, artigos */
```

---

## 📏 Espaçamento

### Sistema de Espaçamento (8pt Grid)

```css
/* Base: 0.25rem = 4px */
--space-0:   0;
--space-1:   0.25rem;  /*  4px */
--space-2:   0.5rem;   /*  8px */
--space-3:   0.75rem;  /* 12px */
--space-4:   1rem;     /* 16px */
--space-5:   1.25rem;  /* 20px */
--space-6:   1.5rem;   /* 24px */
--space-8:   2rem;     /* 32px */
--space-10:  2.5rem;   /* 40px */
--space-12:  3rem;     /* 48px */
--space-16:  4rem;     /* 64px */
```

### Uso do Espaçamento

| Contexto | Espaçamento | Exemplo |
|----------|-------------|---------|
| **Entre elementos inline** | 2-3 (8-12px) | Ícone + texto |
| **Entre componentes** | 4 (16px) | Inputs, botões |
| **Margem de cards** | 4-6 (16-24px) | Cards em lista |
| **Padding de cards** | 4-5 (16-20px) | Conteúdo interno |
| **Padding de página** | 5 (20px) | Margens laterais mobile |
| **Seções** | 8-12 (32-48px) | Entre blocos |

### Border Radius (Arredondamento)

```css
--radius-none:  0;
--radius-sm:    0.375rem;  /* 6px - Inputs */
--radius-md:    0.5rem;    /* 8px - Botões, padrão */
--radius-lg:    0.75rem;   /* 12px - Cards */
--radius-xl:    1rem;      /* 16px - Modais */
--radius-full:  9999px;    /* Circular - Avatars, badges */
```

### Sombras (Elevação)

```css
/* Elevações sutis para depth */
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 1px 3px rgba(0,0,0,0.06);
--shadow-lg:  0 4px 6px rgba(0,0,0,0.07);
--shadow-xl:  0 10px 15px rgba(0,0,0,0.08);
```

**Uso**:
- `shadow-sm`: Borders sutis
- `shadow-md`: Cards (padrão usado)
- `shadow-lg`: Dropdowns, modais
- `shadow-xl`: Modais importantes

---

## 🧩 Componentes

### 1. Botões

#### Variantes

<table>
  <tr>
    <th>Tipo</th>
    <th>Visual</th>
    <th>CSS</th>
    <th>Uso</th>
  </tr>
  <tr>
    <td><strong>Primary</strong></td>
    <td><div style="background: #0f766e; color: white; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; text-align: center;">Entrar</div></td>
    <td><code>.btn-primary</code></td>
    <td>Ação principal da tela</td>
  </tr>
  <tr>
    <td><strong>Secondary</strong></td>
    <td><div style="background: #99f6e4; color: #134e4a; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; text-align: center;">Cancelar</div></td>
    <td><code>.btn-secondary</code></td>
    <td>Ações secundárias</td>
  </tr>
  <tr>
    <td><strong>Ghost</strong></td>
    <td><div style="background: transparent; color: #0f766e; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; text-align: center; border: 1px dashed #0f766e;">Sair</div></td>
    <td><code>.btn-ghost</code></td>
    <td>Ações terciárias, links</td>
  </tr>
</table>

#### Estados

```css
/* Estados dos botões */
.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active {
  opacity: 0.8;
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

#### Tamanhos

| Tamanho | Padding | Height | Font Size |
|---------|---------|--------|-----------|
| **Small** | 0.5rem 1rem | 36px | 14px |
| **Medium** (padrão) | 0.75rem 1.25rem | 44px | 16px |
| **Large** | 1rem 1.5rem | 52px | 18px |

### 2. Inputs

#### Estrutura

```html
<div class="form-group">
  <label class="label" for="email">Email</label>
  <input 
    type="email" 
    id="email" 
    class="input"
    placeholder="seu@email.com"
  />
  <span class="error-msg">Mensagem de erro (se houver)</span>
</div>
```

#### Estados Visuais

<table>
  <tr>
    <th>Estado</th>
    <th>Visual</th>
    <th>Borda</th>
  </tr>
  <tr>
    <td><strong>Default</strong></td>
    <td><input type="text" placeholder="Digite aqui..." style="width: 100%; padding: 0.75rem; border: 1px solid #E2E8F0; border-radius: 0.5rem; background: #F8FAFC;"></td>
    <td><code>#E2E8F0</code></td>
  </tr>
  <tr>
    <td><strong>Focus</strong></td>
    <td><input type="text" placeholder="Digite aqui..." style="width: 100%; padding: 0.75rem; border: 2px solid #0f766e; border-radius: 0.5rem; background: white; box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);"></td>
    <td><code>#0f766e</code> + shadow</td>
  </tr>
  <tr>
    <td><strong>Error</strong></td>
    <td><input type="text" placeholder="Digite aqui..." style="width: 100%; padding: 0.75rem; border: 2px solid #B91C1C; border-radius: 0.5rem; background: #FEF2F2;"></td>
    <td><code>#B91C1C</code></td>
  </tr>
  <tr>
    <td><strong>Disabled</strong></td>
    <td><input type="text" placeholder="Desabilitado" disabled style="width: 100%; padding: 0.75rem; border: 1px solid #E2E8F0; border-radius: 0.5rem; background: #F1F5F9; cursor: not-allowed; opacity: 0.6;"></td>
    <td>Opacidade reduzida</td>
  </tr>
</table>

### 3. Cards

#### Card Padrão

```html
<div class="card">
  <h3>Título do Card</h3>
  <p>Conteúdo do card com informações relevantes.</p>
</div>
```

**Estilos**:
```css
.card {
  background: var(--surface-card);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}
```

#### Card Interativo (Link)

```tsx
<Link to="/path" className="card" style={{ 
  display: 'block', 
  color: 'inherit',
  textDecoration: 'none' 
}}>
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

### 4. Labels & Tags

#### Label de Formulário

```css
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text);
}
```

#### Status Tags (Proposta)

<div style="display: flex; gap: 0.5rem; margin: 1rem 0; flex-wrap: wrap;">
  <span style="background: #CCFBF1; color: #0D9488; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">✓ Ativo</span>
  <span style="background: #FEF3C7; color: #D97706; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">⏳ Pendente</span>
  <span style="background: #FEE2E2; color: #B91C1C; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">✕ Cancelado</span>
  <span style="background: #E0E7FF; color: #4338CA; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">ℹ Info</span>
</div>

### 5. Mensagens de Feedback

#### Alert (Proposta)

```html
<!-- Sucesso -->
<div class="alert alert-success">
  <svg>✓</svg>
  <span>Operação realizada com sucesso!</span>
</div>

<!-- Erro -->
<div class="alert alert-error">
  <svg>✕</svg>
  <span>Ocorreu um erro. Tente novamente.</span>
</div>

<!-- Aviso -->
<div class="alert alert-warning">
  <svg>⚠</svg>
  <span>Atenção: Esta ação não pode ser desfeita.</span>
</div>
```

**Estilos**:
```css
.alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.alert-success {
  background: #CCFBF1;
  color: #0D9488;
  border-left: 4px solid #0D9488;
}

.alert-error {
  background: #FEE2E2;
  color: #B91C1C;
  border-left: 4px solid #B91C1C;
}

.alert-warning {
  background: #FEF3C7;
  color: #D97706;
  border-left: 4px solid #D97706;
}
```

---

## 📱 Padrões de Interface

### Layout Mobile-First

```css
/* Container principal */
#root {
  min-height: 100dvh;
  max-width: 420px;  /* Mobile padrão */
  margin: 0 auto;
  background: var(--surface-card);
}

/* Páginas */
.app-page {
  padding: 1.25rem;
  padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
}

/* Responsivo */
@media (min-width: 768px) {
  :root { 
    --max-width: 480px;  /* Tablets pequenos */
  }
}
```

### Navegação

#### Header

```html
<header style="
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 1.5rem;
">
  <span class="logo">Nexus Med</span>
  <button class="btn btn-ghost">Sair</button>
</header>
```

#### Bottom Navigation (Proposta)

```html
<nav class="bottom-nav">
  <a href="/dashboard" class="nav-item active">
    <svg>🏠</svg>
    <span>Início</span>
  </a>
  <a href="/messages" class="nav-item">
    <svg>💬</svg>
    <span>Mensagens</span>
  </a>
  <a href="/health-metrics" class="nav-item">
    <svg>📊</svg>
    <span>Saúde</span>
  </a>
  <a href="/profile" class="nav-item">
    <svg>👤</svg>
    <span>Perfil</span>
  </a>
</nav>
```

**Estilos**:
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  background: white;
  border-top: 1px solid var(--border);
  padding: 0.5rem;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.75rem;
}

.nav-item.active {
  color: var(--primary);
  font-weight: 600;
}
```

### Listas

#### Lista com Cards

```tsx
<div className="app-page">
  <h1>Receituário</h1>
  
  {prescriptions.map(p => (
    <div key={p.id} className="card">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '0.5rem' 
      }}>
        <strong>{p.medication}</strong>
        <span className="tag tag-success">Ativo</span>
      </div>
      <p style={{ 
        margin: 0, 
        color: 'var(--text-secondary)',
        fontSize: '0.875rem' 
      }}>
        {p.dosage} · {p.professionalName}
      </p>
      <p style={{ 
        margin: 0, 
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        marginTop: '0.25rem' 
      }}>
        {new Date(p.issuedAt).toLocaleDateString('pt-BR')}
      </p>
    </div>
  ))}
</div>
```

### Formulários

#### Padrão de Form

```tsx
<form onSubmit={handleSubmit}>
  <div className="form-group">
    <label className="label" htmlFor="name">Nome completo</label>
    <input 
      type="text" 
      id="name"
      className="input"
      required
    />
  </div>
  
  <div className="form-group">
    <label className="label" htmlFor="email">Email</label>
    <input 
      type="email" 
      id="email"
      className="input"
      required
    />
  </div>
  
  <button type="submit" className="btn btn-primary">
    Salvar
  </button>
</form>
```

---

## ♿ Acessibilidade

### Checklist WCAG 2.2 (AA)

#### Contraste de Cores

| Par de Cores | Ratio | Status | Uso |
|-------------|-------|--------|-----|
| #0F172A / #FFFFFF | 16.1:1 | ✅ AAA | Texto em fundo branco |
| #0B6E99 / #FFFFFF | 5.2:1 | ✅ AA+ | Botão primário |
| #64748B / #FFFFFF | 4.7:1 | ✅ AA | Texto secundário |
| #0D9488 / #FFFFFF | 3.8:1 | ⚠️ AA- | Sucesso (melhorar) |

**Ferramenta**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

#### Áreas de Toque (Mobile)

- ✅ **Mínimo**: 44x44px (WCAG 2.1)
- ✅ **Recomendado**: 48x48px
- ✅ **Atual**: Botões têm height mínima de 44px

#### Navegação por Teclado

```css
/* Focus visível para acessibilidade */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remover outline padrão apenas quando não via teclado */
*:focus:not(:focus-visible) {
  outline: none;
}
```

#### Labels e ARIA

```html
<!-- Label associado -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- ARIA quando label visual não existe -->
<button aria-label="Fechar modal">
  <svg>✕</svg>
</button>

<!-- ARIA para status -->
<div role="alert" aria-live="polite">
  Dados salvos com sucesso!
</div>
```

### Landmarks Semânticos

```html
<body>
  <header>
    <nav aria-label="Principal">...</nav>
  </header>
  
  <main>
    <section aria-labelledby="title">
      <h1 id="title">Dashboard</h1>
      ...
    </section>
  </main>
  
  <footer>...</footer>
</body>
```

---

## 📐 Responsividade

### Breakpoints

```css
/* Mobile First */
:root {
  --max-width: 420px;
}

/* Tablet */
@media (min-width: 768px) {
  :root {
    --max-width: 480px;
  }
}

/* Desktop (opcional - ainda mobile-centric) */
@media (min-width: 1024px) {
  :root {
    --max-width: 540px;
  }
}
```

### Estratégia de Responsividade

```
┌─────────────────────────────────────────────────────────────┐
│              Abordagem Mobile-First                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📱 Mobile (320-767px)         ← Design base                │
│     • Layout vertical                                        │
│     • Navegação bottom nav                                   │
│     • Touch targets 44px+                                    │
│     • Max-width: 420px                                       │
│                                                              │
│  📱 Tablet (768-1023px)        ← Ajustes sutis              │
│     • Max-width: 480px                                       │
│     • Mais espaço lateral                                    │
│     • Mesma estrutura                                        │
│                                                              │
│  🖥️  Desktop (1024px+)          ← Opcional                  │
│     • Max-width: 540px                                       │
│     • Centralizado na tela                                   │
│     • Mantém experiência mobile                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Tokens de Design (Implementação)

### Arquivo: `src/styles/tokens.css`

```css
:root {
  /* ========================================
     CORES
     ======================================== */
  
  /* Primitivas */
  --color-nexus-blue: #0B6E99;
  --color-nexus-blue-80: #0D84B8;
  --color-nexus-blue-20: #E6F2F7;
  --color-nexus-green: #0D9488;
  --color-nexus-green-20: #CCFBF1;
  
  /* Neutros */
  --color-gray-50: #F8FAFC;
  --color-gray-100: #F1F5F9;
  --color-gray-200: #E2E8F0;
  --color-gray-300: #CBD5E1;
  --color-gray-500: #64748B;
  --color-gray-900: #0F172A;
  
  /* Semânticas */
  --color-primary: var(--color-nexus-blue);
  --color-primary-hover: var(--color-nexus-blue-80);
  --color-secondary: var(--color-nexus-green);
  --color-success: var(--color-nexus-green);
  --color-warning: #D97706;
  --color-error: #B91C1C;
  
  /* Superfícies */
  --color-surface: var(--color-gray-50);
  --color-surface-card: #FFFFFF;
  --color-border: var(--color-gray-200);
  --color-border-hover: var(--color-gray-300);
  
  /* Texto */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  
  /* ========================================
     TIPOGRAFIA
     ======================================== */
  
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* ========================================
     ESPAÇAMENTO
     ======================================== */
  
  --space-1: 0.25rem;  /*  4px */
  --space-2: 0.5rem;   /*  8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  
  /* ========================================
     BORDER RADIUS
     ======================================== */
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* ========================================
     SOMBRAS
     ======================================== */
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-lg: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-xl: 0 10px 15px rgba(0,0,0,0.08);
  
  /* ========================================
     TRANSIÇÕES
     ======================================== */
  
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  
  /* ========================================
     LAYOUT
     ======================================== */
  
  --max-width: 420px;
}

/* Responsivo */
@media (min-width: 768px) {
  :root {
    --max-width: 480px;
  }
}
```

---

## 📚 Referências

### Design Systems de Saúde

- [NHS Design System](https://design-system.service.nhs.uk/)
- [Health Design System (Austrália)](https://designsystem.health.gov.au/)
- [Nord Design System](https://nordhealth.design/)

### Ferramentas

- [Coolors](https://coolors.co/) - Paletas de cores
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verificador de contraste
- [Type Scale](https://typescale.com/) - Escalas tipográficas
- [Spacing Calculator](https://8pt.grid/) - Sistema de espaçamento

### Acessibilidade

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [A11y Project](https://www.a11yproject.com/)

---

## 🚀 Próximos Passos

### Fase 1: Tokens (Em andamento)
- [ ] Criar arquivo `tokens.css` com todas as variáveis
- [ ] Substituir valores hardcoded por tokens
- [ ] Testar em todas as páginas

### Fase 2: Componentes
- [ ] Criar componentes React reutilizáveis
- [ ] Implementar variantes de botões
- [ ] Padronizar alerts e feedback
- [ ] Criar sistema de tags/badges

### Fase 3: Navegação
- [ ] Implementar bottom navigation
- [ ] Criar breadcrumbs para navegação interna
- [ ] Adicionar animações de transição

### Fase 4: Acessibilidade
- [ ] Auditar contraste em todos os componentes
- [ ] Implementar navegação por teclado
- [ ] Testar com leitores de tela
- [ ] Adicionar ARIA labels onde necessário

### Fase 5: Documentação Viva
- [ ] Criar página de showcase dos componentes
- [ ] Implementar Storybook (opcional)
- [ ] Documentar padrões de uso

---

**Última atualização**: Fevereiro 2026  
**Versão**: 2.0.0  
**Mantido por**: Equipe Nexus Med
