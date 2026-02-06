# 📐 Guia de Estilo de Código - Nexus Med

> Padrões e convenções para manter consistência no código

## 📋 Índice

- [Princípios Gerais](#princípios-gerais)
- [Frontend (TypeScript/React)](#frontend-typescriptreact)
- [Backend (C#/.NET)](#backend-cnet)
- [Git e Commits](#git-e-commits)
- [Documentação](#documentação)

---

## 🎯 Princípios Gerais

### Código Limpo (Clean Code)

1. **Nomes Significativos**: Variáveis, funções e classes devem ter nomes descritivos
2. **Funções Pequenas**: Cada função deve fazer uma coisa e fazer bem
3. **DRY (Don't Repeat Yourself)**: Evite duplicação de código
4. **KISS (Keep It Simple, Stupid)**: Prefira simplicidade sobre complexidade
5. **YAGNI (You Aren't Gonna Need It)**: Não implemente funcionalidades que não são necessárias agora

### Formatação

- **Indentação**: 2 espaços (TypeScript/React) ou 4 espaços (C#)
- **Linha máxima**: 100-120 caracteres
- **Quebras de linha**: Sempre antes de chaves de abertura (C#) ou conforme Prettier (TS)

---

## ⚛️ Frontend (TypeScript/React)

### Estrutura de Arquivos

```
src/
├── pages/           # Uma pasta por feature
│   └── LoginPage.tsx
├── components/      # Componentes reutilizáveis
│   └── Button.tsx
├── core/           # Contextos, hooks, utils
│   └── AuthContext.tsx
└── styles/         # Estilos globais e tokens
    └── tokens.css
```

### Nomenclatura

#### Arquivos e Pastas

```typescript
// ✅ Bom - PascalCase para componentes
LoginPage.tsx
AuthContext.tsx
Button.tsx

// ❌ Evitar
loginPage.tsx
login-page.tsx
```

#### Componentes

```typescript
// ✅ Bom - PascalCase
export function LoginPage() { }
export function AuthContext() { }

// ❌ Evitar
export function loginPage() { }
export const login_page = () => { }
```

#### Variáveis e Funções

```typescript
// ✅ Bom - camelCase
const userName = 'João';
const handleSubmit = () => { };
const isAuthenticated = true;

// ❌ Evitar
const UserName = 'João';
const handle_submit = () => { };
const is_authenticated = true;
```

#### Constantes

```typescript
// ✅ Bom - UPPER_SNAKE_CASE para constantes globais
const API_BASE_URL = '/api';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ Bom - camelCase para constantes locais
const apiBaseUrl = '/api';
const maxRetryAttempts = 3;
```

### Componentes React

#### Estrutura de Componente

```typescript
// ✅ Bom
import { useState, useEffect } from 'react';
import { useAuth } from '../core/AuthContext';

export function DashboardPage() {
  // 1. Hooks
  const { user, logout } = useAuth();
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Handlers
  const handleLogout = () => {
    logout();
  };

  const fetchData = async () => {
    // ...
  };

  // 4. Render
  return (
    <div className="app-page">
      {/* ... */}
    </div>
  );
}
```

#### Props

```typescript
// ✅ Bom - Interface para props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ Evitar - Props sem tipo
export function Button(props) {
  return <button>{props.children}</button>;
}
```

#### Hooks Customizados

```typescript
// ✅ Bom - Prefixo 'use'
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ✅ Bom - Hook genérico
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch logic
  }, [url]);

  return { data, loading, error };
}
```

### Estilos

#### Preferência

1. **CSS Modules** (futuro)
2. **CSS Classes** com tokens (atual)
3. **Inline styles** apenas quando necessário

```typescript
// ✅ Bom - Usar classes CSS
<button className="btn btn-primary">
  Entrar
</button>

// ✅ Aceitável - Inline para valores dinâmicos
<div style={{ 
  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' 
}}>
  {text}
</div>

// ❌ Evitar - Inline com valores hardcoded
<div style={{ color: '#0B6E99', padding: '16px' }}>
  {text}
</div>
```

#### Design Tokens

```typescript
// ✅ Bom - Usar tokens CSS
style={{ 
  color: 'var(--color-text-secondary)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-md)'
}}

// ❌ Evitar - Valores hardcoded
style={{ 
  color: '#64748B',
  padding: '16px',
  borderRadius: '8px'
}}
```

### TypeScript

#### Tipos

```typescript
// ✅ Bom - Interfaces para objetos
interface User {
  id: number;
  email: string;
  name: string;
  role: 'Patient' | 'Professional';
}

// ✅ Bom - Type para unions/aliases
type UserRole = 'Patient' | 'Professional';
type Status = 'idle' | 'loading' | 'success' | 'error';

// ✅ Bom - Generics quando aplicável
interface ApiResponse<T> {
  data: T;
  message: string;
}
```

#### Any

```typescript
// ❌ Evitar - any
const data: any = await fetchData();

// ✅ Bom - Tipo específico
const data: User[] = await fetchData();

// ✅ Aceitável - unknown quando tipo é realmente desconhecido
const data: unknown = await fetchData();
if (isUser(data)) {
  // Type guard
  console.log(data.email);
}
```

### Estado

```typescript
// ✅ Bom - Estado tipado
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

// ✅ Bom - Estado com valor inicial
const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
```

### Async/Await

```typescript
// ✅ Bom - Tratamento de erros
const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.get('/data');
    setData(response.data);
  } catch (err) {
    setError('Erro ao carregar dados');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// ❌ Evitar - Sem tratamento de erros
const fetchData = async () => {
  const response = await api.get('/data');
  setData(response.data);
};
```

---

## 🔷 Backend (C#/.NET)

### Estrutura de Arquivos

```
src/
├── NexusMed.Domain/
│   ├── Entities/
│   └── Interfaces/
├── NexusMed.Application/
│   ├── DTOs/
│   └── Services/
├── NexusMed.Infrastructure/
│   ├── Data/
│   └── Repositories/
└── NexusMed.WebApi/
    └── Controllers/
```

### Nomenclatura

#### Arquivos

```csharp
// ✅ Bom - PascalCase
User.cs
IUserRepository.cs
UserService.cs
AuthController.cs
```

#### Classes, Interfaces, Métodos

```csharp
// ✅ Bom
public class User { }
public interface IUserRepository { }
public class UserService { }

public async Task<User> GetByIdAsync(int id) { }

// ❌ Evitar
public class user { }
public interface userRepository { }
public async Task<User> getById(int id) { }
```

#### Variáveis Locais

```csharp
// ✅ Bom - camelCase
var userName = "João";
var isActive = true;

// ❌ Evitar
var UserName = "João";
var IsActive = true;
```

#### Propriedades

```csharp
// ✅ Bom - PascalCase
public int Id { get; set; }
public string Email { get; set; }
public bool IsActive { get; set; }

// ❌ Evitar
public int id { get; set; }
public string email { get; set; }
```

### Entidades

```csharp
// ✅ Bom
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navigation properties
    public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}

public enum UserRole
{
    Patient,
    Professional
}
```

### DTOs

```csharp
// ✅ Bom - Sufixo Dto
public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
}
```

### Controllers

```csharp
// ✅ Bom
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        try
        {
            var response = await _authService.LoginAsync(dto);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Email ou senha inválidos" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fazer login");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
```

### Serviços

```csharp
// ✅ Bom - Interface + Implementação
public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
    Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto dto);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    
    public AuthService(
        IUserRepository userRepository,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }
    
    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
    {
        // Implementação
    }
}
```

### Async/Await

```csharp
// ✅ Bom - Sufixo Async para métodos assíncronos
public async Task<User> GetByIdAsync(int id)
{
    return await _context.Users.FindAsync(id);
}

public async Task<List<User>> GetAllAsync()
{
    return await _context.Users.ToListAsync();
}

// ❌ Evitar - Sem sufixo Async
public async Task<User> GetById(int id)
{
    return await _context.Users.FindAsync(id);
}
```

### LINQ

```csharp
// ✅ Bom - Queries legíveis
var activeUsers = await _context.Users
    .Where(u => u.IsActive)
    .OrderBy(u => u.Name)
    .ToListAsync();

// ✅ Bom - Include para relacionamentos
var user = await _context.Users
    .Include(u => u.Prescriptions)
    .FirstOrDefaultAsync(u => u.Id == id);
```

---

## 🌳 Git e Commits

### Branches

```bash
# ✅ Bom
main
develop
feature/user-authentication
feature/prescription-list
fix/login-error
hotfix/security-patch

# ❌ Evitar
master
dev
my-feature
fix
```

### Commits

#### Formato

```
tipo(escopo): descrição curta

Descrição mais detalhada se necessário.
```

#### Tipos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Formatação, falta de ponto-e-vírgula, etc (não muda código)
- **refactor**: Refatoração de código (não adiciona feat nem corrige bug)
- **test**: Adição ou correção de testes
- **chore**: Mudanças em build, CI, etc

#### Exemplos

```bash
# ✅ Bom
git commit -m "feat(auth): adiciona refresh token automático"
git commit -m "fix(prescriptions): corrige filtro por paciente"
git commit -m "docs: atualiza README com instruções de instalação"
git commit -m "refactor(api): extrai lógica de validação para serviço"

# ❌ Evitar
git commit -m "mudanças"
git commit -m "fix"
git commit -m "WIP"
```

### Pull Requests

#### Título

```
feat(prescriptions): adiciona página de listagem de receitas
fix(auth): corrige renovação de token JWT
```

#### Descrição

```markdown
## Descrição
Adiciona a página de listagem de receitas com filtros por paciente.

## Mudanças
- Novo componente PrescriptionsPage
- Endpoint GET /api/prescriptions
- Filtro por data e paciente

## Testes
- [ ] Testado em mobile (Chrome DevTools)
- [ ] Testado filtros
- [ ] Testado estados de loading e erro

## Screenshots
(adicionar se relevante)
```

---

## 📝 Documentação

### Comentários no Código

```typescript
// ✅ Bom - Comenta o "porquê", não o "o quê"
// Força refresh do token se expira em menos de 5 minutos
// para evitar erro 401 em requests longos
if (tokenExpiresIn < 5 * 60 * 1000) {
  await refreshToken();
}

// ❌ Evitar - Comenta o óbvio
// Define a variável loading como true
setLoading(true);
```

### JSDoc / XML Comments

```typescript
// ✅ Bom - JSDoc para funções públicas
/**
 * Valida se um email é válido
 * @param email - Email a ser validado
 * @returns true se válido, false caso contrário
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

```csharp
// ✅ Bom - XML comments
/// <summary>
/// Obtém um usuário pelo ID
/// </summary>
/// <param name="id">ID do usuário</param>
/// <returns>Usuário encontrado ou null</returns>
public async Task<User?> GetByIdAsync(int id)
{
    return await _context.Users.FindAsync(id);
}
```

### README em Pastas

```markdown
# Pasta: components/

Componentes reutilizáveis da aplicação.

## Estrutura

- `Button.tsx` - Componente de botão com variantes
- `Input.tsx` - Componente de input com validação
- `Card.tsx` - Componente de card base

## Como usar

```tsx
import { Button } from './components/Button';

<Button variant="primary" onClick={handleClick}>
  Clique aqui
</Button>
```
```

---

## ✅ Checklist de Code Review

### Frontend

- [ ] Componente está tipado corretamente
- [ ] Usa design tokens (não valores hardcoded)
- [ ] Tratamento de erros implementado
- [ ] Estados de loading e empty tratados
- [ ] Acessibilidade (labels, aria, contraste)
- [ ] Responsivo (mobile-first)
- [ ] Sem console.log em produção

### Backend

- [ ] Segue Clean Architecture
- [ ] DTOs para entrada/saída
- [ ] Validação de dados
- [ ] Tratamento de erros
- [ ] Async/Await usado corretamente
- [ ] Autorização verificada
- [ ] Queries otimizadas (Eager loading)

### Geral

- [ ] Nome de variáveis/funções descritivo
- [ ] Código DRY (sem duplicação)
- [ ] Comentários apenas onde necessário
- [ ] Testes passando
- [ ] Documentação atualizada

---

## 📚 Recursos

- [Clean Code - Robert C. Martin](https://www.amazon.com.br/dp/8576082675)
- [Refactoring - Martin Fowler](https://refactoring.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Última atualização**: Fevereiro 2026  
**Versão**: 1.0.0  
**Mantido por**: Equipe Nexus Med
