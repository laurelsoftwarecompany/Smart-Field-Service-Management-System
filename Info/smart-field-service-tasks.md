# Smart Field Service Management System — Web & Backend Build Plan

**Role:** Web Developer + Backend
**Team:** Web Developer (me), Mobile Developer, AI/ML Developer

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB + Mongoose
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, shadcn/ui
- **Auth:** JWT + bcrypt, role-based middleware (customer/manager/technician/admin) — backend API + web login UI are mine; technician-facing login UI is Mobile Developer's
- **File storage:** AWS S3 (via Multer)
- **Real-time:** Socket.io (for live job status updates on dashboard)
- **Validation:** Zod
- **API docs:** Swagger

Schema and API contracts are being defined independently for now; AI/ML and Mobile devs will adapt their integrations to match once the backend is in place.

---

## Phase 0 — Setup
- [ ] Init repo, package.json, TypeScript config
- [ ] Set up Express project structure
- [ ] Connect MongoDB (Atlas or local)
- [ ] `.env` for secrets + `.env.example` in repo
- [ ] Health-check route, push initial commit

## Phase 1 — Auth
> Note: per spec, the Mobile Developer owns the technician-facing login/logout UI inside the technician app. Backend auth API (below) is still needed to support it, plus manager/admin login on the web dashboard.
- [ ] User schema (role: customer/manager/technician/admin)
- [ ] Signup/login API endpoints, JWT issuance
- [ ] Role-based middleware/guards
- [ ] Web login UI (Manager/Admin only — technician login UI is Mobile Developer's)
- [ ] Push

## Phase 2 — Core Schema
- [ ] Customer schema
- [ ] Technician schema
- [ ] ServiceRequest schema — include placeholder fields for AI output: `category`, `priority`, `aiConfidence`, `recommendedTechnicianId`, `summary`
- [ ] Job schema — status enum: Assigned / Accepted / On The Way / In Progress / Completed / Unable to Complete / Customer Unavailable / Requires Follow-up
- [ ] Assignment schema (or embedded in Job)
- [ ] Push

## Phase 3 — Customer Management
- [ ] CRUD: add/edit/search customer
- [ ] View customer service history endpoint
- [ ] View active service requests for a customer
- [ ] Push

## Phase 4 — Technician Management
- [ ] CRUD endpoints for technicians (admin/manager)
- [ ] Technician availability field/logic
- [ ] Push

## Phase 5 — Service Request Handling
- [ ] Create service request endpoint
- [ ] Stub for AI classification call (mock response until AI service is ready — document the mock shape)
- [ ] List/view requests with filters (status, priority)
- [ ] Push

## Phase 6 — Technician Assignment
- [ ] Manager manually assigns technician to job
- [ ] View AI-recommended technician (stub if needed)
- [ ] Push

## Phase 7 — Job Status, Notes, Images
- [ ] Technician updates job status
- [ ] Add service notes (diagnosis, work performed, parts used, follow-up)
- [ ] Image upload endpoint (S3), associated with job
- [ ] Push

## Phase 8 — Manager Web Dashboard (frontend)
- [ ] Next.js/React setup, auth-protected routes
- [ ] Dashboard stats: total/pending/active/completed/high-priority requests, technician utilization, avg resolution time
- [ ] Customer management UI
- [ ] Technician management UI
- [ ] Service request list + assignment UI
- [ ] Push

## Phase 9 — Admin Dashboard (frontend)
- [ ] User management UI
- [ ] Service category management UI
- [ ] System-wide analytics view
- [ ] Push

## Phase 10 — Polish
- [ ] API documentation (Swagger) — this is the contract doc for AI/ML and Mobile devs
- [ ] Basic test cases for endpoints
- [ ] README