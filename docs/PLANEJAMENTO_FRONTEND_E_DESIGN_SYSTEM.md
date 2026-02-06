# Planejamento do Frontend Nexus Med – Design System e Identidade

Documento de planejamento do desenvolvimento do frontend: referências, design system, identidade do produto e roteiro de implementação.

---

## 1. Referências e fundamentos

### 1.1 UX/UI em aplicações de saúde

- **Múltiplos perfis**: Pacientes (acessibilidade, clareza) e profissionais (dados, produtividade). Interfaces devem ser adaptadas por papel (role-specific design).  
  *Ref.: Designlab, Eleken – Healthcare App Design.*

- **Captura de dados**: Preferir seleção (dropdowns, escolha única/múltipla, data) em vez de texto livre; validação imediata e mensagens de erro claras.  
  *Ref.: Google Open Health Stack – Data Capture Guidelines.*

- **Arquitetura de informação**: Clareza sobre estética; reduzir carga cognitiva; hierarquia visual óbvia.  
  *Ref.: Eleken – User Interface Design for Healthcare Applications.*

- **Acessibilidade e conformidade**: WCAG 2.2 (AA como meta); tratamento de dados sensíveis (LGPD/HIPAA) refletido na UI (feedback, consentimento).  
  *Ref.: NHS Identity – Accessibility; NHS App Design System.*

### 1.2 Design systems em saúde

| Sistema | Uso no Nexus Med |
|--------|-------------------|
| **NHS Digital Design System** (UK) | Componentes acessíveis, padrões de formulário e feedback. |
| **NHS App Design System** | Padrões para app mobile-first, navegação e listas. |
| **Health Design System** (Austrália) | Tokens e componentes para produtos de saúde. |
| **Nord Design System** (Nordhealth) | Tokens, temas e web components como referência de estrutura. |

*Ref.: design-system.digital.nhs.uk, designsystem.health.gov.au, nordhealth.design.*

### 1.3 Identidade e confiança em saúde

- **Cores**: Azul associado a confiança e profissionalismo; branco a limpeza e clareza. Verde (saúde, bem-estar) pode complementar.  
  *Ref.: Wix – How to make a medical logo that inspires trust.*

- **Consistência**: Uso uniforme de logo, cores e tipografia em todos os pontos de contato.

- **Tom de voz**: Claro, respeitoso, orientado a ação; evitar jargão; linguagem inclusiva.

---

## 2. Identidade do produto – Nexus Med

### 2.1 Nome e posicionamento

- **Nome**: Nexus Med  
- **Conceito**: “Nexus” = ponto de conexão entre médico e paciente; “Med” = médico/saúde.  
- **Posicionamento**: Plataforma que integra dados de saúde, comunicação e telemedicina, com foco em clareza e confiança.

### 2.2 Princípios de identidade

| Princípio | Aplicação |
|----------|-----------|
| **Confiança** | Cores estáveis, linguagem clara, feedback explícito em ações sensíveis. |
| **Cuidado** | Tom acolhedor, mensagens de erro construtivas, confirmações antes de ações irreversíveis. |
| **Clareza** | Hierarquia tipográfica forte, ícones reconhecíveis, labels explícitos. |
| **Inclusão** | Contraste e tamanhos de toque adequados; suporte a leitores de tela. |

### 2.3 Paleta de cores (proposta)

```text
Primária (confiança, ação principal)
  – Nexus Blue:     #0B6E99 (principal)
  – Nexus Blue 80:  #0D84B8 (hover/ativo)
  – Nexus Blue 20:  #E6F2F7 (background sutil)

Secundária (saúde, confirmação)
  – Nexus Green:    #0D9488 (sucesso, saúde)
  – Nexus Green 20: #CCFBF1 (background sucesso)

Neutros (superfícies e texto)
  – Surface:       #F8FAFC
  – Surface card:  #FFFFFF
  – Text primary:  #0F172A
  – Text secondary:#64748B
  – Border:        #E2E8F0

Semânticos
  – Error:         #B91C1C
  – Warning:       #D97706
  – Success:       #0D9488
```

### 2.4 Tipografia

