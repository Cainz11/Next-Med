# 📊 Resumo das Regras de IA - Nexus Med

## ✅ Regras Criadas

### 1. nexus-med-core.mdc ⭐
**Aplicação**: Sempre (alwaysApply: true)

Garante que TODAS as conversas com a IA incluam:
- ✅ Princípios fundamentais (SOLID, DRY, KISS, Clean Code)
- ✅ Nomenclatura padrão (PascalCase, camelCase, UPPER_SNAKE_CASE)
- ✅ Design tokens obrigatórios (var(--color-primary) em vez de #0B6E99)
- ✅ Sistema de espaçamento 8pt grid (var(--space-4) em vez de 16px)
- ✅ Padrão de commits (Conventional Commits)
- ✅ Arquitetura Clean Architecture + React 18

**Resultado**: A IA NUNCA vai usar cores ou espaçamentos hardcoded!

---

### 2. frontend-react.mdc
**Aplicação**: Arquivos `**/*.tsx`, `**/*.ts`, `**/frontend/**/*.js`

A IA automaticamente:
- ✅ Organiza componentes: Hooks → Effects → Handlers → Render
- ✅ Cria interfaces TypeScript para props
- ✅ Implementa tratamento completo de erros (try/catch/finally)
- ✅ Inclui estados loading, error, empty
- ✅ Adiciona labels e ARIA para acessibilidade
- ✅ Respeita safe area para iOS
- ✅ Garante touch targets de 44px+

**Resultado**: Componentes React consistentes e acessíveis!

---

### 3. backend-dotnet.mdc
**Aplicação**: Arquivos `**/*.cs`, `**/src/**/*.csproj`

A IA automaticamente:
- ✅ Respeita Clean Architecture (Domain → Application → Infrastructure → WebApi)
- ✅ Usa sufixo `Async` em métodos assíncronos
- ✅ Implementa LINQ otimizado (Include, Where no banco)
- ✅ Aplica injeção de dependências
- ✅ Valida autorização (userId do token)
- ✅ Usa logging estruturado

**Resultado**: Backend seguindo Clean Architecture e boas práticas .NET!

---

### 4. design-system.mdc
**Aplicação**: Arquivos `**/*.tsx`, `**/*.css`, `**/*.scss`

A IA automaticamente:
- ✅ Usa tokens CSS para cores, espaçamento, tipografia
- ✅ Aplica componentes padronizados (.btn, .card, .input)
- ✅ Garante contraste WCAG 2.2 (AA) mínimo 4.5:1
- ✅ Implementa touch targets de 44px+
- ✅ Adiciona labels associados a inputs
- ✅ Respeita safe area (iOS)

**Resultado**: UI consistente com o design system Nexus Med!

---

### 5. documentation.mdc
**Aplicação**: Arquivos `**/*.md`, `**/docs/**/*`

A IA automaticamente:
- ✅ Segue estrutura markdown padronizada
- ✅ Inclui exemplos ✅ CORRETO e ❌ ERRADO
- ✅ Usa diagramas ASCII para visualização
- ✅ Adiciona emojis para clareza (🎨, 🔧, 📚)
- ✅ Cria referências cruzadas entre documentos
- ✅ Mantém CHANGELOG atualizado

**Resultado**: Documentação consistente e navegável!

---

## 🎯 Cobertura

### Tipos de Arquivo

| Extensão | Regras Aplicadas | Exemplos |
|----------|------------------|----------|
| `.tsx` | core, frontend, design | Componentes React |
| `.ts` | core, frontend | Hooks, utils |
| `.cs` | core, backend | Controllers, services |
| `.css` | core, design | Estilos, tokens |
| `.md` | core, documentation | Docs, README |
| Outros | core | Qualquer arquivo |

### Garantias Automáticas

✅ **Sempre enforçadas** (via nexus-med-core):
- Tokens CSS em vez de hardcode
- Nomenclatura consistente
- Princípios SOLID
- Commits convencionais

✅ **Por tipo de arquivo**:
- Frontend: Estrutura de componentes, TypeScript, acessibilidade
- Backend: Clean Architecture, async/await, segurança
- Design: Paleta, componentes, mobile-first
- Docs: Markdown, exemplos, diagramas

---

## 📊 Impacto

### Antes das Regras

```typescript
// ❌ IA poderia fazer assim
<button style={{ 
  background: '#0B6E99',
  padding: '12px 20px',
  borderRadius: '8px'
}}>
  Entrar
</button>
```

### Depois das Regras

```typescript
// ✅ IA faz automaticamente assim
<button className="btn btn-primary">
  Entrar
</button>
```

---

## 🚀 Benefícios Reais

### Para Desenvolvedores

1. **Menos revisões de código**
   - A IA já segue os padrões
   - Menos comentários sobre "usar tokens CSS"
   - Menos "adicionar tratamento de erros"

2. **Código mais consistente**
   - Mesma estrutura em todos os componentes
   - Nomenclatura uniforme
   - Estilos padronizados

3. **Onboarding mais rápido**
   - IA é "treinada" desde o primeiro dia
   - Menos perguntas "como fazer X?"
   - Exemplos práticos em cada regra

### Para o Projeto

1. **Qualidade automática**
   - Acessibilidade (labels, ARIA)
   - Segurança (autorização, validação)
   - Performance (queries otimizadas)

2. **Manutenibilidade**
   - Código previsível
   - Padrões documentados
   - Fácil de entender

3. **Velocidade**
   - Menos tempo em code review
   - Menos refatoração
   - Mais features

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| **Regras criadas** | 5 |
| **Sempre aplicada** | 1 (core) |
| **Contextuais** | 4 |
| **Linhas de exemplo** | 200+ |
| **Padrões cobertos** | 50+ |
| **Tipos de arquivo** | 7 |

---

## 🎓 Exemplos de Uso

### Cenário 1: Criar Componente de Botão

**Comando**: "Crie um componente de botão com variantes"

**IA aplica automaticamente**:
- ✅ nexus-med-core: PascalCase, tokens CSS
- ✅ frontend-react: Interface para props, TypeScript
- ✅ design-system: Classes .btn, variantes padronizadas

**Resultado**:
```typescript
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
      style={{ minHeight: '44px' }}  // Touch target
    >
      {children}
    </button>
  );
}
```

---

### Cenário 2: Criar Endpoint de API

**Comando**: "Crie um endpoint para listar receitas"

**IA aplica automaticamente**:
- ✅ nexus-med-core: PascalCase, async/await
- ✅ backend-dotnet: Clean Architecture, autorização, logging

**Resultado**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class PrescriptionsController : ControllerBase
{
    private readonly IPrescriptionService _service;
    private readonly ILogger<PrescriptionsController> _logger;
    
    public PrescriptionsController(
        IPrescriptionService service,
        ILogger<PrescriptionsController> logger)
    {
        _service = service;
        _logger = logger;
    }
    
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetPrescriptions()
    {
        try
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value!);
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            
            var prescriptions = await _service.GetByUserAsync(userId, role);
            return Ok(prescriptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao listar receitas");
            return StatusCode(500, new { message = "Erro interno" });
        }
    }
}
```

---

### Cenário 3: Adicionar Estilos

**Comando**: "Estilize este componente com a cor primária"

**IA aplica automaticamente**:
- ✅ nexus-med-core: Tokens CSS obrigatórios
- ✅ design-system: var(--color-primary)

**Resultado**:
```typescript
// ✅ IA faz assim automaticamente
<div style={{ 
  color: 'var(--color-primary)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-md)'
}}>
  {content}
