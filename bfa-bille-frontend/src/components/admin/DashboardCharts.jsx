/* ============================================================
   DashboardCharts — Graphiques du tableau de bord (SVG, sans lib)
   ------------------------------------------------------------
   - TrialsByMonthChart : histogramme demandes reçues / acceptées
     sur les 6 derniers mois (trials.byMonth)
   - CategoryDonut : répartition des joueurs par catégorie
     (players.byCategory)
   - TrialStatusBar : en attente / acceptées / refusées
   Chaque graphique a un rôle `img` + libellé textuel et une
   légende lisible (la couleur n'est jamais le seul indicateur).
   ============================================================ */

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const DONUT_COLORS = ['#0f5c2b', '#15803d', '#5fb87d', '#d4af37', '#7d6116', '#b9c7be']

function Panel({ title, aside, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-[#e3ede6] bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-[#14231a]">{title}</h2>
        {aside && <span className="text-xs text-sombre/70">{aside}</span>}
      </div>
      {children}
    </section>
  )
}

function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sombre/75">
      {items.map((i) => (
        <li key={i.label} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
          {i.label}
          {i.value !== undefined && <b className="font-semibold text-[#14231a]">{i.value}</b>}
        </li>
      ))}
    </ul>
  )
}

export function TrialsByMonthChart({ data = [] }) {
  const max = Math.max(4, ...data.map((d) => d.total))
  const top = Math.ceil(max / 4) * 4
  const W = 320
  const H = 170
  const left = 24
  const plotH = 130
  const slot = (W - left) / Math.max(data.length, 1)
  const bar = Math.min(18, slot / 3)
  const summary = data
    .map((d) => `${MOIS[Number(d.mois.slice(5)) - 1]} : ${d.total} reçues, ${d.confirmed} acceptées`)
    .join(' ; ')

  return (
    <Panel title="Demandes d'essai par mois" aside="6 derniers mois">
      <Legend
        items={[
          { label: 'Reçues', color: '#15803d' },
          { label: 'Acceptées', color: '#d4af37' },
        ]}
      />
      {data.every((d) => d.total === 0) ? (
        <p className="py-10 text-center text-sm text-sombre/70">Aucune demande sur la période.</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label={`Demandes d'essai par mois. ${summary}`}>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 10 + (plotH / 4) * i
            return (
              <g key={i}>
                <line x1={left} x2={W} y1={y} y2={y} stroke="#e3ede6" />
                <text x={left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#5a6b61">
                  {Math.round(top - (top / 4) * i)}
                </text>
              </g>
            )
          })}
          {data.map((d, i) => {
            const cx = left + slot * i + slot / 2
            const h1 = (d.total / top) * plotH
            const h2 = (d.confirmed / top) * plotH
            return (
              <g key={d.mois}>
                <rect x={cx - bar - 1} y={10 + plotH - h1} width={bar} height={h1} rx="3" fill="#15803d" />
                <rect x={cx + 1} y={10 + plotH - h2} width={bar} height={h2} rx="3" fill="#d4af37" />
                <text x={cx} y={H - 10} textAnchor="middle" fontSize="9.5" fill="#5a6b61">
                  {MOIS[Number(d.mois.slice(5)) - 1]}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </Panel>
  )
}

export function CategoryDonut({ data = [] }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const R = 42
  const C = 2 * Math.PI * R
  let offset = 0
  const segments = data.map((d, i) => {
    const len = total ? (d.count / total) * C : 0
    const seg = { ...d, len, offset, color: DONUT_COLORS[i % DONUT_COLORS.length] }
    offset += len
    return seg
  })

  return (
    <Panel title="Joueurs par catégorie">
      {total === 0 ? (
        <p className="py-10 text-center text-sm text-sombre/70">Aucun joueur inscrit.</p>
      ) : (
        <div className="flex flex-wrap items-center gap-5">
          <svg
            viewBox="0 0 120 120"
            className="h-36 w-36 shrink-0"
            role="img"
            aria-label={`${total} joueurs : ${data.map((d) => `${d.categorie} ${d.count}`).join(', ')}`}
          >
            <g transform="rotate(-90 60 60)" fill="none" strokeWidth="18">
              {segments.map((s) => (
                <circle
                  key={s.categorie}
                  cx="60"
                  cy="60"
                  r={R}
                  stroke={s.color}
                  strokeDasharray={`${s.len} ${C - s.len}`}
                  strokeDashoffset={-s.offset}
                />
              ))}
            </g>
            <text x="60" y="60" textAnchor="middle" fontFamily="Barlow Condensed" fontWeight="700" fontSize="28" fill="#14231a">
              {total}
            </text>
            <text x="60" y="75" textAnchor="middle" fontSize="9" fill="#5a6b61">
              joueurs
            </text>
          </svg>
          <ul className="min-w-36 flex-1 space-y-2 text-sm">
            {segments.map((s) => (
              <li key={s.categorie} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                {s.categorie}
                <b className="ml-auto font-semibold">{s.count}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  )
}

export function TrialStatusBar({ trials }) {
  const { pending = 0, confirmed = 0, refused = 0, total = 0 } = trials ?? {}
  const parts = [
    { label: 'En attente', value: pending, color: '#d4af37' },
    { label: 'Acceptées', value: confirmed, color: '#15803d' },
    { label: 'Refusées', value: refused, color: '#b9c7be' },
  ]
  return (
    <Panel title="Statut des demandes" aside={`${total} au total`}>
      {total === 0 ? (
        <p className="py-6 text-center text-sm text-sombre/70">Aucune demande.</p>
      ) : (
        <>
          <div
            className="flex h-3 gap-0.5 overflow-hidden rounded-full"
            role="img"
            aria-label={parts.map((p) => `${p.value} ${p.label.toLowerCase()}`).join(', ')}
          >
            {parts
              .filter((p) => p.value > 0)
              .map((p) => (
                <span key={p.label} style={{ flex: p.value, background: p.color }} />
              ))}
          </div>
          <div className="mt-3">
            <Legend items={parts.map((p) => ({ ...p }))} />
          </div>
        </>
      )}
    </Panel>
  )
}
