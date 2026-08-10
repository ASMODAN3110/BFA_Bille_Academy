import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

/* ============================================================
   DragDropZone — Zone de dépôt de fichiers réutilisable
   ------------------------------------------------------------
   - Glisser-déposer + clic pour parcourir (input file masqué)
   - Retour visuel pendant le survol (bordure verte + fond clair)
   - Props : onFiles(FileList), accept, label, helper
   ============================================================ */

export default function DragDropZone({
  onFiles,
  accept = 'image/*',
  label = 'Glissez-déposez vos fichiers ici',
  helper = 'ou cliquez pour parcourir',
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  /* Évite le clignotement quand le curseur passe sur un enfant. */
  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer?.files?.length) onFiles(e.dataTransfer.files)
  }

  const handleBrowse = (e) => {
    if (e.target.files?.length) onFiles(e.target.files)
    e.target.value = '' // permet de re-sélectionner le même fichier
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-dore/40 ${
        isDragging
          ? 'scale-[1.01] border-vert bg-vert/5'
          : 'border-clair bg-white hover:border-vert/60 hover:bg-vert/5'
      } ${className}`}
    >
      <FontAwesomeIcon
        icon={faCloudArrowUp}
        className={`h-8 w-8 transition-colors ${
          isDragging ? 'text-vert' : 'text-sombre/30'
        }`}
      />
      <p className="text-sm font-bold text-sombre">{label}</p>
      <p className="text-xs text-sombre/50">{helper}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleBrowse}
      />
    </div>
  )
}
