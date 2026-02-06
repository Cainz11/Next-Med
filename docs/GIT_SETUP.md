# 📤 Subir o repositório no Git (GitHub / GitLab / Bitbucket)

Guia para publicar o projeto Nexus Med em um repositório remoto (GitHub, GitLab ou Bitbucket).

---

## 1️⃣ Instalar o Git (se ainda não tiver)

### Windows

1. Baixe: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Instale com as opções padrão.
3. **Feche e abra de novo** o terminal (PowerShell ou CMD) para o comando `git` funcionar.

### Conferir instalação

```powershell
git --version
```

Deve aparecer algo como: `git version 2.43.0.windows.1`

---

## 2️⃣ Criar o repositório no GitHub (ou outro)

### GitHub

1. Acesse [https://github.com/new](https://github.com/new)
2. **Repository name**: por exemplo `nexus-med`
3. **Description**: opcional (ex: "App médico Nexus Med - React + .NET")
4. Escolha **Public** ou **Private**
5. **Não** marque "Add a README" (o projeto já tem arquivos)
6. Clique em **Create repository**
7. Copie a URL do repositório:
   - HTTPS: `https://github.com/SEU_USUARIO/nexus-med.git`
   - SSH: `git@github.com:SEU_USUARIO/nexus-med.git`

### GitLab

1. [https://gitlab.com/projects/new](https://gitlab.com/projects/new)
2. Crie o projeto (nome ex: `nexus-med`) e copie a URL mostrada no passo “Create blank project”.

### Bitbucket

1. [https://bitbucket.org/repo/create](https://bitbucket.org/repo/create)
2. Crie o repositório e copie a URL (HTTPS ou SSH).

---

## 3️⃣ Inicializar Git e fazer o primeiro commit (na pasta do projeto)

Abra o terminal **na pasta do projeto** (onde está o `README.md` e a pasta `frontend`):

```powershell
cd C:\Users\Caio\nexus-med
```

Execute os comandos abaixo **na ordem**.

### Inicializar o repositório (se ainda não for um repositório Git)

```powershell
git init
```

### Configurar nome e e-mail (só na primeira vez neste PC)

```powershell
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

### Adicionar todos os arquivos (respeitando o .gitignore)

```powershell
git add .
```

### Ver o que será commitado

```powershell
git status
```

### Criar o primeiro commit

```powershell
git commit -m "feat: projeto inicial Nexus Med - React, .NET, documentação e deploy Vercel"
```

### Renomear branch para main (se quiser usar main)

```powershell
git branch -M main
```

---

## 4️⃣ Conectar ao repositório remoto e enviar

Substitua `URL_DO_SEU_REPOSITORIO` pela URL que você copiou (ex: `https://github.com/SEU_USUARIO/nexus-med.git`).

### Adicionar o remote

```powershell
git remote add origin URL_DO_SEU_REPOSITORIO
```

Exemplo:

```powershell
git remote add origin https://github.com/seusuario/nexus-med.git
```

### Enviar o código (push)

```powershell
git push -u origin main
```

Se o GitHub pedir **usuário e senha**, use:

- **Usuário**: seu usuário do GitHub  
- **Senha**: um **Personal Access Token** (não a senha da conta), criado em:  
  GitHub → Settings → Developer settings → Personal access tokens

---

## 5️⃣ Resumo dos comandos (copiar e colar)

Depois de criar o repositório vazio no GitHub (ou outro) e de ter o Git instalado:

```powershell
cd C:\Users\Caio\nexus-med

git init
git config user.name "Seu Nome"
git config user.email "seu@email.com"

git add .
git status
git commit -m "feat: projeto inicial Nexus Med - React, .NET, documentação e deploy Vercel"
git branch -M main

git remote add origin https://github.com/SEU_USUARIO/nexus-med.git
git push -u origin main
```

Troque `Seu Nome`, `seu@email.com` e `https://github.com/SEU_USUARIO/nexus-med.git` pelos seus dados.

---

## 6️⃣ Se o repositório já for um clone (já tem .git)

Se a pasta já foi clonada de algum lugar e só falta enviar para outro remoto:

```powershell
cd C:\Users\Caio\nexus-med
git remote -v
```

- Se já existir `origin`, você pode trocar a URL:

  ```powershell
  git remote set-url origin https://github.com/SEU_USUARIO/nexus-med.git
  ```

- Depois:

  ```powershell
  git add .
  git commit -m "feat: atualizações do projeto"
  git push -u origin main
  ```

---

## 7️⃣ O que não sobe (está no .gitignore)

- `frontend/node_modules/`
- `frontend/dist/`
- `frontend/.env`
- `bin/`, `obj/` (backend)
- `.vs/`, `.idea/`, `.vscode/`
- Arquivos `.db`, `.log`, etc.

O que **sobe**: código fonte, `docs/`, `README.md`, `.cursor/rules/`, `frontend/vercel.json`, etc.

---

## 8️⃣ Próximos pushes (depois do primeiro)

Sempre que fizer alterações:

```powershell
cd C:\Users\Caio\nexus-med
git add .
git status
git commit -m "tipo: descrição da mudança"
git push
```

Exemplos de mensagem:

- `feat(auth): adiciona refresh token`
- `fix(frontend): corrige rota do design-system`
- `docs: atualiza README`

---

**Última atualização**: Fevereiro 2026  
**Mantido por**: Equipe Nexus Med
