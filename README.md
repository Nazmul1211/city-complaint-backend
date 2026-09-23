# City Complaint & Service Platform — Backend API

A production-grade REST API for municipal complaint and service-request management. Citizens report civic issues, the platform routes each request to the responsible city department via SLA-driven workflows, staff resolve them, and administrators oversee the entire operation.

**Assignment track:** City Complaint & Service Platform (B7A6 Backend Assignment)

---

## Tech Stack

| Category | Technology |
|---|---|
| Runtime & Framework | Node.js, TypeScript, Express.js 5 |
| Database & ORM | PostgreSQL 15+, Prisma ORM 7 (driver adapter `@prisma/adapter-pg`) |
| Validation | Zod 4 |
| Authentication | JWT (access + refresh tokens), Google & GitHub social login, bcrypt password hashing |
| Caching & State | Redis (OTP storage, registration buffer) |
| Email | Nodemailer with EJS HTML templates (SMTP) |
| File Storage | Multer (uploads) + Cloudinary (image hosting) |
| Security | Helmet security headers, express-rate-limit, CORS |
| Code Quality | Biome (lint + format), strict TypeScript |
| Deployment | Vercel (Serverless Functions) |

---

## Roles

The platform enforces 4 roles through strict role-based middleware on every protected route.

| Role | Capabilities |
|---|---|
| **CITIZEN** | Registers (email OTP verification or Google/GitHub), submits service requests, tracks them, adds feedback |
| **STAFF** | Department member; works on requests of their departments only — updates status, adds work updates, uploads attachments |
| **ADMIN** | Full management — departments, members, categories, SLA policies, wards, assignments, user management, audit logs |
| **SUPER_ADMIN** | Everything ADMIN can do (reserved for platform owner) |

Authorization is enforced in two layers: route-level role checks (`auth(...roles)`) plus in-service ownership scoping (a citizen can only read their own requests; staff only see requests in their active departments).

---

## Features

**Authentication & Account**
- Citizen registration with Redis-backed email OTP verification (5-minute expiry)
- Login with JWT access + refresh tokens, delivered via httpOnly cookies and Bearer header
- Google login (ID token verification via google-auth-library) and GitHub login
- Forgot/reset password with OTP flow and email notifications
- Profile management: view/update profile, Cloudinary profile image upload (old image auto-deleted)
- Self soft-delete and admin user management with search, filters, and pagination

**Service Request Lifecycle**
- SLA-aware request creation: response/resolution due dates computed from the category's SLA policy
- Auto-generated human-readable request numbers (`REQ-2026-00001`)
- Strict state machine for status transitions (SUBMITTED → UNDER_REVIEW → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED, with REOPENED/REJECTED/PENDING branches); invalid transitions are rejected with explicit errors
- Automatic timestamp tracking (`firstRespondedAt`, `resolvedAt`, `closedAt`)
- Department routing with full routing history
- Staff assignment with single-active-assignment invariant (release before reassign), all inside database transactions to prevent race conditions
- Unified request timeline merging submission, routing, status, and assignment events
- Work updates and media attachments per request

**Feedback & Notifications**
- Citizens submit one feedback per request, only after the request reaches a terminal state (RESOLVED or CLOSED)
- Event-driven notifications: request created, assigned, status changed, work update added, payment required/successful — failure-tolerant (a notification error never breaks the main flow)
- Mark one / mark all as read, paginated notification list

**Data & Platform Quality**
- Soft deletes for users, departments, categories, and service requests
- Audit logging of critical actions (see below), committed in the same transaction as the action
- Consistent response envelope on every endpoint: `{ success, statusCode, message, data, meta? }` / `{ success, message, errors: [] }`
- Pagination (`?page=&limit=`), filtering (`?status=&priority=&wardId=&departmentId=...`), sorting (`?sortBy=&sortOrder=`), and search (`?searchTerm=`) on list APIs
- Database indexes on all foreign keys and frequently filtered columns; composite index on `[status, priority]`
- Request validation via Zod on body, params, and query, with structured error details

