# 🚀 Quick Start - Nexus Med

> Guia rápido para começar a desenvolver no projeto

## 📋 Checklist Rápido

### Para Desenvolvedores

- [ ] Clone o repositório
- [ ] Leia o [README.md](../README.md)
- [ ] Configure o ambiente (Node.js + .NET 10)
- [ ] Leia [STYLE_GUIDE.md](STYLE_GUIDE.md) (20 min)
- [ ] Explore o [Design System](/design-system) no app
- [ ] Faça seu primeiro commit seguindo os padrões

### Para Designers

- [ ] Leia [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) (25 min)
- [ ] Acesse `/design-system` no app
- [ ] Familiarize-se com a paleta Nexus Blue + Nexus Green
- [ ] Revise os componentes existentes

---

## 🎯 O Que Você Precisa Saber

### 1️⃣ Arquitetura

```
Frontend (React + TypeScript)
        ↓
    REST API
        ↓
Backend (.NET 10 - Clean Architecture)
        ↓
   Database (SQL Server)
```

**Detalhes**: [ARCHITECTURE.md](ARCHITECTURE.md)

---

### 2️⃣ Design System

#### Cores Principais

```
Nexus Blue:  #0B6E99  (Confiança/Ação)
Nexus Green: #0D9488  (Saúde/Sucesso)
```

#### Sempre Use Tokens CSS

```typescript
// ✅ CORRETO
style={{ color: 'var(--color-primary)' }}

// ❌ ERRADO
style={{ color: '#0B6E99' }}
```

**Detalhes**: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

### 3️⃣ Componentes Principais

#### Botões

```typescript
<button className="btn btn-primary">Entrar</button>
<button className="btn btn-secondary">Cancelar</button>
<button className="btn btn-ghost">Sair</button>
```

#### Inputs

```typescript
<div className="form-group">
  <label className="label" htmlFor="email">Email</label>
  <input type="email" id="email" className="input" />
</div>
```

#### Cards

```typescript
<div className="card">
  <strong>Título</strong>
  <p>Descrição</p>
</div>
```

**Detalhes**: [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md)

---

### 4️⃣ Padrões de Código

#### Frontend (TypeScript/React)

```typescript
// Nomenclatura
LoginPage.tsx        // PascalCase (componentes)
const userName = ... // camelCase (variáveis)

// Estado com tratamento de erros
const [data, setData] = useState<Data[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

try {
  const response = await api.get('/data');
  setData(response.data);
} catch (err) {
  setError('Erro ao carregar');
} finally {
  setLoading(false);
}
```

#### Backend (C#/.NET)

```csharp
// Nomenclatura
User.cs                    // PascalCase (classes)
public int Id { get; set; } // PascalCase (propriedades)
var userName = ...         // camelCase (variáveis)

// Async/Await
public async Task<User> GetByIdAsync(int id)
{
    return await _context.Users.FindAsync(id);
}

// Clean Architecture
Domain → Application → Infrastructure → WebApi
```

**Detalhes**: [STYLE_GUIDE.md](STYLE_GUIDE.md)

---

### 5️⃣ Git e Commits

#### Formato

```bash
tipo(escopo): descrição

# Exemplos:
feat(auth): adiciona refresh token automático
fix(prescriptions): corrige filtro por paciente
docs: atualiza README
refactor(api): extrai lógica de validação
```

#### Tipos Comuns

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `refactor`: Refatoração
- `style`: Formatação
- `test`: Testes

---

## 🤖 Regras de IA

O projeto possui 5 regras automáticas em `.cursor/rules/`:

1. **nexus-med-core** (sempre): Princípios fundamentais
2. **frontend-react** (*.tsx): Padrões React
3. **backend-dotnet** (*.cs): Padrões .NET
4. **design-system** (*.css): Design tokens
5. **documentation** (*.md): Padrões docs

Elas garantem que a IA siga os mesmos padrões do time!

---

## 📚 Documentação Essencial

| Precisa de... | Veja... |
|---------------|---------|
| **Overview geral** | [README.md](../README.md) |
| **Navegação completa** | [INDEX.md](INDEX.md) |
| **Arquitetura** | [ARCHITECTURE.md](ARCHITECTURE.md) |
| **UI/Design** | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) |
| **Componentes** | [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md) |
| **Fluxo de dados** | [DATA_FLOW.md](DATA_FLOW.md) |
| **API** | [API_ENDPOINTS.md](API_ENDPOINTS.md) |
| **Padrões de código** | [STYLE_GUIDE.md](STYLE_GUIDE.md) |
| **Histórico** | [CHANGELOG.md](../CHANGELOG.md) |

---

## 🎨 Recursos Visuais

### No App

Após fazer login, acesse:

