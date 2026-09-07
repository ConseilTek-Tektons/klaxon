import { describe, expect, it } from "vitest";
import { alertFingerprint, shouldGroupAlert } from "./alert-dedup";

describe("alert deduplication", () => {
  it("normalizes equivalent signal identities", () => expect(alertFingerprint("CloudWatch", "API", "Latency")).toBe(alertFingerprint(" cloudwatch ", "api", "latency")));
  it("groups alerts within the policy window", () => expect(shouldGroupAlert(new Date("2026-01-01T00:00:00Z"), new Date("2026-01-01T00:10:00Z"))).toBe(true));
});
