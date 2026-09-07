import { describe, expect, it } from "vitest";
import { hasPermission, resolveRolesFromClaims } from "./rbac";

describe("Klaxon RBAC", () => {
  it("grants wildcard permissions to administrators", () => expect(hasPermission(["admin"], "escalations.manage")).toBe(true));
  it("keeps schedule changes away from responders", () => expect(hasPermission(["responder"], "schedules.manage")).toBe(false));
  it("maps responder groups", () => expect(resolveRolesFromClaims({ groups: ["incident-commanders"] })).toEqual(["commander"]));
});
