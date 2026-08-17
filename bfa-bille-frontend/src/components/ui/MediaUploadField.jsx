import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudArrowUp,
  faImage,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import FormInput from '../trial/FormInput'
import { uploadMedia } from '../../utils/media'

/* ============================================================
   MediaUploadField — Champ média : upload + aperçu + URL fallback
   ------------------------------------------------------------
   - Zone cliquable pour importer un fichier image → `uploadMedia`
     (backend /admin/media/upload) → onChange(url MinIO)
   - Aperçu de l'image courante (valeur stockée dans l'entité)
   - Champ « Ou collez une URL » en fallback (paste directe)
   - Dossier = préfixe de la clé côté MinIO
     (joueurs | galerie | blog | boutique)
   - Props : label, name, value, onChange(url), onBlur, dossier,
     accept, helper, error, touched, required, showUrlFallback
   ============================================================ */

const IMAGE_ACCEPT = 'image/jpeg,image/png'

export default function MediaUploadField({
  label,
  name,
  value,
  onChange,
  onBlur,
  dossier,
  accept = IMAGE_ACCEPT,
  helper = 'JPG ou PNG — 10 Mo maximum',
  error,
  touched,
  required = false,
  showUrlFallback = true,
  className = '',
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permet de re-sélectionner le même fichier
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const { url } = await uploadMedia(file, dossier)
      onChange(url)
    } catch (err) {
      setUploadError(err?.message || "Impossible d'importer l'image.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={className}>
      <span className="mb-2 block text-sm font-bold text-vert">
        {label}
        {required && <span className="ml-0.5 text-erreur">*</span>}
      </span>

      <div className="flex items-start gap-4">
        {/* Aperçu de l'image courante */}
        {value ? (
          <img
            src={value}
            alt={`Aperçu de ${label}`}
            className="h-24 w-24 shrink-0 rounded-xl border border-clair object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-clair bg-clair/40 text-sombre/30">
            <FontAwesomeIcon icon={faImage} className="h-6 w-6" />
          </div>
        )}

        {/* Zone d'upload */}
        <div className="min-w-0 flex-1">
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
              uploading
                ? 'cursor-wait border-vert/40 bg-vert/5 text-vert'
                : 'border-clair bg-white text-sombre hover:border-vert/60 hover:bg-vert/5'
            }`}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                Import en cours…
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCloudArrowUp} className="h-4 w-4" />
                Importer une image
              </>
            )}
          </label>
          <p className="mt-1.5 text-xs text-sombre/50">{helper}</p>
        </div>
      </div>

      {/* Erreur d'upload (backend / réseau) */}
      {uploadError && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-erreur">
          {uploadError}
        </p>
      )}

      {/* Fallback : coller une URL directement */}
      {showUrlFallback && (
        <div className="mt-3">
          <FormInput
            label="Ou collez une URL"
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="https://…"
            error={error}
            touched={touched}
          />
        </div>
      )}
    </div>
  )
}
