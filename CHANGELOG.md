# 📝 Changelog

Todas as mudanças notáveis no projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [2.0.0] - 2026-02-05

### 📚 Documentação

#### Adicionado
- **[ARCHITECTURE.md]**: Documentação completa da arquitetura do sistema
  - Visão de alto nível com diagramas
  - Stack tecnológica detalhada
  - Estrutura de diretórios completa
  - Camadas da aplicação (Clean Architecture)
  - Fluxos de dados e requisições
  - Padrões SOLID aplicados
  - Seção de segurança (JWT, BCrypt)
  - Estratégias de escalabilidade
  - Guia de testes

- **[DESIGN_SYSTEM.md]**: Sistema de design completo
  - Identidade visual do Nexus Med
  - Paleta de cores proposta (Nexus Blue + Nexus Green)
  - Sistema tipográfico escalável
  - Sistema de espaçamento (8pt grid)
  - Showcase de componentes (botões, inputs, cards, alerts)
  - Padrões de interface mobile-first
  - Checklist de acessibilidade WCAG 2.2 (AA)
  - Breakpoints e estratégias de responsividade
  - Design tokens em CSS custom properties

- **[COMPONENT_GUIDE.md]**: Guia prático de componentes
  - Exemplos de código para todos os componentes
  - Variações e estados (loading, error, disabled)
  - Boas práticas de uso
  - Padrões de layout (grids, flex, stack)
  - Helpers CSS e utilities
  - Padrões mobile-specific

- **[DATA_FLOW.md]**: Documentação de fluxo de dados
  - Arquitetura de estado (Context API)
  - Fluxos completos de autenticação
  - Fluxos de negócio (receitas, mensagens, exames)
  - Comunicação API com interceptors
  - Gerenciamento de erros hierárquico
  - Estratégias de cache (futuro)
  - Diagramas de sequência detalhados

- **[INDEX.md]**: Índice navegável da documentação
  - Guias por persona (Frontend, Backend, Designer, PO)
  - Busca rápida por tópico
  - Tempos estimados de leitura
  - Checklist de onboarding
  - Links para todos os recursos

- **[COMPONENT_GUIDE.md]**: Guia de referência rápida
  - Todos os componentes com código
  - Estados e variações
  - Exemplos práticos

#### Frontend

- **DesignSystemPage**: Página interativa de showcase do design system
  - Paleta de cores clicável (copia hex ao clicar)
  - Showcase de tipografia com escalas
  - Visualização de espaçamento (8pt grid)
  - Demonstração de componentes (botões, inputs, cards)
  - Exemplos de alerts e feedback
  - Comparação entre paleta proposta e atual
  - Acessível via `/design-system`

- **tokens.css**: Arquivo completo de design tokens
  - Cores primitivas, semânticas e de componentes
  - Sistema tipográfico completo
  - Espaçamento em grid 8pt
  - Border radius, sombras e transições
  - Z-index organizados
  - Variáveis de layout e breakpoints
  - Comentários e documentação inline
  - Preparado para modo escuro (futuro)

#### Atualizado

- **README.md**: Totalmente reformulado
  - Seção de documentação reorganizada
  - Link para índice de documentação
  - Tabela de tecnologias
  - Estrutura visual melhorada
  - Roadmap atualizado
  - Seções de contribuição
  - Seção de regras de IA

### 🤖 Regras de IA

- **Regras do Cursor**: 5 regras `.mdc` em `.cursor/rules/`
  - `nexus-med-core.mdc`: Princípios fundamentais (sempre aplicada)
  - `frontend-react.mdc`: Padrões React/TypeScript
  - `backend-dotnet.mdc`: Padrões C#/.NET e Clean Architecture
  - `design-system.mdc`: Design system e acessibilidade
  - `documentation.mdc`: Padrões de documentação markdown

**Benefícios**:
- Agentes de IA seguem automaticamente os padrões do projeto
- Código mais consistente
- Redução de erros de convenção
- Exemplos práticos com ✅ correto e ❌ errado

---

## [1.0.0] - 2026-01-28

### Adicionado

#### Backend
- Estrutura inicial do projeto .NET 10
- Clean Architecture (Domain, Application, Infrastructure, WebApi)
- Autenticação JWT com refresh tokens
- Endpoints de receitas, exames, métricas de saúde
- Sistema de mensagens entre paciente e profissional
- Sistema de avaliações
- Funcionalidades LGPD (exportar, excluir dados)
- Suporte a múltiplos bancos de dados (SQL Server, SQLite, PostgreSQL)
- Docker Compose para banco de dados

#### Frontend
- Aplicação React 18 + TypeScript + Vite
- Roteamento com React Router
- Context API para autenticação
- Páginas principais (Login, Register, Dashboard, etc.)
- Estilos mobile-first com CSS Variables
- Componentes básicos (botões, inputs, cards)

#### Documentação
- README.md inicial
- API_ENDPOINTS.md com documentação dos endpoints
- PLANEJAMENTO_FRONTEND_E_DESIGN_SYSTEM.md com roadmap

---

## Tipos de Mudanças

- **Adicionado**: para novas funcionalidades
- **Alterado**: para mudanças em funcionalidades existentes
- **Obsoleto**: para funcionalidades que serão removidas
- **Removido**: para funcionalidades removidas
- **Corrigido**: para correções de bugs
- **Segurança**: para vulnerabilidades corrigidas

---

## Links

- [2.0.0]: Documentação completa e Design System interativo
- [1.0.0]: Release inicial do projeto

---

**Mantido por**: Equipe Nexus Med  
**Última atualização**: 05/02/2026
