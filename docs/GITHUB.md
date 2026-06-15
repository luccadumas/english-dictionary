# GitHub — publish the monorepo

Step-by-step to version the project and push it to GitHub.

## 1. Prerequisites

- [Git](https://git-scm.com/downloads) installed
- GitHub account
- Project running locally (`npm run test:all` passing)

## 2. Create the remote repository

1. Open [github.com/new](https://github.com/new)
2. Repository name: e.g. `english-dictionary`
3. Visibility: **Public** (required for free Railway/Vercel Git integration)
4. **Do not** initialize with README, `.gitignore`, or license (the project already has them)
5. Click **Create repository**

Copy the remote URL, e.g. `https://github.com/your-user/english-dictionary.git`

## 3. Initialize Git locally (first time only)

From the project root:

```bash
git init
git branch -M main
```

## 4. Review what will be committed

```bash
git status
```

**Must NOT appear in the commit:**

- `.env`, `.env.local`, `backend/.env`, `frontend/.env.local`
- `node_modules/`
- `.next/`, `dist/`, `coverage/`

These are already listed in `.gitignore`.

**Must be committed:**

- `backend/package-lock.json`
- `frontend/package-lock.json`
- `backend/prisma/migrations/`
- `railway.toml`, Dockerfiles, CI workflow

## 5. First commit

```bash
git add .
git commit -m "Initial commit: English Dictionary monorepo"
```

## 6. Connect remote and push

```bash
git remote add origin https://github.com/your-user/english-dictionary.git
git push -u origin main
```

If GitHub asks for authentication, use a [Personal Access Token](https://github.com/settings/tokens) (classic, `repo` scope) instead of a password.

## 7. Daily workflow

```bash
git checkout -b feature/my-change    # optional branch
# ... edit files ...
git add .
git commit -m "Describe the change"
git push origin feature/my-change    # open PR on GitHub
# or push directly to main:
git push origin main
```

## 8. Enable CI

After the first push, open **Actions** on GitHub. The workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs automatically on `main` and `develop`:

- Backend: lint, unit, E2E, build
- Frontend: lint, unit, build
- Docker: image build on `main`

## 9. Branch protection (recommended)

GitHub → **Settings → Branches → Add rule**:

- Branch name: `main`
- Require status checks: `backend`, `frontend`
- Require pull request before merging (optional)

## 10. Deploy (optional)

After pushing to GitHub, see the **Deploy** section in the root [README.md](../README.md) for Railway (API) and Vercel (frontend).
