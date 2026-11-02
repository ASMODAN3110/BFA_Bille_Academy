import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useHomeData from '../../hooks/useHomeData'
import { parseLocalDate } from '../../utils/dateUtils'
import { useRevealOnce, fadeUp } from '../../hooks/useScrollAnimation'

/* ============================================================
   MatchesRankings — « Prochains matchs » + « Classement » côte à côte
   ------------------------------------------------------------
   Mise en page de la maquette Claude Design : une seule section
   blanche, deux colonnes (matchs ~60 %, classement ~40 %) qui
   passent l'une sous l'autre sur mobile.
   - Matchs : lignes (bloc date · rencontre + détails · type)
   - Classement : tableau à en-tête vert ; sélecteur de catégorie
     quand plusieurs catégories ont un classement
   Une colonne sans données est simplement omise.
   ============================================================ */

const monthLabel = (isoDate) =>
  parseLocalDate(isoDate)
    .toLocaleDateString('fr-FR', { month: 'short' })
    .replace('.', '')
    .toUpperCase()

const TYPE_TAG = {
  Championnat: 'bg-menthe text-[#0f6b33]',
  Amical: 'bg-[#fff4cc] text-dore-dark',
}

function MatchRow({ match }) {
  const date = parseLocalDate(match.date)
  return (
    <li className="flex items-center gap-5 rounded-2xl border border-[#e3ede6] bg-[#fafcfa] px-5 py-[18px]">
      <div className="w-16 shrink-0 text-center">
        <div className="font-display text-[32px] font-extrabold leading-none text-vert">
          {date.getDate()}
        </div>
        <div className="mt-0.5 text-xs tracking-[0.06em] text-sombre/70">
          {monthLabel(match.date)}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#14231a]">
          {match.home} vs {match.away}
        </p>
        <p className="mt-0.5 text-sm text-sombre/70">
          {[match.category, match.venue, match.time].filter(Boolean).join(' · ')}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_TAG[match.type] ?? TYPE_TAG.Amical}`}
      >
        {match.type}
      </span>
    </li>
  )
}

function RankingTable({ rankings }) {
  const [selected, setSelected] = useState(rankings[0].category)
  const table = rankings.find((r) => r.category === selected) ?? rankings[0]

  return (
    <>
      {rankings.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Catégorie du classement">
          {rankings.map((r) => (
            <button
              key={r.category}
              type="button"
              role="tab"
              aria-selected={r.category === table.category}
              onClick={() => setSelected(r.category)}
              className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                r.category === table.category
                  ? 'border-vert bg-vert text-white'
                  : 'border-[#cfe6d6] bg-white text-sombre/80 hover:border-vert hover:text-vert'
              }`}
            >
              {r.category}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-[20px] border border-[#e3ede6]">
        <div className="flex gap-3 bg-vert px-5 py-3 text-[13px] font-semibold tracking-[0.04em] text-white">
          <span className="w-6">#</span>
          <span className="flex-1">ÉQUIPE</span>
          <span>PTS</span>
        </div>
        <ol>
          {table.teams.map((team) => {
            const isBfa = team.name.includes('BFA')
            return (
              <li
                key={`${table.category}-${team.position}`}
                className={`flex gap-3 border-b border-[#e3ede6] px-5 py-3.5 last:border-b-0 ${
                  isBfa ? 'bg-[#f2faf4]' : ''
                }`}
              >
                <span className={`w-6 ${isBfa ? 'font-bold text-vert' : 'text-sombre/70'}`}>
                  {team.position}
                </span>
                <span className={`flex-1 truncate ${isBfa ? 'font-semibold' : ''}`}>
                  {team.name}
                </span>
                <span className={isBfa ? 'font-bold' : ''}>{team.points}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}

function MatchesRankingsContent({ matches, rankings }) {
  const { ref, initial, animate } = useRevealOnce('matches')

  return (
    <section id="matches" className="bg-white py-20 md:py-24">
      <motion.div
        ref={ref}
        variants={fadeUp}
        initial={initial}
        animate={animate}
        className="mx-auto flex max-w-7xl flex-wrap gap-10 px-4 sm:px-6 lg:px-8"
      >
        {matches.length > 0 && (
          <div className="min-w-0 flex-[1_1_560px]">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-4xl font-bold leading-none text-[#14231a] md:text-5xl">
                Prochains matchs
              </h2>
              <Link
                to="/calendrier"
                className="shrink-0 text-[15px] font-semibold text-[#0f6b33] transition-colors hover:text-vert"
              >
                Tout le calendrier →
              </Link>
            </div>
            <ul className="mt-7 flex flex-col gap-3">
              {matches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </ul>
          </div>
        )}

        {rankings.length > 0 && (
          <div id="classements" className="min-w-0 flex-[1_1_360px]">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-4xl font-bold leading-none text-[#14231a] md:text-5xl">
                Classement
              </h2>
              <Link
                to="/resultats"
                className="shrink-0 text-[15px] font-semibold text-[#0f6b33] transition-colors hover:text-vert"
              >
                Voir tout →
              </Link>
            </div>
            <div className="mt-7">
              <RankingTable rankings={rankings} />
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}

/* Les données arrivent après le premier rendu : le contenu (et son
   détecteur de scroll) n'est monté qu'une fois qu'elles sont là. */
export default function MatchesRankings() {
  const { matches, rankings } = useHomeData()
  if (matches.length === 0 && rankings.length === 0) return null
  return <MatchesRankingsContent matches={matches} rankings={rankings} />
}
