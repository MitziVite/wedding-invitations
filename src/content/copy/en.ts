import type { WeddingContent } from "./types";

/**
 * English copy, mirroring `es.ts` field for field — see that file for notes
 * on placeholders and the mobile welcome photo's split name lockup.
 */
export const weddingContent: WeddingContent = {
  coupleNames: "Mitzi & Josh",
  names: { top: "Mitzi", bottom: "Josh" },
  date: "November 7, 2026",
  weekday: "Saturday",

  hero: {
    subtitle: "Our forever begins here",
  },

  welcome: {
    photoSrc: "/images/novios/portrait.jpg",
    photoAlt: "Mitzi and Josh",
    monthName: "November",
    day: "7",
    year: "2026",
    countdownTargetISO: "2026-11-07T10:00:00",
    countdownHeading: "Counting down",
    countdownLabels: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
    photoPlaceholder: "Add the couple's photo",
  },

  invitation: {
    eyebrow: "We're getting married",
    heading: "With the blessing of God and our families",
    body: "With hearts full of joy, we want to share with you one of the most important days of our lives. Your presence will make this moment even more special.",
  },

  ceremony: {
    eyebrow: "The ceremony",
    title: "Temple sealing",
    imageSrc: "/images/novios/temple.svg",
    imageAlt: "Illustration of the temple",
    time: "10:00 a.m.",
    place: "Saratoga Springs Temple",
    address: "987 South Ensign Drive, Saratoga Springs, UT 84045-3839",
    note: "“We will walk side by side on an eternal journey.”",
    noteAuthor: "Gordon B. Hinckley",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=987%20South%20Ensign%20Drive%2C%20Saratoga%20Springs%2C%20UT%2084045-3839",
    startUTC: "2026-11-07T17:00:00Z",
    endUTC: "2026-11-07T18:00:00Z",
    addToCalendarCta: "Add to calendar",
  },

  reception: {
    eyebrow: "The reception",
    title: "Reception",
    imageSrc: "/images/novios/reception.svg",
    imageAlt: "Illustration of the reception venue",
    time: "4:30 p.m.",
    place: "The Barn at Eagle Mountain",
    address: "1713 E Erickson Knl Ln, Eagle Mountain, UT 84005",
    note: "Let's celebrate together with dinner, music, and dancing.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=1713%20E%20Erickson%20Knl%20Ln%2C%20Eagle%20Mountain%2C%20UT%2084005",
    startUTC: "2026-11-07T23:30:00Z",
    endUTC: "2026-11-08T03:30:00Z",
    addToCalendarCta: "Add to calendar",
  },

  timeline: {
    eyebrow: "The big day",
    title: "Itinerary",
    events: [
      {
        time: "10:00 a.m.",
        title: "Temple sealing",
        subtitle: "We become one forever",
        image: "/images/itinerary/templo.png",
        alt: "Watercolor illustration of the temple among flowers",
      },
      {
        time: "4:15 p.m.",
        title: "Welcome",
        subtitle: "We're about to begin",
        image: "/images/itinerary/bienvenidos.png",
        alt: "Watercolor illustration of a welcome floral arch",
      },
      {
        time: "4:30 p.m.",
        title: "Ring ceremony",
        subtitle: "A new beginning",
        image: "/images/itinerary/anillos.png",
        alt: "Watercolor illustration of two intertwined rings with flowers",
      },
      {
        time: "5:15 p.m.",
        title: "Dinner",
        subtitle: "Enjoy with family",
        image: "/images/itinerary/comida.png",
        alt: "Watercolor illustration of an elegant dinner",
      },
      {
        time: "6:15 p.m.",
        title: "First dance",
        subtitle: "The first of many",
        image: "/images/itinerary/primer-baile.png",
        alt: "Watercolor illustration of the couple dancing",
      },
      {
        time: "6:15 p.m.",
        title: "A few words",
        subtitle: "With all our love",
        image: "/images/itinerary/palabras.png",
        alt: "Watercolor illustration of a floral microphone",
      },
      {
        time: "6:30 p.m.",
        title: "Photos & memories",
        subtitle: "We want a photo with you",
        image: "/images/itinerary/fotos.png",
        alt: "Watercolor illustration of a floral camera",
      },
      {
        time: "7:00 p.m.",
        title: "Cake",
        subtitle: "Let the party go on",
        image: "/images/itinerary/pastel.png",
        alt: "Watercolor illustration of a floral wedding cake",
      },
      {
        time: "8:00 p.m.",
        title: "Couple's farewell",
        subtitle: "Until the next adventure ✨",
        image: "/images/itinerary/despedida.png",
        alt: "Watercolor illustration of the couple's farewell car",
      },
    ],
  },

  rsvp: {
    eyebrow: "RSVP",
    title: "R. S. V. P.",
    body: "We'd love to have you with us. Please confirm your attendance by October 1, 2026.",
    deadlineISO: "2026-10-01",
    attendingLabel: "Will you join us?",
    attendingYes: "Yes, I'll be there",
    attendingNo: "I won't be able to attend",
    plusOneLabel: "Would you like to bring an additional guest?",
    plusOneYes: "Yes",
    plusOneNo: "No",
    plusOneNamePlaceholder: "Your guest's name",
    childrenLabel: "If children will be joining you, how many?",
    childrenIncrease: "Add a child",
    childrenDecrease: "Remove a child",
    messageLabel: "Want to leave us a message?",
    messagePlaceholder: "Optional",
    contactNameLabel: "Full name of who's confirming",
    submitCta: "Confirm attendance",
    submitting: "Sending…",
    successTitle: "Thank you for confirming!",
    successBody: "We've recorded your response. See you soon.",
    errorBody: "There was a problem sending your response. Please try again or message us directly.",
    guestQuestionNote: "Questions about how many people can attend with you? Message us directly.",
    calendarEventTitle: "Mitzi and Josh's Wedding <3",
    contacts: {
      mitzi: { name: "Mitzi", phone: "+1 385 439 1623" },
      josh: { name: "Josh", phone: "+1 208 450 7301" },
    },
  },

  faq: {
    eyebrow: "Good questions",
    title: "Frequently asked questions",
    items: [
      {
        q: "Can I bring a guest?",
        a: "Your invitation shows the number of seats reserved for you. If you have any questions, feel free to reach out.",
      },
      {
        q: "Are kids invited?",
        a: "Yes! Children are welcome, and we'd love to celebrate with the little ones of the family too.",
      },
      {
        q: "What's the dress code?",
        a: "Sunday best — think your nicest church clothes. We kindly ask that white be reserved for the bride.",
      },
      {
        q: "Will there be parking?",
        a: "Yes. The venue has parking available for our guests.",
      },
      {
        q: "By when do I need to confirm?",
        a: "We'd appreciate confirming your attendance by October 1, 2026 at the latest.",
      },
      {
        q: "What if I confirm and then can't make it?",
        a: "No worries. Just let us know as soon as possible by message or call to either of us, so we can update our guest list.",
      },
      {
        q: "Can I take photos during the ceremony?",
        a: "Of course! We'd love for you to capture special moments, and afterward we'd be thrilled if you shared your photos with us too.",
      },
      {
        q: "Where's your gift registry?",
        a: "We'll be truly grateful for anything that comes from the heart. We'll have a gift table at the reception, and you're also welcome to check our online registry right from this page.",
      },
    ],
  },

  registry: {
    eyebrow: "Gift registry",
    title: "Our registry",
    body: "Your presence is our greatest gift. If you'd like to give us something, here are a few options.",
    options: [
      { label: "Amazon registry", url: "https://www.amazon.com/wedding/guest-view/L6M37HAVA21S" },
      { label: "Venmo", url: "https://venmo.com/u/MitziVite" },
    ],
  },

  thankYou: {
    heading: "Thank you",
    body: "Thank you for joining us on this special day. With all our love,",
    signature: "Mitzi & Josh",
  },

  footer: "Mitzi & Josh · November 7, 2026",

  common: {
    mapCta: "View map",
    skipIntro: "Skip introduction",
    openInvitationAria: "Open the invitation",
    scrollDownAria: "Go to the next section",
  },
};
