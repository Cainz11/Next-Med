# Script para subir o repositório Nexus Med no Git (GitHub/GitLab/Bitbucket)
# Uso: Execute no PowerShell na pasta do projeto (nexus-med)
# Pré-requisito: Git instalado (https://git-scm.com/download/win)

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host "=== Nexus Med - Subir repositório no Git ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "[OK] Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERRO] Git nao encontrado. Instale em: https://git-scm.com/download/win" -ForegroundColor Red
    Write-Host "Depois de instalar, feche e abra o terminal novamente." -ForegroundColor Yellow
    exit 1
}

Set-Location $projectRoot

# Se ainda não for um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host ""
    Write-Host "Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "[OK] Repositório inicializado." -ForegroundColor Green
} else {
    Write-Host "[OK] Repositório Git já existe." -ForegroundColor Green
}

# Configurar user (só pergunta se ainda não estiver configurado globalmente)
$userName = git config user.name 2>$null
$userEmail = git config user.email 2>$null
if (-not $userName) {
    $userName = Read-Host "Digite seu nome (para os commits)"
    git config user.name $userName
}
if (-not $userEmail) {
    $userEmail = Read-Host "Digite seu email (para os commits)"
    git config user.email $userEmail
}

Write-Host ""
Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
git add .
$status = git status --short
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "[OK] Nada novo para commitar (tudo já está commitado)." -ForegroundColor Green
} else {
    Write-Host "Arquivos que serao commitados:" -ForegroundColor Gray
    git status --short
    Write-Host ""
    git commit -m "feat: projeto inicial Nexus Med - React, .NET, documentação e deploy Vercel"
    Write-Host "[OK] Primeiro commit criado." -ForegroundColor Green
}

# Garantir branch main
git branch -M main 2>$null

# Remote
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host ""
    Write-Host "Cole a URL do seu repositório (GitHub/GitLab/Bitbucket):" -ForegroundColor Yellow
    Write-Host "Exemplo: https://github.com/seu-usuario/nexus-med.git" -ForegroundColor Gray
    $remoteUrl = Read-Host "URL"
    if ($remoteUrl) {
        git remote add origin $remoteUrl.Trim()
        Write-Host "[OK] Remote 'origin' configurado." -ForegroundColor Green
    }
} else {
    Write-Host "[OK] Remote já configurado: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Enviando para o remoto (git push -u origin main)..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host ""
    Write-Host "[OK] Repositório enviado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Se pedir usuário/senha:" -ForegroundColor Yellow
    Write-Host "  - GitHub: use um Personal Access Token em vez da senha." -ForegroundColor Gray
    Write-Host "    Criar em: GitHub -> Settings -> Developer settings -> Personal access tokens" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Tente manualmente:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "Documentação completa: docs\GIT_SETUP.md" -ForegroundColor Cyan
