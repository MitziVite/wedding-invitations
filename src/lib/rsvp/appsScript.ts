import "server-only";

/**
 * The only place the Apps Script Web App URL and shared secret are read —
 * both are server-only env vars (never `NEXT_PUBLIC_*`), so neither ever
 * reaches the browser bundle. The API route is the sole caller of this
 * module; the client only ever talks to our own /api/rsvp route.
 */
export async function callAppsScript<T>(payload: Record<string, unknown>): Promise<T> {
  const url = process.env.RSVP_APPS_SCRIPT_URL;
  const secret = process.env.RSVP_SHARED_SECRET;
  if (!url || !secret) {
    throw new Error("RSVP backend is not configured — set RSVP_APPS_SCRIPT_URL and RSVP_SHARED_SECRET.");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, ...payload }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Apps Script request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}