- **Objetivo**: Legibilidade em mobile e acessibilidade (tamanhos mínimos, contraste).
- **Proposta**:
  - **Títulos**: fonte com boa presença (ex.: **DM Sans**, **Plus Jakarta Sans** ou **Inter** em bold).
  - **Corpo e UI**: mesma família ou complementar (ex.: **Inter**, **Source Sans 3**).
- **Escala sugerida** (rem): 0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.75, 2.

### 2.5 Marca e logo

- **Logo**: Símbolo simples (nó/conexão + elemento de saúde, ex. cruz ou pulsação) + palavra “Nexus Med”.
- **Uso**: Favicon, splash, header do app; sempre com área de respiro e contraste mínimo definido.
- **Favicon**: Versão reduzida do símbolo, legível em 32px.

---

## 3. Design system – estrutura

### 3.1 Tokens (CSS custom properties)

Organização em três níveis:

1. **Primitivos**: cores hex, tamanhos em px/rem, pesos de fonte.
2. **Semânticos**: uso no produto (ex.: `color.action.primary`, `color.text.primary`, `spacing.card`).
3. **Componentes**: valores específicos de componentes (ex.: `button.radius`, `input.height`).

**Exemplo de estrutura de arquivos:**

```text
frontend/src/styles/
  _tokens/
    _colors.scss      (ou .css com :root)
    _typography.scss
    _spacing.scss
    _motion.scss
  _base/
    _reset.scss
    _typography.scss
  theme.css           (importa tokens + base)
```

**Exemplo de tokens em CSS:**

```css
:root {
  /* Primitivos */
  --color-nexus-blue: #0B6E99;
  --color-nexus-green: #0D9488;
  --font-sans: 'Inter', system-ui, sans-serif;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;

  /* Semânticos */
  --color-primary: var(--color-nexus-blue);
  --color-primary-hover: #0D84B8;
  --color-success: var(--color-nexus-green);
  --color-surface: #F8FAFC;
  --color-surface-card: #FFFFFF;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --color-error: #B91C1C;
}
```

### 3.2 Componentes base (inventário)

| Componente | Uso | Referência visual |
|------------|-----|-------------------|
| **Botão** | Primário, secundário, ghost, destrutivo; estados disabled/loading | NHS Button, Material |
| **Input** | Texto, email, senha, data; label + erro + hint | NHS Form, Health DS |
| **Card** | Blocos de conteúdo, listas, dashboards | Atual .card |
| **Chip/Tag** | Tipos de métrica, status, filtros | — |
| **Lista** | Receitas, exames, conversas, profissionais | Lista com avatar/título/subtítulo |
| **Navegação** | Bottom nav (mobile), breadcrumb, voltar | Padrão mobile-first |
| **Feedback** | Toast, alerta inline, modal de confirmação | NHS Notice, Alert |
| **Avatar** | Usuário, profissional | Iniciais ou ícone |

### 3.3 Padrões de página

- **Autenticação**: Centralizada, um fluxo por tela (login / cadastro); link para “Esqueci senha” (quando implementado).
- **Dashboard**: Cards de atalho por perfil (paciente vs profissional); mesmo layout, conteúdos diferentes.
- **Listas**: Cabeçalho com “Voltar” + título; lista com card por item; estado vazio e loading definidos.
- **Formulários**: Agrupamento lógico; um tema por seção (dados pessoais, dados de saúde); botão principal no fim.
- **Detalhe de conversa**: Área de mensagens scrollável + input fixo no rodapé; bolhas diferenciadas por remetente.

### 3.4 Acessibilidade (checklist)

- Contraste de texto ≥ 4.5:1 (AA); elementos de UI ≥ 3:1.
- Áreas de toque ≥ 44x44px (mobile).
- Labels associados a inputs; mensagens de erro associadas ao campo.
- Navegação por teclado e foco visível.
- Uso de landmarks (header, main, nav) e headings em ordem (h1 → h2).
- Testes com leitor de tela (ex.: NVDA/VoiceOver) nas telas críticas.

---

## 4. Roteiro de desenvolvimento do frontend

### Fase 1 – Fundação (Design System e tema)

