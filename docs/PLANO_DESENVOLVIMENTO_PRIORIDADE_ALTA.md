# Plano de desenvolvimento – Prioridade alta

Funcionalidades: **Agendamento**, **Prontuário/Evolução** e **Notificações**.

---

## Visão geral e ordem de execução

| Fase | Funcionalidade      | Motivo da ordem |
|------|---------------------|-----------------|
| 1    | Agendamento         | Base do fluxo; prontuário e notificações dependem de “consulta” |
| 2    | Prontuário / Evolução | Registro do atendimento; notificações podem disparar a partir da consulta |
| 3    | Notificações        | Consome eventos de agendamento e prontuário; pode ser in-app primeiro |

**Estimativa total (ordem de grandeza):** 4–6 sprints de 2 semanas (dependendo do time).

---

# Fase 1 – Agendamento

## 1.1 Objetivo

- Profissional define **horários disponíveis** (slots).
- Paciente **agenda consultas** nesses horários.
- Ambos **listam e gerenciam** (ver, cancelar, remarcar) agendamentos.

## 1.2 Modelo de dados (Domain)

### Novas entidades

**`AvailabilitySlot`** (janela de disponibilidade do profissional)

| Campo            | Tipo     | Descrição |
|------------------|----------|-----------|
| Id               | Guid     | PK |
| ProfessionalId   | Guid     | FK → ProfessionalProfile.Id |
| StartAt          | DateTime | Início do slot (data/hora) |
| EndAt            | DateTime | Fim do slot |
| SlotType         | string   | Ex: "Presencial", "Telemedicina" |
| IsBooked         | bool     | Se já foi agendado (ou derivar de Appointment) |
| CreatedAt        | DateTime | |

**`Appointment`** (consulta agendada)

| Campo            | Tipo     | Descrição |
|------------------|----------|-----------|
| Id               | Guid     | PK |
| PatientId        | Guid     | FK → PatientProfile.Id |
| ProfessionalId   | Guid     | FK → ProfessionalProfile.Id |
| SlotId           | Guid?    | FK → AvailabilitySlot.Id (opcional se no futuro houver “slot virtual”) |
| ScheduledAt      | DateTime | Data/hora da consulta |
| DurationMinutes  | int      | Ex: 30 |
| Status           | string   | "Scheduled", "Completed", "Cancelled", "NoShow" |
| AppointmentType  | string   | "Presencial", "Telemedicina" |
| Notes            | string?  | Observação do agendamento |
| CreatedAt        | DateTime | |
| UpdatedAt        | DateTime? | |
| CancelledAt      | DateTime? | |
| CancellationReason | string? | |

### Regras de negócio (resumo)

- Só **Professional** cria/edita AvailabilitySlot.
- Só **Patient** pode agendar (criar Appointment) em slot do profissional.
- Um slot só pode ter no máximo um Appointment com status não cancelado.
- Cancelamento: manter Appointment com Status = Cancelled (auditoria).
- Listagens: paciente vê “minhas consultas”; profissional vê “minha agenda” e “consultas com meus pacientes”.

## 1.3 Backend (Nexus Med)

### 1.3.1 Domain

- `NexusMed.Domain/Entities/AvailabilitySlot.cs`
- `NexusMed.Domain/Entities/Appointment.cs`
- `NexusMed.Domain/Ports/IAvailabilitySlotRepository.cs`
- `NexusMed.Domain/Ports/IAppointmentRepository.cs`

### 1.3.2 Application (use cases)

**Slots (profissional)**

- `CreateAvailabilitySlotsUseCase` – criar um ou vários slots (ex.: blocos semanais).
- `GetMyAvailabilitySlotsUseCase` – listar slots do profissional (filtro por período).
- `DeleteAvailabilitySlotUseCase` – remover slot (só se não houver appointment ativo).

**Appointments**