**Security**
- Helmet security headers on every response
- Rate limiting: 10 requests / 10 min on auth routes (blocks credential stuffing and OTP brute force), 300 requests / 10 min on all API routes
- CORS restricted to the configured frontend origin with credentials
- Passwords hashed with bcrypt; secrets never exposed; all non-public routes protected
- Account status checks on every authenticated request (deleted, suspended, and unverified accounts are rejected)

**Audit Logs**
- Append-only trail recording who did what and when: status changes, assignments and releases, user deletions (self and admin), department/category/ward deletions
- Stores actor, entity type/ID, before/after snapshots, IP address, and user agent
- Written inside the same database transaction as the action, so the trail can never diverge from real data

---

## API Overview

Base URL: `/api/v1`

### Auth — `/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register citizen (sends OTP email) |
| POST | `/auth/verify-email` | Public | Verify OTP, create account, auto-login |
| POST | `/auth/login` | Public | Email/password login |
| POST | `/auth/google-login` | Public | Google ID token login |
| POST | `/auth/github-login` | Public | GitHub login |
| POST | `/auth/refresh-token` | Public | Rotate access + refresh tokens |
| POST | `/auth/logout` | Public | Clear auth cookies |
| POST | `/auth/forgot-password` | Public | Send password reset OTP |
| POST | `/auth/reset-password` | Public | Reset password with OTP |

### Users & Profile — `/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/me` | Any authenticated | My profile |
| PATCH | `/users/me` | Any authenticated | Update my profile |
| PATCH | `/users/profile-image` | Any authenticated | Upload profile image (form-data `profileImage`) |
| DELETE | `/users/me` | Any authenticated | Soft-delete my account |
| GET | `/users` | ADMIN, SUPER_ADMIN | List users — filters: `role`, `status`, `departmentId`, `searchTerm`, pagination & sorting |
| DELETE | `/users/:id` | ADMIN, SUPER_ADMIN | Soft-delete a user |

### Service Requests — `/requests`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/requests` | CITIZEN | Create request (SLA due dates computed automatically) |
| GET | `/requests/my` | CITIZEN | My requests, paginated |
| GET | `/requests` | ADMIN, SUPER_ADMIN, STAFF | All requests — filters: `status`, `priority`, `categoryId`, `departmentId`, `wardId`, `searchTerm`, pagination & sorting (staff scoped to their departments) |
| GET | `/requests/:id` | Role-scoped | Single request (citizens: own only; staff: own departments) |
| GET | `/requests/:id/timeline` | Role-scoped | Unified event timeline |

