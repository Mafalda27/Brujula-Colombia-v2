import { useEffect, useState } from "react"
import {
  Compass,
  LayoutDashboard,
  MapPin,
  Siren,
  HandHeart,
  Users,
  HeartHandshake,
  Newspaper,
  BarChart3,
  Download,
  Bell,
  ShieldCheck,
  Search,
  Navigation,
  RefreshCw,
  Copy,
  ExternalLink,
  Check,
  Phone,
  ArrowRight,
  Menu,
  X,
  Activity,
  PawPrint,
  Droplet,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  Building2,
  Map as MapIcon,
  Clock,
  Smartphone,
  Apple,
  QrCode,
  AlertTriangle,
  Ban,
  Plus,
  Waves,
  Route,
} from "lucide-react"
import {
  KPIS,
  PINS,
  HUBS,
  NEWS,
  NEWS_SLIDES,
  NOTIF_TYPES,
  CAT_META,
  TIPOS,
  ORDENES,
  URGENT,
  QUAKES,
  VOLUNTEERS,
  DONATIONS,
  SUPPLY_GROUPS,
  SUPPLY_STOP,
  EMERGENCY,
  NEED_GUIDE,
  MENTAL_HEALTH,
  LAST_SYNC,
  type Kpi,
  type Pin,
} from "./lib/data"

type Section =
  | "inicio"
  | "mapa"
  | "estadisticas"
  | "necesito"
  | "ofrezco"
  | "voluntarios"
  | "donar"
  | "novedades"

const NAV: { id: Section; label: string; icon: typeof MapPin; primary?: boolean }[] = [
  { id: "inicio", label: "Inicio", icon: LayoutDashboard, primary: true },
  { id: "mapa", label: "Mapa en vivo", icon: MapPin, primary: true },
  { id: "necesito", label: "Necesito ayuda", icon: Siren, primary: true },
  { id: "ofrezco", label: "Ofrezco ayuda", icon: HandHeart, primary: true },
  { id: "voluntarios", label: "Voluntarios", icon: Users, primary: true },
  { id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
  { id: "novedades", label: "Novedades", icon: Newspaper },
  { id: "donar", label: "Donar", icon: HeartHandshake },
]

const toneColor: Record<Kpi["tone"], { text: string; dot: string; tile: string }> = {
  need: { text: "text-need", dot: "bg-need", tile: "bg-need-soft" },
  offer: { text: "text-offer", dot: "bg-offer", tile: "bg-offer-soft" },
  pet: { text: "text-pet", dot: "bg-pet", tile: "bg-tint-sun" },
  blood: { text: "text-blood", dot: "bg-blood", tile: "bg-need-soft" },
}

const newsTone: Record<string, string> = {
  oficial: "text-brand",
  ungrd: "text-need",
  cruzroja: "text-blood",
  invias: "text-pet",
  sgc: "text-offer",
}

/* --------------------------------------------------------------- primitives */

function SectionHead({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <header className="mb-5 border-l-2 border-accent pl-3.5">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{kicker}</p>
      <h1 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        {title}
      </h1>
      {desc && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">{desc}</p>}
    </header>
  )
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-card border border-white/10 bg-surface shadow-tile ${className}`}>{children}</div>
}

function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`overflow-hidden bg-line ${className}`}>
      {ok ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setOk(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-ink-faint">
          <MapPin size={20} />
        </div>
      )}
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-pill bg-brand px-5 py-3 text-sm font-bold text-paper transition hover:bg-brand/90 active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-brand bg-brand text-paper"
          : "border-line bg-surface text-ink-soft hover:border-line-strong"
      }`}
    >
      {children}
    </button>
  )
}

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value.replace(/\s/g, ""))
        setDone(true)
        setTimeout(() => setDone(false), 1600)
      }}
      className="flex w-full items-center justify-center gap-2 rounded-pill border border-line bg-paper py-3 text-sm font-semibold text-ink transition hover:border-line-strong"
    >
      {done ? <Check size={15} className="text-offer" /> : <Copy size={15} />}
      {done ? "Copiado" : "Copiar número"}
    </button>
  )
}

