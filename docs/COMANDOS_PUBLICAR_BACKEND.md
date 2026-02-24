# Comandos e passos para publicar o backend online

Resumo objetivo para colocar a **API Nexus Med** no ar. Detalhes em [DEPLOY_BACKEND_FREE.md](DEPLOY_BACKEND_FREE.md).

---

## Opções recomendadas

| Serviço      | Vantagem                    | Custo              |
|-------------|-----------------------------|--------------------|
| **Railway** | Simples, migrations automáticas | ~US$ 5 crédito/mês (free tier) |
| **Render**  | 100% free tier              | Serviço “dorme” após ~15 min  |
| **Fly.io**  | Free tier com recursos limitados | Grátis com limites |

---

## 1. Railway (recomendado)

### Passos

1. **Conta:** [railway.app](https://railway.app) → entrar com GitHub.
2. **New Project** → **Deploy from GitHub repo** → escolher o repositório do **nexus-med** (ou o nome do seu repo).
3. **PostgreSQL:** no projeto → **+ New** → **Database** → **PostgreSQL**. Anotar a **DATABASE_URL** (aba Variables do serviço do banco).
4. **API:** **+ New** → **GitHub Repo** (mesmo repositório).
   - **Root Directory:** deixar **em branco**.
   - O `railway.toml` na raiz já aponta para `Dockerfile.api`; se o Railway ignorar, em **Variables** do serviço da API adicione:
     - **RAILWAY_DOCKERFILE_PATH** = `Dockerfile.api`
5. **Variáveis de ambiente** no serviço da **API**:

   | Nome                                 | Valor |
   |--------------------------------------|--------|
   | `DatabaseProvider`                   | `Npgsql` |
   | `ConnectionStrings__DefaultConnection` | (valor de **DATABASE_URL** do PostgreSQL) |
   | `Jwt__Secret`                        | Chave longa e aleatória (32+ caracteres) |
   | `Jwt__Issuer`                        | `NexusMed` |
   | `Jwt__Audience`                      | `NexusMed` |

   No Railway dá para usar **Add Reference** e apontar `ConnectionStrings__DefaultConnection` para a variável `DATABASE_URL` do serviço PostgreSQL.

6. **Domínio:** no serviço da API → **Settings** → **Networking** → **Generate Domain**. Ex.: `https://nexus-med-api.up.railway.app`.

### Migrations

Não é preciso rodar migrations à mão. O `Program.cs` chama `db.Database.Migrate()` na subida; com a connection string correta, as tabelas são criadas/atualizadas no primeiro deploy.

---

## 2. Render (free tier)

1. **Conta:** [render.com](https://render.com) → GitHub.
2. **PostgreSQL:** Dashboard → **New +** → **PostgreSQL** → criar (anotar **Internal Database URL**).
3. **Web Service:** **New +** → **Web Service** → conectar o repo do nexus-med.
   - **Root Directory:** em branco.
   - **Environment:** `Docker`.
   - **Dockerfile Path:** `Dockerfile.api`.
4. **Environment Variables:**

   | Key                                 | Value |
   |-------------------------------------|--------|
   | `DatabaseProvider`                  | `Npgsql` |
   | `ConnectionStrings__DefaultConnection` | (Internal Database URL do PostgreSQL) |
   | `Jwt__Secret`                       | Chave longa (32+ caracteres) |
   | `Jwt__Issuer`                       | `NexusMed` |
   | `Jwt__Audience`                     | `NexusMed` |

5. **Create Web Service**. URL tipo: `https://nexusmed-api.onrender.com`.

Na free tier, o serviço pode “dormir” após ~15 min; a primeira requisição depois disso pode demorar ~1 min.

---

## 3. Comandos úteis (local)

### Gerar chave para JWT (PowerShell)

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Use o resultado (ou uma string longa aleatória) em `Jwt__Secret`.

### Aplicar migrations no banco local (ou em um PostgreSQL remoto)

```powershell
cd C:\Users\Caio\nexus-med\src\NexusMed.WebApi
dotnet ef database update --project ..\NexusMed.Infrastructure --startup-project .
```

### Rodar migrations contra o PostgreSQL do Railway (manual)

```powershell
cd C:\Users\Caio\nexus-med\src\NexusMed.WebApi

$env:DatabaseProvider = "Npgsql"
$env:ConnectionStrings__DefaultConnection = "postgresql://postgres:SUA_SENHA@HOST:PORTA/railway"

dotnet ef database update --project ..\NexusMed.Infrastructure --startup-project .
```

Substitua `SUA_SENHA`, `HOST` e `PORTA` pelos valores da **DATABASE_URL** do Railway.

---

## 4. Frontend (Vercel) apontando para a API

Depois de publicar o backend:

1. No projeto do frontend na **Vercel** → **Settings** → **Environment Variables**.
2. Adicionar:
   - **Name:** `VITE_API_URL`
   - **Value:** URL da API **sem** barra no final (ex.: `https://nexus-med-api.up.railway.app`).
3. **Redeploy** do frontend para aplicar a variável.

O frontend usa `VITE_API_URL` em produção; em desenvolvimento continua usando o proxy para `localhost:5053`.

---

## 5. Checklist

- [ ] Repo no GitHub (nexus-med ou seu nome).
- [ ] Railway ou Render: projeto + PostgreSQL + serviço da API.
- [ ] Variáveis da API: `DatabaseProvider`, `ConnectionStrings__DefaultConnection`, `Jwt__Secret`, `Jwt__Issuer`, `Jwt__Audience`.
- [ ] Root Directory do serviço da API em branco; Dockerfile = `Dockerfile.api`.
- [ ] Domínio público gerado para a API.
- [ ] Na Vercel: `VITE_API_URL` = URL do backend; redeploy.
- [ ] Teste: abrir o site, cadastro e login.

---

## 6. Se a imagem .NET 10 não existir

O `Dockerfile.api` usa `sdk:10.0` e `aspnet:10.0`. Se der erro de imagem não encontrada:

1. Editar **Dockerfile.api**: trocar `10.0` por `8.0` nas duas linhas (sdk e aspnet).
2. No **NexusMed.WebApi.csproj** (e se necessário nos outros .csproj): `<TargetFramework>net8.0</TargetFramework>` e versões compatíveis dos pacotes.
3. Commit, push e novo deploy.

---

**Documentos relacionados:** [DEPLOY_BACKEND_FREE.md](DEPLOY_BACKEND_FREE.md) (detalhes) · [MIGRATIONS_RAILWAY.md](MIGRATIONS_RAILWAY.md) (connection string e migrations).
