# Contributing to Project Equity

Thank you for your interest in contributing to Project Equity! This document provides guidelines for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding New Chapters](#adding-new-chapters)
- [Adding Assets](#adding-assets)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/project-equity.git
   cd project-equity
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Verify everything works**
   - Open http://localhost:5173
   - Play through Chapter 1 to ensure assets load correctly

---

## Development Workflow

### Branch Naming

- `feature/chapter-N` - New chapter development
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates

### Commit Messages

Follow conventional commits format:

```
type(scope): brief description

Detailed description if needed
```

**Types:**

- `feat`: New feature (chapter, game mechanic)
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(chapter5): add chapter 5 with new characters
fix(audio): resolve BGM looping issue
docs(readme): update installation instructions
```

---

## Adding New Chapters

### Complete Workflow

1. **Plan Chapter**

   - Copy `source-materials/chapters/text/templates/chapter_template.txt`
   - Fill in chapter details and asset requirements

2. **Write Source Text**

   - Create `source-materials/chapters/text/chapterN.txt`
   - Follow character voice guidelines

3. **Prepare Assets**

   - Add backgrounds to `src/assets/images/backgrounds/`
   - Add character sprites to `src/assets/images/characters/`
   - Add audio to `src/assets/audio/bgm/` and `src/assets/audio/se/`
   - **Update `CREDITS.md` with all new external assets**

4. **Create Chapter JSON**

   - Create `src/data/chapters/chapterN.json`
   - Follow schema in `src/engine/types.ts`
   - Reference: `docs/CHAPTER_AUTHORING_GUIDE.md`

5. **Generate Asset Types**

   ```bash
   npm run generate-assets
   ```

6. **Test**

   ```bash
   npm run dev
   # Play through entire chapter
   ```

7. **Validate**
   ```bash
   npm run build
   npm run lint
   ```

---

## Adding Assets

### Image Assets

1. **Optimize images** (see `docs/ASSET_GUIDELINES.md`)
2. **Use correct naming convention**
   - Backgrounds: `bg_{location}_{variant}.png`
   - Characters: `{character}_{expression}.png`
3. **Place in correct directory**
4. **Run** `npm run generate-assets`

### Audio Assets

1. **Format**: MP3 only
2. **Optimize** (see `docs/ASSET_GUIDELINES.md`)
3. **Add to correct directory** (`bgm/` or `se/`)
4. **Update `CREDITS.md`** - THIS IS MANDATORY
   - Source URL
   - Author/Creator
   - License type
   - Attribution requirements
5. **Run** `npm run generate-assets`

### Attribution Requirements

**Critical**: All third-party assets MUST be documented in `CREDITS.md` before committing.

Missing attribution will result in PR rejection.

---

## Code Style

### TypeScript

- Use TypeScript for all new code
- Follow existing patterns in `src/engine/` and `src/components/`
- Run `npm run lint` before committing

### React Components

- Functional components with hooks
- Use TypeScript interfaces for props
- Follow existing component structure

### JSON Data

- Use 2-space indentation
- Follow chapter schema strictly
- Validate with `npm run build`

---

## Pull Request Process

### Before Creating PR

1. **Ensure all tests pass**

   ```bash
   npm run build
   npm run lint
   ```

2. **Test changes locally**

   - Play through your chapter/changes
   - Check for errors in browser console

3. **Update documentation**
   - Update README if adding features
   - Update CREDITS.md for new assets
   - Update CHANGELOG.md

### Creating PR

1. **Create from feature branch**

   ```bash
   git checkout -b feature/chapter-5
   # Make changes
   git add .
   git commit -m "feat(chapter5): add chapter 5"
   git push origin feature/chapter-5
   ```

2. **PR Title Format**

   ```
   [Type] Brief description

   Example: [Feature] Add Chapter 5
   Example: [Fix] Resolve audio looping bug
   ```

3. **PR Description Should Include**
   - Summary of changes
   - New features/fixes
   - Testing performed
   - Screenshots (if UI changes)
   - Related issues (if any)

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run build`, `npm run lint`)
- [ ] New assets documented in CREDITS.md
- [ ] Documentation updated if needed
- [ ] Commits follow conventional commits format
- [ ] Changes tested in development environment

---

## Questions or Issues?

- Review documentation in `docs/`
- Check existing issues on GitHub
- Create a new issue if needed

---

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what's best for the project
- Credit others appropriately

---

Thank you for contributing to Project Equity!