function Paginator({
  page,
  pages,
  onChange,
}: {
  page: number
  pages: number
  onChange: (p: number) => void
}) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="flex h-9 w-9 items-center justify-center rounded-pill border border-line bg-surface text-ink transition hover:border-line-strong disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`h-2.5 rounded-pill transition-all ${
            i === page ? "w-6 bg-brand" : "w-2.5 bg-line-strong hover:bg-ink-faint"
          }`}
          aria-label={`Página ${i + 1}`}
        />
      ))}
      <button
        onClick={() => onChange(Math.min(pages - 1, page + 1))}
        disabled={page === pages - 1}
        className="flex h-9 w-9 items-center justify-center rounded-pill border border-line bg-surface text-ink transition hover:border-line-strong disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

/* -------------------------------------------------------------- news carousel */

function NewsCarousel({ onOpen }: { onOpen: () => void }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % NEWS_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])
  const s = NEWS_SLIDES[i]
  return (
    <div className="relative overflow-hidden rounded-tile border border-line bg-surface">
      <button onClick={onOpen} className="relative block h-40 w-full text-left sm:h-44">
        <Photo src={s.photo} alt={s.title} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="inline-flex items-center gap-1 rounded-pill bg-white/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-ink">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-need" /> {s.source}
          </span>
          <h3 className="mt-2 font-display text-base font-bold leading-tight text-white">{s.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{s.text}</p>
        </div>
      </button>
      <div className="absolute right-3 top-3 flex gap-1.5">
        {NEWS_SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`h-1.5 rounded-pill transition-all ${k === i ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
            aria-label={`Alerta ${k + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- the map core */

const pinTone: Record<string, string> = { need: "bg-need", offer: "bg-offer", attended: "bg-line-strong" }
const priorityTone: Record<Pin["priority"], string> = {
  ALTA: "bg-need-soft text-need",
  MEDIA: "bg-tint-sun text-pet",
  BAJA: "bg-offer-soft text-offer",
}

function MiniMap({
  filter,
  activeId,
  setActive,
}: {
  filter: (p: Pin) => boolean
  activeId: string | null
  setActive: (id: string | null) => void
}) {
  const pins = PINS.filter(filter)
  const sel = PINS.find((p) => p.id === activeId)
  return (
    <div className="relative aspect-[4/3] w-full bg-[#efe4d4] sm:aspect-[16/10]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(120,88,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,88,55,0.06) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path
          d="M40 6 C55 4 64 12 62 22 C74 26 76 40 66 46 C70 58 58 66 52 74 C44 80 34 74 34 64 C22 62 20 50 28 44 C20 38 24 24 34 24 C32 14 33 8 40 6 Z"
          fill="#e6d3b8"
          stroke="#d8c09a"
          strokeWidth="0.4"
        />
      </svg>
      {pins.map((p) => (
        <button
          key={p.id}
          onClick={() => setActive(p.id === activeId ? null : p.id)}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          aria-label={p.title}
        >
          <span
            className={`block h-3.5 w-3.5 rounded-full ring-2 ring-surface transition ${pinTone[p.kind]} ${
              activeId === p.id ? "scale-150" : "hover:scale-125"
            }`}
          />
        </button>
      ))}
      {sel && (
        <button
          onClick={() => setActive(null)}
          className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border border-line bg-surface/95 p-2 text-left shadow-lg backdrop-blur sm:inset-x-auto sm:right-3 sm:w-72"
        >
          <Photo src={sel.photo} alt={sel.title} className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${pinTone[sel.kind]}`} />
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                {sel.kind === "need" ? "Necesidad" : sel.kind === "offer" ? "Oferta" : "Atendido"}
              </span>
            </div>
            <p className="truncate font-display text-sm font-bold leading-tight">{sel.title}</p>
            <p className="truncate text-xs text-ink-soft">{sel.city}</p>
          </div>
        </button>
      )}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        {["Toda Colombia", "Ciudad", "GPS"].map((s, k) => (
          <span
            key={s}
            className={`rounded-pill border px-3 py-1.5 text-xs font-semibold backdrop-blur ${
              k === 0 ? "border-brand bg-brand text-paper" : "border-line bg-surface/90 text-ink"
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

function ResultCard({ p, onSelect }: { p: Pin; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="group flex overflow-hidden rounded-tile border border-white/10 bg-surface text-left shadow-tile transition hover:-translate-y-0.5 hover:shadow-glow"
    >
      <Photo src={p.photo} alt={p.title} className="h-auto w-28 shrink-0 self-stretch" />
      <div className="min-w-0 flex-1 p-3.5">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${
              p.kind === "need" ? "bg-need-soft text-need" : p.kind === "offer" ? "bg-offer-soft text-offer" : "bg-paper text-ink-faint"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${pinTone[p.kind]}`} />
            {p.kind === "need" ? "Necesidad" : p.kind === "offer" ? "Oferta" : "Atendido"}
          </span>
          <span className={`rounded-pill px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${priorityTone[p.priority]}`}>
            {p.priority}
          </span>
        </div>
        <h3 className="truncate font-display text-sm font-bold leading-tight">{p.title}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
          <MapPin size={11} /> {p.city} · {p.category}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase text-ink-faint">
            <Clock size={10} /> {p.ago}
          </span>
          <span className="flex items-center gap-0.5 text-xs font-bold text-accent">
            Ver mapa <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </button>
  )
}

type Opt = { id: string; emoji?: string; label: string }

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Opt[]
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const cur = options.find((o) => o.id === value) ?? options[0]
  return (
    <div className="relative">
      <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wide text-ink-faint">
        {label}
      </label>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl border bg-surface px-3.5 py-3 text-sm font-semibold shadow-tile transition ${
          open ? "border-accent ring-4 ring-accent/15" : "border-white/10 hover:-translate-y-0.5"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {cur.emoji && <span>{cur.emoji}</span>}
          {cur.label}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-ink-faint transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[200px] rounded-2xl border border-line bg-surface p-1.5 shadow-glow">
            {options.map((o) => {
              const on = o.id === value
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    onChange(o.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    on ? "bg-brand text-paper" : "text-ink hover:bg-paper"
                  }`}
                >
                  <Check size={14} className={on ? "opacity-100" : "opacity-0"} />
                  {o.emoji && <span>{o.emoji}</span>}
                  <span className="truncate">{o.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function FuentesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  const items = [
    {
      icon: Building2,
      tone: "text-brand",
      title: "Entidades y canales oficiales",
      text: "La información de subsidios, albergues y censos proviene directamente de la UNGRD, Cruz Roja Colombiana, INVÍAS (#767) y los Ministerios de Salud y Transporte.",
    },
    {
      icon: ShieldCheck,
      tone: "text-offer",
      title: "Validación de profesionales (ReTHUS & COPNIA)",
      text: "Cada médico, psicólogo o ingeniero registrado es consultado en ReTHUS o en COPNIA antes de asignarle la insignia verificada.",
    },
    {
      icon: MapIcon,
      tone: "text-accent",
      title: "Mapa colaborativo en tiempo real",
      text: "Sincronizado con la red ciudadana. Cada punto requiere validación comunitaria en terreno: 3 confirmaciones para alcanzar el estado ✅ Validado.",
    },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-t-tile bg-surface p-6 shadow-glow sm:rounded-tile" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tint-sky text-brand">
            <ShieldCheck size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-extrabold">Fuentes oficiales y metodología</h2>
            <p className="text-sm text-ink-soft">Transparencia y verificación comunitaria</p>
          </div>
          <button onClick={onClose} className="rounded-pill border border-line p-2 hover:bg-paper">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-line bg-paper p-4">
              <div className="mb-1 flex items-center gap-2">
                <it.icon size={16} className={it.tone} />
                <h3 className="font-display text-sm font-bold">{it.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{it.text}</p>
            </div>
          ))}
        </div>
        <PrimaryButton className="mt-5 w-full" onClick={onClose}>
          Entendido
        </PrimaryButton>
      </div>
    </div>
  )
}

const PAGE = 4
const priorityRank: Record<Pin["priority"], number> = { ALTA: 0, MEDIA: 1, BAJA: 2 }

function MapaResults() {
  const [cat, setCat] = useState<string>("todas")
  const [tipo, setTipo] = useState<string>("todo")
  const [orden, setOrden] = useState<string>("recientes")
  const [active, setActive] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [fuentes, setFuentes] = useState(false)

  const filter = (p: Pin) => {
    const tipoOk =
      tipo === "todo" ? true : tipo === "validados" ? p.validated : p.kind === tipo
    const catOk = cat === "todas" ? true : p.category === cat
    return tipoOk && catOk
  }

  const results = [...PINS.filter(filter)].sort((a, b) => {
    if (orden === "urgentes") return priorityRank[a.priority] - priorityRank[b.priority]
    if (orden === "cercanos") return a.dist - b.dist
    return a.mins - b.mins
  })

  const pages = Math.ceil(results.length / PAGE)
  const shown = results.slice(page * PAGE, page * PAGE + PAGE)

  const set = (fn: (v: string) => void) => (v: string) => {
    fn(v)
    setPage(0)
  }

  const catOptions: Opt[] = [
    { id: "todas", label: "Todas las categorías" },
    ...CAT_META.map((c) => ({ id: c.id, emoji: c.emoji, label: c.id })),
  ]

  return (
    <div className="space-y-5">
      {/* live status row */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-2 rounded-pill bg-offer-soft px-3.5 py-2 text-sm font-bold text-offer">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-offer opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-pill bg-offer" />
          </span>
          Conectado en vivo · {results.length} puntos
        </span>
        <button
          onClick={() => setFuentes(true)}
          className="flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-brand hover:border-line-strong"
        >
          <Info size={15} /> Fuentes
        </button>
        <span className="flex items-center gap-1.5 rounded-pill border border-accent/40 bg-accent/10 px-3.5 py-2 text-sm font-semibold text-pet">
          <Activity size={15} /> Ver estado de vías
        </span>
      </div>

      {/* map + search */}
      <div className="overflow-hidden rounded-tile border border-line bg-surface shadow-tile">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              placeholder="Busca municipio o dirección…"
              className="w-full rounded-pill border border-line bg-paper py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-ink-faint focus:border-brand"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-pill border border-line bg-paper px-3 py-2.5 text-sm font-semibold hover:border-line-strong">
            <Navigation size={15} /> Mi GPS
          </button>
          <button className="flex items-center gap-1.5 rounded-pill border border-line bg-paper px-3 py-2.5 text-sm font-semibold hover:border-line-strong">
            <RefreshCw size={15} /> Sincronizar
          </button>
        </div>
        <MiniMap filter={filter} activeId={active} setActive={setActive} />
        <div className="flex flex-wrap gap-4 border-t border-line p-3 text-xs font-medium">
          <Legend dot="bg-need" label="Necesidad" />
          <Legend dot="bg-offer" label="Oferta" />
          <Legend dot="bg-line-strong" label="Atendido" />
        </div>
      </div>

      {/* the three dropdowns */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Dropdown label="Categoría" value={cat} options={catOptions} onChange={set(setCat)} />
        <Dropdown label="Tipo" value={tipo} options={TIPOS as unknown as Opt[]} onChange={set(setTipo)} />
        <Dropdown label="Ordenar" value={orden} options={ORDENES as unknown as Opt[]} onChange={set(setOrden)} />
      </div>

      {/* results */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold">Publicaciones activas ({results.length})</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((p) => (
          <ResultCard key={p.id} p={p} onSelect={() => setActive(p.id)} />
        ))}
      </div>
      <Paginator page={page} pages={pages} onChange={setPage} />

      <FuentesModal open={fuentes} onClose={() => setFuentes(false)} />
    </div>
  )
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} /> {label}
    </span>
  )
}

/* ---------------------------------------------------------- notifications modal */

function NotifModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [types, setTypes] = useState(NOTIF_TYPES)
  const [push, setPush] = useState(false)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-t-tile bg-surface p-6 sm:rounded-tile"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold">Notificaciones</h2>
            <p className="text-sm text-ink-soft">Elige qué alertas quieres recibir.</p>
          </div>
          <button onClick={onClose} className="rounded-pill border border-line p-2 hover:bg-paper">
            <X size={18} />
          </button>
        </div>

        <label className="accent-gradient mt-4 flex items-center gap-3 rounded-2xl p-4 text-[#12100c]">
          <Bell size={20} />
          <div className="flex-1">
            <div className="font-bold">Activar notificaciones push</div>
            <div className="text-xs text-[#12100c]/70">Recíbelas aunque la app esté cerrada</div>
          </div>
          <Toggle on={push} onToggle={() => setPush((v) => !v)} light />
        </label>

        <div className="mt-4 space-y-1">
          {types.map((t) => (
            <label
              key={t.id}
              className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                t.on && push ? "border-line bg-paper" : "border-transparent"
              }`}
            >
              <div className="flex-1">
                <div className="text-sm font-semibold">{t.label}</div>
                <div className="text-xs text-ink-faint">{t.detail}</div>
              </div>
              <Toggle
                on={t.on}
                onToggle={() =>
                  setTypes((prev) => prev.map((x) => (x.id === t.id ? { ...x, on: !x.on } : x)))
                }
              />
            </label>
          ))}
        </div>

        <PrimaryButton className="mt-5 w-full" onClick={onClose}>
          Guardar preferencias
        </PrimaryButton>
      </div>
    </div>
  )
}

