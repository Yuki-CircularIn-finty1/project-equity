# GitHub Setup Instructions

## Quick Setup (Using Script)

### Step 1: Create Repository on GitHub

1. Go to https://github.com/Yuki-CircularIn-finty1
2. Click **"New repository"** (green button)
3. Repository name: `project-equity`
4. Description: `A browser-based sound novel game engine with multi-chapter storytelling`
5. Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (you already have one)
7. Click **"Create repository"**

### Step 2: Run the Setup Script

Open PowerShell in the project directory and run:

```powershell
cd e:\downloads_E\me_1125\sound-novel-game
.\setup-github.ps1
```

The script will:

- ✓ Check Git installation
- ✓ Initialize Git repository (if needed)
- ✓ Add all files
- ✓ Create initial commit
- ✓ Add remote origin
- ✓ Push to GitHub (with your confirmation)

Follow the prompts and confirm when asked!

---

## Manual Setup (Alternative)

If you prefer to run commands manually:

```powershell
# 1. Navigate to project
cd e:\downloads_E\me_1125\sound-novel-game

# 2. Initialize Git
git init

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "feat: initial commit - Project Equity with chapters 1-4"

# 5. Add remote
git remote add origin https://github.com/Yuki-CircularIn-finty1/project-equity.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### "Permission denied" or Authentication Error

You need to authenticate with GitHub. Use one of these methods:

**Option 1: GitHub CLI (Recommended)**

```powershell
# Install GitHub CLI from: https://cli.github.com/
gh auth login
```

**Option 2: Personal Access Token**

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Give it `repo` permissions
4. Use the token as your password when pushing

**Option 3: SSH Key**

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys
```

### "Repository not found"

Make sure you created the repository on GitHub first (Step 1 above).

### "fatal: not a git repository"

Make sure you're in the correct directory:

```powershell
cd e:\downloads_E\me_1125\sound-novel-game
```

---

## After Pushing to GitHub

### 1. Set Up GitHub Pages (Optional - for live demo)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** → **/ (root)**
5. Click **Save**

Your game will be live at:
`https://yuki-circularin-finty1.github.io/project-equity/`

### 2. Add Topics

On your repository page, click the ⚙️ gear icon next to "About" and add:

- `visual-novel`
- `sound-novel`
- `game-engine`
- `react`
- `typescript`
- `interactive-fiction`

### 3. Update README (Optional)

Add a badge to your README showing the project is live:

```markdown
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Chapters](https://img.shields.io/badge/chapters-4%2F8-blue)
```

---

## Next: Working on Chapter 5

Create a new branch for development:

```powershell
# Create and switch to feature branch
git checkout -b feature/chapter-5

# Make your changes (following docs/CHAPTER_AUTHORING_GUIDE.md)

# Commit changes
git add .
git commit -m "feat(chapter5): add chapter 5"

# Push feature branch
git push origin feature/chapter-5
```

Then create a Pull Request on GitHub to review before merging to main!

---

## Quick Reference

```powershell
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/chapter-X

# Push changes
git add .
git commit -m "your message"
git push

# Update from GitHub
git pull
```

---

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md)
