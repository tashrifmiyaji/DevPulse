# DevPulse

Live: https://dev-pulse-snowy-eight.vercel.app/

A lightweight issue-tracking API and user management service built with TypeScript, Express and PostgreSQL. Designed for quick deployments (Vercel) and role-based workflows (contributor, maintainer).

**Features**
- **Issue tracking:** Create, read, update and delete issues.
- **Authentication:** Signup and login with JWT-based tokens.
- **Role-based access control:** `contributor` and `maintainer` roles with guarded routes.
- **PostgreSQL persistence:** Automatic table initialization on startup.
- **Structured responses & error handling:** Centralized response utility and global error middleware.

**Tech Stack**
- **Runtime:** Node.js + TypeScript
- **Server:** Express v5
- **Database:** PostgreSQL (`pg`)
- **Auth / Security:** `jsonwebtoken`, `bcryptjs`
- **Dev / Build:** `tsx`, `tsup`
- **Deployment:** Vercel

**Quick Setup**
Prerequisites: Node.js (recommended 18+), PostgreSQL

1. Clone the repository and install dependencies:

```
git clone <repo-url>
cd DevPulse
npm install
```

2. Create a `.env` file in the project root with the following variables:

```
PORT=3000
CONNECTION_STRING=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

3. Run in development:

```
npm run dev
```

4. Build for production and start:

```
npm run build
npm start
```

The server calls the database initializer (`initDb`) on startup which creates required tables if they do not exist.

**API Endpoints**
Base path: `/api`

- `GET /` — Health check (returns a simple JSON message)
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT tokens

- `POST /api/issues/` — Create an issue (requires authenticated role `contributor` or `maintainer`)
- `GET /api/issues/` — List all issues
- `GET /api/issues/:id` — Retrieve a single issue by ID
- `PATCH /api/issues/:id` — Update an issue (requires `contributor` or `maintainer`)
- `DELETE /api/issues/:id` — Delete an issue (requires `maintainer`)

**Database Schema (summary)**

- `users` table
	- `id` SERIAL PRIMARY KEY
	- `name` TEXT NOT NULL
	- `email` TEXT UNIQUE NOT NULL
	- `password` TEXT NOT NULL
	- `role` VARCHAR(20) NOT NULL DEFAULT 'contributor' (allowed: `contributor`, `maintainer`)
	- `created_at`, `updated_at` TIMESTAMP DEFAULT NOW()

- `issues` table
	- `id` SERIAL PRIMARY KEY
	- `reporter_id` INT UNIQUE REFERENCES `users(id)` ON DELETE CASCADE
	- `title` VARCHAR(150) NOT NULL
	- `description` TEXT NOT NULL
	- `type` VARCHAR(20) NOT NULL (allowed: `bug`, `feature_request`)
	- `status` VARCHAR(20) NOT NULL DEFAULT 'open' (allowed: `open`, `in_progress`, `resolved`)
	- `created_at`, `updated_at` TIMESTAMP DEFAULT NOW()

**Deployment**
- Deployed to Vercel: https://dev-pulse-snowy-eight.vercel.app/

**Notes**
- Environment variables are read from `.env` via `src/config/dotEnv.ts`.
- The app initializes DB tables automatically on startup (`src/db/index.ts`).

