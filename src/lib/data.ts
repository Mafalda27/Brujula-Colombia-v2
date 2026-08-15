export const LAST_SYNC = "15 ago 2026 · 06:00 a.m."

/** Build an Unsplash URL at a given crop size. */
export const img = (id: string, w = 640, h = 480) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`

export type Kpi = {
  key: string
  label: string
  sub: string
  value: number
  tone: "need" | "offer" | "pet" | "blood"
}

export const KPIS: Kpi[] = [
  { key: "need", label: "Necesitan", sub: "reportes activos", value: 400, tone: "need" },
  { key: "offer", label: "Ofrecen", sub: "iniciativas", value: 52, tone: "offer" },
  { key: "pet", label: "Mascotas", sub: "puntos de acopio", value: 3, tone: "pet" },
  { key: "blood", label: "Sangre", sub: "pedidos abiertos", value: 13, tone: "blood" },
]

export type Category =
  | "Alimentos y Agua"
  | "Insumos Médicos"
  | "Voluntariado"
  | "Albergue y Carpas"
  | "Herramientas"
  | "Donación de Sangre"
  | "Nequi / Colectas"
  | "Mascotas"

/** Category metadata for the filter dropdowns (emoji + label). */
export const CAT_META: { id: Category; emoji: string }[] = [
  { id: "Alimentos y Agua", emoji: "🍲" },
  { id: "Insumos Médicos", emoji: "💊" },
  { id: "Voluntariado", emoji: "🙋" },
  { id: "Albergue y Carpas", emoji: "⛺" },
  { id: "Herramientas", emoji: "🚜" },
  { id: "Donación de Sangre", emoji: "🩸" },
  { id: "Nequi / Colectas", emoji: "🧧" },
  { id: "Mascotas", emoji: "🐾" },
]

export const TIPOS = [
  { id: "todo", emoji: "🔵", label: "Todo" },
  { id: "need", emoji: "🔴", label: "Necesidades" },
  { id: "offer", emoji: "🟢", label: "Ofertas" },
  { id: "validados", emoji: "✅", label: "Solo validados" },
] as const

export const ORDENES = [
  { id: "recientes", emoji: "🕐", label: "Más recientes" },
  { id: "urgentes", emoji: "💥", label: "Más urgentes" },
  { id: "cercanos", emoji: "📍", label: "Más cercanos a mí" },
] as const

export type Pin = {
  id: string
  kind: "need" | "offer" | "attended"
  x: number // % position over the stylized map
  y: number
  title: string
  city: string
  priority: "ALTA" | "MEDIA" | "BAJA"
  category: Category
  photo: string
  ago: string
  mins: number // minutes since posted (for "recientes")
  dist: number // km from user (for "cercanos")
  validated: boolean
}

export const PINS: Pin[] = [
  { id: "p1", kind: "need", x: 46, y: 30, title: "Colombia cuida a Colombia", city: "Bogotá D.C.", priority: "MEDIA", category: "Voluntariado", photo: img("1760726338804-48c662cbb782"), ago: "hace 12 min", mins: 12, dist: 3.2, validated: true },
  { id: "p2", kind: "need", x: 52, y: 42, title: "Fundación Transformando Vidas", city: "Calarcá, Quindío", priority: "MEDIA", category: "Alimentos y Agua", photo: img("1678885408084-90d814a3e464"), ago: "hace 34 min", mins: 34, dist: 210, validated: false },
  { id: "p3", kind: "need", x: 40, y: 46, title: "Estadio El Campín — albergue", city: "Bogotá D.C.", priority: "ALTA", category: "Albergue y Carpas", photo: img("1517137916198-332dd1c41fc6"), ago: "hace 8 min", mins: 8, dist: 5.1, validated: true },
  { id: "p4", kind: "need", x: 58, y: 52, title: "C.C. Gran Plaza — Bosa", city: "Bogotá D.C.", priority: "ALTA", category: "Alimentos y Agua", photo: img("1713019704587-9ca6cd08be75"), ago: "hace 1 h", mins: 62, dist: 12.4, validated: false },
  { id: "p5", kind: "offer", x: 62, y: 62, title: "Brigada médica voluntaria", city: "Villavicencio, Meta", priority: "MEDIA", category: "Insumos Médicos", photo: img("1666990975175-411922e46e06"), ago: "hace 20 min", mins: 20, dist: 98, validated: true },
  { id: "p6", kind: "need", x: 34, y: 58, title: "Comedor comunitario Siloé", city: "Cali, Valle", priority: "ALTA", category: "Alimentos y Agua", photo: img("1605032659978-a5bd04094a16"), ago: "hace 5 min", mins: 5, dist: 260, validated: true },
  { id: "p7", kind: "offer", x: 44, y: 66, title: "Punto de acopio UNAL", city: "Bogotá D.C.", priority: "BAJA", category: "Herramientas", photo: img("1698023424292-fd31ed53d4fa"), ago: "hace 2 h", mins: 120, dist: 7.8, validated: false },
  { id: "p8", kind: "need", x: 30, y: 40, title: "Barrio Obrero — Quibdó", city: "Quibdó, Chocó", priority: "MEDIA", category: "Insumos Médicos", photo: img("1666990985056-3b5b18a607c2"), ago: "hace 45 min", mins: 45, dist: 340, validated: false },
  { id: "p9", kind: "attended", x: 50, y: 72, title: "Escuela de Caballería", city: "Neiva, Huila", priority: "BAJA", category: "Voluntariado", photo: img("1633624514147-2c50e6e8eead"), ago: "hace 3 h", mins: 180, dist: 280, validated: true },
  { id: "p10", kind: "need", x: 56, y: 34, title: "Vereda La Esperanza", city: "Cúcuta, N. Santander", priority: "ALTA", category: "Voluntariado", photo: img("1551919764-a2c5cdb8d46c"), ago: "hace 15 min", mins: 15, dist: 390, validated: false },
  { id: "p11", kind: "offer", x: 48, y: 50, title: "Refugio temporal para mascotas", city: "Bogotá D.C.", priority: "MEDIA", category: "Mascotas", photo: img("1655944098799-7efb2b2d1dc7"), ago: "hace 40 min", mins: 40, dist: 9.3, validated: true },
  { id: "p12", kind: "need", x: 38, y: 64, title: "Entrega de agua potable", city: "Cali, Valle", priority: "ALTA", category: "Alimentos y Agua", photo: img("1559748059-8a0665dae088"), ago: "hace 25 min", mins: 25, dist: 255, validated: true },
  { id: "p13", kind: "need", x: 60, y: 44, title: "Colecta Nequi — kits escolares", city: "Bogotá D.C.", priority: "BAJA", category: "Nequi / Colectas", photo: img("1698023424292-fd31ed53d4fa"), ago: "hace 55 min", mins: 55, dist: 6.6, validated: false },
  { id: "p14", kind: "need", x: 42, y: 38, title: "Banco de sangre — donantes O-", city: "Medellín, Antioquia", priority: "ALTA", category: "Donación de Sangre", photo: img("1615461066841-6116e61058f4"), ago: "hace 3 min", mins: 3, dist: 240, validated: true },
]

export const CATEGORIES = CAT_META.map((c) => c.id)

export const HUBS = [
  { city: "Bogotá D.C.", dept: "Cundinamarca", need: 332, offer: 48 },
  { city: "Villavicencio", dept: "Meta", need: 13, offer: 3 },
  { city: "Cúcuta", dept: "Norte de Santander", need: 10, offer: 0 },
  { city: "Neiva", dept: "Huila", need: 6, offer: 0 },
  { city: "Cali", dept: "Valle del Cauca", need: 5, offer: 2 },
]

export type News = {
  source: string
  tone: "oficial" | "ungrd" | "cruzroja" | "invias" | "sgc"
  time: string
  text: string
}

export const NEWS: News[] = [
  { source: "Gobierno · Oficial", tone: "oficial", time: "Hoy 05:40", text: "El Gobierno mantiene atención prioritaria y recursos para la reconstrucción de infraestructura en zonas afectadas." },
  { source: "UNGRD", tone: "ungrd", time: "Hoy 05:12", text: "Subsidios de arriendo activos para familias damnificadas con censo del Registro Único de Damnificados (RUD)." },
  { source: "Cruz Roja", tone: "cruzroja", time: "Hoy 04:55", text: "Equipos de rescate y voluntarios coordinan acopio de víveres en centros habilitados por Cruz Roja y Defensa Civil." },
  { source: "INVÍAS #767", tone: "invias", time: "Hoy 04:30", text: "Monitoreo permanente en corredores viales principales; línea gratuita #767 habilitada para reportes." },
]

export const URGENT = {
  source: "UNGRD",
  text: "Alerta roja por crecientes súbitas en cuencas del Meta y Casanare. Evite zonas ribereñas.",
}

export type Quake = {
  mag: number
  place: string
  depth: string
  time: string
  felt: boolean
}

export const QUAKES: Quake[] = [
  { mag: 4.6, place: "6 km NE de Jordán", depth: "153.1 km", time: "19/07 8:44 p. m.", felt: true },
  { mag: 4.4, place: "133 km NW de Mosquera", depth: "10.0 km", time: "18/07 3:40 a. m.", felt: true },
  { mag: 4.5, place: "5 km S de Jordán", depth: "150.2 km", time: "18/07 1:10 p. m.", felt: true },
  { mag: 4.3, place: "5 km NE de Villanueva", depth: "152.5 km", time: "15/07 3:13 p. m.", felt: true },
  { mag: 4.3, place: "12 km SW de Piedecuesta", depth: "146.2 km", time: "23/07 10:10 a. m.", felt: true },
  { mag: 4.4, place: "148 km WSW de Santa Genoveva", depth: "18.4 km", time: "21/07 6:02 a. m.", felt: false },
]

export type Volunteer = {
  name: string
  role: string
  place: string
  tags: string[]
  photo: string
  available: boolean
}

export const VOLUNTEERS: Volunteer[] = [
  { name: "María G.", role: "Psicología · manejo de crisis", place: "Remoto / teléfono", tags: ["ReTHUS", "Salud mental"], photo: img("1494790108377-be9c29b29330", 240, 240), available: true },
  { name: "Ing. Julián R.", role: "Ingeniería estructural (COPNIA)", place: "Villavicencio, Meta", tags: ["COPNIA", "Infraestructura"], photo: img("1500648767791-00dcc994a43e", 240, 240), available: true },
  { name: "Camila O.", role: "Enfermería · primeros auxilios", place: "Bogotá D.C.", tags: ["ReTHUS", "Salud"], photo: img("1609436132311-e4b0c9370469", 240, 240), available: true },
  { name: "David M.", role: "Logística y transporte", place: "Cali, Valle", tags: ["Verificado", "Logística"], photo: img("1507003211169-0a1dd7228f2d", 240, 240), available: false },
  { name: "Laura P.", role: "Coordinación de acopio", place: "Calarcá, Quindío", tags: ["Verificado", "Alimentos"], photo: img("1714462396046-29272a3cb549", 240, 240), available: true },
  { name: "Andrés V.", role: "Rescate y evacuación", place: "Cúcuta, N. Santander", tags: ["Verificado", "Rescate"], photo: img("1590086782957-93c06ef21604", 240, 240), available: true },
  { name: "Sofía R.", role: "Trabajo social comunitario", place: "Neiva, Huila", tags: ["Verificado", "Comunidad"], photo: img("1701728667207-54b43dbdab97", 240, 240), available: false },
]

export const DONATIONS = [
  {
    org: "Cruz Roja Colombiana",
    desc: "Campaña nacional de atención médica, albergues y agua potable.",
    method: "Banco Davivienda · Cuenta Corriente",
    number: "0560 4550 6999 6490",
    meta: "NIT 899.999.025-3 · Daviplata habilitado",
    link: "Donar en línea con PSE / Tarjeta",
  },
  {
    org: "Banco de Alimentos de Colombia",
    desc: "Distribución masiva de paquetes nutricionales y agua a comedores comunitarios.",
    method: "Llave Bre-B / Interoperabilidad",
    number: "0091 677 852",
    meta: "Asociación de Bancos de Alimentos de Colombia",
    link: "Página oficial de recaudación",
  },
]

export type SupplyItem = { name: string; urgent?: boolean }

export type SupplyGroup = {
  id: string
  title: string
  emoji: string
  note: string
  items: SupplyItem[]
}

/** "Qué se necesita" — clasificado por categorías. */
export const SUPPLY_GROUPS: SupplyGroup[] = [
  {
    id: "agua",
    title: "Agua y alimentos",
    emoji: "🍲",
    note: "No perecederos, listos para repartir.",
    items: [
      { name: "Agua embotellada", urgent: true },
      { name: "Enlatados abre-fácil", urgent: true },
      { name: "Leche en polvo" },
      { name: "Granos y arroz" },
      { name: "Barras energéticas" },
    ],
  },
  {
    id: "salud",
    title: "Salud y primeros auxilios",
    emoji: "💊",
    note: "Insumos sellados y vigentes.",
    items: [
      { name: "Gasas estériles", urgent: true },
      { name: "Suero oral" },
      { name: "Alcohol y antisépticos" },
      { name: "Analgésicos comunes" },
      { name: "Tapabocas" },
    ],
  },
  {
    id: "mujer",
    title: "Salud e higiene de la mujer",
    emoji: "🌸",
    note: "Suele faltar y casi nadie la dona.",
    items: [
      { name: "Toallas higiénicas", urgent: true },
      { name: "Copas / protectores" },
      { name: "Ropa interior nueva" },
      { name: "Jabón íntimo" },
      { name: "Pruebas de embarazo" },
    ],
  },
  {
    id: "bebes",
    title: "Bebés y primera infancia",
    emoji: "🍼",
    note: "Marca el peso/talla si donas pañales.",
    items: [
      { name: "Pañales de bebé", urgent: true },
      { name: "Fórmula infantil", urgent: true },
      { name: "Teteros y chupos" },
      { name: "Pañitos húmedos" },
      { name: "Ropa de bebé nueva" },
    ],
  },
  {
    id: "aseo",
    title: "Aseo e higiene",
    emoji: "🧼",
    note: "Kits familiares sellados.",
    items: [
      { name: "Jabón y champú" },
      { name: "Pasta y cepillos dentales" },
      { name: "Pañales de adulto", urgent: true },
      { name: "Papel higiénico" },
    ],
  },
  {
    id: "mascotas",
    title: "Mascotas",
    emoji: "🐾",
    note: "Concentrado y accesorios básicos.",
    items: [
      { name: "Comida para perros/gatos", urgent: true },
      { name: "Correas y platos" },
      { name: "Cobijas para animales" },
    ],
  },
  {
    id: "logistica",
    title: "Logística",
    emoji: "📦",
    note: "Ayuda a mover y clasificar donaciones.",
    items: [
      { name: "Cajas grandes y cinta", urgent: true },
      { name: "Linternas y pilas" },
      { name: "Cobijas nuevas" },
    ],
  },
]

/** Cosas que ya NO reciben los centros de acopio. */
export const SUPPLY_STOP = [
  "Ropa usada",
  "Peluches",
  "Medicamentos vencidos",
  "Comida preparada",
]

export type Emergency = {
  number: string
  label: string
  detail: string
  tone: "need" | "offer" | "brand"
}

export const EMERGENCY: Emergency[] = [
  { number: "123", label: "Emergencias", detail: "Línea única nacional · 24/7", tone: "need" },
  { number: "122", label: "Fiscalía", detail: "Reportar delitos y desapariciones", tone: "brand" },
  { number: "#767", label: "Estado de vías", detail: "INVÍAS · cierres y reportes", tone: "offer" },
]

export type GuideStep = {
  n: string
  title: string
  body: string
  action?: string
}

/** Guía paso a paso: ¿Qué hacer? */
export const NEED_GUIDE: GuideStep[] = [
  {
    n: "1",
    title: "Registrarme como damnificado (RUD)",
    body: "El Registro Único de Damnificados habilita subsidios de arriendo y ayudas del Gobierno. Es 100% gratuito: nadie debe cobrarte por inscribirte. Ten a mano tu cédula y la dirección del hogar afectado.",
    action: "Abrir portal UNGRD",
  },
  {
    n: "2",
    title: "Mi vivienda quedó con grietas o daños",
    body: "No vuelvas a ingresar si hay grietas grandes, muros inclinados o techos comprometidos. Solicita una evaluación estructural gratuita a un ingeniero registrado en COPNIA a través del directorio de voluntarios.",
    action: "Ver ingenieros verificados",
  },
  {
    n: "3",
    title: "Subsidios y alivios confirmados",
    body: "Alivios en servicios públicos, prórrogas bancarias y subsidios de arriendo para familias censadas. Confirma siempre en canales oficiales antes de entregar datos o dinero.",
    action: "Ver alivios vigentes",
  },
  {
    n: "4",
    title: "Vías cerradas y cómo moverme",
    body: "Consulta el estado de corredores viales antes de salir. La línea gratuita #767 de INVÍAS recibe reportes 24/7 sobre cierres, derrumbes y pasos restringidos.",
    action: "Ver estado de vías",
  },
  {
    n: "5",
    title: "Busco a una persona desaparecida",
    body: "Reporta a la Fiscalía (122) y a la Cruz Roja (Restablecimiento del Contacto Familiar). Publica también en el mapa para que la red comunitaria ayude en la búsqueda.",
    action: "Publicar búsqueda en el mapa",
  },
  {
    n: "6",
    title: "Necesito apoyo emocional o psicológico",
    body: "Es normal sentir angustia tras una emergencia. Hay líneas gratuitas y confidenciales de atención en crisis disponibles todo el día.",
    action: "Ver líneas de salud mental",
  },
]

export type NewsSlide = {
  source: string
  tone: News["tone"]
  title: string
  text: string
  photo: string
}

export const NEWS_SLIDES: NewsSlide[] = [
  {
    source: "UNGRD · Alerta roja",
    tone: "ungrd",
    title: "Crecientes súbitas en el Meta y Casanare",
    text: "Evite zonas ribereñas. Equipos de respuesta desplegados en corredores del piedemonte.",
    photo: img("1633624514147-2c50e6e8eead", 900, 500),
  },
  {
    source: "Cruz Roja",
    tone: "cruzroja",
    title: "Acopio de víveres en centros habilitados",
    text: "Voluntarios y brigadistas coordinan la entrega de agua potable y kits de aseo.",
    photo: img("1713019704587-9ca6cd08be75", 900, 500),
  },
  {
    source: "INVÍAS #767",
    tone: "invias",
    title: "Monitoreo permanente de corredores viales",
    text: "Paso restringido Bogotá–Villavicencio. Línea gratuita #767 habilitada 24/7.",
    photo: img("1655944098799-7efb2b2d1dc7", 900, 500),
  },
]

export type NotifType = {
  id: string
  label: string
  detail: string
  on: boolean
}

export const NOTIF_TYPES: NotifType[] = [
  { id: "sismos", label: "Sismos (SGC)", detail: "Eventos sentidos ≥ 4.0 en tu zona", on: true },
  { id: "ungrd", label: "Alertas UNGRD", detail: "Alertas rojas y naranjas oficiales", on: true },
  { id: "vias", label: "Estado de vías (INVÍAS)", detail: "Cierres y pasos restringidos", on: false },
  { id: "sangre", label: "Pedidos de sangre", detail: "Bancos de sangre cercanos", on: true },
  { id: "cerca", label: "Necesidades cercanas", detail: "Nuevas necesidades a < 5 km", on: false },
  { id: "novedades", label: "Boletines y novedades", detail: "Comunicados verificados", on: true },
]

export const MENTAL_HEALTH = [
  { name: "Línea 106 · Salud mental", detail: "Atención en crisis 24/7 — Bogotá" },
  { name: "Línea 192 opción 4", detail: "Orientación en salud MinSalud" },
  { name: "Cruz Roja · Apoyo psicosocial", detail: "Acompañamiento a damnificados" },
]
