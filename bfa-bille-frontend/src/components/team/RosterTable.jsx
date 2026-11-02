/* ============================================================
   RosterTable — Tableau de l'effectif (maquette Claude Design)
   ------------------------------------------------------------
   Colonnes : joueur (Prenom Nom), poste. Le backend n'a ni numéro
   de maillot ni statut pour l'effectif d'une fiche : ces colonnes
   de la maquette sont donc omises.
   L'effectif n'a pas d'id stable et les noms peuvent se répéter
   → clés de lignes par index.
   ============================================================ */

export default function RosterTable({ effectif }) {
  if (effectif.length === 0) {
    return (
      <p className="px-6 py-8 text-center text-sm text-sombre/70">
        Aucun joueur dans cet effectif pour le moment.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[15px]">
        <thead>
          <tr className="bg-vert text-white">
            <th scope="col" className="px-4 py-3 text-[13px] font-semibold tracking-[0.04em]">
              JOUEUR
            </th>
            <th scope="col" className="px-4 py-3 text-[13px] font-semibold tracking-[0.04em]">
              POSTE
            </th>
          </tr>
        </thead>
        <tbody>
          {effectif.map((joueur, index) => (
            <tr key={index} className="border-b border-[#e3ede6] last:border-b-0">
              <td className="px-4 py-3.5 font-medium text-[#14231a]">{joueur.nom}</td>
              <td className="px-4 py-3.5 text-sombre/80">{joueur.poste}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
