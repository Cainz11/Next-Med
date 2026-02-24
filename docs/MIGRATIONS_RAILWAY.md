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

1. **Variables** → adicione ou edite **uma** das opções:
   - **Opção A:** `ConnectionStrings__DefaultConnection` = valor completo da **DATABASE_URL** (URL `postgresql://...`).
   - **Opção B:** `DATABASE_URL` = valor completo (ou referência à variável do serviço PostgreSQL). A API lê `DATABASE_URL` automaticamente se `DefaultConnection` não estiver definida.
2. **Opcional:** `DatabaseProvider` = `Npgsql` (a API detecta PostgreSQL pela URL `postgresql://` e usa Npgsql; definir só evita ambiguidade).

**Importante:** Se a API não receber nenhuma connection string, ela usa **SQLite** com arquivo local. No Railway o sistema de arquivos é efêmero: a cada deploy o “banco” é recriado vazio e os dados são perdidos. Por isso é essencial configurar **DATABASE_URL** ou **ConnectionStrings__DefaultConnection** com a URL do PostgreSQL.

Depois disso, faça um **Redeploy** do serviço da API. Na primeira subida, o `Migrate()` vai criar todas as tabelas no banco em `shuttle.proxy.rlwy.net:33548`.

---

## Rodar migrations manualmente (opcional)

Só é necessário se você quiser aplicar migrations a partir do seu PC (por exemplo, em outro ambiente).

**Importante:** use o formato **chave=valor** do Npgsql (não a URL `postgresql://`), senão pode aparecer o erro *"Format of the initialization string does not conform to specification starting at index 0"* (o `dotnet ef` às vezes usa a connection string do `appsettings.json` se a variável não for lida).

1. Na raiz do repositório, defina as variáveis e rode o comando **na mesma sessão** (ou numa única linha).

**PowerShell (recomendado – formato chave=valor):**

```powershell
cd C:\Users\Caio\nexus-med

# Substitua HOST, PORTA, SENHA pelo valor da sua DATABASE_URL do Railway
$env:ConnectionStrings__DefaultConnection = "Host=shuttle.proxy.rlwy.net;Port=33548;Database=railway;Username=postgres;Password=SUA_SENHA"
$env:DatabaseProvider = "Npgsql"
dotnet ef database update --project src/NexusMed.Infrastructure --startup-project src/NexusMed.WebApi
```

Ou numa única linha (para garantir que as variáveis sejam usadas):

```powershell
cd C:\Users\Caio\nexus-med; $env:ConnectionStrings__DefaultConnection = "Host=shuttle.proxy.rlwy.net;Port=33548;Database=railway;Username=postgres;Password=SUA_SENHA"; $env:DatabaseProvider = "Npgsql"; dotnet ef database update --project src/NexusMed.Infrastructure --startup-project src/NexusMed.WebApi
```

**Cmd:**

```cmd
set ConnectionStrings__DefaultConnection=Host=shuttle.proxy.rlwy.net;Port=33548;Database=railway;Username=postgres;Password=SUA_SENHA
set DatabaseProvider=Npgsql
dotnet ef database update --project src/NexusMed.Infrastructure --startup-project src/NexusMed.WebApi
```

Substitua `SUA_SENHA` (e, se for o caso, host/porta/database) pelos valores da **DATABASE_URL** do Railway.

---

## Resumo

| Onde              | O que fazer |
|-------------------|-------------|
| **Railway (API)** | Garantir `ConnectionStrings__DefaultConnection` = `DATABASE_URL` completa do PostgreSQL e `DatabaseProvider` = `Npgsql`. Migrations rodam sozinhas na subida. |
| **Seu PC**        | Opcional: usar `dotnet ef database update` com a mesma connection string para aplicar/atualizar o banco manualmente. |

O banco em `shuttle.proxy.rlwy.net:33548` passa a ser usado com a URL completa; as migrations são executadas na inicialização da API.
