# 🏥 Nexus Med

> Aplicação web mobile-first para integração médico-paciente: receituário, exames, dados de saúde, mensagens e avaliações, com autenticação JWT e conformidade LGPD.

## 📚 Documentação

### 📑 [Índice Completo da Documentação](docs/INDEX.md)

| Documento | Descrição |
|-----------|-----------|
| **[📑 INDEX.md](docs/INDEX.md)** | **Índice navegável de toda a documentação** (comece aqui!) |
| **[📖 ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Arquitetura completa do sistema, camadas, padrões SOLID e fluxos |
| **[🎨 DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** | Paleta de cores, tipografia, componentes e tokens de design |
| **[🧩 COMPONENT_GUIDE.md](docs/COMPONENT_GUIDE.md)** | Guia prático de uso dos componentes com exemplos de código |
| **[🔄 DATA_FLOW.md](docs/DATA_FLOW.md)** | Fluxo de dados, comunicação API e gerenciamento de estado |
| **[🔗 API_ENDPOINTS.md](docs/API_ENDPOINTS.md)** | Documentação de todos os endpoints da API REST |
| **[📋 PLANEJAMENTO_FRONTEND_E_DESIGN_SYSTEM.md](docs/PLANEJAMENTO_FRONTEND_E_DESIGN_SYSTEM.md)** | Planejamento e roadmap do desenvolvimento frontend |
| **[📐 STYLE_GUIDE.md](docs/STYLE_GUIDE.md)** | Padrões de código, convenções e boas práticas |
| **[📝 CHANGELOG.md](CHANGELOG.md)** | Histórico de versões e mudanças no projeto |

### 🎨 Design System Interativo

Acesse `/design-system` após fazer login para visualizar:
- Paleta de cores interativa (clique para copiar)
- Showcase de componentes
- Exemplos de tipografia e espaçamento
- Demonstração de alerts e feedback

## 🏗️ Arquitetura

- **Backend:** .NET 10, Clean Architecture (Domain, Application, Infrastructure, WebApi), SOLID
- **Frontend:** React 18 + TypeScript + Vite, mobile-first, Design System
- **Banco:** SQL Server (padrão), SQLite ou PostgreSQL

## Como rodar

### Backend

```bash
cd nexus-med/src/NexusMed.WebApi
dotnet run
```

A API sobe em `http://localhost:5053`. Swagger em `http://localhost:5053/swagger` (em Development).

### Frontend

Requer Node.js e npm instalados:

```bash
cd nexus-med/frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O proxy envia `/api` para a API em 5053.

### Publicar na Vercel (frontend)

O frontend pode ser publicado na [Vercel](https://vercel.com). O backend .NET deve estar em outro serviço (Azure, Railway, Render, etc.).

1. **Root Directory** na Vercel: `frontend`
2. Variável de ambiente: `VITE_API_URL` = URL do backend (ex: `https://sua-api.railway.app/api`)
3. Deploy: a Vercel usa `npm run build` (Vite) automaticamente.

Guia completo: **[docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md)**

### Backend + banco de graça (testes)

Para hospedar a API .NET e o banco (PostgreSQL ou SQLite) em plano gratuito:

- **Railway** ou **Render**: use o **Dockerfile.api** na raiz e siga **[docs/DEPLOY_BACKEND_FREE.md](docs/DEPLOY_BACKEND_FREE.md)**.

### Banco em Docker (SQL Server)

Para subir apenas o banco de dados com Docker:

```bash
cd nexus-med
docker-compose up -d
```

O SQL Server sobe na porta **1433**. Senha do usuário `sa`: `NexusMed@Passw0rd`.

Para a API usar esse banco, execute com o ambiente Docker (carrega `appsettings.Docker.json`):

```bash
cd src/NexusMed.WebApi
set ASPNETCORE_ENVIRONMENT=Docker
dotnet run
```

No Linux/macOS: `export ASPNETCORE_ENVIRONMENT=Docker` antes de `dotnet run`.

- **Dockerfile do banco:** `database/Dockerfile` (imagem base oficial Microsoft SQL Server).
- **docker-compose.yml** na raiz: serviço `db` com volume persistente `nexus-med-sqldata`.

### Banco (configuração manual)

O projeto suporta **SQL Server** (padrão), SQLite ou PostgreSQL. Em `appsettings.json`:

- **SQL Server (LocalDB):** já configurado por padrão. Exige [SQL Server LocalDB](https://learn.microsoft.com/sql/database-engine/configure-windows/sql-server-express-localdb) ou instância completa.
- **SQL Server (instância):** `"DatabaseProvider": "SqlServer"` e `ConnectionStrings:DefaultConnection` com algo como  
  `Server=.;Database=NexusMed;User Id=sa;Password=...;TrustServerCertificate=True;`
- **SQLite:** `"DatabaseProvider": "Sqlite"` e `"DefaultConnection": "Data Source=nexusmed.db"`
- **PostgreSQL:** `"DatabaseProvider": "Npgsql"` e a connection string com `Host=...;Database=...;Username=...;Password=...`

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro e login de paciente e profissional
- JWT + refresh token com renovação automática
- Proteção de rotas e autorização por role

### 💊 Receituário e Exames
- Profissional emite receitas para pacientes
- Listagem de receitas (paciente e profissional)
- Upload e visualização de exames

### 📊 Dados de Saúde
- Paciente registra métricas: glicemia, PA, peso, atividade física
- Dashboard de métricas com visualização temporal
- Profissional visualiza dados dos pacientes

### 💬 Mensagens
- Conversas entre paciente e profissional
- Lista de conversas com últimas mensagens
- Interface de chat em tempo real

### ⭐ Avaliações
- Pacientes avaliam profissionais
- Listagem de profissionais com nota média
- Sistema de reputação

### 🔒 LGPD
- Consentimento de uso de dados
- Exportação completa de dados pessoais
- Exclusão de conta e dados
- Auditoria de acesso a dados sensíveis

## 📁 Estrutura do Projeto

### Backend (Clean Architecture)

```
src/
├── NexusMed.Domain/          # Entidades e interfaces do domínio
├── NexusMed.Application/     # Casos de uso e DTOs
├── NexusMed.Infrastructure/  # EF Core, repositórios, JWT, BCrypt
└── NexusMed.WebApi/          # Controllers, middleware, DI
```

### Frontend (React + TypeScript)

```
frontend/
├── src/
│   ├── pages/          # Páginas/Views da aplicação
│   ├── components/     # Componentes reutilizáveis
│   ├── core/          # Context API e serviços
│   ├── index.css      # Design tokens e estilos globais
│   └── App.tsx        # Rotas e configuração
└── docs/              # Documentação
```

### 📖 Para Mais Detalhes

Consulte **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** para diagramas completos e explicação de cada camada.

## 🎨 Design System

O projeto segue um design system completo com:

- **Paleta de cores**: Nexus Blue (confiança) + Nexus Green (saúde)
- **Tipografia**: Sistema de escalas e pesos otimizados
- **Espaçamento**: Grid de 8pt para consistência
- **Componentes**: Botões, inputs, cards, alerts padronizados
- **Acessibilidade**: WCAG 2.2 (AA) compliance

Veja detalhes em **[DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** ou acesse `/design-system` no app.

## 🔄 Fluxo de Dados

A aplicação utiliza:

- **Estado Global**: React Context para autenticação
- **Estado Local**: useState para dados de página
- **Comunicação**: API REST com interceptors para tokens
- **Segurança**: JWT com refresh automático

Fluxos detalhados em **[DATA_FLOW.md](docs/DATA_FLOW.md)**.

## 🚀 Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, React Router |
| **Backend** | .NET 10, ASP.NET Core, Entity Framework Core |
| **Segurança** | JWT Bearer, BCrypt.Net |
| **Banco de Dados** | SQL Server, SQLite, PostgreSQL |
| **DevOps** | Docker, Git |

## 📈 Roadmap

- [ ] WebSockets para mensagens em tempo real (SignalR)
- [ ] PWA com offline-first
- [ ] React Query para cache inteligente
- [ ] Notificações push
- [ ] Telemedicina com vídeo chamada
- [ ] Migração para microservices
- [ ] Redis para cache distribuído

## 🤖 Regras de IA

O projeto possui regras de desenvolvimento automáticas para agentes de IA em `.cursor/rules/`:

| Regra | Aplicação | Descrição |
|-------|-----------|-----------|
| **nexus-med-core.mdc** | Sempre | Princípios fundamentais, nomenclatura, design tokens |
| **frontend-react.mdc** | `**/*.tsx, **/*.ts` | Padrões React, TypeScript, hooks, acessibilidade |
| **backend-dotnet.mdc** | `**/*.cs` | Clean Architecture, async/await, LINQ, segurança |
| **design-system.mdc** | `**/*.tsx, **/*.css` | Paleta de cores, componentes, mobile-first |
| **documentation.mdc** | `**/*.md` | Padrões de markdown, diagramas, exemplos |

**Benefícios**:
- ✅ Código consistente automaticamente
- ✅ IA segue os mesmos padrões do time
- ✅ Menos erros de convenção
- ✅ Onboarding rápido para novos agentes

Veja detalhes em [.cursor/rules/README.md](.cursor/rules/README.md)

## 📤 Subir o repositório no Git

Para publicar o projeto no **GitHub**, **GitLab** ou **Bitbucket**:

1. **Instale o Git** (se ainda não tiver): [git-scm.com/download/win](https://git-scm.com/download/win)
2. **Crie um repositório vazio** no GitHub (ou outro) — não adicione README.
3. Na pasta do projeto, execute o script:
   ```powershell
   .\subir-git.ps1
   ```
   Ou siga o guia passo a passo: **[docs/GIT_SETUP.md](docs/GIT_SETUP.md)**

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

**Padrões a seguir**:
- [STYLE_GUIDE.md](docs/STYLE_GUIDE.md) - Convenções de código
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Estrutura do projeto
- [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) - UI e componentes
- [.cursor/rules/](.cursor/rules/) - Regras de IA (seguem os mesmos padrões)

## 📄 Licença

Este projeto é open source. Consulte o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com 💙 pela equipe Nexus Med**  
*Conectando saúde e tecnologia*
