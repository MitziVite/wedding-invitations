/**
 * All Spanish copy for the sections below the hero. Placeholder values are
 * wrapped in [brackets] (or clearly noted) so the real event details can be
 * dropped in later without touching component code. Couple names are
 * placeholders too — swap them for the real ones.
 */
export const weddingContent = {
  coupleNames: "Josh & Mitzi",
  date: "7 de noviembre de 2026",
  weekday: "Sábado",

  welcome: {
    // The couple's photo. Leave empty to show the placeholder block.
    photoSrc: "/images/novios/portrait.jpg",
    photoAlt: "Josh y Mitzi",
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
    title: "Ceremonia religiosa",
    imageSrc: "/images/novios/temple.svg",
    imageAlt: "Ilustración del templo",
    time: "10:00 a. m.",
    place: "[Nombre del lugar de la ceremonia]",
    address: "[Dirección de la ceremonia]",
    note: "Te esperamos para unir nuestras vidas ante Dios.",
    mapUrl: "#",
  },

  reception: {
    eyebrow: "La recepción",
    title: "Recepción",
    imageSrc: "/images/novios/reception.svg",
    imageAlt: "Ilustración del salón de recepción",
    time: "4:30 p. m.",
    place: "[Nombre del salón]",
    address: "[Dirección de la recepción]",
    note: "Celebremos juntos con cena, música y baile.",
    mapUrl: "#",
  },

  timeline: {
    eyebrow: "El gran día",
    title: "Itinerario",
    events: [
      { time: "10:00 a. m.", label: "Sellamiento en el templo" },
      { time: "11:30 a. m. – 12:30 p. m.", label: "Sesión de fotos (familia y padrinos)" },
      { time: "1:30 – 2:30 p. m.", label: "Comida" },
      { time: "4:30 p. m.", label: "Cambio de anillos" },
      { time: "5:30 p. m.", label: "Cena" },
      { time: "6:40 p. m.", label: "Baile" },
      { time: "8:00 p. m.", label: "Despedida de los novios" },
    ],
  },

  location: {
    eyebrow: "Cómo llegar",
    title: "Ubicación",
    body: "Aquí encontrarás los enlaces para llegar fácilmente a cada evento.",
    links: [
      { label: "Mapa de la ceremonia", url: "#" },
      { label: "Mapa de la recepción", url: "#" },
    ],
  },

  dressCode: {
    eyebrow: "Código de vestimenta",
    title: "Etiqueta formal",
    body: "Vestido largo para ellas y traje formal para ellos. Te sugerimos tonos elegantes y reservar el blanco para la novia.",
  },

  rsvp: {
    eyebrow: "Confirma tu asistencia",
    title: "R. S. V. P.",
    body: "Nos encantaría contar contigo. Por favor confirma tu asistencia antes del 1 de octubre de 2026.",
    cta: "Confirmar asistencia",
    note: "El formulario estará disponible muy pronto.",
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
        a: "[Placeholder] Te compartiremos los detalles pronto.",
      },
      {
        q: "¿Habrá estacionamiento?",
        a: "[Placeholder] Sí, el lugar cuenta con estacionamiento para los invitados.",
      },
      {
        q: "¿Hasta cuándo puedo confirmar?",
        a: "Agradecemos tu confirmación antes del 1 de octubre de 2026.",
      },
    ],
  },

  registry: {
    eyebrow: "Mesa de regalos",
    title: "Nuestros regalos",
    body: "Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, aquí te dejamos algunas opciones.",
    options: [
      { label: "[Tienda de regalos 1]", url: "#" },
      { label: "[Tienda de regalos 2]", url: "#" },
      { label: "Lluvia de sobres", url: "#" },
    ],
  },

  thankYou: {
    heading: "Gracias",
    body: "Gracias por acompañarnos en este momento tan especial. Con todo nuestro cariño,",
    signature: "Josh & Mitzi",
  },

  footer: "Josh & Mitzi · 7 de noviembre de 2026",
} as const;
