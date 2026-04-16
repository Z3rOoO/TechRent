# copilot-instructions for TechRent

Purpose
- Help AI coding agents become productive quickly in this repo (backend Node/Express + frontend Next.js + MySQL).

Big picture (what matters)
- Backend: `backend/server.js` is the Express entrypoint. Routes live in `backend/routes/*` and handlers in `backend/controllers/*`. Routes are mounted by prefix (e.g. `/auth`, `/dashboard`).
- Database: MySQL schema and views are in `bd/schema.sql` and `bd/views.sql`. The app expects a database named `techrent_db` by default (see README).
- DB access: `backend/config/database.js` provides a mysql2 pool and helper functions (`Read`, `Create`, `Update`, `Delete`). Importing this file runs `testConnection()` — be cautious when modifying startup behavior.
- Auth: JWT-based. Middleware in `backend/middlewares/auth.js` exposes `autenticar` and `autorizar(...niveis)`. Tokens expected in header `Authorization: Bearer <token>`.

How to run (use exact commands)
- Backend (dev):
  - cd backend
  - npm install
  - npm run dev  # uses nodemon (server entry: backend/server.js)
- Backend (prod): `npm start` in `backend`
- Frontend (dev):
  - cd frontend
  - npm install
  - npm run dev  # Next.js App Router in `frontend/src/app`
- Database (local): import `bd/schema.sql` then `bd/views.sql` (see README for example `SOURCE` commands).

Key env variables (set in `.env` at repo root or backend/.env)
- `PORT` — backend port (default 3001)
- `JWT_SECRET` — required for token signing/verification
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — used by `backend/config/database.js`

> Note: `backend/config/database.js` uses `mysql2/promise` and will attempt a test connection at import time.

Project-specific patterns and conventions
- Responses use Portuguese keys/messages (e.g., `{ mensagem: '...' }`) — keep language consistent when adding endpoints.
- Authorization pattern: protect routes with `autenticar` then `autorizar('admin')` as needed. Example route usage: in a router file

  router.get('/relatorio', autenticar, autorizar('admin'), dashboardController.relatorio);

- Controllers export functions named for actions (e.g., `login`, `registro`, `listaEquipamentos`). Routes call controller methods directly.
- DB helpers in `backend/config/database.js` use string-based `where` clauses (e.g., `Read('equipamentos', "status = 'disponivel'")`). Use parameterized queries carefully if you refactor.

Integration points and dependencies to watch
- `backend` depends on `mysql2`, `jsonwebtoken`, `bcrypt` / `bcryptjs`, `dotenv` and `express` (see `backend/package.json`).
- `frontend` depends on Next.js 16+ and React 19 (see `frontend/package.json`). The frontend expects the API under the appropriate host/port — add `cors` in `server.js` if serving cross-origin during local dev.

Examples to reference when modifying code
- Entry + route mounting: `backend/server.js`
- Auth middleware: `backend/middlewares/auth.js` (shows token format and `autorizar` usage)
- DB helpers and connection pool: `backend/config/database.js` (shows env vars and helper APIs)

What NOT to change without coordination
- Don’t remove the connection test side-effect in `backend/config/database.js` unless you update startup expectations.
- Keep JWT format and `Authorization` header handling consistent across endpoints.

Next actions for reviewers
- If you want, I can extend this with examples of controller-to-DB usage by scanning `backend/controllers/*` and adding call-site snippets.

If anything here is unclear or you want additional examples (controller snippets, common responses, or frontend API calls), tell me which area to expand.
