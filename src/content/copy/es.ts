/**
 * All Spanish copy for the sections below the hero. Placeholder values are
 * wrapped in [brackets] (or clearly noted) so the real event details can be
 * dropped in later without touching component code. Couple names are
 * placeholders too — swap them for the real ones.
 */
export const weddingContent = {
  coupleNames: "Mitzi & Josh",
  // Same two names, split for the stacked script lockup in the welcome
  // photo (top name / ampersand / bottom name) — kept separate from
  // coupleNames so the on-photo layout doesn't depend on string-splitting.
  names: { top: "Mitzi", bottom: "Josh" },
  date: "7 de noviembre de 2026",
  weekday: "Sábado",

  welcome: {
    // The couple's photo. Leave empty to show the placeholder block.
    photoSrc: "/images/novios/portrait.jpg",
    photoAlt: "Mitzi y Josh",
    monthName: "Noviembre",
    day: "7",
    year: "2026",
    // Local date/time the countdown ticks down to (ceremony start, 10:00 a. m.).
    countdownTargetISO: "2026-11-07T10:00:00",
  },

  invitation: {
    eyebrow: "Nos casamos",
    heading: "Con la bendición de Dios y de nuestras familias",
    body: "Con el corazón lleno de alegría, queremos compartir contigo uno de los días más importantes de nuestras vidas. Tu presencia hará este momento aún más especial.",
  },

  ceremony: {
    eyebrow: "La ceremonia",
    title: "Sellamiento en el templo",
    imageSrc: "/images/novios/temple.svg",
    imageAlt: "Ilustración del templo",
    time: "10:00 a. m.",
    place: "Templo de Saratoga Springs",
    address: "987 South Ensign Drive, Saratoga Springs, UT 84045-3839",
    note: "“Caminaremos lado a lado en una jornada eterna.”",
    noteAuthor: "Gordon B. Hinckley",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=987%20South%20Ensign%20Drive%2C%20Saratoga%20Springs%2C%20UT%2084045-3839",
  },

  reception: {
    eyebrow: "La recepción",
    title: "Recepción",
    imageSrc: "/images/novios/reception.svg",
    imageAlt: "Ilustración del salón de recepción",
    time: "4:30 p. m.",
    place: "The Barn at Eagle Mountain",
    address: "1713 E Erickson Knl Ln, Eagle Mountain, UT 84005",
    note: "Celebremos juntos con cena, música y baile.",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=1713%20E%20Erickson%20Knl%20Ln%2C%20Eagle%20Mountain%2C%20UT%2084005",
  },

  timeline: {
    eyebrow: "El gran día",
    title: "Itinerario",
    // `icon` picks a built-in line-drawing from timelineIcons.tsx. Add an
    // `iconSrc` (path under /public) to any stop to swap in a custom
    // illustration later — it takes over automatically, no code change.
    events: [
      {
        time: "10:00 a. m.",
        title: "Sellamiento en el templo",
        description: "Nos unimos para siempre",
        icon: "rings",
      },
      {
        time: "11:30 a. m. – 12:30 p. m.",
        title: "Sesión de fotos",
        description: "Familia y padrinos",
        icon: "camera",
      },
      { time: "1:30 – 2:30 p. m.", title: "Comida", description: "Un primer brindis juntos", icon: "plate" },
      { time: "4:30 p. m.", title: "Cambio de anillos", description: "Un nuevo comienzo", icon: "ring" },
      { time: "5:30 p. m.", title: "Cena", description: "A disfrutar en familia", icon: "wineGlass" },
      {
        time: "6:40 p. m.",
        title: "Baile",
        description: "El primer baile de los novios",
        icon: "musicNote",
      },
      {
        time: "7:40 p. m.",
        title: "Batucada y víbora de la mar",
        description: "¡A mover el esqueleto!",
        icon: "maracas",
      },
      {
        time: "8:00 p. m.",
        title: "Despedida de los novios",
        description: "Hasta la próxima aventura",
        icon: "carTrail",
      },
    ],
  },

  rsvp: {
    eyebrow: "Confirma tu asistencia",
    title: "R. S. V. P.",
    body: "Nos encantaría contar contigo. Por favor confirma tu asistencia antes del 1 de octubre de 2026.",
    deadlineISO: "2026-10-01",
    attendingLabel: "¿Podrás acompañarnos?",
    attendingYes: "Sí, ahí estaré",
    attendingNo: "No podré asistir",
    plusOneLabel: "¿Deseas traer un acompañante adicional?",
    plusOneNamePlaceholder: "Nombre de tu acompañante",
    childrenLabel: "¿Cuántos niños vendrán contigo?",
    childrenIncrease: "Agregar un niño",
    childrenDecrease: "Quitar un niño",
    messageLabel: "¿Quieres dejarnos un mensaje?",
    messagePlaceholder: "Opcional",
    contactNameLabel: "Nombre completo de quien confirma",
    contactEmailLabel: "Correo (opcional)",
    submitCta: "Enviar confirmación",
    submitting: "Enviando…",
    successTitle: "¡Gracias por confirmar!",
    successBody: "Ya registramos tu respuesta. Nos vemos pronto.",
    errorBody: "Hubo un problema al enviar tu respuesta. Intenta de nuevo o escríbenos directamente.",
    guestQuestionNote: "¿Tienes dudas sobre cuántas personas pueden asistir contigo? Escríbenos directamente.",
    // Replace with the couple's real numbers before sending invitations —
    // wa.me links, digits only, country code included, no symbols.
    whatsapp: {
      mitzi: { name: "Mitzi", url: "https://wa.me/00000000000" },
      josh: { name: "Josh", url: "https://wa.me/00000000000" },
    },
  },

  faq: {
    eyebrow: "Buenas preguntas",
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Puedo llevar acompañante?",
        a: "Tu invitación indica el número de lugares reservados para ti. Si tienes dudas, contáctanos con gusto.",
      },
      {
        q: "¿Los niños están invitados?",
        a: "¡Sí! Los niños son bienvenidos y nos dará mucho gusto celebrar también con los más pequeños de la familia.",
      },
      {
        q: "¿Cómo debo vestir?",
        a: "La celebración será de etiqueta formal: vestido largo para ellas y traje para ellos. Te pedimos reservar el blanco para la novia.",
      },
      {
        q: "¿Habrá estacionamiento?",
        a: "Sí. El lugar cuenta con estacionamiento disponible para nuestros invitados.",
      },
      {
        q: "¿Hasta cuándo puedo confirmar?",
        a: "Te agradeceremos confirmar tu asistencia a más tardar el 1 de octubre de 2026.",
      },
      {
        q: "¿Qué pasa si después de confirmar ya no puedo asistir?",
        a: "No te preocupes. Solo te pedimos que nos avises lo antes posible por mensaje o llamada a cualquiera de los novios, para poder actualizar nuestra lista de invitados.",
      },
      {
        q: "¿Puedo tomar fotos durante la ceremonia?",
        a: "¡Por supuesto! Nos encantará que captures momentos especiales y, si quieres, después también nos haría mucha ilusión que compartieras tus fotos con nosotros.",
      },
      {
        q: "¿Dónde está nuestra mesa de regalos?",
        a: "Estaremos muy agradecidos por cualquier detalle que nazca de tu corazón. Tendremos una mesa de regalos durante la recepción y, si lo prefieres, también puedes consultar nuestra mesa de regalos en línea directamente desde esta página.",
      },
    ],
  },

  registry: {
    eyebrow: "Mesa de regalos",
    title: "Nuestros regalos",
    body: "Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, aquí te dejamos algunas opciones.",
    options: [
      { label: "Mesa de regalos Amazon", url: "https://www.amazon.com/wedding/guest-view/L6M37HAVA21S" },
      { label: "Mesa de regalos Walmart", url: "https://www.walmart.com/registry/WR/5c3f1024-fe75-4095-8a5f-d43c77398ba2" },
    ],
  },

  thankYou: {
    heading: "Gracias",
    body: "Gracias por acompañarnos en este momento tan especial. Con todo nuestro cariño,",
    signature: "Mitzi & Josh",
  },

  footer: "Mitzi & Josh · 7 de noviembre de 2026",
} as const;
