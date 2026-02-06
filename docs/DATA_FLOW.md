# 🔄 Fluxo de Dados - Nexus Med

> Documentação detalhada sobre como os dados fluem através da aplicação

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura de Estado](#arquitetura-de-estado)
- [Fluxos de Autenticação](#fluxos-de-autenticação)
- [Fluxos de Negócio](#fluxos-de-negócio)
- [Comunicação API](#comunicação-api)
- [Gerenciamento de Erros](#gerenciamento-de-erros)
- [Cache e Performance](#cache-e-performance)

---

## 🎯 Visão Geral

O Nexus Med utiliza uma arquitetura de fluxo de dados unidirecional, com separação clara entre:

- **Estado Global**: Gerenciado via React Context (Auth)
- **Estado Local**: Gerenciado via useState em componentes
- **Estado do Servidor**: Dados da API consumidos sob demanda

```
┌─────────────────────────────────────────────────────────────┐
│                    Fluxo de Dados                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Usuário Interage                                            │
│       │                                                      │
│       ▼                                                      │
│  Componente React                                            │
│       │                                                      │
│       ├─> Estado Local (useState)                            │
│       │                                                      │
│       ├─> Context API (Auth)                                 │
│       │                                                      │
│       └─> API Call                                           │
│            │                                                 │
│            ▼                                                 │
│       Backend (.NET)                                         │
│            │                                                 │
│            ▼                                                 │
│       Banco de Dados                                         │
│            │                                                 │
│            ▼                                                 │
│       Resposta JSON                                          │
│            │                                                 │
│            ▼                                                 │
│       Atualiza Estado                                        │
│            │                                                 │
│            ▼                                                 │
│       Re-render Componente                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura de Estado

### Estado Global (AuthContext)

```tsx
// frontend/src/core/AuthContext.tsx
interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  email: string | null;
  role: 'Patient' | 'Professional' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

**Responsabilidades**:
- ✅ Armazenar token de acesso
- ✅ Armazenar informações do usuário (email, role)
- ✅ Prover métodos de login/logout
- ✅ Auto-renovação de tokens (refresh)
- ✅ Persistência em localStorage

**Componentes que Consomem**:
- Todos os componentes protegidos (via `useAuth()`)
- ProtectedRoute (verificação de autenticação)
- Header (exibição de usuário/logout)

### Estado Local

Cada página gerencia seu próprio estado para dados específicos:

```tsx
// Exemplo: PrescriptionsPage
const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Padrão de Carregamento**:
```tsx
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.get('/prescriptions');
      setPrescriptions(data);
    } catch (err) {
      setError('Erro ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

---

## 🔐 Fluxos de Autenticação

### 1. Registro de Usuário

```
┌──────────┐                                               
│  User    │                                               
└────┬─────┘                                               
     │ 1. Preenche formulário (email, senha, nome, role)  
     ▼                                                     
┌──────────────┐                                          
│ RegisterPage │                                          
└──────┬───────┘                                          
       │ 2. handleSubmit()                                
       ▼                                                  
┌────────────────┐                                        
│ POST /api/auth │                                        
│   /register    │                                        
└───────┬────────┘                                        
        │ 3. Cria usuário                                 
        ▼                                                 
┌────────────────┐                                        
│   Database     │                                        
│  Users table   │                                        
└───────┬────────┘                                        
        │ 4. Retorna { id, email, role }                  
        ▼                                                 
┌──────────────┐                                          
│ RegisterPage │                                          
└──────┬───────┘                                          
       │ 5. Redireciona para /login                       
       ▼                                                  
┌──────────┐                                              
│LoginPage │                                              
└──────────┘                                              
```

**Código**:
```tsx
// frontend/src/pages/RegisterPage.tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(null);
  
  try {
    await api.post('/auth/register', {
      email, password, name, role
    });
    
    // Sucesso: redireciona para login
    navigate('/login');
  } catch (err) {
    setError('Erro ao criar conta');
  }
};
```

### 2. Login de Usuário

```
┌──────────┐                                               
│  User    │                                               
└────┬─────┘                                               
     │ 1. Email + Senha                                    
     ▼                                                     
┌──────────────┐                                          
│  LoginPage   │                                          
└──────┬───────┘                                          
       │ 2. login(email, password)                        
       ▼                                                  
┌────────────────┐                                        
│  AuthContext   │                                        
└───────┬────────┘                                        
        │ 3. POST /api/auth/login                         
        ▼                                                 
┌────────────────┐                                        
│   Backend      │                                        
│  - Valida hash │                                        
│  - Gera JWT    │                                        
└───────┬────────┘                                        
        │ 4. Retorna tokens                               
        │    { accessToken, refreshToken }                
        ▼                                                 
┌────────────────┐                                        
│  AuthContext   │                                        
│  - Salva tokens│                                        
│  - Decodifica  │                                        
│  - Extrai user │                                        
└───────┬────────┘                                        
        │ 5. setIsAuthenticated(true)                     
        ▼                                                 
┌──────────────┐                                          
│  Navigate    │                                          
│ /dashboard   │                                          
└──────────────┘                                          
```

**Código**:
```tsx
// frontend/src/core/AuthContext.tsx
const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  
  const { accessToken, refreshToken } = response.data;
  
  // Salva tokens
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  
  // Decodifica token para extrair dados do usuário
  const decoded = JSON.parse(atob(accessToken.split('.')[1]));
  
  setAccessToken(accessToken);
  setEmail(decoded.email);
  setRole(decoded.role);
  setIsAuthenticated(true);
};
```

### 3. Renovação de Token (Refresh)

```
┌────────────────┐                                        
│  API Request   │                                        
└───────┬────────┘                                        
        │ 1. Inclui accessToken                           
        ▼                                                 
┌────────────────┐                                        
│   Backend      │                                        
│  JWT Middleware│                                        
└───────┬────────┘                                        
        │                                                 
        ├─ Token válido? ──> Processa request            
        │                                                 
        └─ Token expirado?                                
                │                                         
                ▼                                         
        ┌────────────────┐                                
        │ Retorna 401    │                                
        └───────┬────────┘                                
                │ 2. Interceptor detecta 401              
                ▼                                         
        ┌────────────────┐                                
        │  AuthContext   │                                
        │  refreshToken()│                                
        └───────┬────────┘                                
                │ 3. POST /api/auth/refresh               
                │    { refreshToken }                     
                ▼                                         
        ┌────────────────┐                                
        │   Backend      │                                
        │ - Valida RT    │                                
        │ - Gera novo AT │                                
        └───────┬────────┘                                
                │ 4. Retorna novo accessToken             
                ▼                                         
        ┌────────────────┐                                
        │  AuthContext   │                                
        │ - Salva novo AT│                                
        │ - Retry request│                                
        └────────────────┘                                
```

---

## 💼 Fluxos de Negócio

### 1. Listar Receitas (Patient)

```
┌──────────────────┐                                      
│ PrescriptionsPage│                                      
└────────┬─────────┘                                      
         │ useEffect()                                    
         ▼                                                
┌──────────────────┐                                      
│ GET /api/        │                                      
│ prescriptions    │                                      
│ Authorization:   │                                      
│ Bearer <token>   │                                      
└────────┬─────────┘                                      
         │ Backend extrai userId do token                
         ▼                                                
┌──────────────────┐                                      
│  Repository      │                                      
│  .Where(p =>     │                                      
│   p.PatientId    │                                      
│   == userId)     │                                      
└────────┬─────────┘                                      
         │ SELECT * FROM Prescriptions                    
         │ WHERE PatientId = @userId                      
         ▼                                                
┌──────────────────┐                                      
│   Database       │                                      
└────────┬─────────┘                                      
         │ Retorna lista de receitas                      
         ▼                                                
┌──────────────────┐                                      
│     DTO          │                                      
│ [{ id, medication│                                      
│   dosage, ...}]  │                                      
└────────┬─────────┘                                      
         │ 200 OK                                         
         ▼                                                
┌──────────────────┐                                      
│ PrescriptionsPage│                                      
│ setPrescriptions │                                      
│ setLoading(false)│                                      
└────────┬─────────┘                                      
         │ Re-render                                      
         ▼                                                
┌──────────────────┐                                      
│  UI atualizada   │                                      
│  Lista exibida   │                                      
└──────────────────┘                                      
```

**Código Frontend**:
```tsx
useEffect(() => {
  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setPrescriptions(response.data);
    } catch (err) {
      setError('Erro ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };
  
  fetchPrescriptions();
}, [accessToken]);
```

**Código Backend**:
```csharp
[HttpGet]
[Authorize]
public async Task<IActionResult> GetPrescriptions()
{
    // Extrai userId do token JWT
    var userId = int.Parse(User.FindFirst("userId")?.Value!);
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    
    // Paciente vê apenas suas receitas
    if (role == "Patient")
    {
        var prescriptions = await _repository
            .GetAllAsync(p => p.PatientId == userId);
        return Ok(prescriptions);
    }
    
    // Profissional vê receitas que emitiu
    else if (role == "Professional")
    {
        var prescriptions = await _repository
            .GetAllAsync(p => p.ProfessionalId == userId);
        return Ok(prescriptions);
    }
    
    return Forbid();
}
```

### 2. Criar Receita (Professional)

```
┌──────────────────┐                                      
│ PrescriptionsPage│                                      
│  (Professional)  │                                      
└────────┬─────────┘                                      
         │ 1. Preenche formulário                         
         │    (patientId, medication, dosage)             
         ▼                                                
┌──────────────────┐                                      
│ handleCreate()   │                                      
└────────┬─────────┘                                      
         │ 2. POST /api/prescriptions                     
         │    { patientId, medication, dosage }           
         ▼                                                
┌──────────────────┐                                      
│   Backend        │                                      
│ [Authorize]      │                                      
│ role=Professional│                                      
└────────┬─────────┘                                      
         │ 3. Valida dados                                
         │ 4. Cria entidade                               
         ▼                                                
┌──────────────────┐                                      
│ new Prescription │                                      
│ {                │                                      
│  ProfessionalId, │                                      
│  PatientId,      │                                      
│  Medication,     │                                      
│  Dosage,         │                                      
│  IssuedAt        │                                      
│ }                │                                      
└────────┬─────────┘                                      
         │ 5. INSERT INTO Prescriptions                   
         ▼                                                
┌──────────────────┐                                      
│   Database       │                                      
└────────┬─────────┘                                      
         │ 6. Retorna 201 Created                         
         │    { id, ... }                                 
         ▼                                                
┌──────────────────┐                                      
│ PrescriptionsPage│                                      
│ - Adiciona à     │                                      
│   lista local    │                                      
│ - Mostra toast   │                                      
│   sucesso        │                                      
└──────────────────┘                                      
```

### 3. Enviar Mensagem

```
┌──────────────────────┐                                  
│ ConversationDetailPage│                                 
└────────┬──────────────┘                                 
         │ 1. Digite mensagem + Enter                     
         ▼                                                
┌──────────────────────┐                                  
│ handleSendMessage()  │                                  
└────────┬──────────────┘                                 
         │ 2. POST /api/messages                          
         │    {                                           
         │      conversationId,                           
         │      content                                   
         │    }                                           
         ▼                                                
┌──────────────────────┐                                  
│   Backend            │                                  
│ - Valida conversa    │                                  
│ - Verifica permissão │                                  
│   (user participa?)  │                                  
└────────┬──────────────┘                                 
         │ 3. INSERT INTO Messages                        
         │    (ConversationId, SenderId, Content, ...)    
         ▼                                                
┌──────────────────────┐                                  
│   Database           │                                  
└────────┬──────────────┘                                 
         │ 4. Retorna mensagem criada                     
         │    { id, content, sentAt, ... }                
         ▼                                                
┌──────────────────────┐                                  
│ ConversationDetailPage│                                 
│ - Adiciona à lista   │                                  
│   local de mensagens │                                  
│ - Limpa input        │                                  
│ - Scroll to bottom   │                                  
└──────────────────────┘                                  
```

---

## 📡 Comunicação API

### Cliente HTTP Base

```typescript
// frontend/src/core/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Proxy Vite redireciona para localhost:5053
  timeout: 10000,
});

// Interceptor: adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: trata erros 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se 401 e não é retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenta renovar token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        });
        
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        
        // Retry request com novo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou: desloga
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Padrões de Request

#### GET (Listar)
```typescript
const response = await api.get('/prescriptions');
const prescriptions = response.data;  // Array
```

#### GET (Detalhe)
```typescript
const response = await api.get(`/messages/${conversationId}`);
const messages = response.data;  // Array ou objeto
```

#### POST (Criar)
```typescript
const response = await api.post('/prescriptions', {
  patientId: 123,
  medication: 'Dipirona',
  dosage: '500mg, 6/6h'
});
const created = response.data;  // Objeto criado
```

#### PUT (Atualizar)
```typescript
await api.put(`/health-metrics/${id}`, {
  value: 120
});
```

#### DELETE (Excluir)
```typescript
await api.delete(`/prescriptions/${id}`);
```

---

## ⚠️ Gerenciamento de Erros

### Hierarquia de Erros

```
┌─────────────────────────────────────────────────────────────┐
│                    Tipos de Erro                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Erro de Rede (Network Error)                            │
│     • Sem conexão com internet                              │
│     • Backend offline                                        │
│     • Timeout                                                │
│                                                              │
│  2. Erro de Cliente (4xx)                                    │
│     • 400 Bad Request: Dados inválidos                      │
│     • 401 Unauthorized: Token inválido/expirado             │
│     • 403 Forbidden: Sem permissão                          │
│     • 404 Not Found: Recurso não existe                     │
│                                                              │
│  3. Erro de Servidor (5xx)                                   │
│     • 500 Internal Server Error                             │
│     • 503 Service Unavailable                               │
│                                                              │
│  4. Erro de Validação                                        │
│     • Frontend: Formulário inválido                         │
│     • Backend: Business rule violation                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tratamento no Frontend

```tsx
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  setError(null);
  
  try {
    await api.post('/endpoint', data);
    // Sucesso
  } catch (err: any) {
    // Erro de rede
    if (!err.response) {
      setError('Erro de conexão. Verifique sua internet.');
      return;
    }
    
    // Erro do servidor
    const status = err.response.status;
    
    if (status === 400) {
      setError('Dados inválidos. Verifique os campos.');
    } else if (status === 401) {
      setError('Sessão expirada. Faça login novamente.');
      // Redireciona (ou tenta refresh)
    } else if (status === 403) {
      setError('Você não tem permissão para esta ação.');
    } else if (status === 404) {
      setError('Recurso não encontrado.');
    } else if (status >= 500) {
      setError('Erro no servidor. Tente novamente mais tarde.');
    } else {
      setError('Erro desconhecido. Contate o suporte.');
    }
  }
};
```

### Tratamento no Backend

```csharp
// Middleware de tratamento de exceções
public class ExceptionHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new
            {
                error = ex.Message,
                details = ex.Errors
            });
        }
        catch (UnauthorizedAccessException)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Não autorizado"
            });
        }
        catch (Exception ex)
        {
            // Log erro
            _logger.LogError(ex, "Erro não tratado");
            
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Erro interno do servidor"
            });
        }
    }
}
```

---

## 💾 Cache e Performance

### Estratégias de Cache (Futuro)

```
┌─────────────────────────────────────────────────────────────┐
│                 Estratégias de Cache                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Browser Cache (HTTP Headers)                             │
│     Cache-Control: max-age=3600                             │
│     ETag: "abc123"                                          │
│                                                              │
│  2. React Query / SWR (Futuro)                               │
│     const { data } = useQuery('prescriptions', fetchFn, {   │
│       staleTime: 5 * 60 * 1000,  // 5 minutos              │
│       cacheTime: 10 * 60 * 1000   // 10 minutos            │
│     });                                                      │
│                                                              │
│  3. Redis (Backend - Futuro)                                 │
│     cache.Set("user:123", userData, TimeSpan.FromMinutes(15));│
│                                                              │
│  4. Service Worker (PWA - Futuro)                            │
│     Cache estático (HTML, CSS, JS)                          │
│     Cache dinâmico (API responses)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Otimizações Implementadas

✅ **Frontend**:
- Vite para build otimizado
- Code splitting por rota
- Lazy loading de componentes
- CSS otimizado com variáveis

✅ **Backend**:
- Async/Await para I/O
- Entity Framework com queries otimizadas
- Connection pooling
- JWT em memória (stateless)

### Otimizações Futuras

🔮 **Frontend**:
- [ ] React Query para cache de dados
- [ ] Virtualização de listas longas
- [ ] Image lazy loading
- [ ] Service Worker para PWA

🔮 **Backend**:
- [ ] Redis para cache distribuído
- [ ] Response compression (Gzip/Brotli)
- [ ] Database indexing otimizado
- [ ] Background jobs para tarefas pesadas

---

## 📊 Diagrama Completo do Fluxo

```
┌────────────────────────────────────────────────────────────────────┐
│                         NEXUS MED                                   │
│                      Fluxo de Dados Completo                        │
└────────────────────────────────────────────────────────────────────┘

       ┌─────────────┐
       │   Browser   │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ React App   │
       │             │
       │ ┌─────────┐ │
       │ │ Context │ │  ← Estado Global (Auth)
       │ └─────────┘ │
       │             │
       │ ┌─────────┐ │
       │ │ Pages   │ │  ← Estado Local (useState)
       │ └─────────┘ │
       │             │
       │ ┌─────────┐ │
       │ │   API   │ │  ← Cliente HTTP (axios)
       │ │ Client  │ │
       │ └─────┬───┘ │
       └───────┼─────┘
               │
               │ HTTP/REST
               │ Authorization: Bearer <JWT>
               │
               ▼
       ┌─────────────┐
       │  ASP.NET    │
       │   Core      │
       │             │
       │ ┌─────────┐ │
       │ │   JWT   │ │  ← Middleware Auth
       │ │  Auth   │ │
       │ └─────────┘ │
       │             │
       │ ┌─────────┐ │
       │ │Controllers│  ← Endpoints REST
       │ └─────────┘ │
       │             │
       │ ┌─────────┐ │
       │ │ Services│ │  ← Business Logic
       │ └─────────┘ │
       │             │
       │ ┌─────────┐ │
       │ │Repository│  ← Data Access
       │ └─────┬───┘ │
       └───────┼─────┘
               │
               │ EF Core
               │ LINQ Queries
               │
               ▼
       ┌─────────────┐
       │ SQL Server  │
       │             │
       │  Users      │
       │  Prescriptions│
       │  Messages   │
       │  ...        │
       └─────────────┘
```

---

## 🚀 Próximos Passos

### Melhorias de Fluxo de Dados

1. **React Query**:
   - Cache automático de requisições
   - Invalidação inteligente
   - Polling e refresh automático

2. **WebSockets** (Mensagens em tempo real):
   - SignalR para notificações
   - Atualização automática de conversas
   - Presença online

3. **Optimistic Updates**:
   - Atualizar UI antes da resposta
   - Rollback em caso de erro
   - Melhor UX percebida

4. **Offline-First** (PWA):
   - Service Worker
   - IndexedDB para cache local
   - Sync quando reconectar

---

**Última atualização**: Fevereiro 2026  
**Versão**: 1.0.0  
**Mantido por**: Equipe Nexus Med