</div>

// ❌ IA NUNCA fará assim
<div style={{ 
  color: '#0B6E99',
  padding: '16px',
  borderRadius: '8px'
}}>
  {content}
</div>
```

---

## 🔄 Manutenção

### Quando Atualizar

1. **Mudança de Padrão**: Novo padrão adotado pelo time
2. **Feedback Recorrente**: IA comete o mesmo erro repetidamente
3. **Nova Funcionalidade**: Novo componente ou padrão
4. **Melhoria de Exemplo**: Exemplo pode ser mais claro

### Como Atualizar

1. Edite o arquivo `.mdc` correspondente
2. Adicione/atualize exemplo com ✅ e ❌
3. Teste com a IA
4. Atualize este SUMMARY.md

---

## 🎯 Próximos Passos

### Possíveis Novas Regras

1. **testing.mdc**: Padrões de testes (Vitest, xUnit)
2. **api-conventions.mdc**: Convenções REST específicas
3. **performance.mdc**: Otimizações (lazy loading, memoization)
4. **security.mdc**: Segurança (XSS, CSRF, SQL injection)

### Melhorias nas Regras Atuais

1. Adicionar mais exemplos de hooks customizados
2. Incluir padrões de state management (Context, Redux)
3. Exemplos de queries GraphQL (se adotado)
4. Padrões de microservices (se migrar)

---

## 📚 Referências

Estas regras são baseadas em:
- [STYLE_GUIDE.md](../../docs/STYLE_GUIDE.md)
- [ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- [DESIGN_SYSTEM.md](../../docs/DESIGN_SYSTEM.md)
- [COMPONENT_GUIDE.md](../../docs/COMPONENT_GUIDE.md)
- Clean Code - Robert C. Martin
- Clean Architecture - Robert C. Martin

---

**Última atualização**: Fevereiro 2026  
**Versão**: 1.0.0  
**Mantido por**: Equipe Nexus Med

---

*🤖 **Estas regras garantem que a IA seja um membro produtivo e consistente do time!***
