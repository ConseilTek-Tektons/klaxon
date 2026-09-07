# Klaxon operations

`GET /api/health` reports application and dependency readiness without secrets. App Runner and App Service use it for health replacement.

## Managed-service model

Managed web runtimes remove host and orchestrator maintenance. Managed PostgreSQL, Redis, queue, and object services offload backup, patching, replacement, and scaling primitives. Operators retain ownership of notification providers, spend, escalation correctness, restore drills, quotas, and dependency response.

## Release sequence

1. Pass code, test, infrastructure, and container gates; scan/sign one image and deploy by digest.
2. Back up PostgreSQL and apply forward-compatible migrations.
3. In staging, inject a test alert twice and verify one group with two occurrences.
4. Verify schedule overrides, escalation idempotency, incident declaration/timeline, RBAC denial, and a cited copilot answer.
5. Shift traffic while watching intake latency, grouping rate, queue age, notification delivery, database locks, and IdP callbacks.

Set explicit response SLOs and provider fallbacks. Test database recovery, queue replay, missed-page detection, and provider failover quarterly. A managed service reduces maintenance; it does not replace operational ownership.