### Request Sub-resources

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/requests/:id/routes` | ADMIN, SUPER_ADMIN, STAFF | Route request to a department |
| GET | `/requests/:id/routes` | ADMIN, SUPER_ADMIN, STAFF | Routing history |
| PATCH | `/requests/:id/routes/:routeId/end` | ADMIN, SUPER_ADMIN | End an active route |
| POST | `/requests/:id/assignments` | ADMIN, SUPER_ADMIN, STAFF | Assign staff member (transaction + status change) |
| GET | `/requests/:id/assignments` | Role-scoped | Assignment history, paginated |
| PATCH | `/requests/:id/assignments/:assignmentId/release` | ADMIN, SUPER_ADMIN, STAFF | Release assignment (reverts status when none remain) |
| PATCH | `/requests/:id/status` | ADMIN, SUPER_ADMIN, STAFF | Change status (state-machine validated) |
| GET | `/requests/:id/status/history` | Role-scoped | Status history, paginated |
| POST | `/requests/:id/updates` | ADMIN, SUPER_ADMIN, STAFF | Add work update |
| GET | `/requests/:id/updates` | Role-scoped | List work updates |
| POST | `/requests/:id/attachments` | Role-scoped | Upload media attachment (form-data `file`, Cloudinary) |
| GET | `/requests/:id/attachments` | Role-scoped | List attachments |
| DELETE | `/requests/:id/attachments/:attachmentId` | Role-scoped | Delete attachment |
| POST | `/requests/:id/feedback` | CITIZEN | Submit feedback (terminal state, one per request) |
| GET | `/requests/:id/feedback` | Role-scoped | Get request feedback |

### Departments — `/departments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/departments` | ADMIN, SUPER_ADMIN | Create department |
| GET | `/departments` | Public | List departments |
| GET | `/departments/:id` | Public | Department details |
| PATCH | `/departments/:id` | ADMIN, SUPER_ADMIN | Update department |
| DELETE | `/departments/:id` | ADMIN, SUPER_ADMIN | Soft-delete department (audited) |
| POST | `/departments/:id/members` | ADMIN, SUPER_ADMIN | Add staff member to department |
| GET | `/departments/:id/members` | Any authenticated | List members |
| PATCH | `/departments/:id/members/:memberId` | ADMIN, SUPER_ADMIN | Update member position/status |
| DELETE | `/departments/:id/members/:memberId` | ADMIN, SUPER_ADMIN | Remove member |

### Categories & SLA — `/categories`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories` | Any authenticated | List categories (`?departmentId=`) |
| GET | `/categories/:id` | Any authenticated | Category details |
| POST | `/categories` | ADMIN, SUPER_ADMIN | Create category |
| PATCH | `/categories/:id` | ADMIN, SUPER_ADMIN | Update category |
| DELETE | `/categories/:id` | ADMIN, SUPER_ADMIN | Soft-delete category (audited) |
| GET | `/categories/:categoryId/sla` | Any authenticated | Get SLA policy |
| POST | `/categories/:categoryId/sla` | ADMIN, SUPER_ADMIN | Create SLA policy |
| PATCH | `/categories/:categoryId/sla` | ADMIN, SUPER_ADMIN | Update SLA policy |

### Wards — `/wards`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/wards` | Any authenticated | List wards (`?city=&isActive=`) |
| GET | `/wards/:id` | Any authenticated | Ward details |
| POST | `/wards` | ADMIN, SUPER_ADMIN | Create ward |
| PATCH | `/wards/:id` | ADMIN, SUPER_ADMIN | Update ward |
| DELETE | `/wards/:id` | ADMIN, SUPER_ADMIN | Delete ward (audited) |

### Notifications — `/notifications`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/notifications` | Any authenticated | My notifications, paginated (`?isRead=&type=`) |
| PATCH | `/notifications/read-all` | Any authenticated | Mark all as read |
| PATCH | `/notifications/:id/read` | Any authenticated | Mark one as read |

### Audit Logs — `/audit-logs`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/audit-logs` | ADMIN, SUPER_ADMIN | Audit trail — filters: `action`, `entityType`, `entityId`, `actorId`, pagination & sorting |
| GET | `/audit-logs/actions` | ADMIN, SUPER_ADMIN | Distinct logged action verbs |

### Health

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Service welcome / health check |

---

## Response Format

Every endpoint returns the standardized envelope.

Success:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request created successfully",
  "data": { "...": "..." },
  "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

