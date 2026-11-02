import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'
import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import TeamPills from '../components/team/TeamPills'
import RosterTable from '../components/team/RosterTable'
import StaffList from '../components/team/StaffList'
import ObjectivesList from '../components/team/ObjectivesList'
import PalmaresList from '../components/team/PalmaresList'
import { useCategories } from '../hooks/useCategories'
import { api } from '../utils/api'
import { normalizeFiche } from '../utils/teamSheetAdapter'

/* ============================================================
   TeamSheet — Fiche technique d'une catégorie
               (/equipes/technique/:categorie), maquette Claude Design
   Bandeau de titre + sélecteur de catégorie, puis deux colonnes :
   effectif et objectifs à gauche, staff et palmarès à droite.
   ------------------------------------------------------------
   Module 5 — branchement backend :
   - L'URL porte le NOM de catégorie (/equipes/technique/U9), l'API
     veut l'ID → résolution via useCategories() (find par nom).
     Ne jamais supposer les ids (réels : 13/14/15).
   - Fetch : GET /api/team-sheets/categorie/:id (public, sans token)
     → normalizeFiche (staff/palmares/objectifs multilignes → lignes).
   - 404 « Fiche technique non disponible pour cette catégorie. » →
     état vide (icône + message) en conservant le TeamSelector.
   - Redirection vers la 1re catégorie réelle si le paramètre est
     inconnu (plus de constante mock).
   ============================================================ */

export default function TeamSheet() {
  const { categorie } = useParams()
  const navigate = useNavigate()
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useCategories()

  /* Catégorie résolue par NOM (URL) → objet { id, nom }. */
  const cat = categories.find((c) => c.nom === categorie)
  const catId = cat?.id
  const catName = cat?.nom ?? categorie

  /* Compteur de requêtes : ignore une réponse périmée (StrictMode /
     changement rapide de catégorie). */
  const loadSeq = useRef(0)
  const [fiche, setFiche] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* Redirection vers la première catégorie (réelle, via useCategories)
     si l'URL est invalide ou absente — jamais de boucle : on ne
     navigue que lorsque catégorie !== cible. */
  useEffect(() => {
    if (categoriesLoading) return
    if (categories.length === 0) return
    const target = catName && cat ? categorie : categories[0].nom
    if (categorie !== target) {
      navigate(`/equipes/technique/${target}`, { replace: true })
    }
  }, [categoriesLoading, categories, categorie, catName, cat, navigate])

  /* Chargement de la fiche dès que l'id de catégorie est connu. */
  useEffect(() => {
    if (!catId) return
    const requestId = ++loadSeq.current
    setLoading(true)
    setError(null)
    setFiche(null)
    api(`/api/team-sheets/categorie/${catId}`)
      .then((res) => {
        if (requestId !== loadSeq.current) return
        setFiche(normalizeFiche(res?.data))
        setLoading(false)
      })
      .catch((err) => {
        if (requestId !== loadSeq.current) return
        setError(err?.message || 'Impossible de charger la fiche technique.')
        setLoading(false)
      })
  }, [catId])

  const crumbs = [
    { label: 'Accueil', to: '/' },
    { label: 'Équipes', to: '/equipes' },
    { label: 'Fiches techniques', to: '/equipes/technique' },
  ]
  if (catName) crumbs.push({ label: catName })

  const subTitle = 'mb-5 font-display text-3xl font-bold leading-none text-[#14231a] md:text-4xl'

  return (
    <>
      <PageHero
        crumbs={crumbs}
        title="Fiches techniques"
        lead="Staff, objectifs, palmarès et effectif de chaque catégorie."
      >
        {categories.length > 0 && (
          <div className="mt-7">
            <TeamPills
              categories={categories.map((c) => c.nom)}
              active={catName}
              onChange={(name) => navigate(`/equipes/technique/${name}`)}
            />
          </div>
        )}
      </PageHero>

      <section id="fiche-technique" className="bg-[#fafcfa] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {categoriesLoading ? (
            <p className="py-10 text-center text-sm text-sombre/75">
              Chargement des catégories…
            </p>
          ) : categoriesError ? (
            <div
              role="alert"
              className="rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
            >
              {categoriesError}
            </div>
          ) : !cat ? (
            /* Redirection en cours vers la 1re catégorie réelle. */
            null
          ) : loading ? (
            <p className="py-10 text-center text-sm text-sombre/75">
              Chargement de la fiche…
            </p>
          ) : error || !fiche ? (
            <div className="mx-auto max-w-md rounded-[20px] border border-dashed border-dore/40 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-menthe text-vert">
                <FontAwesomeIcon icon={faFutbol} className="h-7 w-7" />
              </div>
              <p className="mt-5 font-semibold text-sombre">
                {error ?? 'Fiche technique non disponible pour cette catégorie.'}
              </p>
              <p className="mt-2 text-sm text-sombre/75">
                {error
                  ? 'Réessayez dans quelques instants.'
                  : 'Aucune fiche technique pour cette catégorie pour le moment.'}
              </p>
            </div>
          ) : (
            <motion.div
              key={catName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-wrap items-start gap-10"
            >
              {/* Colonne principale : effectif + objectifs */}
              <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-10">
                <div>
                  <h2 className={subTitle}>Effectif {fiche.saison}</h2>
                  <div className="overflow-hidden rounded-[20px] border border-[#e3ede6] bg-white">
                    <RosterTable effectif={fiche.effectif} />
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Button to="/equipes" variant="outline" size="sm" className="px-6">
                      Voir tout l&rsquo;effectif →
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className={subTitle}>Objectifs de la saison</h2>
                  <ObjectivesList objectifs={fiche.objectifs} />
                </div>
              </div>

              {/* Colonne latérale : staff + palmarès */}
              <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-10">
                <div>
                  <h2 className={subTitle}>Staff</h2>
                  <StaffList staff={fiche.staff} />
                </div>
                <div>
                  <h2 className={subTitle}>Palmarès</h2>
                  <PalmaresList palmares={fiche.palmares} />
                </div>
              </aside>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
