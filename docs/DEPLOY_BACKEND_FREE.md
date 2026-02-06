# Hospedar backend e banco de graça (só para testes)

Este guia mostra como colocar a **API .NET** e o **banco de dados** em planos gratuitos, só para testes. O frontend continua na Vercel.

---

## Opções gratuitas (resumo)

| Serviço | Backend .NET | Banco | Limite gratuito |
|--------|----------------|------|------------------|
| **Railway** | Sim (Docker ou Nixpacks) | PostgreSQL | ~US$ 5 crédito/mês |
| **Render** | Sim (Docker) | PostgreSQL | Serviço “dorme” após 15 min sem uso |
| **Fly.io** | Sim (Docker) | SQLite no mesmo container ou Postgres | Recursos limitados grátis |

Recomendação para testes: **Railway** (mais simples) ou **Render** (100% free tier).

---

## Opção 1: Railway (recomendado para testes)

Railway dá crédito gratuito por mês. Dá para rodar a API + PostgreSQL tranquilo para testes.

### 1. Conta e projeto

1. Acesse [railway.app](https://railway.app) e entre com **GitHub**.
2. **New Project**.
3. **Deploy from GitHub repo** → escolha **Cainz11/Next-Med**.

### 2. Banco PostgreSQL

1. No projeto, clique em **+ New** → **Database** → **PostgreSQL**.
2. Aguarde criar. Clique no serviço PostgreSQL → aba **Variables** (ou **Connect**).
3. Copie a variável **DATABASE_URL** (algo como `postgresql://postgres:senha@host:porta/railway`).

### 3. Serviço da API (backend)

1. **+ New** → **GitHub Repo** de novo (ou **Service** a partir do mesmo repo).
2. Repositório: **Next-Med**.
3. **Importante – Root Directory:** deixe **em branco** (não use `src/NexusMed.WebApi`). O build precisa da raiz do repositório para encontrar Domain, Application e Infrastructure.
4. O arquivo **railway.toml** na raiz do repo já define o uso do `Dockerfile.api`. Se o Railway ignorar, nas **Variables** do serviço adicione:
   - **RAILWAY_DOCKERFILE_PATH** = `Dockerfile.api`
5. Não defina Build Command nem Start Command (o Dockerfile cuida disso).

4. **Variables** (variáveis de ambiente) – **obrigatório** para usar PostgreSQL (senão a API usa SQLite ou pode falhar com LocalDB no Linux):

   | Nome | Valor |
   |------|--------|
   | `DatabaseProvider` | `Npgsql` |
   | `ConnectionStrings__DefaultConnection` | Cole o valor de **DATABASE_URL** do PostgreSQL (ex.: `postgresql://postgres:xxx@xxx.railway.internal:5432/railway`) |
   | `Jwt__Secret` | Uma chave longa e aleatória (ex.: 32+ caracteres) |
   | `Jwt__Issuer` | `NexusMed` |
   | `Jwt__Audience` | `NexusMed` |

   Para pegar a **DATABASE_URL**: no serviço **PostgreSQL** → aba **Variables** ou **Connect** → copie `DATABASE_URL` e cole em `ConnectionStrings__DefaultConnection` do serviço da **API**. No Railway você pode referenciar a variável do outro serviço: em **Variables** da API, **Add Variable** → **Add Reference** → escolha o serviço PostgreSQL → variável `DATABASE_URL` (ele preenche o valor automaticamente).

5. **Settings** do serviço da API:
   - **Generate Domain** (ou **Settings** → **Networking** → **Generate Domain**) para ter uma URL pública, ex.: `https://next-med-api.up.railway.app`.

### 4. Frontend (Vercel)

Na Vercel, no projeto do frontend:

- **Environment Variables** → adicione:
  - **Name:** `VITE_API_URL`
  - **Value:** a URL da API no Railway **sem** barra no final (ex.: `https://next-med-api.up.railway.app`)  
  Se a API expõe rotas em `/api`, use: `https://next-med-api.up.railway.app/api`.
- Faça um novo deploy para aplicar a variável.

### 5. CORS (se o front der erro de CORS)

No backend já está `AllowAnyOrigin()`. Se um dia restringir, inclua o domínio da Vercel, ex.: `https://next-med.vercel.app`.

---

## Opção 2: Render (100% free tier)

No Render, o serviço web “dorme” após ~15 min sem acesso (na free tier). O banco PostgreSQL free costuma ficar ativo.

### 1. Conta

1. Acesse [render.com](https://render.com) e entre com **GitHub**.

### 2. PostgreSQL

1. **Dashboard** → **New +** → **PostgreSQL**.
2. **Name:** `nexusmed-db`.
3. **Region:** escolha o mais próximo.
4. **Create Database**.
5. Quando criar, em **Info** pegue:
   - **Internal Database URL** (uso no backend na Render)
   - ou **External Database URL** (se for usar de fora).

### 3. Web Service (API)

1. **New +** → **Web Service**.
2. Conecte o repositório **Cainz11/Next-Med**.
3. Configurações:
   - **Name:** `nexusmed-api`
   - **Region:** mesmo do banco
   - **Root Directory:** em branco
   - **Environment:** `Docker`
   - **Dockerfile Path:** `Dockerfile.api` (na raiz do repo)

4. **Environment Variables** (Add Environment Variable):

   | Key | Value |
   |-----|--------|
   | `DatabaseProvider` | `Npgsql` |
   | `ConnectionStrings__DefaultConnection` | A **Internal Database URL** do PostgreSQL (cole inteira) |
   | `Jwt__Secret` | Chave secreta longa (32+ caracteres) |
   | `Jwt__Issuer` | `NexusMed` |
   | `Jwt__Audience` | `NexusMed` |

5. **Create Web Service**. O Render vai buildar a imagem e subir a API. A URL será algo como `https://nexusmed-api.onrender.com`.

### 4. Frontend (Vercel)

No projeto da Vercel:

- **VITE_API_URL** = `https://nexusmed-api.onrender.com` (ou `https://nexusmed-api.onrender.com/api` se a API usar o prefixo `/api`).
- Redeploy do frontend.

### 5. Observação

Na free tier, na primeira requisição após um tempo parado o serviço pode demorar ~1 minuto para “acordar”. Isso é normal.

---

## Opção 3: Só SQLite (um único serviço, bem simples)

Se quiser **só testar** e não se importar em perder dados a cada redeploy, dá para rodar a API com **SQLite** (arquivo local no container), sem banco externo.

### Railway com SQLite

1. **New Project** → **Deploy from GitHub repo** → **Next-Med**.
2. No serviço criado:
   - **Dockerfile Path:** `Dockerfile.api`
   - **Variables:**
     - `DatabaseProvider` = `Sqlite`
     - `ConnectionStrings__DefaultConnection` = `Data Source=nexusmed.db`
     - `Jwt__Secret` = (chave longa)
     - `Jwt__Issuer` = `NexusMed`
     - `Jwt__Audience` = `NexusMed`
3. **Generate Domain** e use essa URL no **VITE_API_URL** da Vercel.

Os dados ficam no container; se o serviço for recriado, o arquivo some. Para testes rápidos serve.

---

## Checklist rápido

- [ ] Backend publicado (Railway ou Render) e URL da API anotada.
- [ ] Banco PostgreSQL criado (ou SQLite só para teste) e connection string no backend.
- [ ] Variáveis `Jwt__Secret`, `DatabaseProvider` e `ConnectionStrings__DefaultConnection` configuradas no backend.
- [ ] Na Vercel, `VITE_API_URL` apontando para a URL do backend (com ou sem `/api` conforme sua API).
- [ ] Novo deploy do frontend na Vercel após mudar `VITE_API_URL`.
- [ ] Teste: abrir o site na Vercel, cadastro e login.

---

## Erro: "The referenced project ../NexusMed.Application does not exist"

Isso acontece quando o Railway **não** usa o `Dockerfile.api` e tenta buildar só a pasta do WebApi (sem Domain, Application, Infrastructure).

**Solução:**

1. **Root Directory** do serviço no Railway deve estar **vazio**. Se estiver `src/NexusMed.WebApi`, apague e deixe em branco.
2. O repositório deve ter o **railway.toml** na raiz (já existe) com `builder = "DOCKERFILE"` e `dockerfilePath = "Dockerfile.api"`.
3. Se ainda assim usar Nixpacks/Railpack, nas **Variables** do serviço adicione:
   - **RAILWAY_DOCKERFILE_PATH** = `Dockerfile.api`
4. Faça um novo deploy (Redeploy ou push no GitHub).

---

## Erro: "LocalDB is not supported on this platform"

Isso acontece quando a API está rodando no **Linux** (Railway, Render) mas a configuração ainda aponta para **SQL Server LocalDB** (que só existe no Windows).

**Solução:**

1. **Defina as variáveis de ambiente** no serviço da API (Railway/Render):
   - **DatabaseProvider** = `Npgsql`
   - **ConnectionStrings__DefaultConnection** = URL do PostgreSQL (a mesma **DATABASE_URL** do banco que você criou)

2. No **Railway**: no serviço da API → **Variables** → **Add Reference** → selecione o serviço PostgreSQL → variável `DATABASE_URL`. Depois crie uma variável **ConnectionStrings__DefaultConnection** e use essa referência, ou copie o valor de `DATABASE_URL` do PostgreSQL e cole em `ConnectionStrings__DefaultConnection`.

3. Se não configurar PostgreSQL, a API passa a usar **SQLite** automaticamente no Linux (arquivo `nexusmed.db` no container). Os dados podem ser perdidos em redeploys.

---

## Migrations (criar tabelas no banco)

A API já aplica as **migrations do EF Core na subida** (`db.Database.Migrate()` no `Program.cs`). Ou seja, ao fazer deploy no Railway com a connection string correta, as tabelas são criadas/atualizadas sozinhas.

- **Connection string:** use a **URL completa** do PostgreSQL (ex.: `postgresql://postgres:senha@shuttle.proxy.rlwy.net:33548/railway`), não só `host:porta`.
- Guia específico: **[MIGRATIONS_RAILWAY.md](MIGRATIONS_RAILWAY.md)**.

---

## Se o Dockerfile falhar (imagem .NET 10)

Se a imagem `mcr.microsoft.com/dotnet/sdk:10.0` ou `aspnet:10.0` não existir ou der erro:

1. Abra **Dockerfile.api** na raiz do repo.
2. Troque:
   - `sdk:10.0` → `sdk:8.0`
   - `aspnet:10.0` → `aspnet:8.0`
3. No **NexusMed.WebApi.csproj**, altere `<TargetFramework>net10.0</TargetFramework>` para `net8.0` e ajuste o pacote **Microsoft.AspNetCore.OpenApi** para uma versão 8.x compatível.
4. Faça commit e push para o GitHub e rode o deploy de novo.

---

## Resumo das URLs

| Onde | URL exemplo |
|------|-------------|
| Frontend (Vercel) | `https://next-med.vercel.app` |
| Backend (Railway) | `https://next-med-api.up.railway.app` |
| Backend (Render) | `https://nexusmed-api.onrender.com` |

O frontend chama a API usando a variável **VITE_API_URL** que você configurou na Vercel.

---

**Última atualização:** Fevereiro 2026  
**Mantido por:** Equipe Nexus Med
