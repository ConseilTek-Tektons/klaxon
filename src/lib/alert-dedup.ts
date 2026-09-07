import { createHash } from "node:crypto";

export function alertFingerprint(source: string, service: string, signal: string) {
  return createHash("sha256").update([source, service, signal].map((part) => part.trim().toLowerCase()).join("|")).digest("hex");
}

export function shouldGroupAlert(existingLastSeen: Date, incomingAt: Date, windowMinutes = 15) {
  return incomingAt.getTime() - existingLastSeen.getTime() <= windowMinutes * 60_000;
}
