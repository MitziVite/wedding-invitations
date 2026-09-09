export interface ItineraryEventContent {
  time: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

export interface FaqItemContent {
  q: string;
  a: string;
}

export interface RegistryOptionContent {
  label: string;
  url: string;
}

export interface PhoneContactContent {
  name: string;
  /** Display-ready, e.g. "+52 55 1234 5678" — a tel: link is derived from it by stripping whitespace. */
  phone: string;
}

/** Shape shared by every language's copy file — see `es.ts` / `en.ts`. */
export interface WeddingContent {
  coupleNames: string;
  names: { top: string; bottom: string };
  date: string;
  weekday: string;

  hero: {
    subtitle: string;
  };

  welcome: {
    photoSrc: string;
    photoAlt: string;
    monthName: string;
    day: string;
    year: string;
    countdownTargetISO: string;
    countdownHeading: string;
    countdownLabels: { days: string; hours: string; minutes: string; seconds: string };
    photoPlaceholder: string;
  };

  invitation: {
    eyebrow: string;
    heading: string;
    body: string;
  };

  ceremony: {
    eyebrow: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    time: string;
    place: string;
    address: string;
    note: string;
    noteAuthor: string;
    mapUrl: string;
    /** UTC instants (not local wall-clock) so the .ics/calendar link shows the correct moment regardless of the guest's own timezone. */
    startUTC: string;
    endUTC: string;
    addToCalendarCta: string;
  };

  reception: {
    eyebrow: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    time: string;
    place: string;
    address: string;
    note: string;
    mapUrl: string;
    startUTC: string;
    endUTC: string;
    addToCalendarCta: string;
  };

  timeline: {
    eyebrow: string;
    title: string;
    events: ItineraryEventContent[];
  };

  rsvp: {
    eyebrow: string;
    title: string;
    body: string;
    deadlineISO: string;
    attendingLabel: string;
    attendingYes: string;
    attendingNo: string;
    plusOneLabel: string;
    plusOneYes: string;
    plusOneNo: string;
    plusOneNamePlaceholder: string;
    childrenLabel: string;
    childrenIncrease: string;
    childrenDecrease: string;
    messageLabel: string;
    messagePlaceholder: string;
    contactNameLabel: string;
    submitCta: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorBody: string;
    guestQuestionNote: string;
    /** Event title for the "add to Google Calendar" link — the wedding as a whole, not just "Reception". */
    calendarEventTitle: string;
    contacts: { mitzi: PhoneContactContent; josh: PhoneContactContent };
  };

  faq: {
    eyebrow: string;
    title: string;
    items: FaqItemContent[];
  };

  registry: {
    eyebrow: string;
    title: string;
    body: string;
    options: RegistryOptionContent[];
  };

  thankYou: {
    heading: string;
    body: string;
    signature: string;
  };

  footer: string;

  /** Small cross-cutting UI strings not tied to a single section. */
  common: {
    mapCta: string;
    skipIntro: string;
    openInvitationAria: string;
    scrollDownAria: string;
  };
}
