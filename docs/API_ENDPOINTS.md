# Nexus Med — API Endpoints

Base URL (dev): `http://localhost:5053/api`  
O frontend usa proxy: `/api` → `http://localhost:5053/api`.

Autenticação: Bearer JWT no header `Authorization` (exceto onde indicado *Público*).

---

## Auth (`/api/auth`)

| Método | Rota | Auth | Descrição | Body | Resposta |
|--------|------|------|-----------|------|----------|
| POST | `/auth/register/patient` | *Público* | Cadastro de paciente | `email`, `password`, `fullName`, `dateOfBirth?`, `phone?`, `documentNumber?` | 200 + `accessToken`, `refreshToken`, `userId`, `email`, `role` |
| POST | `/auth/register/professional` | *Público* | Cadastro de profissional | `email`, `password`, `fullName`, `crm?`, `specialty?`, `phone?` | 200 idem |
| POST | `/auth/login` | *Público* | Login | `email`, `password` | 200 idem / 401 |
| POST | `/auth/refresh` | *Público* | Renovar token | `refreshToken` | 200 idem / 401 |

---

## Profile (`/api/profile`)

| Método | Rota | Auth | Descrição | Body | Resposta |
|--------|------|------|-----------|------|----------|
| GET | `/profile` | JWT | Perfil do usuário logado | — | 200 + `role`, `email`, `fullName`, `dateOfBirth?`, `phone?`, `documentNumber?`, `crm?`, `specialty?` / 404 se usuário inexistente |
| PUT | `/profile` | JWT | Atualizar perfil (cria se não existir) | `fullName?`, `dateOfBirth?`, `phone?`, `documentNumber?`, `crm?`, `specialty?` | 204 |

---

## Prescriptions (`/api/prescriptions`)

| Método | Rota | Auth | Descrição | Body / Query | Resposta |
|--------|------|------|-----------|---------------|----------|
| GET | `/prescriptions` | JWT | Listar prescrições (do paciente ou do profissional) | — | 200 + array |
| POST | `/prescriptions` | JWT (Professional) | Criar prescrição | `patientId`, `description?`, `filePath?` | 201 + `id` |

---

## Exams (`/api/exams`)

| Método | Rota | Auth | Descrição | Body / Query | Resposta |
|--------|------|------|-----------|---------------|----------|
| GET | `/exams` | JWT | Listar exames | `patientId?` | 200 + array |
| POST | `/exams` | JWT | Criar exame | `patientId`, `name?`, `filePath?`, `examDate?`, `requestedByProfessionalId?` | 201 + `id` |

---

## HealthMetrics (`/api/health-metrics`)

| Método | Rota | Auth | Descrição | Body / Query | Resposta |
|--------|------|------|-----------|---------------|----------|
| GET | `/health-metrics/units` | JWT | Lista de unidades para dropdown | — | 200 + `[{ value, label }]` |
| GET | `/health-metrics` | JWT | Listar métricas | `patientId?`, `from?`, `to?` | 200 + array |
| POST | `/health-metrics` | JWT (Patient) | Registrar métrica | `metricType`, `value?`, `unit?`, `notes?`, `recordedAt` | 201 + `id` |

---

## Messages (`/api/messages`)

| Método | Rota | Auth | Descrição | Body / Params | Resposta |
|--------|------|------|-----------|---------------|----------|
| GET | `/messages/conversations` | JWT | Listar conversas | — | 200 + array |
| POST | `/messages/conversations` | JWT | Obter ou criar conversa (paciente → profissional) | `professionalId` (ID do **perfil** do profissional) | 200 + `id`, `patientId`, `professionalId`, `createdAt` |
| GET | `/messages/conversations/{conversationId}/messages` | JWT | Mensagens da conversa | Query: `skip?`, `take?` | 200 + array |
| POST | `/messages/send` | JWT | Enviar mensagem | `conversationId`, `content` | 200 + `id` |

---

## Professionals (`/api/professionals`)

| Método | Rota | Auth | Descrição | Query | Resposta |
|--------|------|------|-----------|------|----------|
| GET | `/professionals` | JWT | Listar profissionais | `skip?`, `take?` | 200 + array `id`, `userId`, `fullName`, `crm`, `specialty`, `phone`, `averageRating` |

---

## Ratings (`/api/ratings`)

| Método | Rota | Auth | Descrição | Body / Params | Resposta |
|--------|------|------|-----------|---------------|----------|
| POST | `/ratings` | JWT | Criar avaliação | `ratedUserId`, `context?`, `score`, `comment?` | 200 + `id` / 400 |
| GET | `/ratings/professional/{professionalUserId}` | *Público* | Avaliações do profissional (por **userId**) | Query: `recentCount?` | 200 / 404 |

---

## LGPD (`/api/lgpd`)

| Método | Rota | Auth | Descrição | Body | Resposta |
|--------|------|------|-----------|------|----------|
| POST | `/lgpd/consent` | JWT | Registrar consentimento | `purpose`, `accepted` | 204 |
| GET | `/lgpd/export-my-data` | JWT | Exportar dados do usuário | — | 200 + JSON |
| DELETE | `/lgpd/my-account` | JWT | Excluir conta e dados | — | 204 |

---

## Resumo por prefixo

- **auth** — login, registro, refresh (todos públicos).
- **profile** — GET/PUT do perfil do usuário logado.
- **prescriptions** — listar e criar (criar só Professional).
- **exams** — listar e criar.
- **health-metrics** — units (GET), listar, criar (criar só Patient).
- **messages** — conversations (GET/POST), messages (GET), send (POST).
- **professionals** — GET lista.
- **ratings** — POST criar, GET professional/:userId (público).
- **lgpd** — consent (POST), export-my-data (GET), my-account (DELETE).

As rotas são **case-insensitive** (ex.: `/api/profile` e `/api/Profile` funcionam). O frontend usa sempre minúsculas (ex.: `/api/profile`, `/api/health-metrics`). O ASP.NET Core aceita ambos; o proxy e o `ApiService` usam `/api/...` em minúsculas.
