import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { database } from "@/lib/db";
import { hasEffectivePermission } from "@/lib/rbac-server";

export const runtime = "nodejs";
const workspaceId = process.env.WORKSPACE_ID ?? "00000000-0000-4000-8000-000000000001";
const incidentSchema = z.object({ serviceId: z.string().uuid().nullable().default(null), title: z.string().trim().min(3).max(240), severity: z.enum(["sev0","sev1","sev2","sev3"]), summary: z.string().trim().max(10_000).default("") });

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!await hasEffectivePermission(session.user.roles, "dashboard.view")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return NextResponse.json({ data: [], mode: "demo-ui" });
  const rows = await database()`select i.id,i.title,i.severity,i.status,i.declared_at,i.resolved_at,s.name as service,u.display_name as commander from incident i left join service s on s.id=i.service_id left join app_user u on u.id=i.commander_id where i.organisation_id=${workspaceId} order by i.declared_at desc limit 100`;
  return NextResponse.json({ data: rows, mode: "postgres" });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!await hasEffectivePermission(session.user.roles, "incidents.manage")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return NextResponse.json({ error: "PostgreSQL is required for persistent incidents." }, { status: 503 });
  const parsed = incidentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid incident.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const created = await database().begin(async (tx) => {
      const [incident] = await tx`insert into incident (organisation_id,service_id,title,severity,summary) values (${workspaceId},${parsed.data.serviceId},${parsed.data.title},${parsed.data.severity},${parsed.data.summary}) returning *`;
      await tx`insert into timeline_entry (incident_id,actor_id,entry_type,body) values (${incident.id},${session.user.id},'status','Incident declared')`;
      await tx`insert into audit_event (organisation_id,actor_id,action,entity_type,entity_id,payload) values (${workspaceId},${session.user.id},'incident.declared','incident',${incident.id},${tx.json({ severity: parsed.data.severity })})`;
      return incident;
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) { console.error("incident.create_failed", { message: String(error) }); return NextResponse.json({ error: "Incident could not be declared." }, { status: 500 }); }
}
