import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFutbol } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '../components/layout/Breadcrumb'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import TeamSelector from '../components/team/TeamSelector'
import RosterTable from '../components/team/RosterTable'
import StaffList from '../components/team/StaffList'
import ObjectivesList from '../components/team/ObjectivesList'
import PalmaresList from '../components/team/PalmaresList'
import { useScrollAnimation, fadeUp } from '../hooks/useScrollAnimation'
import { useCategories } from '../hooks/useCategories'
import { api } from '../utils/api'
import { normalizeFiche } from '../utils/teamSheetAdapter'

/* ============================================================
   TeamSheet — Fiche technique d'une catégorie
               (/equipes/technique/:categorie)
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
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })

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

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Équipes', href: '/equipes' },
    { label: 'Fiches techniques', href: '/equipes/technique' },
  ]
  if (catName) breadcrumbItems.push({ label: catName })

  return (
    <section id="fiche-technique" className="bg-clair py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <SectionTitle
            title="Fiches Techniques"
            subtitle="Profils techniques détaillés, effectifs et données historiques par catégorie."
          />
        </motion.div>

        {categories.length > 0 && (
          <TeamSelector
            categories={categories.map((c) => c.nom)}
            active={catName}
            onChange={(name) => navigate(`/equipes/technique/${name}`)}
          />
        )}

        {/* Contenu de la fiche */}
        {categoriesLoading ? (
          <p className="mt-10 py-10 text-center text-sm text-sombre/60">
            Chargement des catégories…
          </p>
        ) : categoriesError ? (
          <div
            role="alert"
            className="mt-10 rounded-xl border border-erreur/30 bg-erreur/10 px-4 py-3 text-sm font-medium text-erreur"
          >
            {categoriesError}
          </div>
        ) : !cat ? (
          /* Redirection en cours vers la 1re catégorie réelle. */
          null
        ) : loading ? (
          <p className="mt-10 py-10 text-center text-sm text-sombre/60">
            Chargement de la fiche…
          </p>
        ) : error || !fiche ? (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-dore/40 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clair text-dore-dark">
              <FontAwesomeIcon icon={faFutbol} className="h-7 w-7" />
            </div>
            <p className="mt-5 font-semibold text-sombre">
              {error ?? 'Fiche technique non disponible pour cette catégorie.'}
            </p>
            <p className="mt-2 text-sm text-sombre/60">
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
            className="mt-10 space-y-8"
          >
            {/* Effectif */}
            <Card className="p-6 md:p-8">
              <h3 className="mb-4 text-xl font-extrabold text-vert">
                Effectif {fiche.saison}
              </h3>
              <RosterTable effectif={fiche.effectif} />
              <div className="mt-5 flex justify-end">
                <Button
                  to="/equipes"
                  variant="outline"
                  size="sm"
                  className="px-6"
                >
                  Voir tout l'effectif →
                </Button>
              </div>
            </Card>

            {/* Staff technique */}
            <Card className="p-6 md:p-8">
              <h3 className="mb-5 text-xl font-extrabold text-vert">
                Staff Technique
              </h3>
              <StaffList staff={fiche.staff} />
            </Card>

            {/* Objectifs de la saison */}
            <Card className="p-6 md:p-8">
              <h3 className="mb-5 text-xl font-extrabold text-vert">
                Objectifs Saison
              </h3>
              <ObjectivesList objectifs={fiche.objectifs} />
            </Card>

            {/* Palmarès */}
            <Card className="p-6 md:p-8">
              <h3 className="mb-5 text-xl font-extrabold text-vert">Palmarès</h3>
              <PalmaresList palmares={fiche.palmares} />
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
