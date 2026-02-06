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

# Remote (evitar erro quando origin ainda não existe)
$defaultRepoUrl = "https://github.com/Cainz11/Next-Med.git"
$previousErrorAction = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$remoteUrl = (git remote get-url origin 2>$null)
$ErrorActionPreference = $previousErrorAction
if (-not $remoteUrl -or ($remoteUrl -match "error:")) {
    Write-Host ""
    Write-Host "Repositório remoto não configurado. Usar padrão Next-Med? (S/N)" -ForegroundColor Yellow
    Write-Host "  $defaultRepoUrl" -ForegroundColor Gray
    $usarPadrao = Read-Host "Pressione Enter para Sim, ou N para digitar outra URL"
    if ($usarPadrao -eq "" -or $usarPadrao -eq "S" -or $usarPadrao -eq "s") {
        $remoteUrl = $defaultRepoUrl
        git remote add origin $remoteUrl
        Write-Host "[OK] Remote 'origin' configurado: $remoteUrl" -ForegroundColor Green
    } else {
        Write-Host "Cole a URL do repositório (ex: https://github.com/usuario/repo.git):" -ForegroundColor Yellow
        $remoteUrl = Read-Host "URL"
        if ($remoteUrl) {
            git remote add origin $remoteUrl.Trim()
            Write-Host "[OK] Remote 'origin' configurado." -ForegroundColor Green
            $remoteUrl = $remoteUrl.Trim()
        }
    }
} else {
    Write-Host "[OK] Remote já configurado: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
if (-not $remoteUrl) {
    Write-Host "Nenhum remote configurado. Para adicionar e enviar depois, use:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/Cainz11/Next-Med.git" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Documentação: docs\GIT_SETUP.md" -ForegroundColor Cyan
    exit 0
}

Write-Host "Enviando para o remoto (git push -u origin main)..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host ""
    Write-Host "[OK] Repositório enviado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "Se pedir usuário/senha:" -ForegroundColor Yellow
    Write-Host "  Username: Cainz11" -ForegroundColor Gray
    Write-Host "  Password: cole seu Personal Access Token (não a senha da conta)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para não digitar o token toda vez (só no seu PC, NUNCA commite o token):" -ForegroundColor Yellow
    Write-Host "  git remote set-url origin https://Cainz11:SEU_TOKEN_AQUI@github.com/Cainz11/Next-Med.git" -ForegroundColor Gray
    Write-Host "  Depois: git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Tente manualmente:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "Documentação completa: docs\GIT_SETUP.md" -ForegroundColor Cyan
