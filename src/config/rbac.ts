export const rbacConfig = {
  roles: {
    owner: { label: "Owner", description: "Full control, including security and workspace policy." },
    admin: { label: "Admin", description: "Manages services, integrations, and access." },
    commander: { label: "Incident commander", description: "Coordinates incidents and responder operations." },
    responder: { label: "Responder", description: "Acknowledges alerts and works incidents." },
    observer: { label: "Observer", description: "Follows incident state without operational control." },
    auditor: { label: "Auditor", description: "Reviews incident history and evidence." },
    viewer: { label: "Viewer", description: "Read-only dashboard access." },
  },
  permissions: {
    "dashboard.view": "View the operations dashboard", "alerts.ingest": "Submit and normalize alerts",
    "incidents.manage": "Declare, coordinate, and resolve incidents", "schedules.manage": "Manage on-call schedules and overrides",
    "escalations.manage": "Configure escalation policies", "maintenance.manage": "Manage maintenance windows",
    "analytics.view": "View reliability analytics", "assistant.ask": "Ask the incident copilot",
    "access.manage": "Configure roles and identity mappings", "settings.manage": "Manage workspace integrations and settings",
  },
  rolePermissions: {
    owner: ["*"], admin: ["*"],
    commander: ["dashboard.view", "incidents.manage", "schedules.manage", "escalations.manage", "maintenance.manage", "analytics.view", "assistant.ask"],
    responder: ["dashboard.view", "alerts.ingest", "incidents.manage", "assistant.ask"],
    observer: ["dashboard.view", "assistant.ask"], auditor: ["dashboard.view", "analytics.view", "assistant.ask"], viewer: ["dashboard.view"],
  } as Record<string, readonly string[]>,
  identityGroupMappings: {
    "klaxon-owners": "owner", "klaxon-admins": "admin", "incident-commanders": "commander",
    responders: "responder", "incident-observers": "observer", "reliability-auditors": "auditor",
  } as Record<string, string>,
  defaultRole: "viewer",
};
