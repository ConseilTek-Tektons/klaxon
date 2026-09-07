# Klaxon role-based access control

Bootstrap grants live in `src/config/rbac.ts`; PostgreSQL stores reviewed per-tenant overrides. Visible controls are convenience only—alerts, incidents, schedules, escalation, maintenance, and administration remain server-authorized.

| Role | Intended access |
|---|---|
| `owner` | Immutable full access and security ownership |
| `admin` | Full service, integration, and access administration |
| `commander` | Incident command, schedules, escalation, maintenance, analytics |
| `responder` | Alert intake, acknowledge/work incident paths, assistant |
| `observer` | Dashboard and assistant without operational mutation |
| `auditor` | Dashboard, reliability analytics, assistant |
| `viewer` | Read-only dashboard |

Default groups are `klaxon-owners`, `klaxon-admins`, `incident-commanders`, `responders`, `incident-observers`, and `reliability-auditors`. Unknown groups receive `viewer`.

Add permissions in configuration, enforce each in its API, hide unavailable UI, and test both allowed and denied roles. Owner grants are immutable, and policy updates append an audit event in the same transaction.
