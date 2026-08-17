import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { ALBUM_THEMES } from '../../../utils/albumAdapter'

/* ============================================================
   ThemeFilter — Filtre par thème des albums (@EF22)
   ------------------------------------------------------------
   - Boutons « chips » : Tous + thèmes de la galerie
   - Compteur « X album(s) affiché(s) sur Y »
   - Props : themes, selected, onSelect(theme), count, total
   - GALLERY_THEMES = alias d'ALBUM_THEMES : une seule source
     de thèmes sur le front (module 4), aucune duplication.
   ============================================================ */

export const GALLERY_THEMES = ALBUM_THEMES

export default function ThemeFilter({
  themes = GALLERY_THEMES,
  selected = 'Tous',
  onSelect,
  count = 0,
  total = 0,
}) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer par thème">
        <Button
          type="button"
          variant={selected === 'Tous' ? 'filter-active' : 'filter'}
          size="sm"
          onClick={() => onSelect('Tous')}
          aria-pressed={selected === 'Tous'}
        >
          Tous
        </Button>
        {themes.map((theme) => (
          <Button
            key={theme}
            type="button"
            variant={selected === theme ? 'filter-active' : 'filter'}
            size="sm"
            onClick={() => onSelect(theme)}
            aria-pressed={selected === theme}
          >
            {theme}
          </Button>
        ))}
      </div>

      <p className="flex items-center gap-2 text-sm text-sombre/60">
        <FontAwesomeIcon icon={faImages} className="h-4 w-4 text-vert" />
        <span>
          <span className="font-bold text-vert">{count}</span> album(s)
          affiché(s) sur {total}
        </span>
      </p>
    </Card>
  )
}
