import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'

/* ============================================================
   TrialExport — Export CSV des demandes d'essai (admin)
   ------------------------------------------------------------
   - Exporte la liste passée en prop (respecte les filtres actifs)
   - BOM UTF-8 pour Excel + retours à la ligne Windows
   - Échappe correctement les champs contenant des virgules
   ============================================================ */

const CSV_HEADERS = [
  'Prénom',
  'Nom',
  'E-mail',
  'Téléphone',
  'Âge',
  'Catégorie',
  'Poste',
  "Date d'essai",
  'Date de soumission',
  'Statut',
  'Message',
]

const escapeCsv = (value) => {
  const s = value == null ? '' : String(value)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function TrialExport({ trials }) {
  const handleExport = () => {
    const lines = [
      CSV_HEADERS.join(','),
      ...trials.map((t) =>
        [
          escapeCsv(t.prenom),
          escapeCsv(t.nom),
          escapeCsv(t.email),
          escapeCsv(t.telephone),
          escapeCsv(t.age),
          escapeCsv(t.categorie),
          escapeCsv(t.poste),
          escapeCsv(t.dateEssai),
          escapeCsv(t.dateSoumission),
          escapeCsv(t.statut),
          escapeCsv(t.message),
        ].join(','),
      ),
    ]
    const blob = new Blob([String.fromCharCode(0xfeff) + lines.join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'demandes-essais.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleExport}>
      <FontAwesomeIcon icon={faFileCsv} className="h-4 w-4" />
      Exporter CSV
    </Button>
  )
}
