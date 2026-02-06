# 🤖 Regras de IA para o Nexus Med

Esta pasta contém regras de desenvolvimento que os agentes de IA seguem automaticamente ao trabalhar no projeto.

## 📋 Regras Disponíveis

### 1. `nexus-med-core.mdc`
**Aplicação**: Sempre (alwaysApply: true)

Princípios fundamentais do projeto:
- Arquitetura Clean Architecture (.NET 10) + React 18
- Nomenclatura padrão (PascalCase, camelCase)
- Design tokens CSS (sempre usar, nunca hardcode)
- Sistema de espaçamento 8pt grid
- Padrão de commits (Conventional Commits)
- Princípios SOLID, DRY, KISS

### 2. `frontend-react.mdc`
**Aplicação**: Arquivos `**/*.tsx`, `**/*.ts`, `**/frontend/**/*.js`

Padrões específicos de React/TypeScript:
- Estrutura de componentes (Hooks → Effects → Handlers → Render)
- Props com interfaces TypeScript
- Estados com tratamento completo de erros
- Hooks customizados
- Estados de Loading/Empty/Error
- Acessibilidade (labels, ARIA)
- Mobile-first (safe area, touch targets 44px+)

### 3. `backend-dotnet.mdc`
**Aplicação**: Arquivos `**/*.cs`, `**/src/**/*.csproj`

Padrões específicos de C#/.NET:
- Clean Architecture (Domain, Application, Infrastructure, WebApi)
- Async/Await com sufixo `Async`
- LINQ e Entity Framework otimizados
- Injeção de dependências
- Autorização e validação
- Logging estruturado

### 4. `design-system.mdc`
**Aplicação**: Arquivos `**/*.tsx`, `**/*.css`, `**/*.scss`

Design system do Nexus Med:
- Paleta de cores (Nexus Blue + Nexus Green)
- Tokens CSS para cores, espaçamento, tipografia
- Componentes padronizados (botões, inputs, cards)
- Acessibilidade WCAG 2.2 (AA)
- Mobile-first e safe area
- Contraste mínimo 4.5:1

### 5. `documentation.mdc`
**Aplicação**: Arquivos `**/*.md`, `**/docs/**/*`

Padrões de documentação:
- Estrutura de markdown (títulos, listas, tabelas)
- Exemplos de código com contexto
- Diagramas ASCII
- Emojis para clareza
- Referências cruzadas
- Atualização do CHANGELOG

---

## 🎯 Como Funcionam

### Regras Sempre Aplicadas

A regra `nexus-med-core.mdc` está configurada com `alwaysApply: true`, o que significa que será **sempre incluída** em todas as conversas com a IA, independentemente do arquivo sendo editado.

### Regras Contextuais

As outras regras são ativadas automaticamente quando você abre ou menciona arquivos que correspondem aos seus padrões glob:

- **Frontend**: Ao editar `.tsx` ou `.ts`
- **Backend**: Ao editar `.cs` ou `.csproj`
- **Design**: Ao editar `.tsx`, `.css` ou `.scss`
- **Docs**: Ao editar `.md` ou arquivos em `/docs/`

### Múltiplas Regras

É possível ter várias regras ativas ao mesmo tempo. Por exemplo:
- Editando `DashboardPage.tsx`: `nexus-med-core`, `frontend-react`, `design-system`
- Editando `AuthController.cs`: `nexus-med-core`, `backend-dotnet`
- Editando `DESIGN_SYSTEM.md`: `nexus-med-core`, `documentation`

---

## 📚 Documentação Relacionada

Estas regras são baseadas na documentação completa do projeto:

