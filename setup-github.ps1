# Project Equity - GitHub Setup Script
# This script initializes Git and pushes to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Project Equity - GitHub Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if already a git repository
if (Test-Path ".git") {
    Write-Host "⚠ Git repository already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to continue? This will add and commit changes. (y/n)"
    if ($response -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit 0
    }
} else {
    # Initialize git repository
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Check git status
Write-Host "Checking repository status..." -ForegroundColor Yellow
git status --short

Write-Host ""

# Add all files
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files staged" -ForegroundColor Green

Write-Host ""

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
$commitExists = git log --oneline 2>$null
if ($commitExists) {
    git commit -m "chore: update project structure and documentation"
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    git commit -m "feat: initial commit - Project Equity with chapters 1-4

- Complete sound novel game engine with React + TypeScript
- Chapters 1-4 implemented and tested
- Comprehensive documentation for chapters 5-8
- Asset attribution in CREDITS.md
- Source materials organized in dedicated directory"
    Write-Host "✓ Initial commit created" -ForegroundColor Green
}

Write-Host ""

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "✓ Remote 'origin' already configured: $remoteExists" -ForegroundColor Green
} else {
    # Add remote
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    $remoteUrl = "https://github.com/Yuki-CircularIn-finty1/project-equity.git"
    git remote add origin $remoteUrl
    Write-Host "✓ Remote added: $remoteUrl" -ForegroundColor Green
}

Write-Host ""

# Ask before pushing
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ready to push to GitHub!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Make sure you have created the repository on GitHub first!" -ForegroundColor Yellow
Write-Host "Repository URL: https://github.com/Yuki-CircularIn-finty1/project-equity" -ForegroundColor Yellow
Write-Host ""
$pushResponse = Read-Host "Push to GitHub now? (y/n)"

if ($pushResponse -eq "y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    
    # Rename branch to main if needed
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        git branch -M main
        Write-Host "✓ Branch renamed to 'main'" -ForegroundColor Green
    }
    
    # Push to GitHub
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ SUCCESS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your repository is now on GitHub!" -ForegroundColor Green
        Write-Host "View at: https://github.com/Yuki-CircularIn-finty1/project-equity" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Set up GitHub Pages for live demo (Settings → Pages)" -ForegroundColor White
        Write-Host "2. Add repository topics (visual-novel, react, typescript)" -ForegroundColor White
        Write-Host "3. Start working on Chapter 5 using the templates!" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "✗ Push failed" -ForegroundColor Red
        Write-Host "Please make sure:" -ForegroundColor Yellow
        Write-Host "1. The repository exists on GitHub" -ForegroundColor White
        Write-Host "2. You have push access to the repository" -ForegroundColor White
        Write-Host "3. You're authenticated with GitHub (run 'git credential-manager')" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "Push cancelled. You can push later with:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "Script completed." -ForegroundColor Cyan