function Toggle({ on, onToggle, light = false }: { on: boolean; onToggle: () => void; light?: boolean }) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-pill transition ${
        on ? (light ? "bg-accent" : "bg-offer") : light ? "bg-white/25" : "bg-line-strong"
      }`}
      role="switch"
      aria-checked={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-pill bg-white shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  )
}

/* ------------------------------------------------------------- download modal  */

function DownloadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-t-tile bg-surface p-6 sm:rounded-tile"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold">Lleva Brújula contigo</h2>
            <p className="text-sm text-ink-soft">Funciona sin conexión y te avisa en tiempo real.</p>
          </div>
          <button onClick={onClose} className="rounded-pill border border-line p-2 hover:bg-paper">
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-paper p-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-surface text-ink">
            <QrCode size={72} />
          </div>
          <p className="text-sm text-ink-soft">
            Escanea el código con tu teléfono para instalar la app o descarga el archivo APK
            directamente.
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <a
            href="#descargar-apk"
            className="accent-gradient flex items-center gap-3 rounded-2xl p-4 text-[#12100c] transition hover:brightness-105"
          >
            <Smartphone size={22} />
            <div className="flex-1">
              <div className="font-bold">Descargar APK (Android)</div>
              <div className="text-xs text-[#12100c]/70">v2.4 · 18 MB · fuera de Play Store</div>
            </div>
            <Download size={18} />
          </a>
          <a
            href="#appstore"
            className="flex items-center gap-3 rounded-2xl border border-line p-4 transition hover:bg-paper"
          >
            <Apple size={22} />
            <div className="flex-1">
              <div className="font-bold">App Store (iOS)</div>
              <div className="text-xs text-ink-faint">Próximamente</div>
            </div>
            <ExternalLink size={16} className="text-ink-faint" />
          </a>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- sections */

function BentoTile({
  onClick,
  className = "",
  style,
  children,
}: {
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`group relative flex flex-col overflow-hidden rounded-tile p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  )
}

const kpiIcon: Record<Kpi["tone"], typeof Siren> = {
  need: Siren,
  offer: HandHeart,
  pet: PawPrint,
  blood: Droplet,
}

