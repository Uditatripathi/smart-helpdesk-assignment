
# 🧑‍💻 Smart Helpdesk Assignment

This is my submission for the **Wexa AI Fresher Assignment**.  
The project is a **Helpdesk Ticketing System** with AI-assisted triage, built using the **MERN stack**.

---

## 🚀 Features Implemented
- 🔑 **Authentication & Roles** → Admin, Agent, User (JWT-based login/register)
- 📚 **Knowledge Base (KB)** → Create, search, and manage KB articles
- 🎫 **Ticketing System** → Users can create tickets; tickets are classified & routed
- 🤖 **Agentic Triage (stub)** → Draft replies, classify tickets, fetch KB, auto-close based on confidence
- ✅ **Audit Timeline** → Every action (create, classify, resolve) is logged
- ⚙️ **Admin Settings** → Toggle auto-close, change confidence threshold
- 📦 **Dockerized setup** → Run full stack (Mongo + API + Client) with one command
- 🌱 **Seed Data** → Preloaded admin, agent, user accounts + KB articles + sample tickets

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React (Vite), React Router
- **Containerization**: Docker + Docker Compose

---

## 🔑 Seeded Accounts
- Admin → `admin@example.com / password123`
- Agent → `agent@example.com / password123`
- User → `user@example.com / password123`

---

## ⚡ How to Run

### Option 1: With Docker (recommended)
```bash
# From project root
docker compose up --build -d

# Seed initial data
docker compose exec api npm run seed
````

* API → [http://localhost:8080](http://localhost:8080)
* Client → [http://localhost:5173](http://localhost:5173)

---

### Option 2: Manual (without Docker)

1. **Start MongoDB** locally or via Docker.
2. Run Backend:

   ```bash
   cd api
   cp .env.example .env
   npm install
   npm run dev
   ```
3. Run Frontend:

   ```bash
   cd ../client
   npm install
   npm run dev
   ```
4. Open → [http://localhost:5173](http://localhost:5173)

---

## 📝 Demo Flow

1. Login as **Admin** → Add KB article.
2. Login as **User** → Create a ticket.
3. System **classifies ticket & drafts reply**.
4. If confidence high → Auto-closed.
5. If not → **Agent** reviews & resolves.
6. **Audit log** shows full lifecycle.

---

👩‍💻 **Submitted by:** Udita Tripathi
📧 Email: [uditatripathi123@gmail.com](mailto:uditatripathi123@gmail.com)



