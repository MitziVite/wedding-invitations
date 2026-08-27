import { NextRequest, NextResponse } from "next/server";
import { rsvpSubmitSchema } from "@/lib/rsvp/schema";
import { callAppsScript } from "@/lib/rsvp/appsScript";
import type { ErrorResult } from "@/lib/rsvp/schema";

// Minimum time (ms) a real guest needs to have the form open before
// submitting — anything faster is almost certainly a bot filling every
// field programmatically the instant the page loads.
const MIN_FORM_TIME_MS = 3000;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json<ErrorResult>({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot + timing checks run before schema validation and before ever
  // reaching Apps Script — bots get a fake "success" so they don't learn
  // anything from the response, and the sheet is never touched.
  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  const elapsed = Date.now() - Number(body.formRenderedAt);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FORM_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  const parsed = rsvpSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ErrorResult>({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const { contactName, contactEmail, attending, plusOneName, childrenCount, message } = parsed.data;
    const submission = { contactName, contactEmail, attending, plusOneName, childrenCount, message };
    const result = await callAppsScript<{ ok: boolean; error?: string }>(submission);
    if (!result.ok) {
      return NextResponse.json<ErrorResult>({ ok: false, error: result.error ?? "rejected" }, { status: 422 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json<ErrorResult>({ ok: false, error: "server_error" }, { status: 502 });
  }
}
