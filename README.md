# Student Portal — Three-Tier Application

A production-style three-tier sample app:

- **Presentation tier:** React 19 + TypeScript + Vite (TanStack Query, React Hook Form, React Router 7)
- **Application tier:** Spring Boot 3.4 on Java 21 (Spring Web, Spring Data JPA, Bean Validation, Actuator, OpenAPI 3 / Swagger UI)
- **Data tier:** MySQL 8 with schema managed by Flyway

Implements CRUD for a single `Student` resource and is intentionally minimal so the
patterns (DTOs, RFC 7807 errors, pagination, validation, query caching, etc.) stay
front-and-center.

```
.
├── backend/      Spring Boot REST API
├── frontend/     React + Vite SPA
├── database/     One-time database / user creation script
└── README.md
```

## Prerequisites

| Tool      | Version (or later) |
|-----------|--------------------|
| JDK       | 21                 |
| Maven     | 3.9                |
| Node.js   | 20 LTS             |
| npm       | 10                 |
| MySQL     | 8.0                |

## 1. Database

Start MySQL, then run the bootstrap script once:

```bash
mysql -u root -p < database/01_create_database.sql
```

This creates the `student_portal` database and a `student_portal` user.
Flyway will create the `students` table the first time the API starts.

## 2. Backend (Spring Boot API)

```bash
cd backend
# Override defaults if needed (see application.yml):
#   DB_URL, DB_USERNAME, DB_PASSWORD, SERVER_PORT, CORS_ALLOWED_ORIGINS
mvn spring-boot:run
```

The API listens on **http://localhost:8080**.

| Endpoint                                | Description                  |
|-----------------------------------------|------------------------------|
| `GET    /api/v1/students?page=&size=&sort=&search=` | Paginated list / search |
| `GET    /api/v1/students/{id}`          | Get one                     |
| `POST   /api/v1/students`               | Create                       |
| `PUT    /api/v1/students/{id}`          | Update                       |
| `DELETE /api/v1/students/{id}`          | Delete                       |
| `GET    /actuator/health`               | Health probe                 |
| `GET    /swagger-ui.html`               | Interactive API docs         |

Errors follow **RFC 7807 `application/problem+json`** with a `timestamp` and
(for validation failures) a per-field `errors` map.

Run tests:

```bash
mvn test
```

## 3. Frontend (React SPA)

```bash
cd frontend
cp .env.example .env       # optional — defaults proxy to localhost:8080
npm install
npm run dev
```

The SPA serves on **http://localhost:5173** and proxies `/api/*` to the backend
via Vite's dev server, so no CORS configuration is required for local development.

Production build:

```bash
npm run build      # outputs frontend/dist
npm run preview    # serve the build locally
```

## Architecture notes

- **Layered backend** (`controller → service → repository`) with **DTOs** at the
  boundary so the JPA entity is never exposed to HTTP clients.
- **Optimistic locking** via `@Version` prevents lost updates on concurrent edits.
- **Auditing** (`createdAt` / `updatedAt`) is handled by Spring Data JPA, not by
  application code.
- **Flyway** owns the schema — JPA is set to `ddl-auto: validate` so it can never
  silently drift the database.
- **HikariCP** is the connection pool (Spring Boot default), tuned conservatively
  in `application.yml`.
- **Pagination & search** are first-class on the list endpoint; the frontend uses
  `placeholderData` so page transitions don't flash empty states.
- **TanStack Query** is the source of truth for server state on the client; React
  state holds only UI state (search input, pagination cursor, form values).
- **React Hook Form** handles form state with mirrored client/server validation
  rules; backend field errors are merged back into the form via `setError`.
- A central `ApiError` class normalises Problem-Details responses so UI code
  doesn't have to peek into Axios internals.

## Configuration

| Variable                | Default                                                          | Where      |
|-------------------------|------------------------------------------------------------------|------------|
| `DB_URL`                | `jdbc:mysql://localhost:3306/student_portal?...`                 | backend    |
| `DB_USERNAME`           | `root`                                                           | backend    |
| `DB_PASSWORD`           | `root`                                                           | backend    |
| `SERVER_PORT`           | `8080`                                                           | backend    |
| `CORS_ALLOWED_ORIGINS`  | `http://localhost:5173`                                          | backend    |
| `VITE_API_BASE_URL`     | `/api/v1`                                                        | frontend   |

For real environments, supply these through your secrets manager / environment —
never commit production credentials.
