# 🚀 Publicar o Nexus Med na Vercel

Este guia explica como publicar o **frontend** do Nexus Med na Vercel. O **backend** (.NET) precisa estar em outro serviço (Azure, Railway, Render, etc.).

## 📋 Visão geral

```
┌─────────────────────────────────────────────────────────────┐
│                        Produção                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Usuário                                                    │
│      │                                                       │
│      ▼                                                       │
│   Vercel (Frontend React)                                    │
│   https://nexus-med.vercel.app                                │
│      │                                                       │
│      │  Requisições /api/* → VITE_API_URL                    │
│      ▼                                                       │
│   Backend .NET (outro provedor)                              │
│   https://sua-api.railway.app  ou  Azure / Render / etc.     │
│      │                                                       │
│      ▼                                                       │
│   Banco de dados (SQL Server, etc.)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

- **Vercel**: hospeda apenas o frontend (HTML, CSS, JS estáticos).
- **Backend**: deve estar publicado em um serviço que suporte .NET (Azure App Service, Railway, Render, Fly.io, etc.).

---

## 1️⃣ Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Backend .NET já publicado e acessível via HTTPS (para configurar a URL da API)
- Repositório Git (GitHub, GitLab ou Bitbucket) com o projeto

---

## 2️⃣ Deploy pela interface da Vercel

### Passo 1: Importar o projeto

1. Acesse [vercel.com](https://vercel.com) e faça login.
2. Clique em **Add New** → **Project**.
3. Importe o repositório do Nexus Med (conecte GitHub/GitLab/Bitbucket se ainda não estiver conectado).
4. Se o repositório tiver **apenas a pasta `frontend`** como raiz do app, na Vercel use **Root Directory**: `frontend`.

### Passo 2: Configurar o projeto

| Campo | Valor |
|-------|--------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` (se o repositório for a raiz do monorepo) |
| **Build Command** | `npm run build` (já vem do vercel.json) |
| **Output Directory** | `dist` (já vem do vercel.json) |
| **Install Command** | `npm install` |

Se você usar o `vercel.json` que está em `frontend/`, a Vercel já usa esses valores.

### Passo 3: Variáveis de ambiente

Em **Settings** → **Environment Variables** do projeto na Vercel, adicione:

| Nome | Valor | Ambiente |
|------|--------|----------|
| `VITE_API_URL` | `https://SUA-API.com` | Production (e Preview se quiser) |

**Exemplos:**

- Backend na Railway: `https://nexus-med-api.railway.app`
- Backend na Azure: `https://nexus-med-api.azurewebsites.net`
- Backend no Render: `https://nexus-med-api.onrender.com`

**Importante:** A URL deve ser a **base** da API. Se o backend expõe rotas em `/api` (ex: `/api/auth/login`), inclua `/api` na URL:

```text
https://sua-api.railway.app/api
```

Assim o frontend chama `VITE_API_URL + '/auth/login'` → `https://sua-api.railway.app/api/auth/login`.

### Passo 4: Deploy

1. Clique em **Deploy**.
2. Aguarde o build. O comando executado será `npm run build` (Vite).
3. Ao finalizar, a Vercel mostra a URL do projeto, por exemplo:  
   `https://nexus-med-xxx.vercel.app`

---

## 3️⃣ Deploy pela CLI (opcional)

### Instalar a Vercel CLI

```bash
npm i -g vercel
```

### Fazer deploy a partir da pasta frontend

```bash
cd nexus-med/frontend
npm install
vercel
```

- Na primeira vez, faça login com `vercel login` e responda às perguntas (linkar a um projeto ou criar um novo).
- Para **produção**:

```bash
vercel --prod
```

### Variáveis de ambiente pela CLI

```bash
cd frontend
vercel env add VITE_API_URL
# Escolha Production (e Preview se quiser) e informe a URL da API
```

Depois rode o deploy de novo:

```bash
vercel --prod
```

---

## 4️⃣ Repositório só com o frontend

Se o repositório for **somente** a pasta `frontend` (sem pasta `src` do backend):

- **Root Directory** na Vercel: deixe em branco (raiz do repo).
- O `vercel.json` e o `package.json` já devem estar na raiz desse repositório.

---

## 5️⃣ Repositório monorepo (raiz = nexus-med)

Se a raiz do repositório for o monorepo (ex: `nexus-med/` com `frontend/` e `src/`):

1. Na Vercel, em **Root Directory** defina: **frontend**.
2. A Vercel vai usar `frontend/package.json`, `frontend/vercel.json` e rodar o build dentro de `frontend/`.

---

## 6️⃣ Backend e CORS

O backend .NET precisa permitir a origem do frontend na Vercel. Exemplo em `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "https://nexus-med.vercel.app",     // produção
                "https://*.vercel.app"              // previews
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ...
app.UseCors();
```

Ajuste os domínios para os que a Vercel mostrar no seu projeto (ex: `https://seu-projeto.vercel.app`).

---

## 7️⃣ Resumo rápido

| Etapa | Ação |
|--------|------|
| 1 | Publicar o backend .NET em algum provedor (Azure, Railway, Render, etc.) |
| 2 | Criar projeto na Vercel e apontar para o repo (Root = `frontend` se for monorepo) |
| 3 | Definir `VITE_API_URL` com a URL base da API (incluindo `/api` se for o caso) |
| 4 | Fazer o deploy (botão Deploy ou `vercel --prod`) |
| 5 | Configurar CORS no backend para a URL do frontend na Vercel |

---

## 8️⃣ Onde hospedar o backend .NET

A Vercel **não** executa aplicações .NET. O backend precisa estar em um destes (ou similar):

| Serviço | Exemplo de uso |
|---------|-----------------|
| **Azure App Service** | Publicar a WebApi e usar a URL no `VITE_API_URL` |
| **Railway** | Criar projeto, conectar repo, escolher pasta da API e fazer deploy |
| **Render** | Web Service com Docker ou build .NET |
| **Fly.io** | Deploy de container com a API .NET |
| **AWS / GCP** | App runner, Cloud Run, etc. |

Depois de publicar o backend, use a URL pública (ex: `https://sua-api.railway.app/api`) em `VITE_API_URL` na Vercel.

---

## 9️⃣ Troubleshooting

### Build falha na Vercel

- Confirme que **Root Directory** está como `frontend` (no monorepo).
- Veja os logs do build: pode faltar dependência (ex.: `react`, `vite`) no `package.json`; o `package.json` que configuramos já inclui `build: "vite build"` e as dependências necessárias.

### “Erro de rede” ou “CORS” no browser

- Verifique se `VITE_API_URL` está correta e acessível (abrir no navegador ou com `curl`).
- Confirme que o backend tem CORS liberado para o domínio do frontend na Vercel (`https://seu-projeto.vercel.app` e, se quiser, `https://*.vercel.app`).

### Rotas 404 ao recarregar a página

O `vercel.json` já tem um rewrite enviando tudo para `index.html` (SPA). Se ainda der 404, confira se o **Output Directory** é `dist` e se o rewrite está aplicado (às vezes é preciso redeployar após mudar o `vercel.json`).

---

**Última atualização**: Fevereiro 2026  
**Mantido por**: Equipe Nexus Med
