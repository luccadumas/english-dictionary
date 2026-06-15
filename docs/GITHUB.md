# GitHub — publish the monorepo

Step-by-step to version the project and push it to GitHub.

**Repository:** https://github.com/luccadumas/english-dictionary

## 1. Prerequisites

- [Git](https://git-scm.com/downloads) installed
- GitHub account
- Project running locally (`npm run test:all` passing)
- Node.js **22+**

## 2. Create the remote repository

1. Open [github.com/new](https://github.com/new)
2. Repository name: e.g. `english-dictionary`
3. Visibility: **Public** (required for free Railway/Vercel Git integration)
4. **Do not** initialize with README, `.gitignore`, or license (the project already has them)
5. Click **Create repository**

## 3. Initialize Git locally (first time only)

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
- `.vercel/`, `.railway/` (local CLI state)

**Must be committed:**

- `backend/package-lock.json`
- `frontend/package-lock.json`
- `backend/prisma/migrations/`
- `Dockerfile`, `railway.toml`, `docker-compose.yml`
- `frontend/vercel.json`
- `.github/workflows/ci.yml`

## 5. Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(api): add endpoint for user favorites
fix(deploy): correct Railway Dockerfile context
chore(docs): update deploy instructions
```

```bash
git add .
git commit -m "feat: initial commit"
```

## 6. Connect remote and push

```bash
git remote add origin https://github.com/your-user/english-dictionary.git
git push -u origin main
```

## 7. Daily workflow

```bash
git checkout -b feature/my-change
# ... edit files ...
git add .
git commit -m "feat(web): add profile modal"
git push origin feature/my-change    # open PR on GitHub
```

## 8. Enable CI

After the first push, open **Actions** on GitHub. The workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on `main` and `develop`:

- **backend:** lint, unit, E2E, build (Node 22)
- **frontend:** lint, unit, build (Node 22)
- **docker:** image build on `main`

## 9. Branch protection (recommended)

GitHub → **Settings → Branches → Add rule**:

- Branch name: `main`
- Require status checks: `backend`, `frontend`
- Require pull request before merging (optional)

## 10. Deploy

After pushing to GitHub:

| Service | Platform | Trigger |
|---------|----------|---------|
| API | Railway | Git push → `dictionary-api` service |
| Frontend | Vercel | Git push → `frontend/` root directory |

See the **Deploy** section in the root [README.md](../README.md) for full setup (variables, CORS, import words).

### Quick reference

**Railway (API)**

- Root `Dockerfile` + `railway.toml`
- Plugins: Postgres, Redis
- `CORS_ORIGIN` = Vercel URL

**Vercel (frontend)**

- Root Directory: `frontend`
- `NEXT_PUBLIC_API_URL` = Railway API URL
