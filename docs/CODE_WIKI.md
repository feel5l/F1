# Ghiyabi (غيابي) Code Wiki

This repository contains “Ghiyabi” (غيابي), a React + Firebase attendance system for a school environment (Arabic-first, RTL-friendly). The app manages students/classes, records daily attendance, and provides logs + analytics dashboards with role-based access control.

## 1) Architecture Overview

### High-level

- **UI**: React 19 + React Router (client-side SPA).
- **Data/Auth**: Firebase Authentication + Cloud Firestore.
- **Authorization**: Dual-layer
  - **Client-side** role gating (navigation + pages)
  - **Firestore Security Rules** as the enforcement point
- **Build/Tooling**: Vite + TypeScript + Tailwind + shadcn/ui, tested with Vitest.

### Runtime flow (request path)

1. Browser loads [main.tsx](file:///workspace/F1/src/main.tsx) → mounts React app.
2. [AuthProvider](file:///workspace/F1/src/lib/AuthContext.tsx) subscribes to Firebase Auth changes.
3. When a user is signed in, the provider fetches role metadata from:
   - `staff` collection (user profile)
   - `roles/<email>` document (fast lookup used by Firestore rules)
4. [App.tsx](file:///workspace/F1/src/App.tsx) protects routes: unauthenticated users are redirected to `/login`.
5. Pages use Firestore reads/writes directly from the browser via the Firebase SDK.

### Key cross-cutting concerns

- **Role-based UI**: [Layout.tsx](file:///workspace/F1/src/components/Layout.tsx) filters navigation items by `appRole`.
- **Error handling for Firestore writes**: [handleFirestoreError](file:///workspace/F1/src/lib/firebase.ts#L10-L48) builds a structured error payload, logs it, then throws.
- **RTL**: Toaster is explicitly configured with `dir="rtl"` in [main.tsx](file:///workspace/F1/src/main.tsx#L9-L16); the app copy is mostly Arabic.

## 2) Repository Layout

```text
.
├── src/
│   ├── components/
│   │   ├── ui/                shadcn/ui primitives (Button, Card, Table, etc.)
│   │   └── Layout.tsx         App shell: sidebar/header + role-filtered navigation
│   ├── lib/
│   │   ├── AuthContext.tsx    Auth state + role resolution
│   │   ├── firebase.ts        Firebase init + Firestore error helper
│   │   └── utils.ts           Tailwind class merge helper (cn)
│   ├── pages/                 Route pages (Login, Attendance, Reports, etc.)
│   ├── App.tsx                Route definitions + auth gating
│   ├── main.tsx               React entrypoint
│   └── types.ts               Domain model types
├── firestore.rules            Firestore Security Rules (authorization source of truth)
├── firebase-blueprint.json    Firestore entities/collections schema blueprint
├── seed.ts                    Firestore seeding script (staff collection)
├── netlify.toml               Netlify SPA build + redirect config
├── .github/workflows/ci.yml   CI pipeline (npm ci, lint, test, build)
└── docs/
    └── CODE_WIKI.md           This document
```

## 3) Data Model & Firestore Collections

The domain types are defined in [types.ts](file:///workspace/F1/src/types.ts).

### Collections

- **`classes`**: Class metadata
  - Shape: [Class](file:///workspace/F1/src/types.ts#L1-L7)
  - Key fields: `name`, `gradeLevel`, optional `teacherEmail`
- **`students`**: Student records
  - Shape: [Student](file:///workspace/F1/src/types.ts#L9-L18)
  - Key fields: `fullName`, `classId`, `guardianPhone`, `isActive`
- **`sessions`**: Attendance sessions (one “attendance-taking event”)
  - Shape: [Session](file:///workspace/F1/src/types.ts#L20-L27)
  - Key fields: `date`, `period`, `subject`, `classId`, `teacherEmail`
- **`attendanceLogs`**: Per-student attendance for a given session
  - Shape: [AttendanceLog](file:///workspace/F1/src/types.ts#L29-L38)
  - Key fields: `studentId`, `sessionId`, `classId`, `teacherEmail`, `status`, `timestamp`, optional `note`
- **`staff`**: Staff directory (display + management)
  - Shape: [StaffMember](file:///workspace/F1/src/types.ts#L47-L57)
  - Key fields: `fullName`, `email`, `role` (display), `appRole` (authorization)
- **`roles`**: Authorization lookup table
  - Document ID: user email
  - Fields: `{ role: AppRole, updatedAt: ... }`
  - Used heavily by Firestore rules for efficient role checks (instead of querying `staff`).

### Enumerations

- **`AttendanceStatus`**: `"حاضر" | "غائب" | "متأخر" | "بعذر"` ([types.ts](file:///workspace/F1/src/types.ts#L29-L38))
- **`AppRole`**: `"ADMIN" | "TEACHER" | "TEACHER_LEADER" | "ATTENDANCE_OFFICER" | "SUPERVISOR"` ([types.ts](file:///workspace/F1/src/types.ts#L40-L56))

## 4) Authorization & Security

### Firestore Security Rules (source of truth)

Rules live in [firestore.rules](file:///workspace/F1/firestore.rules).

- Default policy is **deny all** (global wildcard rule with `allow read, write: if false`).
- Access is then explicitly granted per collection using helper functions:
  - `getAppRole()` reads `roles/<email>` to determine role
  - `isAdmin()`, `isTeacher()`, `isTeacherLeader()`, `isAttendanceOfficer()`, `isSupervisor()`
- Rules also validate payload schemas (e.g. `isValidStudent`, `isValidLog`) to prevent malformed writes.

Important implementation detail:
- `isAdmin()` is role-based only (`roles/<email>.role == "ADMIN"`).
- A one-time bootstrap is permitted for `alzaem3000@gmail.com` to create `roles/alzaem3000@gmail.com` with `{ role: "ADMIN" }` during first login.

### Client-side role resolution

[AuthProvider](file:///workspace/F1/src/lib/AuthContext.tsx) performs:

- Auth subscription: `onAuthStateChanged(auth, ...)`
- Staff lookup: query `staff` by email
- Roles lookup: read document `roles/<email>`
- It then exposes convenient booleans:
  - `isAdmin`, `isTeacher`, `isSupervisor`

UI gating happens mainly in:
- [App.tsx](file:///workspace/F1/src/App.tsx) (auth/no-auth redirect)
- [Layout.tsx](file:///workspace/F1/src/components/Layout.tsx) (role-based navigation visibility)

## 5) Major Modules & Responsibilities

### `src/lib/`

- [firebase.ts](file:///workspace/F1/src/lib/firebase.ts)
  - Initializes Firebase app using `firebase-applet-config.json`.
  - Exports:
    - `db` (Firestore instance)
    - `auth` (Firebase Auth instance)
    - `handleFirestoreError()` and `OperationType` enum for consistent Firestore error reporting.
- [AuthContext.tsx](file:///workspace/F1/src/lib/AuthContext.tsx)
  - Central auth state provider.
  - Resolves staff profile and `appRole`.
- [utils.ts](file:///workspace/F1/src/lib/utils.ts)
  - `cn()` merges Tailwind classnames (`clsx` + `tailwind-merge`).

### `src/components/`

- [Layout.tsx](file:///workspace/F1/src/components/Layout.tsx)
  - App frame (sidebar + mobile sheet menu).
  - Nav items are defined with required roles and filtered against `staffMember.appRole`.
  - Handles logout via `auth.signOut()`.
- `components/ui/*`
  - Shared UI primitives (shadcn/ui pattern). These are consumed throughout pages to keep visual/behavior consistency.

### `src/pages/`

- [Login.tsx](file:///workspace/F1/src/pages/Login.tsx)
  - `handleLogin()` uses `signInWithEmailAndPassword`.
  - Supports “username” login by appending `@ghiabi.com` when the input lacks `@`.
  - Google login: attempts popup first, then falls back to redirect flow on popup-blocked environments (common on mobile previews).
  - `handleResetPassword()` uses `sendPasswordResetEmail`.
- [Dashboard.tsx](file:///workspace/F1/src/pages/Dashboard.tsx)
  - Computes summary stats:
    - Total students (all if admin; otherwise only teacher’s assigned classes)
    - Today’s absent/late/present using `attendanceLogs` filtered by start-of-day timestamp
- [Attendance.tsx](file:///workspace/F1/src/pages/Attendance.tsx)
  - Attendance-taking workflow:
    1. Load classes and apply role-based visibility (teacher only sees their own classes).
    2. After class selection, load active students in that class.
    3. On submit:
       - Create a `sessions` document
       - Create one `attendanceLogs` document per student (status + note)
  - Key functions:
    - `submitAttendance()` ([Attendance.tsx](file:///workspace/F1/src/pages/Attendance.tsx#L77-L118))
    - `handleStatusChange()` / `handleNoteChange()` for local state updates
- [Students.tsx](file:///workspace/F1/src/pages/Students.tsx)
  - CRUD for `students` collection (add/update/delete).
  - CSV export and CSV import via `papaparse`.
  - Key functions:
    - `handleSave()` (add/update)
    - `handleDelete()`
    - `handleImportCSV()`
    - `exportToCSV()`
- [Classes.tsx](file:///workspace/F1/src/pages/Classes.tsx)
  - Lists classes and assigns teachers by setting `teacherEmail`.
  - Loads `staff` ordered by `fullName` to populate teacher selection.
  - Note: `seedClasses()` is currently a stub placeholder.
- [Staff.tsx](file:///workspace/F1/src/pages/Staff.tsx)
  - Displays staff directory.
  - Admin-only role management:
    - Updates `staff/<id>.appRole`
    - Syncs `roles/<email>` for Firestore rules performance
  - Key function: `handleUpdateRole()` ([Staff.tsx](file:///workspace/F1/src/pages/Staff.tsx#L61-L86))
- [Logs.tsx](file:///workspace/F1/src/pages/Logs.tsx)
  - Displays last 100 attendance logs:
    - Admin sees all logs
    - Non-admin sees only logs where `teacherEmail == user.email`
  - Fetches `students`, `sessions`, `classes` to resolve names for display.
  - WhatsApp notification button:
    - Builds `wa.me/<phone>?text=...` and opens it in a new tab/window.
    - Function: `sendWhatsAppNotification()` ([Logs.tsx](file:///workspace/F1/src/pages/Logs.tsx#L70-L84))
- [Reports.tsx](file:///workspace/F1/src/pages/Reports.tsx)
  - Reporting/analytics:
    - Filters by class + student + date range
    - Loads logs from Firestore and filters client-side for relative windows (today/week/month)
    - Renders charts via Recharts:
      - Line chart (daily trends)
      - Pie chart (status distribution)
    - Auto-refresh every 5 minutes via `setInterval`
    - CSV export of filtered dataset (currently exports `studentId` rather than student name)

## 6) Dependency Relationships (How the Pieces Connect)

### Core dependency chain

- [main.tsx](file:///workspace/F1/src/main.tsx)
  → `BrowserRouter`
  → [AuthProvider](file:///workspace/F1/src/lib/AuthContext.tsx)
  → [App.tsx](file:///workspace/F1/src/App.tsx)
  → [Layout.tsx](file:///workspace/F1/src/components/Layout.tsx)
  → Route pages in `src/pages/*`

### Data access

- Pages import `db` from [firebase.ts](file:///workspace/F1/src/lib/firebase.ts) and use Firestore SDK calls directly.
- Role logic depends on `roles/<email>` documents:
  - Rules: [firestore.rules](file:///workspace/F1/firestore.rules#L14-L42)
  - Client resolution: [AuthContext.tsx](file:///workspace/F1/src/lib/AuthContext.tsx#L30-L79)

### External libraries used by feature

- Routing: `react-router-dom` (route protection + SPA navigation)
- UI: shadcn/ui components + Lucide icons
- Styling: Tailwind + `cn()` helper
- Charts: `recharts` (Reports page)
- Dates: `date-fns` (Reports/Logs formatting, Arabic locale)
- CSV: `papaparse` (Students import)
- Notifications: `sonner` (toasts)

Note: `express` and `firebase-admin` are listed as dependencies but are not currently used in `src/`.

## 7) How to Run (Local Development)

### Prerequisites

- Node.js 20+
- npm
- A Firebase project (Auth + Firestore enabled)

### Configuration

1. **Firebase config**
   - The app imports `firebase-applet-config.json` (root) inside [firebase.ts](file:///workspace/F1/src/lib/firebase.ts#L1-L8).
   - Ensure this file points to your Firebase project. Do not commit secrets; treat it like environment configuration.

2. **Environment variables**
   - Optional (used for build-time injection in [vite.config.ts](file:///workspace/F1/vite.config.ts#L6-L23)):
     - `GEMINI_API_KEY` (the codebase currently doesn’t show direct Gemini usage in `src/`, but CI expects it)
   - Example file: [.env.example](file:///workspace/F1/.env.example)

### Install & run

```bash
cd /workspace/F1
npm ci
npm run dev
```

The dev server is configured to run on port 3000.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Typecheck (“lint”)

```bash
npm run lint
```

## 8) Deployment

### Netlify

The repository includes [netlify.toml](file:///workspace/F1/netlify.toml) configured for a Vite SPA:

- Build: `npm run build`
- Publish directory: `dist`
- SPA redirects: all routes → `/index.html`

### GitHub Actions CI

[ci.yml](file:///workspace/F1/.github/workflows/ci.yml) runs on pushes/PRs and executes:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm test`

The workflow expects several secrets (Firebase and Gemini) to be configured in GitHub.

## 9) Operational Notes

### Seeding staff data

[seed.ts](file:///workspace/F1/seed.ts) populates the `staff` collection.

Run manually (example):

```bash
npx tsx seed.ts
```

This script uses the same `firebase-applet-config.json` project configuration as the app.

### Security spec

[security_spec.md](file:///workspace/F1/security_spec.md) describes intended invariants and denial tests for the Firestore security rules. It is a good checklist when evolving schemas or adding new operations.
