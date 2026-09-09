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

export interface WhatsappContactContent {
  name: string;
  url: string;
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
    whatsapp: { mitzi: WhatsappContactContent; josh: WhatsappContactContent };
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