function KpiStrip({ onOpen }: { onOpen: (s: Section) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {KPIS.map((k) => {
        const t = toneColor[k.tone]
        const Icon = kpiIcon[k.tone]
        const target: Section = k.tone === "need" ? "necesito" : k.tone === "offer" ? "ofrezco" : "mapa"
        return (
          <button
            key={k.key}
            onClick={() => onOpen(target)}
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-surface px-3.5 py-3 text-left shadow-tile transition hover:-translate-y-0.5 hover:border-line-strong"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.tile} ${t.text}`}>
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className={`font-display text-xl font-extrabold tabular leading-none ${t.text}`}>{k.value}</span>
                <span className="truncate text-xs font-semibold text-ink">{k.label}</span>
              </div>
              <div className="truncate font-mono text-[10px] uppercase tracking-wide text-ink-faint">{k.sub}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

const emgTone: Record<string, string> = {
  need: "bg-need-soft text-need ring-need/30",
  offer: "bg-offer-soft text-offer ring-offer/30",
  brand: "bg-tint-sky text-brand ring-white/15",
}

function EmergencyStrip() {
  return (
    <div className="rounded-tile border border-need/25 bg-need-soft/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle size={16} className="text-need" />
        <p className="text-sm font-bold text-ink">¿Es una emergencia vital?</p>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-ink-faint">Llamada gratis</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {EMERGENCY.map((e) => (
          <a
            key={e.number}
            href={`tel:${e.number.replace(/\D/g, "")}`}
            className={`flex items-center gap-3 rounded-2xl bg-surface p-3 ring-1 shadow-tile transition hover:-translate-y-0.5 ${emgTone[e.tone]}`}
          >
            <Phone size={15} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-lg font-extrabold leading-none tabular">{e.number}</div>
              <div className="truncate text-[11px] text-ink-soft">{e.label} · {e.detail}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function Accordion({ step, open, onToggle, onAction }: { step: typeof NEED_GUIDE[number]; open: boolean; onToggle: () => void; onAction?: () => void }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition ${open ? "border-accent/40 bg-surface" : "border-white/10 bg-surface"}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold ${open ? "accent-gradient text-[#12100c]" : "bg-paper text-ink-soft"}`}>
          {step.n}
        </span>
        <span className="flex-1 font-display text-sm font-bold text-ink">{step.title}</span>
        <ChevronDown size={16} className={`shrink-0 text-ink-faint transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-ink-soft">{step.body}</p>
          {step.action && (
            <button
              onClick={onAction}
              className="mt-3 inline-flex items-center gap-1.5 rounded-pill border border-line bg-paper px-3.5 py-2 text-xs font-bold text-accent transition hover:border-line-strong"
            >
              {step.action} <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function SismoVias() {
  const q = QUAKES[0]
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-tile border border-white/10 bg-surface p-4 shadow-tile">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-need/30 bg-need-soft">
          <Waves size={13} className="text-need" />
          <span className="font-display text-lg font-extrabold leading-none tabular text-need">{q.mag}</span>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">SGC · Último sismo</p>
          <p className="truncate font-display text-sm font-bold">{q.place}</p>
          <p className="truncate text-xs text-ink-soft">Prof. {q.depth} · {q.time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-tile border border-white/10 bg-surface p-4 shadow-tile">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-pet/30 bg-tint-sun">
          <Route size={16} className="text-pet" />
          <span className="mt-0.5 font-mono text-[9px] font-bold text-pet">#767</span>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">INVÍAS · Vías</p>
          <p className="truncate font-display text-sm font-bold">2 novedades activas</p>
          <p className="truncate text-xs text-ink-soft">Bogotá–Villavicencio restringida</p>
        </div>
      </div>
    </div>
  )
}

function Inicio({ go, openDownload }: { go: (s: Section) => void; openDownload: () => void }) {
  const [active, setActive] = useState<string | null>(null)
  const [tab, setTab] = useState<"cobertura" | "urgencia">("cobertura")
  const need = KPIS.find((k) => k.tone === "need")?.value ?? 0
  const offer = KPIS.find((k) => k.tone === "offer")?.value ?? 0
  const coverage = need ? Math.round((offer / need) * 100) : 0

  return (
    <div className="space-y-4">
      {/* greeting + live band */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
          Hola, Colombia <span className="align-middle">👋</span>
        </h1>
        <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-accent opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-pill bg-accent" />
          </span>
          En vivo · {LAST_SYNC}
        </span>
        <p className="w-full text-sm text-ink-soft">
          Mapa, necesidades, voluntarios y donaciones — coordinados en un solo lugar.
        </p>
      </div>

      {/* emergency vital numbers */}
      <EmergencyStrip />

      {/* MAP hero (light inset) + coverage gauge */}
      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="relative overflow-hidden rounded-tile bg-surface p-2 shadow-glow">
          <div className="relative h-[300px] w-full overflow-hidden rounded-[22px] sm:h-[380px]">
            <MiniMap filter={() => true} activeId={active} setActive={setActive} />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3">
              <span className="glass flex items-center gap-2 rounded-pill px-3.5 py-2 ring-1 ring-white/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-offer opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-pill bg-offer" />
                </span>
                <span className="text-sm font-extrabold text-ink">Mapa en vivo</span>
                <span className="hidden font-mono text-xs font-semibold text-ink-soft sm:inline">451 puntos</span>
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent p-3">
              <div className="hidden text-white sm:block">
                <p className="font-display text-lg font-extrabold drop-shadow">Ayuda cerca de ti</p>
                <p className="text-xs text-white/85 drop-shadow">Georreferenciada en tiempo real</p>
              </div>
              <button
                onClick={() => go("mapa")}
                className="pointer-events-auto ml-auto inline-flex items-center gap-2 rounded-pill bg-white px-5 py-3 text-sm font-bold text-[#12100c] transition hover:brightness-95 active:scale-[0.98]"
              >
                Abrir mapa <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* coverage gauge card */}
        <div className="flex flex-col rounded-tile bg-surface p-6 shadow-tile">
          <div className="flex gap-1 rounded-pill bg-paper p-1 shadow-inset">
            {(["cobertura", "urgencia"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 rounded-pill py-2 text-xs font-bold capitalize transition ${
                  tab === id ? "bg-brand text-paper" : "text-ink-soft"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
          <div className="relative mt-4 flex flex-1 items-center justify-center">
            <Gauge pct={tab === "cobertura" ? coverage : 82} />
            <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
              <span className="font-display text-4xl font-extrabold tabular">
                {tab === "cobertura" ? coverage : 82}%
              </span>
              <span className="text-xs font-semibold text-accent">
                {tab === "cobertura" ? "Demanda cubierta" : "Casos urgentes"}
              </span>
            </div>
          </div>
          <button
            onClick={() => go("estadisticas")}
            className="mt-2 flex items-center justify-center gap-1 rounded-pill border border-line py-2.5 text-xs font-bold text-ink-soft transition hover:bg-paper"
          >
            Ver estadísticas <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* official signals */}
      <SismoVias />

      {/* primary action tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <BentoTile onClick={() => go("necesito")} className="h-40 bg-surface shadow-tile ring-1 ring-need/30">
          <span className="mb-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-need-soft text-need"><Siren size={20} /></span>
          <div className="font-display text-lg font-extrabold leading-tight">Necesito ayuda</div>
          <div className="text-xs text-ink-soft">Reporta o solicita apoyo</div>
        </BentoTile>
        <BentoTile onClick={() => go("ofrezco")} className="h-40 bg-surface shadow-tile ring-1 ring-offer/30">
          <span className="mb-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-offer-soft text-offer"><HandHeart size={20} /></span>
          <div className="font-display text-lg font-extrabold leading-tight">Ofrezco ayuda</div>
          <div className="text-xs text-ink-soft">Súmate como voluntario</div>
        </BentoTile>
        <BentoTile onClick={() => go("voluntarios")} className="col-span-2 h-40 bg-surface shadow-tile">
          <div className="mb-auto flex items-center justify-between">
            <span className="font-display font-extrabold text-ink">Voluntarios verificados</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-accent text-[#12100c] transition group-hover:translate-x-0.5">
              <ChevronRight size={18} />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {VOLUNTEERS.slice(0, 5).map((v) => (
                <img key={v.name} src={v.photo} alt={v.name} className="h-11 w-11 rounded-pill border-2 border-surface object-cover" />
              ))}
            </div>
            <span className="text-sm font-semibold text-ink-soft">+54 activos hoy</span>
          </div>
        </BentoTile>
      </div>

      {/* secondary row */}
      <div className="grid gap-3 lg:grid-cols-4">
        <div className="shadow-tile rounded-tile lg:col-span-2">
          <NewsCarousel onOpen={() => go("novedades")} />
        </div>
        <BentoTile onClick={() => go("donar")} className="bg-surface shadow-tile">
          <span className="mb-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-tint-peach text-accent"><HeartHandshake size={20} /></span>
          <div className="font-display text-lg font-extrabold">Donar</div>
          <div className="text-xs text-ink-soft">Cuentas verificadas e insumos</div>
        </BentoTile>
        <BentoTile onClick={openDownload} className="accent-gradient text-[#12100c] shadow-glow">
          <Download size={24} className="mb-auto" />
          <div className="font-display text-lg font-extrabold">Descargar app</div>
          <div className="text-xs text-[#12100c]/75">APK · funciona sin conexión</div>
        </BentoTile>
      </div>

      {/* últimas actualizaciones feed */}
      <div className="rounded-tile border border-white/10 bg-surface shadow-tile">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="font-display text-sm font-bold">Últimas actualizaciones</h3>
          <button onClick={() => go("novedades")} className="flex items-center gap-1 text-xs font-bold text-accent">
            Ver todas <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-line">
          {NEWS.slice(0, 3).map((n, i) => (
            <button key={i} onClick={() => go("novedades")} className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-paper">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.tone === "ungrd" ? "bg-need" : n.tone === "cruzroja" ? "bg-blood" : n.tone === "invias" ? "bg-pet" : "bg-offer"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-wide ${newsTone[n.tone] ?? "text-ink"}`}>{n.source}</span>
                  <span className="font-mono text-[10px] uppercase text-ink-faint">{n.time}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{n.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Mapa() {
  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Mapa colaborativo"
        title="Mapa de ayuda en vivo"
        desc="Cada punto es una necesidad o una oferta puesta por la comunidad y validada en terreno. Filtra por tipo y categoría; los resultados aparecen como tarjetas."
      />
      <MapaResults />
    </div>
  )
}

function Gauge({ pct }: { pct: number }) {
  const R = 52
  const C = Math.PI * R // semicircle length
  const off = C * (1 - pct / 100)
  return (
    <svg viewBox="0 0 140 82" className="w-full max-w-[240px]">
      <path
        d="M 18 74 A 52 52 0 0 1 122 74"
        fill="none"
        stroke="var(--color-line)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 18 74 A 52 52 0 0 1 122 74"
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
      />
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb057" />
          <stop offset="1" stopColor="var(--color-accent-2)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function Estadisticas() {
  const total = KPIS.reduce((a, k) => a + k.value, 0)
  const need = KPIS.find((k) => k.tone === "need")?.value ?? 0
  const offer = KPIS.find((k) => k.tone === "offer")?.value ?? 0
  const coverage = need ? Math.round((offer / need) * 100) : 0
  return (
    <div className="space-y-8">
      <SectionHead
        kicker="Estadísticas en vivo"
        title="Situación consolidada de la red"
        desc={`${total} señales activas agregadas de todos los municipios. Un solo tablero sincronizado con fuentes oficiales.`}
      />

      {/* claymorphic coverage gauge */}
      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <Card className="flex flex-col items-center p-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">Cobertura de la red</span>
          <div className="relative mt-2 flex items-end justify-center">
            <Gauge pct={coverage} />
            <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
              <span className="font-display text-4xl font-extrabold tabular text-ink">{coverage}%</span>
            </div>
          </div>
          <p className="-mt-2 text-sm font-semibold text-accent-2">Demanda con oferta asignada</p>
          <p className="mt-1 text-xs text-ink-soft">
            {offer} ofertas activas frente a {need} necesidades abiertas. Faltan manos.
          </p>
        </Card>
        <Card className="flex flex-col justify-center gap-3 p-6">
          <h3 className="font-display text-lg font-bold">Lectura rápida</h3>
          {[
            ["🔴", `${need} necesidades`, "requieren atención en terreno"],
            ["🟢", `${offer} ofertas`, "de voluntarios y profesionales"],
            ["📈", `${coverage}% cubierto`, "queda una brecha por cerrar hoy"],
          ].map(([e, a, b]) => (
            <div key={a} className="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3 shadow-inset">
              <span className="text-xl">{e}</span>
              <div>
                <span className="font-display font-bold">{a}</span>
                <span className="text-sm text-ink-soft"> · {b}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => {
          const t = toneColor[k.tone]
          const Icon = k.tone === "need" ? Siren : k.tone === "offer" ? HandHeart : k.tone === "pet" ? PawPrint : Droplet
          return (
            <div key={k.key} className={`rounded-tile ${t.tile} p-6 shadow-tile`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink-soft">{k.label}</span>
                <Icon size={18} className={t.text} />
              </div>
              <div className={`font-display text-5xl font-extrabold tabular ${t.text}`}>{k.value}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">{k.sub}</div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-pill bg-white/60">
                <div className={`h-full ${t.dot}`} style={{ width: `${Math.min(100, (k.value / total) * 100 + 8)}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-line p-4">
          <h3 className="font-display font-bold">Distribución por hub</h3>
        </div>
        <div className="divide-y divide-line">
          {HUBS.map((h) => {
            const max = HUBS[0].need + HUBS[0].offer
            const tot = h.need + h.offer
            return (
              <div key={h.city} className="flex items-center gap-4 px-4 py-3">
                <div className="w-36 shrink-0">
                  <div className="text-sm font-semibold">{h.city}</div>
                  <div className="text-xs text-ink-faint">{h.dept}</div>
                </div>
                <div className="flex h-4 flex-1 overflow-hidden rounded-pill bg-paper">
                  <div className="h-full bg-need" style={{ width: `${(h.need / max) * 100}%` }} />
                  <div className="h-full bg-offer" style={{ width: `${(h.offer / max) * 100}%` }} />
                </div>
                <div className="w-10 text-right tabular text-sm font-bold">{tot}</div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink-soft">{label}</span>
      <input
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-paper px-3.5 py-2.5 text-sm shadow-inset outline-none placeholder:text-ink-faint focus:border-accent"
      />
    </label>
  )
}

function Necesito() {
  const [open, setOpen] = useState<string>("1")
  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Necesito ayuda"
        title="Guía paso a paso: ¿qué hacer?"
        desc="Rutas verificadas para damnificados. No reemplaza los canales oficiales de emergencia del Estado."
      />

      <div className="space-y-2">
        {NEED_GUIDE.map((s) => (
          <Accordion
            key={s.n}
            step={s}
            open={open === s.n}
            onToggle={() => setOpen((v) => (v === s.n ? "" : s.n))}
          />
        ))}
      </div>

      {/* urgent publish callout */}
      <div className="flex flex-col gap-3 rounded-tile border border-need/25 bg-need-soft/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-bold text-ink">¿Tu necesidad es puntual y urgente?</p>
          <p className="text-sm text-ink-soft">Publícala en el mapa para que la comunidad y las brigadas la vean en vivo.</p>
        </div>
        <PrimaryButton className="!bg-need shrink-0">
          <Siren size={15} /> Publicar en el mapa
        </PrimaryButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-3 inline-flex rounded-2xl bg-need-soft p-2.5">
            <Siren size={20} className="text-need" />
          </div>
          <h3 className="font-display text-lg font-bold">Reportar emergencia en el mapa</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Fija tu ubicación y describe qué necesitas: agua, alimentos, medicamentos, rescate o
            albergue. Se publica en vivo para la comunidad.
          </p>
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <Field label="¿Qué necesitas?" placeholder="Ej.: Agua potable para 12 familias" />
            <Field label="Municipio / dirección" placeholder="Ej.: Barrio Obrero, Quibdó" />
            <PrimaryButton className="!bg-need w-full">Publicar necesidad</PrimaryButton>
          </form>
        </Card>

        <Card className="p-6">
          <div className="mb-3 inline-flex rounded-2xl bg-brand/10 p-2.5">
            <ShieldCheck size={20} className="text-brand" />
          </div>
          <h3 className="font-display text-lg font-bold">Registro Único de Damnificados</h3>
          <p className="mt-1 text-sm text-ink-soft">
            El censo RUD habilita subsidios de arriendo y ayudas del Gobierno para familias
            afectadas. Verifica tu estado o inicia el registro.
          </p>
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <Field label="Número de cédula" placeholder="Solo números" />
            <Field label="Municipio del hogar afectado" placeholder="Ej.: Villavicencio" />
            <PrimaryButton className="w-full">Verificar / iniciar RUD</PrimaryButton>
          </form>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-1 font-display text-lg font-bold">Líneas de salud mental</h3>
        <p className="mb-4 text-sm text-ink-soft">Atención gratuita y confidencial en crisis.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {MENTAL_HEALTH.map((m) => (
            <div key={m.name} className="rounded-2xl border border-line bg-paper p-4">
              <div className="mb-2 flex items-center gap-2 text-brand">
                <Phone size={16} />
                <span className="text-sm font-semibold">{m.name}</span>
              </div>
              <p className="text-xs text-ink-soft">{m.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Ofrezco() {
  const [pro, setPro] = useState(true)
  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Ofrezco ayuda"
        title="Súmate como voluntario o profesional"
        desc="Revisamos cada perfil y te contactamos en máximo 48 horas. Tu perfil verificado aparece en el directorio público."
      />
      <Card className="p-6">
        <p className="mb-2 text-xs font-semibold text-ink-soft">
          ¿Tu profesión cuenta con tarjeta o registro profesional?
        </p>
        <div className="mb-5 grid grid-cols-2 gap-2">
          {[
            { v: true, label: "Sí, soy profesional con registro" },
            { v: false, label: "No, ofrezco ayuda comunitaria" },
          ].map((o) => (
            <button
              key={String(o.v)}
              onClick={() => setPro(o.v)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                pro === o.v
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-line bg-paper text-ink-soft hover:border-line-strong"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <Field label="Nombre completo" placeholder="Ej.: María González Pérez" />
          {pro && <Field label="Número de cédula" placeholder="Para verificar en ReTHUS / COPNIA" />}
          <Field
            label={pro ? "Profesión" : "¿Cómo puedes ayudar?"}
            placeholder={pro ? "Ej.: Psicología (manejo de crisis)" : "Ej.: Logística, cocina, transporte"}
          />
          <Field label="Días y horarios disponibles" placeholder="Ej.: Jueves y viernes de 4 a 6" />
          <div className="sm:col-span-2">
            <Field label="WhatsApp de contacto" placeholder="Ej.: 300 123 4567" />
          </div>
          <label className="sm:col-span-2 flex items-start gap-2 rounded-2xl border border-line bg-paper p-3 text-xs text-ink-soft">
            <input type="checkbox" className="mt-0.5 accent-[var(--color-brand)]" />
            Autorizo la publicación de mi medio de contacto en el directorio verificado y el
            tratamiento de mis datos (Ley Estatutaria 1581 de 2012).
          </label>
          <PrimaryButton className="!bg-offer sm:col-span-2">
            <HandHeart size={16} /> Enviar mi ofrecimiento de ayuda
          </PrimaryButton>
        </form>
      </Card>
    </div>
  )
}

const VPAGE = 6

function Voluntarios() {
  const [avail, setAvail] = useState(false)
  const [page, setPage] = useState(0)
  const list = VOLUNTEERS.filter((v) => (avail ? v.available : true))
  const pages = Math.ceil(list.length / VPAGE)
  const shown = list.slice(page * VPAGE, page * VPAGE + VPAGE)
  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Directorio verificado"
        title="Voluntarios y profesionales"
        desc="Brigadas ciudadanas y profesionales certificados en salud e ingeniería dispuestos a brindar ayuda."
      />
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={!avail} onClick={() => { setAvail(false); setPage(0) }}>
          Todos ({VOLUNTEERS.length})
        </Chip>
        <Chip active={avail} onClick={() => { setAvail(true); setPage(0) }}>
          Disponibles ahora
        </Chip>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((v) => (
          <Card key={v.name} className="flex flex-col p-5">
            <div className="mb-3 flex items-start gap-3">
              <div className="relative">
                <img src={v.photo} alt={v.name} className="h-14 w-14 rounded-2xl object-cover" />
                <span
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-pill border-2 border-surface ${
                    v.available ? "bg-offer" : "bg-line-strong"
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-1 font-display text-sm font-bold leading-tight">
                  {v.name}
                  <ShieldCheck size={13} className="text-offer" />
                </div>
                <p className="text-xs text-ink-soft">{v.role}</p>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-1 text-xs text-ink-faint">
              <MapPin size={12} /> {v.place}
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {v.tags.map((t) => (
                <span key={t} className="rounded-pill bg-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto flex gap-2">
              <button className="flex-1 rounded-pill bg-brand py-2 text-xs font-bold text-paper transition hover:bg-brand/90">
                Ver perfil
              </button>
              <button className="flex-1 rounded-pill bg-offer py-2 text-xs font-bold text-white transition hover:opacity-90">
                WhatsApp
              </button>
            </div>
          </Card>
        ))}
      </div>
      <Paginator page={page} pages={pages} onChange={setPage} />
    </div>
  )
}

function Donar({ go }: { go: (s: Section) => void }) {
  const [tab, setTab] = useState<"seguro" | "insumos" | "personas">("seguro")
  const tabs = [
    { id: "seguro", label: "Donar seguro" },
    { id: "insumos", label: "Qué se necesita" },
    { id: "personas", label: "Personas que ayudan" },
  ] as const
  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Donar"
        title="Donaciones verificadas"
        desc="Cuentas de entidades oficiales, insumos priorizados por categoría y personas que ya están ayudando."
      />

      {/* segmented tabs */}
      <div className="flex gap-1 rounded-pill border border-line bg-surface p-1 shadow-tile">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-pill px-3 py-2 text-xs font-bold transition sm:text-sm ${
              tab === t.id ? "bg-brand text-paper" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "seguro" && (
        <div className="grid gap-4 md:grid-cols-2">
          {DONATIONS.map((d) => (
            <Card key={d.org} className="p-6">
              <span className="inline-flex items-center gap-1 rounded-pill bg-offer-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-offer">
                <ShieldCheck size={12} /> Verificado oficial
              </span>
              <h3 className="mt-3 font-display text-base font-bold">{d.org}</h3>
              <p className="mt-1 text-sm text-ink-soft">{d.desc}</p>
              <div className="my-4 rounded-2xl border border-line bg-paper p-4">
                <div className="text-xs font-semibold text-ink-soft">{d.method}</div>
                <div className="my-1 font-mono text-lg font-bold tabular text-brand">{d.number}</div>
                <div className="text-xs text-ink-faint">{d.meta}</div>
              </div>
              <div className="space-y-2">
                <CopyButton value={d.number} />
                <button className="flex w-full items-center justify-center gap-2 rounded-pill bg-brand py-3 text-sm font-bold text-paper transition hover:bg-brand/90">
                  {d.link} <ExternalLink size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "insumos" && (
        <div className="space-y-4">
          {/* legend */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-accent"><Plus size={13} /> Urgente hoy</span>
            <span className="flex items-center gap-1.5 text-offer"><Check size={13} /> Se recibe</span>
            <span className="flex items-center gap-1.5 text-ink-faint"><Ban size={13} /> Ya no reciben</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {SUPPLY_GROUPS.map((g) => (
              <Card key={g.id} className="p-5">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">{g.emoji}</span>
                  <h3 className="font-display text-sm font-bold">{g.title}</h3>
                </div>
                <p className="mb-3 text-xs text-ink-soft">{g.note}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <span
                      key={it.name}
                      className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium ${
                        it.urgent
                          ? "border-accent/40 bg-accent/10 text-accent"
                          : "border-offer/25 bg-offer-soft text-offer"
                      }`}
                    >
                      {it.urgent && <Plus size={11} />}
                      {it.name}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* ya no reciben */}
          <Card className="p-5">
            <div className="mb-2 flex items-center gap-2 text-ink-faint">
              <Ban size={15} />
              <h3 className="font-display text-sm font-bold text-ink">Por favor, ya no envíes</h3>
            </div>
            <p className="mb-3 text-xs text-ink-soft">Satura los centros de acopio y retrasa la ayuda que sí urge.</p>
            <div className="flex flex-wrap gap-1.5">
              {SUPPLY_STOP.map((s) => (
                <span key={s} className="rounded-pill border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink-faint line-through">
                  {s}
                </span>
              ))}
            </div>
          </Card>

          {/* map link */}
          <button
            onClick={() => go("mapa")}
            className="flex w-full items-center justify-between gap-3 rounded-tile border border-white/10 bg-surface p-4 text-left shadow-tile transition hover:-translate-y-0.5"
          >
            <div>
              <p className="font-display text-sm font-bold">¿Buscas necesidades puntuales por municipio?</p>
              <p className="text-xs text-ink-soft">Los centros de acopio publican lo que les falta en vivo.</p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-pill accent-gradient px-3.5 py-2 text-xs font-bold text-[#12100c]">
              Ir al mapa <ArrowRight size={13} />
            </span>
          </button>
        </div>
      )}

      {tab === "personas" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {VOLUNTEERS.filter((v) => v.available).map((v) => (
            <Card key={v.name} className="flex items-center gap-3 p-4">
              <img src={v.photo} alt={v.name} className="h-12 w-12 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 font-display text-sm font-bold">
                  {v.name} <ShieldCheck size={12} className="text-offer" />
                </div>
                <p className="truncate text-xs text-ink-soft">{v.role}</p>
              </div>
              <button onClick={() => go("voluntarios")} className="shrink-0 rounded-pill bg-offer px-3 py-2 text-xs font-bold text-white">
                Contactar
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function Novedades() {
  const [tab, setTab] = useState<"boletines" | "sismos" | "vias">("boletines")
  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Novedades oficiales"
        title="Situación actual y alertas"
        desc="Reportes de entidades oficiales colombianas: UNGRD (boletines), SGC (sismos), INVÍAS #767 (vías) y Cruz Roja."
      />
      <NewsCarousel onOpen={() => {}} />
      <div className="flex flex-wrap gap-2">
        {[
          { id: "boletines", label: `Boletines (${NEWS.length})` },
          { id: "sismos", label: `SGC Sismos (${QUAKES.length})` },
          { id: "vias", label: "INVÍAS #767" },
        ].map((t) => (
          <Chip key={t.id} active={tab === t.id} onClick={() => setTab(t.id as typeof tab)}>
            {t.label}
          </Chip>
        ))}
      </div>

      {tab === "boletines" && (
        <Card className="divide-y divide-line">
          {NEWS.map((n, i) => (
            <div key={i} className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">{n.time}</span>
                <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide ${newsTone[n.tone]}`}>
                  <ShieldCheck size={12} /> {n.source} · verificado
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink">{n.text}</p>
            </div>
          ))}
        </Card>
      )}

      {tab === "sismos" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {QUAKES.map((q, i) => (
            <Card key={i} className="flex items-start gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-need/30 bg-need-soft">
                <span className="font-mono text-[9px] uppercase text-need">Mag</span>
                <span className="font-display text-xl font-extrabold tabular text-need">{q.mag}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-bold">{q.place}</h3>
                  {q.felt && (
                    <span className="rounded-pill bg-pet/15 px-1.5 py-0.5 font-mono text-[9px] uppercase text-pet">Sentido</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-ink-soft">Profundidad {q.depth} · {q.time}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">Fuente: SGC / RSNC</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "vias" && (
        <Card className="p-6">
          <div className="flex items-center gap-2 text-pet">
            <Activity size={16} />
            <h3 className="font-display font-bold">Estado de vías — INVÍAS</h3>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Monitoreo permanente en corredores viales principales. Línea gratuita
            <span className="font-mono font-bold text-ink"> #767</span> habilitada para reportes 24/7.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {[
              ["Vía Bogotá — Villavicencio", "Paso restringido · un carril"],
              ["Ruta del Sol — sector Meta", "Habilitada con precaución"],
              ["Corredor Cúcuta — Pamplona", "Cierre nocturno preventivo"],
            ].map(([road, state]) => (
              <div key={road} className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3">
                <span className="font-semibold">{road}</span>
                <span className="text-xs text-ink-soft">{state}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------------- shell */

function Brand({ small = false, onDark = false }: { small?: boolean; onDark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center rounded-2xl ${small ? "h-9 w-9" : "h-10 w-10"} ${
          onDark ? "glass-dark text-accent ring-1 ring-white/25" : "bg-brand text-accent"
        }`}
      >
        <Compass size={small ? 20 : 22} />
      </div>
      {!small && (
        <div className="leading-tight">
          <div className={`font-display text-base font-extrabold tracking-tight ${onDark ? "text-white" : "text-ink"}`}>
            Brújula Colombia
          </div>
          <div className={`text-[11px] ${onDark ? "text-white/60" : "text-ink-faint"}`}>
            Red de ayuda en vivo verificada
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [section, setSection] = useState<Section>("inicio")
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [dlOpen, setDlOpen] = useState(false)
  const [fuentesOpen, setFuentesOpen] = useState(false)

  const go = (s: Section) => {
    setSection(s)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const primary = NAV.filter((n) => n.primary)

  const render = () => {
    switch (section) {
      case "inicio": return <Inicio go={go} openDownload={() => setDlOpen(true)} />
      case "mapa": return <Mapa />
      case "estadisticas": return <Estadisticas />
      case "necesito": return <Necesito />
      case "ofrezco": return <Ofrezco />
      case "voluntarios": return <Voluntarios />
      case "donar": return <Donar go={go} />
      case "novedades": return <Novedades />
    }
  }

  return (
    <div className="flex min-h-screen flex-col text-ink">
      {/* ---- robust top header ---- */}
      <header className="glass sticky top-0 z-30 border-b border-line">
        {/* utility bar */}
        <div className="border-b border-line/60">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 lg:px-8">
            <Brand />
            <span className="ml-1 hidden items-center gap-1.5 rounded-pill bg-offer-soft px-3 py-1.5 font-mono text-[11px] font-bold text-offer sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-offer opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-pill bg-offer" />
              </span>
              EN VIVO
              <span className="font-medium text-ink-faint">· {LAST_SYNC}</span>
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setFuentesOpen(true)}
                className="hidden h-10 items-center gap-1.5 rounded-pill border border-line bg-surface px-3.5 text-sm font-semibold text-offer transition hover:border-line-strong sm:flex"
                aria-label="Fuentes verificadas"
              >
                <ShieldCheck size={16} /> Verificado
              </button>
              <button
                onClick={() => setNotifOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-pill border border-line bg-surface text-ink transition hover:border-line-strong hover:bg-paper"
                aria-label="Notificaciones"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-pill bg-need ring-2 ring-surface" />
              </button>
              <button
                onClick={() => setDlOpen(true)}
                className="accent-gradient flex items-center gap-1.5 rounded-pill px-3.5 py-2.5 text-sm font-bold text-[#12100c] shadow-tile transition hover:brightness-105 active:scale-[0.98]"
              >
                <Download size={15} /> <span className="hidden sm:inline">Descargar app</span>
                <span className="sm:hidden">App</span>
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-line bg-surface lg:hidden"
                aria-label="Menú"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* desktop tab nav */}
        <div className="hidden lg:block">
          <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-8 py-2 no-scrollbar">
            {NAV.map((n) => {
              const on = n.id === section
              return (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-pill px-3.5 py-2 text-sm font-semibold transition ${
                    on ? "bg-brand text-paper" : "text-ink-soft hover:bg-paper hover:text-ink"
                  }`}
                >
                  <n.icon size={16} className={on ? "text-accent" : ""} />
                  {n.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* urgent ticker */}
        <button
          onClick={() => go("novedades")}
          className="flex w-full items-center gap-2 border-t border-need/15 bg-need-soft/70 px-4 py-2 text-left lg:px-8"
        >
          <span className="flex shrink-0 items-center gap-1 rounded-pill bg-need px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
            <Bell size={10} /> {URGENT.source}
          </span>
          <span className="line-clamp-1 text-xs text-ink-soft">{URGENT.text}</span>
          <ChevronRight size={14} className="ml-auto shrink-0 text-need" />
        </button>
      </header>

      {/* content column */}
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-5 pb-24 lg:pb-8">
            <KpiStrip onOpen={go} />
            {render()}
          </div>
        </main>

        <footer className="border-t border-line bg-surface px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-md">
                <Brand />
                <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                  Iniciativa ciudadana independiente y abierta, coordinada con la red de voluntarios y
                  brigadistas en territorio. No reemplaza los canales oficiales de emergencia del
                  Estado. Protocolos con base en UNGRD, ReTHUS, COPNIA, Cruz Roja Colombiana e INVÍAS
                  #767.
                </p>
              </div>
              <button
                onClick={() => setDlOpen(true)}
                className="inline-flex items-center gap-2 rounded-pill border border-accent bg-accent/10 px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-accent/20"
              >
                <Download size={15} /> Descargar APK
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-[11px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
              <span>© 2026 Brújula Colombia · Licencia abierta CC BY-SA 4.0</span>
              <span className="flex gap-4">
                <a href="#" className="hover:text-ink">Privacidad</a>
                <a href="#" className="hover:text-ink">Términos</a>
                <a href="#" className="hover:text-ink">Ley 1581/2012</a>
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* ---- mobile bottom nav ---- */}
      <nav className="glass fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 gap-1 rounded-pill p-1.5 shadow-glow ring-1 ring-white/50 lg:hidden">
        {primary.map((n) => {
          const on = n.id === section
          return (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`flex flex-col items-center gap-0.5 rounded-pill py-2 text-[10px] font-semibold transition ${
                on ? "brand-gradient text-paper shadow-tile" : "text-ink-faint"
              }`}
            >
              <n.icon size={19} className={on ? "text-accent" : ""} />
              {n.label.split(" ")[0]}
            </button>
          )
        })}
      </nav>

      {/* ---- mobile overflow menu ---- */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute right-0 top-0 h-full w-72 bg-surface p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <Brand small />
              <button onClick={() => setMenuOpen(false)} className="rounded-pill border border-line p-2">
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1">
              {NAV.map((n) => {
                const on = n.id === section
                return (
                  <button
                    key={n.id}
                    onClick={() => go(n.id)}
                    className={`flex w-full items-center gap-3 rounded-pill px-3.5 py-2.5 text-sm font-semibold ${
                      on ? "bg-brand text-paper" : "text-ink-soft"
                    }`}
                  >
                    <n.icon size={18} className={on ? "text-accent" : ""} />
                    {n.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <NotifModal open={notifOpen} onClose={() => setNotifOpen(false)} />
      <DownloadModal open={dlOpen} onClose={() => setDlOpen(false)} />
      <FuentesModal open={fuentesOpen} onClose={() => setFuentesOpen(false)} />
    </div>
  )
}
