/* ============================================================
   StaffList — Staff technique (maquette Claude Design)
   ------------------------------------------------------------
   Le backend renvoie le staff en texte multiligne (une personne par
   ligne). Les lignes de la forme « Rôle : Nom » sont séparées en nom
   (en gras) et rôle (dessous) ; les autres lignes sont affichées
   telles quelles (l'admin saisit du texte libre).
   ============================================================ */

const splitRole = (line) => {
  const i = line.indexOf(':')
  if (i === -1) return { name: line, role: null }
  const role = line.slice(0, i).trim()
  const name = line.slice(i + 1).trim()
  return name ? { name, role } : { name: line, role: null }
}

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

export default function StaffList({ staff }) {
  if (staff.length === 0) {
    return <p className="text-sm text-sombre/70">Staff non renseigné.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {staff.map((line, index) => {
        const { name, role } = splitRole(line)
        return (
          <li
            key={`${line}-${index}`}
            className="flex items-center gap-3.5 rounded-[20px] border border-[#e3ede6] bg-white px-[18px] py-4"
          >
            <span
              aria-hidden="true"
              className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-vert ${
                index % 2 === 0
                  ? 'bg-gradient-to-br from-[#cfe6d6] to-menthe'
                  : 'bg-gradient-to-br from-[#fff0b8] to-[#fff8e1]'
              }`}
            >
              {initials(name)}
            </span>
            <div className="min-w-0">
              <p className="break-words font-semibold text-[#14231a]">{name}</p>
              {role && <p className="text-sm text-sombre/70">{role}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