| Item | Descrição |
|------|------------|
| Tokens | Arquivo de tokens (cores, tipografia, espaçamento, raio, sombra) em CSS/SCSS. |
| Tema base | Aplicar tokens em `styles.css`; substituir variáveis hardcoded atuais. |
| Tipografia | Incluir fontes (ex.: Google Fonts); aplicar escala nos títulos e corpo. |
| Documentação | Página ou Storybook interno com cores, tipo e espaçamento (opcional no MVP). |

### Fase 2 – Componentes core

| Item | Descrição |
|------|------------|
| Botões | Variantes primário, secundário, ghost, danger; estados. |
| Inputs | Label, hint, erro; acessibilidade. |
| Cards | Padrão único com slots (título, subtítulo, ação). |
| Feedback | Alerta inline; toast simples (serviço + componente). |

### Fase 3 – Padrões de layout e navegação

| Item | Descrição |
|------|------------|
| Layout | Shell com header (logo + ações) e área de conteúdo; respeitar safe area. |
| Navegação | Bottom nav para mobile (Dashboard, Mensagens, Dados, Perfil); item ativo destacado. |
| Listas | Template de item (ícone/avatar, título, subtítulo, ação); estados vazio e loading. |

### Fase 4 – Aplicação à aplicação

| Item | Descrição |
|------|------------|
| Telas | Reaplicar componentes e tokens em Login, Register, Dashboard, Prescriptions, Exams, Health Metrics, Messages, Professionals, LGPD. |
| Fluxos | Consistência de feedback (sucesso/erro), confirmações (ex.: excluir conta). |
| Responsivo | Breakpoints definidos (mobile primeiro; tablet/desktop como expansão). |

### Fase 5 – Identidade e polish

| Item | Descrição |
|------|------------|
| Logo e favicon | Inclusão do símbolo e “Nexus Med” onde aplicável. |
| Onboarding | Telas de boas-vindas e consentimento LGPD (se ainda não existirem). |
| Acessibilidade | Revisão de contraste, foco e leitor de tela; ajustes finos. |
| Performance | Lazy loading de rotas; otimização de imagens e fontes. |

---

## 5. Estrutura de pastas sugerida (frontend)

```text
frontend/src/
  app/
    core/           (guards, interceptors, services)
    shared/         (componentes e diretivas reutilizáveis)
      components/   (botão, input, card, alerta, etc.)
      pipes/
    features/       (ou pages/)
      auth/
      dashboard/
      prescriptions/
      ...
    layout/         (shell, header, bottom-nav)
  styles/
    _tokens/
    _base/
    theme.css
  assets/
    fonts/
    images/
    icons/
```

---

## 6. Referências diretas

1. **UX em healthcare**  
   - designlab.com/blog (UX Design in Healthcare)  
   - eleken.co (User Interface Design for Healthcare Applications 2025)  
   - developers.google.com/open-health-stack/design (Data Capture)

2. **Design systems**  
   - design-system.digital.nhs.uk (NHS Digital)  
   - design-system.nhsapp.service.nhs.uk (NHS App)  
   - designsystem.health.gov.au (Health Design System – Austrália)  
   - nordhealth.design (Nord Design System)

3. **Identidade e acessibilidade**  
   - england.nhs.uk/nhsidentity (NHS Identity)  
   - service-manual.nhs.uk/accessibility (NHS Accessibility)  
   - wix.com/blog (Medical logo trust)

4. **Design tokens**  
   - css-tricks.com (What Are Design Tokens)  
   - penpot.app/blog (Design tokens and CSS variables)  
   - telerik.com/blogs (Design Tokens building blocks)

---

## 7. Próximos passos recomendados

1. Validar paleta e tipografia com stakeholders (e, se possível, um teste rápido de contraste).  
2. Implementar tokens em `frontend/src/styles` e aplicar no tema global.  
3. Criar componentes shared (botão, input, card) e usá-los nas telas existentes.  
4. Introduzir layout (shell + bottom nav) e ajustar rotas.  
5. Inserir logo e favicon; revisar textos e fluxos sob a ótica da identidade e acessibilidade.

Este documento serve como referência única para o planejamento do frontend, do design system e da identidade do Nexus Med, alinhado a boas práticas de saúde digital e acessibilidade.
