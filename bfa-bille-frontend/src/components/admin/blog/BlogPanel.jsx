import { useState } from 'react'
import BlogStatusBadge from './BlogStatusBadge'
import MediaUploadField from '../../ui/MediaUploadField'

/* ============================================================
   BlogPanel — « Édition rapide » de l'article sélectionné
   ------------------------------------------------------------
   - Titre, extrait (calculé depuis le contenu : lecture seule),
     image de couverture (upload / URL)
   - Brouillon : « Enregistrer le brouillon » + « Publier »
     Publié    : « Enregistrer » + « Dépublier »
   - « Contenu complet… » ouvre l'éditeur riche (modale)
   - Remonté avec `key={post.id}` : l'état local repart de l'article
   ============================================================ */

const input =
  'h-[42px] w-full rounded-[10px] border border-[#cfe0d4] bg-white px-3 text-sm outline-none transition focus:border-vert focus:ring-2 focus:ring-vert/20'

export default function BlogPanel({ post, error, saving, onSave, onFull }) {
  const [titre, setTitre] = useState(post?.titre ?? '')
  const [image, setImage] = useState(post?.image ?? '')

  if (!post) {
    return (
      <aside className="min-w-0 flex-1 basis-72 rounded-2xl border border-[#e3ede6] bg-white p-5 text-sm text-sombre/75">
        Sélectionnez un article pour l'éditer rapidement, ou créez-en un nouveau.
      </aside>
    )
  }

  const save = (estPublie) => onSave(post, { titre: titre.trim(), image, estPublie })

  return (
    <aside className="flex min-w-0 flex-1 basis-72 flex-col gap-3 rounded-2xl border border-[#e3ede6] bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <b className="text-base">Édition rapide</b>
        <BlogStatusBadge statut={post.statut} />
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-erreur/30 bg-erreur/10 px-3 py-2 text-sm text-erreur">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="blog-titre" className="mb-1.5 block text-[13px] font-semibold">
          Titre
        </label>
        <input
          id="blog-titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className={input}
        />
      </div>

      <div>
        <label htmlFor="blog-extrait" className="mb-1.5 block text-[13px] font-semibold">
          Extrait
        </label>
        <textarea
          id="blog-extrait"
          rows={3}
          readOnly
          value={post.extrait}
          className="w-full resize-none rounded-[10px] border border-[#e3ede6] bg-[#f4f7f5] px-3 py-2.5 text-sm text-sombre/80"
        />
        <p className="mt-1 text-xs text-sombre/70">Généré depuis le contenu de l'article.</p>
      </div>

      <MediaUploadField
        label="Image de couverture"
        name="blog-image"
        value={image}
        onChange={setImage}
        dossier="blog"
        showUrlFallback={false}
      />

      <div className="flex flex-wrap gap-2.5">
        {post.estPublie ? (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(true)}
              className="inline-flex h-11 items-center rounded-xl bg-vert px-4 text-sm font-semibold text-white transition hover:bg-vert-dark disabled:opacity-60"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(false)}
              className="inline-flex h-11 items-center rounded-xl border border-[#cfe0d4] bg-white px-4 text-sm font-semibold text-vert-dark transition hover:bg-[#f4f9f6] disabled:opacity-60"
            >
              Dépublier
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(false)}
              className="inline-flex h-11 items-center rounded-xl border border-[#cfe0d4] bg-white px-4 text-sm font-semibold text-vert-dark transition hover:bg-[#f4f9f6] disabled:opacity-60"
            >
              Enregistrer le brouillon
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save(true)}
              className="inline-flex h-11 items-center rounded-xl bg-vert px-[18px] text-sm font-semibold text-white transition hover:bg-vert-dark disabled:opacity-60"
            >
              Publier
            </button>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => onFull(post)}
        className="min-h-9 self-start text-[13px] font-semibold text-vert-dark hover:underline"
      >
        Contenu complet…
      </button>
    </aside>
  )
}
