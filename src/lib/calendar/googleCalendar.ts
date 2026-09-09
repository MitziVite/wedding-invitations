interface CalendarEventInput {
  title: string;
  description: string;
  location: string;
  /** UTC instants, e.g. "2026-11-07T17:00:00Z" — displays correctly in every guest's own timezone. */
  startUTC: string;
  endUTC: string;
}

/** "2026-11-07T17:00:00Z" -> "20261107T170000Z", the format Google Calendar's URL expects. */
function toGoogleUTC(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** A "add to Google Calendar" link — opens calendar.google.com pre-filled with the event, no file to download or open. */
export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toGoogleUTC(event.startUTC)}/${toGoogleUTC(event.endUTC)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