- `CreateAppointmentUseCase` – paciente agenda (patientId do token, professionalId + slotId ou ScheduledAt + duration).
- `GetMyAppointmentsUseCase` – lista para paciente ou profissional (filtro por role, período, status).
- `CancelAppointmentUseCase` – paciente ou profissional cancela (status + CancelledAt + motivo opcional).
- `GetAvailableSlotsUseCase` – lista slots disponíveis de um profissional em um período (para o paciente escolher).

### 1.3.3 Infrastructure

- `AvailabilitySlotRepository.cs`, `AppointmentRepository.cs`
- `AppDbContext`: `DbSet<AvailabilitySlot>`, `DbSet<Appointment>` + configuração EF (FKs, índices).
- Migration: `Add_Appointments_And_AvailabilitySlots`.

### 1.3.4 WebApi (controllers)

- **`AvailabilitySlotsController`** (autorizado, role Professional)
  - `POST /api/availability-slots` – criar slots (body: lista ou período + recorrência simples).
  - `GET /api/availability-slots?from=...&to=...` – meus slots.
  - `DELETE /api/availability-slots/{id}` – excluir slot.

- **`AppointmentsController`** (autorizado)
  - `GET /api/appointments?from=...&to=...&status=...` – minhas consultas (paciente ou profissional).
  - `GET /api/appointments/available-slots?professionalId=...&from=...&to=...` – slots disponíveis do profissional (paciente).
  - `POST /api/appointments` – agendar (paciente).
  - `PATCH /api/appointments/{id}/cancel` ou `POST /api/appointments/{id}/cancel` – cancelar (body opcional: reason).

### 1.4 Frontend

- **Profissional**
  - Página “Minha agenda” ou “Disponibilidade”: listar slots, formulário para criar blocos (ex.: dia + hora início/fim, tipo).
  - Lista de “Próximas consultas” (cards com paciente, data/hora, status).

- **Paciente**
  - Página “Agendar consulta”: escolher profissional (pode reutilizar lista de profissionais), depois período → chamada `available-slots` → escolher slot → POST appointment.
  - Página “Minhas consultas”: listar agendamentos (próximas, passadas, canceladas) com opção de cancelar/remarcar.

### 1.5 Critérios de conclusão (Fase 1)

- [ ] Profissional consegue criar e listar slots.
- [ ] Paciente vê slots disponíveis de um profissional e agenda.
- [ ] Paciente e profissional listam consultas e podem cancelar com motivo opcional.
- [ ] Testes unitários/integração para use cases e endpoints críticos.

---

# Fase 2 – Prontuário / Evolução

## 2.1 Objetivo

- Profissional registra **evolução** (nota de atendimento) vinculada a um **atendimento/consulta** (Appointment) ou, em versão mínima, ao paciente.
- Histórico de evoluções do paciente acessível ao profissional que atende.

## 2.2 Modelo de dados (Domain)

### Nova entidade

**`ClinicalNote`** (evolução / nota de prontuário)

| Campo            | Tipo     | Descrição |
|------------------|----------|-----------|
| Id               | Guid     | PK |
| AppointmentId    | Guid?    | FK → Appointment.Id (opcional na v1; permite evolução “solta”) |
| PatientId        | Guid     | FK → PatientProfile.Id |
| ProfessionalId   | Guid     | FK → ProfessionalProfile.Id (quem escreveu) |
| Content          | string   | Texto livre (evolução) |
| NoteType         | string   | Ex: "Evolution", "Anamnesis", "Conduct" |
| CreatedAt        | DateTime | |
| UpdatedAt        | DateTime? | |

Regra: apenas o profissional que criou (ou a mesma organização, se no futuro houver) pode editar/excluir. Leitura: profissional que atende o paciente (ex.: tem appointment ou é o autor da nota).

## 2.3 Backend (Nexus Med)

### 2.3.1 Domain

- `NexusMed.Domain/Entities/ClinicalNote.cs`
- `NexusMed.Domain/Ports/IClinicalNoteRepository.cs`

### 2.3.2 Application (use cases)

