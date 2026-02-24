# Análise de UX e UI – Frontend Nexus Med

Documento de análise do frontend React (UX e UI) do projeto Nexus Med, com pontos fortes, inconsistências e recomendações.

---

## 1. Visão geral

| Aspecto | Situação atual |
|--------|-----------------|
| **Stack** | React, React Router, CSS (global + utilitários) |
| **Estrutura** | Páginas em `pages/`, componentes em `components/`, config em `config/`, core em `core/` |
| **Design** | Tokens em `:root` (cores, radius, shadow), sem biblioteca de componentes |
| **Navegação** | Layout com barra superior + sidebar (desktop); cards no dashboard (mobile) |
| **Feedback** | Toasts (sucesso/erro), modais de confirmação, empty states, skeletons em algumas telas |

---

## 2. Pontos fortes

### 2.1 Design system base
- **Tokens CSS** consistentes: `--primary`, `--text-muted`, `--radius`, `--shadow`, `--transition`.
- **Paleta** coerente (teal/verde) e adequada a contexto de saúde.
- **Tipografia** com hierarquia clara (títulos, labels, hints).

### 2.2 Componentes reutilizáveis
- **PageHeader**: volta + título + slot opcional à direita.
- **EmptyState**: ícone, título, descrição e CTA; uso em várias páginas.
- **StatusBadge**: estados visuais (agendada, cancelada etc.).
- **ConfirmModal**: confirmação de ações destrutivas com `aria-modal` e `aria-labelledby`.
- **ToastContext**: feedback global sem bloquear a tela.
- **NotificationBell**: acesso rápido a notificações com indicador de não lidas.

### 2.3 Padrões de conteúdo
- **Tabs** em pill com estado ativo (Consultas / Agendar, etc.) e `aria-selected`.
- **Cards** com `.card-clickable` e feedback de hover/active.
- **Formulários** com `.form-group`, `.label`, `.input`, `.form-hint`.
- **Landing** e **login** com carrossel e CTAs claros.

### 2.4 Navegação e layout
- **Sidebar** no desktop com NavLink ativo e ícones.
- **Dashboard** sem redundância em desktop (só dica + menu lateral); em mobile, cards para navegar.
- **Fluxo de agendamento** simplificado: data única + blocos de 45 min.

### 2.5 Acessibilidade (parcial)
- Uso de `aria-label`, `aria-hidden`, `role="dialog"`, `role="tablist"` / `tab` onde aplicável.
- Focus visível em inputs (outline + box-shadow).
- Estrutura de headings (h1 por página).

---

## 3. Inconsistências e lacunas

### 3.1 Cabeçalho de página
- **Com PageHeader:** AppointmentsPage, NotificationsPage, ClinicalNotesPage.
- **Sem PageHeader** (header manual com “← Voltar” + h1): PrescriptionsPage, ExamsPage, MessagesPage, HealthMetricsPage, ProfessionalsPage, LgpdPage, etc.

**Impacto:** Visual e hierarquia diferentes entre telas; manutenção mais difícil.

**Recomendação:** Padronizar todas as páginas internas com `<PageHeader title="..." backTo="/dashboard" />` (e `right` quando houver ação no header).

### 3.2 Estados de loading
- **Skeleton:** AppointmentsPage, NotificationsPage (e outras que usam EmptyState após load).
- **Só texto “Carregando...”:** PrescriptionsPage, MessagesPage, ExamsPage, HealthMetricsPage, ProfessionalsPage.

**Impacto:** Experiência desigual; em algumas telas a espera parece “travada”.

**Recomendação:** Usar skeleton (ou um componente `LoadingState` único) em listas e formulários que dependem de API.

### 3.3 Empty state
- **Com EmptyState (ícone + texto + CTA):** Appointments, Notifications, ClinicalNotes, Agendar.
- **Só parágrafo:** Prescriptions (“Nenhuma prescrição.”), Messages, Exams.

**Impacto:** Telas mais “secas” e menos orientação quando não há dados.

**Recomendação:** Usar `<EmptyState>` em todas as listas vazias, com título, descrição e ação quando fizer sentido (ex.: “Ver profissionais” em Mensagens).

### 3.4 Tratamento de erro
- Uso de `error-msg` e toasts em várias telas.
- Em algumas páginas o erro só aparece no toast; em outras também em texto na página.

**Recomendação:** Manter erro visível na página (acessível e persistente) + toast opcional para reforço; evitar só toast em telas de formulário.

