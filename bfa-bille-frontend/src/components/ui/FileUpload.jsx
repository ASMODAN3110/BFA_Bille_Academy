import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
  faImage,
  faUpload,
  faVideo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import DragDropZone from './DragDropZone'
import Button from './Button'

/* ============================================================
   FileUpload — Import de fichiers avec validation et progression
   ------------------------------------------------------------
   - Glisser-déposer ou parcourir (via <DragDropZone />)
   - Formats acceptés : JPG, PNG, MP4, WEBM — max. 10 Mo / fichier
   - Erreurs par fichier, aperçu des fichiers validés (data URL)
   - Barre de progression simulée, puis onUpload(fichiers)
   - Props : onUpload([{ id, file, nom, type, url }])
   ============================================================ */

/* Formats alignés sur le backend : JPG, PNG, MP4, WEBM.
   ⚠️ PAS de WebP — le backend rejette image/webp (400). */
const MAX_SIZE = 10 * 1024 * 1024 // 10 Mo
const ACCEPTED_MIMES = [
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/webm',
]
const ACCEPTED_EXT = ['jpg', 'jpeg', 'png', 'mp4', 'webm']

const isAccepted = (file) => {
  if (ACCEPTED_MIMES.includes(file.type)) return true
  const ext = String(file.name).split('.').pop()?.toLowerCase()
  return ACCEPTED_EXT.includes(ext)
}

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Lecture impossible : ${file.name}`))
    reader.readAsDataURL(file)
  })

export default function FileUpload({
  onUpload,
  label = 'Glissez-déposez vos fichiers ici',
  helper = 'JPG, PNG, MP4, WEBM — 10 Mo maximum par fichier',
}) {
  const [pending, setPending] = useState([])
  const [errors, setErrors] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const idRef = useRef(0)

  const handleFiles = async (fileList) => {
    if (uploading) return
    const files = Array.from(fileList)
    const nextErrors = []
    const accepted = []

    await Promise.all(
      files.map(async (file) => {
        if (!isAccepted(file)) {
          nextErrors.push(
            `« ${file.name} » : format non pris en charge. Formats acceptés : JPG, PNG, MP4, WEBM.`,
          )
          return
        }
        if (file.size > MAX_SIZE) {
          nextErrors.push(
            `« ${file.name} » : fichier trop volumineux (${formatSize(
              file.size,
            )} — maximum 10 Mo).`,
          )
          return
        }
        const url = await readFileAsDataURL(file).catch(() => null)
        if (!url) {
          nextErrors.push(`« ${file.name} » : lecture impossible.`)
          return
        }
        idRef.current += 1
        accepted.push({
          id: idRef.current,
          file,
          nom: file.name,
          type: file.type.startsWith('video') ? 'video' : 'image',
          url,
        })
      }),
    )

    setErrors((prev) => [...prev, ...nextErrors])
    setPending((prev) => [...prev, ...accepted])
  }

  /* Progression simulée pendant l'import. */
  useEffect(() => {
    if (!uploading) return undefined
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 8 + Math.random() * 18))
    }, 140)
    return () => clearInterval(timer)
  }, [uploading])

  /* Fin d'import : remonte les fichiers puis réinitialise. */
  useEffect(() => {
    if (!uploading || progress < 100) return undefined
    const timer = setTimeout(() => {
      onUpload(pending)
      setPending([])
      setErrors([])
      setProgress(0)
      setUploading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [uploading, progress, pending, onUpload])

  const startUpload = () => {
    if (pending.length === 0 || uploading) return
    setErrors([])
    setProgress(0)
    setUploading(true)
  }

  const removePending = (id) =>
    setPending((prev) => prev.filter((p) => p.id !== id))

  const dismissError = (index) =>
    setErrors((prev) => prev.filter((_, i) => i !== index))

  return (
    <div className="space-y-4">
      <DragDropZone
        onFiles={handleFiles}
        accept="image/jpeg,image/png,video/mp4,video/webm"
        label={label}
        helper={helper}
      />

      {errors.length > 0 && (
        <ul className="space-y-1.5">
          {errors.map((err, index) => (
            <li
              key={`${index}-${err}`}
              className="flex items-start justify-between gap-2 rounded-lg border border-erreur/20 bg-erreur/5 px-3 py-2 text-sm text-erreur"
            >
              <span className="flex items-start gap-2">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                {err}
              </span>
              <button
                type="button"
                onClick={() => dismissError(index)}
                aria-label="Fermer l'erreur"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-erreur/70 transition hover:bg-erreur/10"
              >
                <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {pending.length > 0 && !uploading && (
        <ul className="space-y-2">
          {pending.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-clair bg-clair/30 p-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.type === 'video' ? (
                  <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-vert-dark/90 text-dore">
                    <FontAwesomeIcon icon={faVideo} className="h-4 w-4" />
                  </span>
                ) : (
                  <img
                    src={item.url}
                    alt={`Aperçu de ${item.nom}`}
                    className="h-12 w-16 shrink-0 rounded-lg border border-clair object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-sombre">
                    {item.nom}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-sombre/50">
                    <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5 text-succes" />
                    {item.type === 'video' ? 'Vidéo' : 'Image'} · {formatSize(item.file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePending(item.id)}
                aria-label={`Retirer ${item.nom} de la sélection`}
                title="Retirer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sombre/40 transition hover:bg-erreur/10 hover:text-erreur active:scale-95"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {uploading && (
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-vert">
              <FontAwesomeIcon icon={faUpload} className="h-4 w-4" />
              Import en cours…
            </span>
            <span className="font-bold text-vert">{Math.round(progress)} %</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-clair">
            <div
              className="h-full rounded-full bg-vert transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {pending.length > 0 && !uploading && (
        <Button
          type="button"
          onClick={startUpload}
          aria-label={`Importer ${pending.length} fichier(s)`}
        >
          <FontAwesomeIcon icon={faUpload} className="h-4 w-4" />
          Importer {pending.length} fichier{pending.length > 1 ? 's' : ''}
        </Button>
      )}
    </div>
  )
}