- `CreateClinicalNoteUseCase` – criar evolução (PatientId, AppointmentId opcional, Content, NoteType).
- `UpdateClinicalNoteUseCase` – editar (apenas autor).
- `GetClinicalNotesByPatientUseCase` – listar notas do paciente (para profissional que atende).
- `GetClinicalNoteByIdUseCase` – obter uma nota (autorização por paciente/role).

### 2.3.3 Infrastructure

- `ClinicalNoteRepository.cs`
- `AppDbContext`: `DbSet<ClinicalNote>` + FK para Appointment, Patient, Professional.
- Migration: `Add_ClinicalNotes`.

### 2.3.4 WebApi (controllers)

- **`ClinicalNotesController`** (autorizado, role Professional para criar/editar)
  - `POST /api/clinical-notes` – criar (body: patientId, appointmentId?, content, noteType).
  - `PUT /api/clinical-notes/{id}` – atualizar (body: content).
  - `GET /api/clinical-notes?patientId=...` – listar por paciente.
  - `GET /api/clinical-notes/{id}` – obter uma nota.

### 2.4 Frontend

- Na **lista de pacientes** ou na **consulta agendada**: botão “Evolução” / “Prontuário”.
- Página ou drawer **“Evolução / Prontuário”**: lista de ClinicalNotes do paciente (data, tipo, trecho); botão “Nova evolução”; formulário (texto, tipo).
- Ao abrir um **Appointment** (próxima consulta), permitir abrir/registrar evolução ligada àquele AppointmentId.

### 2.5 Critérios de conclusão (Fase 2)

- [ ] Profissional cria e edita evolução vinculada a paciente (e opcionalmente a appointment).
- [ ] Profissional visualiza histórico de evoluções do paciente.
- [ ] Permissões: só autor edita; só profissionais com vínculo ao paciente (ex.: têm consulta) veem notas.
- [ ] Testes para use cases e endpoints.

---

# Fase 3 – Notificações

## 3.1 Objetivo

- **Notificações in-app** (lista no app) para eventos como: consulta agendada, lembrete de consulta, consulta cancelada, nova mensagem (já pode existir fluxo; unificar modelo).
- Opcional depois: e-mail e push (FCM/APNs).

## 3.2 Modelo de dados (Domain)

### Nova entidade

**`Notification`**

| Campo            | Tipo     | Descrição |
|------------------|----------|-----------|
| Id               | Guid     | PK |
| UserId           | Guid     | FK → User.Id (destinatário) |
| Title            | string   | Título curto |
| Body             | string?  | Corpo ou resumo |
| Type             | string   | "AppointmentScheduled", "AppointmentReminder", "AppointmentCancelled", "NewMessage", "ClinicalNoteAdded", etc. |
| RelatedEntityId  | string?  | Ex: Appointment.Id, Message.Id (para link no app) |
| RelatedEntityType | string? | "Appointment", "Message", "Conversation" |
| IsRead           | bool     | Default false |
| ReadAt           | DateTime? | |
| CreatedAt        | DateTime | |

Índices: `UserId`, `(UserId, IsRead, CreatedAt)` para listagem eficiente.

## 3.3 Backend (Nexus Med)

### 3.3.1 Domain

- `NexusMed.Domain/Entities/Notification.cs`
- `NexusMed.Domain/Ports/INotificationRepository.cs`

### 3.3.2 Application (use cases)

- `CreateNotificationUseCase` – criar uma notificação (interno; chamado por outros use cases ou handlers).
- `GetMyNotificationsUseCase` – listar do usuário (paginado, filtro por IsRead).
- `MarkNotificationAsReadUseCase` – marcar como lida (e ReadAt).
- `MarkAllNotificationsAsReadUseCase` – marcar todas como lidas.

**Integrações (disparo):**

- No `CreateAppointmentUseCase`: após criar Appointment, chamar CreateNotificationUseCase para o paciente (e opcionalmente para o profissional).
- No `CancelAppointmentUseCase`: notificar paciente (e profissional).
- Em “lembrete”: job em background (ex.: Hangfire, Quartz ou timer) que busca appointments em 24h e cria Notification “AppointmentReminder” para o paciente.
- Se desejar notificar “nova mensagem”: ao enviar mensagem, criar notificação para o outro participante da conversa.

