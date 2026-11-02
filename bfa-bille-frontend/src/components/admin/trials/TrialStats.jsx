/* ============================================================
   TrialStats — Chiffres des demandes d'essai (admin, @EF20)
   ------------------------------------------------------------
   - Total, En attente (mise en avant en doré), Acceptées, Refusées
   - Valeur en Barlow Condensed, 2 colonnes sur téléphone
   ============================================================ */

export default function TrialStats({ trials }) {
  const counts = { 'En attente': 0, Confirmé: 0, Refusé: 0 }
  trials.forEach((t) => {
    if (counts[t.statut] !== undefined) counts[t.statut] += 1
  })

  const stats = [
    { label: 'Total', value: trials.length },
    {
      label: 'En attente',
      value: counts['En attente'],
      box: 'border-[#efdca0] bg-[#fffdf3]',
      text: 'text-dore-dark',
    },
    { label: 'Acceptées', value: counts.Confirmé, text: 'text-vert-dark' },
    { label: 'Refusées', value: counts.Refusé },
  ]

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl border p-4 ${s.box ?? 'border-[#e3ede6] bg-white'}`}
        >
          <p className={`text-[13px] ${s.text ?? 'text-sombre/75'}`}>{s.label}</p>
          <p
            className={`font-display text-[38px] font-bold leading-[1.1] tabular-nums ${s.text ?? 'text-[#14231a]'}`}
          >
            {s.value}
          </p>
        </div>
      ))}
    </section>
  )
}
