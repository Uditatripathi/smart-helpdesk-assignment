# Smart Helpdesk with Agentic Triage (MERN, Stubbed Agent)

This is a minimal implementation of the assignment. It includes:
- JWT Auth & Roles (admin/agent/user)
- KB CRUD (admin)
- Ticket creation/list/detail
- Agent triage stub (classify → retrieve KB → draft → decide)
- Audit logs
- Config (autoClose + threshold)
- Docker Compose for API, Mongo, Client
- Seed script

## Quickstart (Docker)

```bash
docker compose up --build -d
# API on http://localhost:8080, Client on http://localhost:5173
# Seed (in another shell):
docker compose exec api npm run seed
```

Login with:
- admin@example.com / password123 (admin)
- agent@example.com / password123 (agent)
- user@example.com / password123 (user)

## Local Dev

```bash
# API
cd api
cp .env.example .env
npm install
npm run dev

# Client
cd ../client
npm install
npm run dev
```

Set `VITE_API_URL` env for client if the API is not at http://localhost:8080.

## Notes
- Agent is deterministic (no external LLM) and logs audit trail.
- Text index on articles for search; regex fallback.
- Health endpoints: `/healthz`, `/readyz`.
```