- **`/design-system`**: Paleta de cores interativa, componentes
- **`/dashboard`**: Exemplo de layout com cards
- **`/prescriptions`**: Exemplo de lista

### Na Documentação

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): Paleta visual, componentes
- [ARCHITECTURE.md](ARCHITECTURE.md): Diagramas de arquitetura
- [DATA_FLOW.md](DATA_FLOW.md): Diagramas de fluxo

---

## ⚡ Comandos Rápidos

### Backend

```bash
# Rodar API
cd src/NexusMed.WebApi
dotnet run

# URL: http://localhost:5053
# Swagger: http://localhost:5053/swagger
```

### Frontend

```bash
# Rodar app
cd frontend
npm install
npm run dev

# URL: http://localhost:5173
```

### Docker (Banco)

```bash
# Subir SQL Server
docker-compose up -d

# Porta: 1433
# Senha: NexusMed@Passw0rd
```

---

## 🎯 Primeiros Passos

### 1. Clone e Configure

```bash
git clone <repo>
cd nexus-med
```

### 2. Backend

```bash
cd src/NexusMed.WebApi
dotnet restore
dotnet run
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Acesse

- Frontend: http://localhost:5173
- API: http://localhost:5053
- Swagger: http://localhost:5053/swagger

### 5. Login/Cadastro

1. Acesse http://localhost:5173
2. Clique em "Criar conta"
3. Preencha email, senha, nome
4. Selecione tipo (Paciente ou Profissional)
5. Entre no dashboard!

---

## 💡 Dicas

### Para IA

As regras em `.cursor/rules/` são **carregadas automaticamente**. A IA já sabe:
- ✅ Usar design tokens
- ✅ Seguir nomenclatura PascalCase/camelCase
- ✅ Implementar tratamento de erros
- ✅ Incluir estados loading/empty/error
- ✅ Seguir Clean Architecture

### Para Humanos

- 📖 Consulte o [INDEX.md](INDEX.md) para navegação
- 🎨 Use `/design-system` no app para referência visual
- 📝 Siga [STYLE_GUIDE.md](STYLE_GUIDE.md) para código
- 🔍 Use o Swagger para testar a API
- 💬 Pergunte ao time em caso de dúvida

---

## 🚨 Atenção

### Obrigatório

- ✅ Usar design tokens (var(--color-primary))
- ✅ Tipagem TypeScript (evitar `any`)
- ✅ Tratamento de erros em async/await
- ✅ Labels em inputs (acessibilidade)
- ✅ Commits no formato convencional

### Evitar

- ❌ Hardcode de cores (#0B6E99)
- ❌ Hardcode de espaçamento (16px)
- ❌ Props sem tipo (any)
- ❌ Async sem try/catch
- ❌ Inputs sem label

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Documentos** | 9 |
| **Regras de IA** | 5 |
| **Páginas de docs** | ~150 |
| **Exemplos de código** | 100+ |
| **Diagramas** | 15+ |
| **Componentes** | 20+ |

---

## 🎓 Próximos Passos

### Desenvolvedor Frontend

1. ✅ Leia este Quick Start
2. ✅ Explore [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
3. ✅ Acesse `/design-system` no app
4. ✅ Leia [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md)
5. ✅ Implemente seu primeiro componente
6. ✅ Teste com os padrões do [STYLE_GUIDE.md](STYLE_GUIDE.md)

### Desenvolvedor Backend

1. ✅ Leia este Quick Start
2. ✅ Explore [ARCHITECTURE.md](ARCHITECTURE.md)
3. ✅ Entenda as camadas (Domain → Application → Infrastructure)
4. ✅ Leia [API_ENDPOINTS.md](API_ENDPOINTS.md)
5. ✅ Implemente seu primeiro endpoint
6. ✅ Teste no Swagger

---

## 🆘 Ajuda

- **Dúvidas técnicas**: Consulte [INDEX.md](INDEX.md) e navegue para o doc relevante
- **Padrões de código**: [STYLE_GUIDE.md](STYLE_GUIDE.md)
- **Design**: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) ou `/design-system`
- **Arquitetura**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Fluxos**: [DATA_FLOW.md](DATA_FLOW.md)

---

**Pronto para começar?** 🚀

Escolha seu caminho:
- 👨‍💻 **Dev Frontend**: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) → [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md)
- 👨‍💻 **Dev Backend**: [ARCHITECTURE.md](ARCHITECTURE.md) → [API_ENDPOINTS.md](API_ENDPOINTS.md)
- 🎨 **Designer**: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) → `/design-system` (app)
- 🏗️ **Arquiteto**: [INDEX.md](INDEX.md) → Navegue por todos

---

**Última atualização**: Fevereiro 2026  
**Versão**: 2.0.0  
**Mantido por**: Equipe Nexus Med
