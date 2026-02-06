# Migrations e banco no Railway

## O que foi configurado

- **Migrations EF Core**: a pasta `src/NexusMed.Infrastructure/Persistence/Migrations` contém a migração inicial (`InitialCreate`).
- **Na subida da API**: o `Program.cs` chama `db.Database.Migrate()`, então **as migrations são aplicadas automaticamente** sempre que a API sobe (incluindo no Railway).

Ou seja: não é preciso rodar migrations à mão no Railway. Basta garantir a **connection string** correta e fazer deploy (ou redeploy). Na primeira execução, as tabelas são criadas.

---

## Connection string no Railway

O endereço que você citou (`shuttle.proxy.rlwy.net:33548`) é só **host:porta**. A API precisa da **connection string completa** que o Railway gera para o PostgreSQL.

### Onde pegar no Railway

1. Abra o **serviço PostgreSQL** no seu projeto.
2. Aba **Variables** (ou **Connect** / **Connection**).
3. Copie a variável **`DATABASE_URL`**.  
   Ela vem nesse formato:
   ```text
   postgresql://postgres:SENHA@shuttle.proxy.rlwy.net:33548/railway
   ```
   (host e porta podem ser outros; o importante é usar a URL inteira.)

### Configurar na API

No **serviço da API** (não no do banco):

1. **Variables** → adicione ou edite:
   - **Nome:** `ConnectionStrings__DefaultConnection`
   - **Valor:** cole o valor completo de **`DATABASE_URL`** (a URL acima).
2. **Nome:** `DatabaseProvider`  
   **Valor:** `Npgsql`

Se o Railway permitir **referência** à variável do outro serviço, você pode apontar `ConnectionStrings__DefaultConnection` para a `DATABASE_URL` do PostgreSQL em vez de colar o valor.

Depois disso, faça um **Redeploy** do serviço da API. Na primeira subida, o `Migrate()` vai criar todas as tabelas no banco em `shuttle.proxy.rlwy.net:33548`.

---

## Rodar migrations manualmente (opcional)

Só é necessário se você quiser aplicar migrations a partir do seu PC (por exemplo, em outro ambiente).

1. No seu PC, defina a connection string do banco do Railway (use a mesma `DATABASE_URL` do Railway, no formato que o Npgsql aceita).
2. Na raiz do repositório:

```bash
cd C:\Users\Caio\nexus-med

# Usando a URL do Railway (substitua pela sua DATABASE_URL completa)
set ConnectionStrings__DefaultConnection=postgresql://postgres:SUA_SENHA@shuttle.proxy.rlwy.net:33548/railway
set DatabaseProvider=Npgsql

dotnet ef database update --project src/NexusMed.Infrastructure --startup-project src/NexusMed.WebApi
```

No PowerShell:

```powershell
$env:ConnectionStrings__DefaultConnection = "postgresql://postgres:SUA_SENHA@shuttle.proxy.rlwy.net:33548/railway"
$env:DatabaseProvider = "Npgsql"
dotnet ef database update --project src/NexusMed.Infrastructure --startup-project src/NexusMed.WebApi
```

Substitua `SUA_SENHA` pela senha real que está na `DATABASE_URL` do Railway.

---

## Resumo

| Onde              | O que fazer |
|-------------------|-------------|
| **Railway (API)** | Garantir `ConnectionStrings__DefaultConnection` = `DATABASE_URL` completa do PostgreSQL e `DatabaseProvider` = `Npgsql`. Migrations rodam sozinhas na subida. |
| **Seu PC**        | Opcional: usar `dotnet ef database update` com a mesma connection string para aplicar/atualizar o banco manualmente. |

O banco em `shuttle.proxy.rlwy.net:33548` passa a ser usado com a URL completa; as migrations são executadas na inicialização da API.