Error:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "You have provided incorrect field type or missing fields",
  "errors": [{ "path": "title", "message": "Title is required" }]
}
```

In development, error responses include the error name, full error object, and stack trace. In production they are reduced to a generic message with an empty `errors` array.

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis
- SMTP credentials for email
- Cloudinary account (for image uploads)

### Installation

1. Clone and install:

```bash
git clone https://github.com/Nazmul1211/city-complaint-backend.git
cd city-complaint-backend
npm install
```

2. Configure environment — copy `.env.example` to `.env` and fill in the variables:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/city_complaint"

FRONTEND_URL="http://localhost:3000"
BCRYPT_SALT_ROUND=12

# Seeded accounts (created automatically on first boot)
SUPER_ADMIN_NAME="Super Admin"
SUPER_ADMIN_EMAIL="superadmin@citycare.com"
SUPER_ADMIN_PASSWORD="superAdminPassword"
TESTER_ADMIN_NAME="Test Admin"
TESTER_ADMIN_EMAIL="admin@citycare.com"
TESTER_ADMIN_PASSWORD="adminPassword"
TESTER_CITIZEN_NAME="Test Citizen"
TESTER_CITIZEN_EMAIL="citizen@citycare.com"
TESTER_CITIZEN_PASSWORD="citizenPassword"

JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

REDIS_USER="default"
REDIS_PASSWORD="your-redis-password"
REDIS_HOST="your-redis-host"
REDIS_PORT=6379

SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
EMAIL_SENDER="CityCare <no-reply@citycare.com>"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

3. Apply migrations and start:

```bash
npx prisma migrate deploy
npm run dev
```

The server seeds the super admin, tester admin, tester citizen, and demo data (departments, staff, categories, SLA policies, wards) on startup, then listens on `PORT`.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start in watch mode with tsx |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled build |
| `npm run format:check` / `format:fix` | Biome formatting |
| `npm run lint:check` / `lint:fix` | Biome linting |

---

## Database

17 Prisma models organized across modular schema files in `prisma/schema/`:

**User** (with Citizen profile), **Department**, **DepartmentMember**, **Category**, **SlaPolicy**, **Ward**, **ServiceRequest**, **ReportedLocation**, **RequestDepartmentRoute**, **RequestAssignment**, **RequestStatusHistory**, **WorkUpdate**, **MediaAttachment**, **Feedback**, **Notification**, **AuditLog**.

Key design points:

- Soft deletes (`isDeleted`/`deletedAt`) on users, departments, categories, and service requests — all queries scope out deleted rows
- Proper relations with cascading rules, unique constraints (`requestNo`, per-department category names), and indexes on every foreign key plus filter/sort columns
- Transactions guard multi-step operations (request creation, assignment + status change, release + status revert) against race conditions
- Ten migrations track the schema evolution from initial user model to audit logs

---

## Project Structure

```
src/
├── app.ts                        # Express app: helmet, CORS, rate limiters, routes, error handling
├── server.ts                     # DB/Redis/SMTP connection checks, seeding, listen
├── app/
│   ├── config/                   # Environment configuration
│   ├── lib/                      # prisma, redis, cloudinary, multer, nodemailer, googleAuth clients
│   ├── middlewares/              # auth (JWT + roles), validateRequest (Zod), globalErrorHandler, notFound
│   ├── templates/                # EJS email templates
│   └── module/                   # One folder per domain: route → controller → service → validation → interface
│       ├── auth/
│       ├── users/
│       ├── department/
│       ├── category/             # Includes SLA policy handlers
│       ├── ward/
│       ├── service-request/      # Core resource; mounts all request sub-routers
│       ├── request-routing/
│       ├── request-assignment/
│       ├── request-status/
│       ├── work-update/
│       ├── media-attachment/
│       ├── feedback/
│       ├── notification/
│       └── audit-log/
└── utils/                        # catchAsync, sendResponse, jwt, seed
prisma/
├── schema/                       # Modular schema files per domain
└── migrations/                   # SQL migrations
```

---

## Deployment

Deployed on Vercel (Serverless Functions). Notes:

- `prisma.config.ts` reads `DATABASE_URL` via `process.env` so `prisma generate` in the `postinstall` hook succeeds on Vercel where the variable is not present at build time
- The generated Prisma client (`generated/prisma`) is git-ignored and regenerated by `postinstall` on every install
- All environment variables above must be configured in the Vercel project settings
- Redis and SMTP must be reachable from the serverless environment

---

## API Documentation

A complete Postman collection covering all endpoints, request bodies, and role-based flows is provided with the project submission.

---

## Roadmap

- **Payment integration** (bKash/Stripe/SSLCommerz): the schema is already prepared — `Category.paymentRequired`, `Category.defaultFeeAmount`, and `PAYMENT_REQUIRED`/`PAYMENT_SUCCESSFUL` notification types — pending the payment gateway module