### 3.3.3 Infrastructure

- `NotificationRepository.cs`
- `AppDbContext`: `DbSet<Notification>` + índice composto.
- Migration: `Add_Notifications`.

### 3.3.4 WebApi (controllers)

- **`NotificationsController`** (autorizado)
  - `GET /api/notifications?unreadOnly=false&skip=0&take=20` – minhas notificações.
  - `PATCH /api/notifications/{id}/read` ou `POST /api/notifications/{id}/read` – marcar como lida.
  - `POST /api/notifications/mark-all-read` – marcar todas como lidas.
  - Opcional: `GET /api/notifications/unread-count` – contador para badge.

### 3.4 Frontend

- **Ícone de sino** no header/shell: badge com contagem de não lidas; dropdown ou página com lista de notificações (título, data, link para Appointment/Message).
- **Página “Notificações”**: lista completa, “Marcar todas como lidas”.
- Ao clicar em uma notificação: marcar como lida e navegar para a tela correspondente (ex.: `/appointments`, `/messages/:id`).

### 3.5 Critérios de conclusão (Fase 3)

- [ ] Notificações criadas ao agendar e ao cancelar consulta.
- [ ] Listagem in-app e marcação como lida (uma e “todas”).
- [ ] Lembrete de consulta (job) implementado e criando notificação.
- [ ] (Opcional) Contador de não lidas no header.
- [ ] Testes para use cases e endpoints de notificação.

---

# Resumo de artefatos por fase

| Fase | Domain (entities + ports) | Application (use cases) | Infrastructure (repos + DbContext + migration) | WebApi (controllers) | Frontend (páginas/componentes) |
|------|---------------------------|--------------------------|--------------------------------------------------|------------------------|----------------------------------|
| 1 – Agendamento | AvailabilitySlot, Appointment; IAvailabilitySlotRepository, IAppointmentRepository | 6 use cases (slots + appointments) | 2 repos, DbSets, 1 migration | AvailabilitySlotsController, AppointmentsController | Agenda profissional; Agendar consulta (paciente); Minhas consultas (ambos) |
| 2 – Prontuário | ClinicalNote; IClinicalNoteRepository | 4 use cases | 1 repo, DbSet, 1 migration | ClinicalNotesController | Prontuário/Evolução por paciente (profissional) |
| 3 – Notificações | Notification; INotificationRepository | 4 use cases + disparos em Create/Cancel appointment (+ job lembrete) | 1 repo, DbSet, 1 migration | NotificationsController | Sino + lista; página Notificações; links para Appointment/Message |

---

# Dependências técnicas sugeridas

- **Agendamento:** sem novas dependências; apenas EF Core e padrão atual do Nexus Med.
- **Prontuário:** depende de Appointment (Fase 1) para vincular evolução à consulta; pode começar só com PatientId + ProfessionalId.
- **Notificações:** in-app não exige pacotes extras; para **lembrete** pode-se usar `BackgroundService` (timer) ou, em produção, Hangfire/Quartz. E-mail e push ficam para uma fase seguinte (SendGrid/SES + FCM/APNs).

---

# Checklist geral de entrega

- [ ] Fase 1: Agendamento end-to-end (slots + appointments + cancelamento).
- [ ] Fase 2: Prontuário/Evolução (criar, editar, listar por paciente).
- [ ] Fase 3: Notificações in-app (criação em eventos de appointment + lembrete + lista e marcar como lida).
- [ ] Documentação de API atualizada (ex.: `docs/API_ENDPOINTS.md`).
- [ ] Migrations aplicadas e testadas (SQLite dev, PostgreSQL/SQL Server conforme ambiente).
- [ ] Testes automatizados para regras críticas (agendamento, permissões de prontuário, criação de notificação).

Este plano pode ser quebrado em issues/tarefas no repositório (ex.: um issue por use case ou por controller) e estimado por sprint conforme a capacidade do time.