### 3.5 Formulários
- **Labels:** Maioria com `.label`; alguns inputs sem `<label>` associado (só placeholder).
- **Validação:** Senha com regras e mensagens; outros campos às vezes só `required`.

**Recomendação:** Todo input com `<label>` (ou `aria-label`); mensagens de validação próximas ao campo; considerar `aria-invalid` e `aria-describedby` em erros.

---

## 4. Acessibilidade

### 4.1 Já atendido
- Contraste de texto/fundo adequado (cores escuras em fundo claro).
- Focus visível em inputs (border + box-shadow).
- Modal de confirmação com `role="dialog"`, `aria-modal`, `aria-labelledby`.
- Tabs com `role="tablist"` e `aria-selected`.
- Links e botões com texto ou `aria-label`.

### 4.2 A melhorar
- **Focus trap:** Modal não prende o foco nem fecha com Escape.
- **Focus após abrir modal:** Foco não vai para o primeiro elemento interativo.
- **Skip link:** Não há “Pular para conteúdo” para usuários de teclado.
- **Focus visível em botões/links:** Garantir `:focus-visible` em todos os controles (hoje parte do foco pode estar só em inputs).
- **Tabs com teclado:** Navegação por setas e Tab dentro do tablist (padrão ARIA).

---

## 5. Responsividade e uso em diferentes dispositivos

### 5.1 Pontos positivos
- Layout adaptativo: sidebar só a partir de 1024px; conteúdo centralizado em mobile.
- `env(safe-area-inset-bottom)` em páginas e toasts.
- Dashboard: cards no mobile, dica no desktop.
- Login com carrossel e card responsivo.

### 5.2 A considerar
- **Touch:** Áreas de toque em botões e links já razoáveis (padding); verificar itens de lista e linhas de notificação.
- **Sidebar em mobile:** Navegação só por “Voltar” e dashboard cards; não há menu hamburger. Para muitos itens, pode ser aceitável; para muitos usuários, um menu compacto (drawer ou bottom nav) pode ajudar.
- **Tabelas:** Se no futuro houver tabelas (ex.: lista de pacientes), planejar leitura em telas pequenas (cards ou colunas prioritárias).

---

## 6. Resumo e prioridades

### Resumo
- Base sólida: tokens, componentes (PageHeader, EmptyState, Toast, ConfirmModal, StatusBadge), layout (sidebar + barra) e fluxos principais (landing, login, agendamento) bem encaminhados.
- Principais gaps: **uso inconsistente de PageHeader, loading e empty state**, e **acessibilidade avançada** (modal, foco, teclado).

### Prioridade alta (rápido impacto)
1. **Padronizar header:** Usar `PageHeader` em todas as páginas internas (Prescriptions, Exams, Messages, HealthMetrics, Professionals, Lgpd, etc.).
2. **Empty state em todas as listas:** Trocar “Nenhuma prescrição” / “Nenhuma conversa” por `EmptyState` com título, descrição e CTA quando existir.
3. **Loading:** Introduzir skeleton (ou um único `LoadingState`) nas listas que hoje só mostram “Carregando...”.

### Prioridade média
4. **Modal:** Focus trap, foco inicial no primeiro botão/campo, fechar com Escape.
5. **Focus visível:** Garantir `:focus-visible` em botões e links (e remover `outline: none` sem substituto).
6. **Labels e erros:** Todo input com label e, em erro, `aria-invalid` + mensagem associada.

### Prioridade baixa / evolução
7. Skip link “Pular para conteúdo”.
8. Navegação por teclado nas tabs (setas).
9. Em mobile, avaliar drawer ou bottom nav se a navegação crescer.

---

## 7. Referência rápida

| Página / Área      | PageHeader | Loading      | Empty state |
|--------------------|------------|-------------|-------------|
| Appointments       | ✅         | Skeleton    | ✅          |
| Notifications      | ✅         | Skeleton    | ✅          |
| ClinicalNotes      | ✅         | -           | ✅          |
| Prescriptions      | ❌ manual  | Texto       | ❌ parágrafo|
| Exams              | ❌ manual  | Texto       | ❌ parágrafo|
| Messages           | ❌ manual  | Texto       | ❌ parágrafo|
| HealthMetrics      | ❌ manual  | -           | -           |
| Professionals      | ❌ manual  | -           | -           |
| Lgpd               | ❌ manual  | -           | -           |
| Dashboard          | -          | -           | -           |
| Landing / Login    | -          | -           | -           |

---

**Documento gerado com base no código em:** `frontend/src` (React) e `frontend/src/index.css`.  
**Sugestão:** usar este documento como checklist em sprints de UX/UI e acessibilidade.
