import type { ProductConfig } from "./types";

export const product: ProductConfig = {
  id: "klaxon",
  name: "Klaxon",
  category: "Work & Delivery",
  tagline: "On-call that pages people, not your budget.",
  description: "Self-hosted on-call schedules, escalation, alert grouping, incident command, and response analytics.",
  repositoryUrl: "https://github.com/ConseilTek-Tektons/klaxon",
  nav: [{ label: "Incidents", badge: "2" }, { label: "Alerts" }, { label: "On-call" }, { label: "Services" }],
  demoUsers: [
    { id: "demo-admin", name: "Maya Chen", email: "maya@northstar.example", role: "admin", label: "Reliability admin" },
    { id: "demo-manager", name: "Jon Bell", email: "jon@northstar.example", role: "commander", label: "Incident commander" },
    { id: "demo-host", name: "Priya Rao", email: "priya@northstar.example", role: "responder", label: "On-call responder" },
  ],
  ai: {
    name: "Response copilot",
    description: "Ask about active incidents, alert storms, escalation policy, handoffs, or draft post-incident narratives.",
    systemPrompt: "You are Klaxon's incident response copilot. Use only supplied incident context and approved runbooks. Cite evidence, distinguish observation from inference, never acknowledge alerts, and never change an incident.",
    suggestedQuestions: ["Why did this alert group page once?", "Which handoff needs attention?", "Draft a factual incident summary."],
  },
};