| Regra | Baseada em |
|-------|-----------|
| `nexus-med-core` | [README.md](../README.md), [STYLE_GUIDE.md](../docs/STYLE_GUIDE.md) |
| `frontend-react` | [STYLE_GUIDE.md](../docs/STYLE_GUIDE.md), [COMPONENT_GUIDE.md](../docs/COMPONENT_GUIDE.md) |
| `backend-dotnet` | [ARCHITECTURE.md](../docs/ARCHITECTURE.md), [STYLE_GUIDE.md](../docs/STYLE_GUIDE.md) |
| `design-system` | [DESIGN_SYSTEM.md](../docs/DESIGN_SYSTEM.md), [COMPONENT_GUIDE.md](../docs/COMPONENT_GUIDE.md) |
| `documentation` | [INDEX.md](../docs/INDEX.md), padrões markdown |

---

## ✅ Benefícios

### Para Desenvolvedores Humanos
- IA segue os mesmos padrões do time
- Sugestões de código consistentes
- Menos revisões por violação de padrões

### Para a IA
- Contexto claro sobre o projeto
- Padrões específicos por tipo de arquivo
- Exemplos de código correto e incorreto

### Para o Projeto
- Código mais consistente
- Menos erros de padrão
- Onboarding mais rápido (humanos e IA)

---

## 🔄 Atualização

### Quando Atualizar uma Regra

1. **Mudança de Padrão**: Se um padrão do projeto mudar
2. **Novo Componente**: Adicionar à regra `design-system.mdc`
3. **Nova Convenção**: Adicionar à regra apropriada
4. **Feedback Recorrente**: Se a IA comete o mesmo erro repetidamente

### Como Atualizar

1. Edite o arquivo `.mdc` correspondente
2. Mantenha exemplos com `✅ CORRETO` e `❌ ERRADO`
3. Seja conciso (ideal: < 500 linhas)
4. Teste com a IA em alguns arquivos

---

## 🎨 Formato das Regras

### Estrutura Básica

```markdown
---
description: Descrição breve da regra
globs: **/*.tsx,**/*.ts
alwaysApply: false
---

# Título da Regra

## Seção 1

\`\`\`typescript
// ✅ CORRETO - Exemplo bom
code here

// ❌ ERRADO - Exemplo ruim
bad code
\`\`\`
```

### Boas Práticas

- ✅ Exemplos concretos com código
- ✅ Comparação certo vs errado
- ✅ Conciso e objetivo
- ✅ Uma preocupação por seção
- ❌ Textos muito longos
- ❌ Múltiplas preocupações misturadas
- ❌ Sem exemplos de código

---

## 🚀 Testando as Regras

### Teste Manual

1. Abra um arquivo do tipo correspondente (ex: `.tsx`)
2. Peça à IA para criar/modificar código
3. Verifique se segue os padrões da regra

### Exemplo de Teste

```
Você: "Crie um componente de botão"

IA deve:
✅ Usar PascalCase para nome
✅ Usar TypeScript com interface de props
✅ Usar classes CSS (.btn)
✅ Usar tokens CSS (var(--color-primary))
✅ Incluir props disabled e loading
```

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Total de regras** | 5 |
| **Regras sempre aplicadas** | 1 (core) |
| **Regras contextuais** | 4 |
| **Padrões glob únicos** | 7 |
| **Linhas de código de exemplo** | 200+ |

---

## 🤝 Contribuindo

Para adicionar ou modificar regras:

1. Siga o formato `.mdc` com frontmatter
2. Inclua exemplos ✅ CORRETO e ❌ ERRADO
3. Mantenha < 500 linhas
4. Teste com a IA
5. Documente no `README.md` (este arquivo)

---

## 📞 Suporte

- **Dúvidas sobre regras**: Consulte [STYLE_GUIDE.md](../docs/STYLE_GUIDE.md)
- **Padrões de código**: Veja [INDEX.md](../docs/INDEX.md)
- **Design system**: Acesse `/design-system` no app

---

**Última atualização**: Fevereiro 2026  
**Mantido por**: Equipe Nexus Med

---

*💡 **Dica**: As regras são carregadas automaticamente pelo Cursor. Você não precisa fazer nada manualmente!*
