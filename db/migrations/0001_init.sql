create extension if not exists pgcrypto;

create table organisation (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, created_at timestamptz not null default now());
create table app_user (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  identity_subject text not null, email text not null, display_name text not null, phone text, active boolean not null default true,
  created_at timestamptz not null default now(), unique (organisation_id, identity_subject), unique (organisation_id, email)
);
create table team (id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade, name text not null, slug text not null, unique (organisation_id, slug));
create table service (
  id uuid primary key default gen_random_uuid(), team_id uuid not null references team(id) on delete cascade,
  name text not null, slug text not null, tier smallint not null default 2 check (tier between 0 and 4), runbook_url text,
  active boolean not null default true, unique (team_id, slug)
);
create table on_call_schedule (
  id uuid primary key default gen_random_uuid(), team_id uuid not null references team(id) on delete cascade,
  name text not null, timezone text not null default 'UTC', handoff_time time not null default '09:00', unique (team_id, name)
);
create table rotation (
  id uuid primary key default gen_random_uuid(), schedule_id uuid not null references on_call_schedule(id) on delete cascade,
  user_id uuid not null references app_user(id) on delete cascade, position integer not null, starts_at timestamptz not null,
  rotation_hours integer not null check (rotation_hours between 1 and 8760), unique (schedule_id, position)
);
create table schedule_override (
  id uuid primary key default gen_random_uuid(), schedule_id uuid not null references on_call_schedule(id) on delete cascade,
  replaces_user_id uuid references app_user(id), user_id uuid not null references app_user(id), starts_at timestamptz not null,
  ends_at timestamptz not null, reason text not null default '', check (ends_at > starts_at)
);
create table escalation_policy (
  id uuid primary key default gen_random_uuid(), team_id uuid not null references team(id) on delete cascade,
  name text not null, steps jsonb not null, repeat_count integer not null default 1 check (repeat_count between 0 and 10), unique (team_id, name)
);
create table alert (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  service_id uuid references service(id) on delete set null, source text not null, external_id text not null, fingerprint text not null,
  title text not null, details jsonb not null default '{}'::jsonb, severity text not null check (severity in ('info','warning','critical')),
  status text not null default 'triggered' check (status in ('triggered','acknowledged','resolved','suppressed')),
  occurrence_count integer not null default 1, first_seen_at timestamptz not null, last_seen_at timestamptz not null,
  acknowledged_by uuid references app_user(id), acknowledged_at timestamptz, resolved_at timestamptz,
  unique (organisation_id, source, external_id)
);
create index alert_active_fingerprint_idx on alert (organisation_id, fingerprint, last_seen_at desc) where status in ('triggered','acknowledged');
create table incident (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  service_id uuid references service(id), commander_id uuid references app_user(id), title text not null,
  severity text not null check (severity in ('sev0','sev1','sev2','sev3')), status text not null default 'declared' check (status in ('declared','mitigating','monitoring','resolved')),
  summary text not null default '', channel_url text, declared_at timestamptz not null default now(), resolved_at timestamptz
);
create table incident_alert (incident_id uuid not null references incident(id) on delete cascade, alert_id uuid not null references alert(id) on delete cascade, primary key (incident_id, alert_id));
create table timeline_entry (
  id bigint generated always as identity primary key, incident_id uuid not null references incident(id) on delete cascade,
  actor_id text not null, entry_type text not null check (entry_type in ('status','note','action','notification','system')),
  body text not null, metadata jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now()
);
create table notification (
  id uuid primary key default gen_random_uuid(), alert_id uuid references alert(id) on delete cascade, incident_id uuid references incident(id) on delete cascade,
  recipient text not null, channel text not null check (channel in ('email','sms','voice','chat','push')),
  status text not null check (status in ('queued','sent','delivered','failed')), attempt integer not null default 1, provider_reference text,
  created_at timestamptz not null default now(), check (alert_id is not null or incident_id is not null)
);
create table maintenance_window (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  service_id uuid references service(id) on delete cascade, name text not null, starts_at timestamptz not null, ends_at timestamptz not null,
  created_by uuid references app_user(id), check (ends_at > starts_at)
);
create table audit_event (id bigint generated always as identity primary key, organisation_id uuid not null references organisation(id) on delete cascade, actor_id text not null, action text not null, entity_type text not null, entity_id text not null, payload jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now());
create index audit_event_org_time_idx on audit_event (organisation_id, occurred_at desc);
create table role_policy (organisation_id uuid not null references organisation(id) on delete cascade, role_key text not null, permissions text[] not null default '{}', updated_by text not null, updated_at timestamptz not null default now(), primary key (organisation_id, role_key));
