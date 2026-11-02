import { ALBUM_THEMES } from '../../../utils/albumAdapter'

/* ============================================================
   ThemeFilter — Filtre par thème des albums (@EF22)
   ------------------------------------------------------------
   - Pastilles : « Tous les thèmes » + thèmes de la galerie
   - Props : themes, selected, onSelect(theme)
   - GALLERY_THEMES = alias d'ALBUM_THEMES : une seule source
     de thèmes sur le front (module 4), aucune duplication.
   ============================================================ */

export const GALLERY_THEMES = ALBUM_THEMES

const chip = (on) =>
  `inline-flex h-10 items-center rounded-[10px] border px-3.5 text-[13px] transition ${
    on
      ? 'border-vert bg-menthe font-semibold text-vert-dark'
      : 'border-[#e3ede6] bg-white font-medium text-[#3b4d42] hover:border-vert/50'
  }`

export default function ThemeFilter({
  themes = GALLERY_THEMES,
  selected = 'Tous',
  onSelect,
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par thème">
      <button
        type="button"
        onClick={() => onSelect('Tous')}
        aria-pressed={selected === 'Tous'}
        className={chip(selected === 'Tous')}
      >
        Tous les thèmes
      </button>
      {themes.map((theme) => (
        <button
          key={theme}
          type="button"
          onClick={() => onSelect(theme)}
          aria-pressed={selected === theme}
          className={chip(selected === theme)}
        >
          {theme}
        </button>
      ))}
    </div>
  )
}
