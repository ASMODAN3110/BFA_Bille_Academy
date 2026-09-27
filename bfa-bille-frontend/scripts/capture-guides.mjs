/* ============================================================
   capture-guides.mjs — Captures d'écran pour les guides BFA
   ------------------------------------------------------------
   Parcourt le site (visiteur + admin) et produit des captures
   annotées (surlignage doré + pastille numérotée) pour les
   guides d'utilisation LaTeX dans Ressources/Guides/captures/.
   Usage : node scripts/capture-guides.mjs
   Prérequis : frontend :5173 + backend :4000 (données seedées).
   ============================================================ */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const ROOT = resolve(process.cwd(), '../../../Ressources/Guides/captures')
const DIR_VIS = join(ROOT, 'visiteur')
const DIR_ADM = join(ROOT, 'admin')

/* Neutralise les animations pour figer l'état visuel final —
   framer-motion anime opacity/transform en inline (whileInView) :
   sans cela les éléments restent invisibles dans les captures. */
const KILL_ANIM = `*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  opacity: 1 !important;
  transform: none !important;
}`

/* Identifiants fournis par variables d'environnement — jamais en dur :
     ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/capture-guides.mjs */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

let browser, page

/* ---------- utilitaires ---------- */

async function newPage() {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    locale: 'fr-FR',
  })
  const p = await ctx.newPage()
  return p
}

/** Fige les animations et attend que le contenu soit rendu. */
async function settle(p, extraMs = 400) {
  await p.addStyleTag({ content: KILL_ANIM }).catch(() => {})
  await p.waitForLoadState('networkidle').catch(() => {})
  await p.waitForTimeout(extraMs)
}

/**
 * Surligne un élément (outline doré + pastille numérotée).
 * locator : Locator Playwright. num : numéro affiché dans la pastille.
 */
async function highlight(locator, num) {
  const el = locator.first()
  await el.scrollIntoViewIfNeeded({ timeout: 4000 })
  await el.evaluate((node, n) => {
    node.style.outline = '4px solid #d4af37'
    node.style.outlineOffset = '3px'
    node.style.borderRadius = '8px'
    node.style.boxShadow = '0 0 0 6px rgba(212,175,55,.28)'
    const r = node.getBoundingClientRect()
    const badge = document.createElement('div')
    badge.textContent = String(n)
    badge.style.cssText = [
      'position:absolute', 'z-index:2147483647',
      `left:${Math.max(4, r.left + window.scrollX - 14)}px`,
      `top:${Math.max(4, r.top + window.scrollY - 14)}px`,
      'width:30px', 'height:30px', 'border-radius:50%',
      'background:#d4af37', 'color:#004d00',
      'font:bold 16px/30px Arial,sans-serif', 'text-align:center',
      'box-shadow:0 2px 8px rgba(0,0,0,.45)',
    ].join(';')
    badge.className = 'guide-badge'
    document.body.appendChild(badge)
  }, num, { timeout: 4000 })
}

/** Retire les surlignages/pastilles injectés. */
async function clearHighlights(p) {
  await p.evaluate(() => {
    document.querySelectorAll('.guide-badge').forEach((b) => b.remove())
    document.querySelectorAll('[style*="outline: 4px solid"]').forEach((n) => {
      n.style.outline = ''
      n.style.outlineOffset = ''
      n.style.boxShadow = ''
    })
  })
}

/** Locator tolérant : bouton OU lien contenant le texte. */
function action(p, regex) {
  return p.locator('button, a').filter({ hasText: regex }).first()
}

/**
 * Capture `file` dans `dir`.
 * zones : tableau de [locator, numéro] à surligner avant la capture.
 * Les locators absents (timeout court) sont ignorés au lieu de faire échouer.
 */
async function shot(p, dir, file, zones = [], opts = {}) {
  mkdirSync(dir, { recursive: true })
  for (const [loc, num] of zones) {
    try {
      await highlight(loc, num)
    } catch {
      console.warn('    ⚠ zone introuvable pour', file, '(pastille', num + ')')
    }
  }
  await p.waitForTimeout(150)
  await p.screenshot({ path: join(dir, file), fullPage: opts.fullPage ?? false })
  await clearHighlights(p)
  console.log('  ✓', file)
}

/* ---------- parcours VISITEUR ---------- */

async function parcoursVisiteur() {
  console.log('== VISITEUR ==')
  const p = await newPage()

  // --- Accueil ---
  await p.goto(BASE + '/')
  await settle(p, 800)
  await shot(p, DIR_VIS, '01-accueil.png', [
    [p.locator('header nav').first(), 1],
    [p.locator('footer').first(), 2],
  ])
  await p.evaluate(() => window.scrollTo(0, 1200))
  await settle(p)
  await shot(p, DIR_VIS, '02-accueil-sections.png')

  // --- Équipes / joueurs ---
  await p.goto(BASE + '/equipes')
  await settle(p)
  await shot(p, DIR_VIS, '03-equipes.png', [
    [p.locator('[role="tablist"]').first(), 1],
  ])
  const carteJoueur = p.locator('[aria-label^="Voir la fiche"]').first()
  await carteJoueur.scrollIntoViewIfNeeded()
  await carteJoueur.click()
  await settle(p, 700)
  await shot(p, DIR_VIS, '04-fiche-joueur.png')
  await p.keyboard.press('Escape')
  await p.getByRole('button', { name: /fermer|close/i }).first().click().catch(() => {})
  await settle(p, 300)

  // --- Fiche technique ---
  await p.goto(BASE + '/equipes/technique/U9')
  await settle(p, 800)
  await shot(p, DIR_VIS, '05-fiche-technique.png', [
    [p.locator('[role="tablist"], [role="tab"]').first(), 1],
  ])

  // --- Calendrier ---
  await p.goto(BASE + '/calendrier')
  await settle(p)
  await shot(p, DIR_VIS, '06-calendrier.png', [
    [p.locator('main').locator('div.aspect-square').first(), 1],
  ])
  const joursAvecEvt = p.locator('main .aspect-square').filter({ has: p.locator('.bg-dore, [class*="dore"]') })
  await joursAvecEvt.first().click().catch(() => {})
  await settle(p, 500)
  await shot(p, DIR_VIS, '07-calendrier-evenement.png')
  await p.keyboard.press('Escape')

  // --- Essais ---
  await p.goto(BASE + '/essais')
  await settle(p)
  await shot(p, DIR_VIS, '08-essais.png')
  // Remplissage du formulaire (données fictives de démonstration)
  await p.getByLabel(/nom/i).first().fill('Mbarga')
  await p.getByLabel(/prénom|prenom/i).first().fill('Junior')
  await p.getByLabel(/téléphone|telephone/i).first().fill('+237 690 12 34 56')
  await p.getByLabel(/e-?mail|email/i).first().fill('parent.mbarga@example.com')
  const ageField = p.getByLabel(/âge|age/i).first()
  if (await ageField.count()) await ageField.fill('12')
  await shot(p, DIR_VIS, '09-essais-rempli.png', [
    [p.getByRole('button', { name: /envoyer|soumettre|inscrire|envoy/i }).last(), 1],
  ])

  // --- Galerie ---
  await p.goto(BASE + '/galerie')
  await settle(p)
  await shot(p, DIR_VIS, '10-galerie.png', [
    [p.locator('[role="tablist"]').first(), 1],
  ])
  const album = p.locator('main').getByRole('button').or(p.locator('main a')).first()
  await album.click().catch(() => {})
  await settle(p, 700)
  await shot(p, DIR_VIS, '11-galerie-album.png')
  // Ouvre la visionneuse sur le premier média
  const media = p.locator('main img').first()
  if (await media.count()) {
    await media.click().catch(() => {})
    await settle(p, 500)
    await shot(p, DIR_VIS, '12-galerie-visionneuse.png')
    await p.keyboard.press('Escape')
  }

  // --- Blog ---
  await p.goto(BASE + '/blog')
  await settle(p)
  await shot(p, DIR_VIS, '13-blog.png', [
    [p.locator('[role="tablist"]').first(), 1],
  ])
  await p.locator('main a, main [role="button"]').filter({ hasText: /lire|voir|suite/i }).first().click()
    .catch(() => p.locator('article, [class*="cursor-pointer"]').first().click().catch(() => {}))
  await settle(p, 700)
  await shot(p, DIR_VIS, '14-blog-article.png')

  // --- Résultats ---
  await p.goto(BASE + '/resultats')
  await settle(p)
  await shot(p, DIR_VIS, '15-resultats.png')

  // --- Boutique ---
  await p.goto(BASE + '/boutique')
  await settle(p)
  await shot(p, DIR_VIS, '16-boutique.png')
  const btnDevis = p.getByRole('button', { name: /devis/i }).first()
  if (await btnDevis.count()) {
    await btnDevis.click()
    await settle(p, 600)
    await shot(p, DIR_VIS, '17-boutique-devis.png', [
      [p.locator('[role="dialog"], .fixed').last(), 1],
    ])
    await p.keyboard.press('Escape')
  }

  await p.close()
}

/* ---------- parcours ADMIN ---------- */

async function parcoursAdmin() {
  console.log('== ADMIN ==')
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('  ⚠ ADMIN_EMAIL / ADMIN_PASSWORD absents — parcours admin ignoré')
    return
  }
  const p = await newPage()

  // --- Connexion ---
  await p.goto(BASE + '/admin')
  await settle(p)
  await shot(p, DIR_ADM, '01-connexion.png', [
    [p.getByLabel(/email/i), 1],
    [p.getByLabel(/mot de passe/i), 2],
    [p.getByRole('button', { name: /se connecter/i }), 3],
  ])
  await p.getByLabel(/email/i).fill(ADMIN_EMAIL)
  await p.getByLabel(/mot de passe/i).fill(ADMIN_PASSWORD)
  await p.getByRole('button', { name: /se connecter/i }).click()
  await p.waitForURL('**/admin/dashboard', { timeout: 15000 })
  await settle(p, 800)
  await shot(p, DIR_ADM, '02-tableau-de-bord.png', [
    [p.locator('aside, nav').filter({ hasText: 'Tableau de bord' }).first(), 1],
  ])

  // --- Joueurs ---
  await p.goto(BASE + '/admin/players')
  await settle(p)
  await shot(p, DIR_ADM, '03-joueurs.png', [
    [action(p, /ajouter un joueur/i), 1],
  ])
  await action(p, /ajouter un joueur/i).click()
  await settle(p, 600)
  await shot(p, DIR_ADM, '04-joueur-ajout.png', [
    [p.locator('[role="dialog"], .fixed').last(), 1],
  ])
  await p.keyboard.press('Escape')
  await settle(p, 300)

  // --- Catégories ---
  await p.goto(BASE + '/admin/categories')
  await settle(p)
  await shot(p, DIR_ADM, '05-categories.png', [
    [action(p, /ajouter une catégorie/i), 1],
  ])
  await action(p, /ajouter une catégorie/i).click()
  await settle(p, 600)
  await shot(p, DIR_ADM, '06-categorie-modal.png')
  await p.keyboard.press('Escape')
  await settle(p, 300)

  // --- Calendrier ---
  await p.goto(BASE + '/admin/calendar')
  await settle(p)
  await shot(p, DIR_ADM, '07-calendrier.png', [
    [action(p, /créer un événement/i), 1],
  ])
  await action(p, /créer un événement/i).click().catch(() => {})
  await settle(p, 600)
  await shot(p, DIR_ADM, '07b-evenement-modal.png')
  await p.keyboard.press('Escape')

  // --- Essais (validation) ---
  await p.goto(BASE + '/admin/trials')
  await settle(p)
  await shot(p, DIR_ADM, '08-essais.png')
  const btnValider = p.getByRole('button', { name: /valider|confirmer/i }).first()
  const btnRefuser = p.getByRole('button', { name: /refuser/i }).first()
  if (await btnValider.count()) {
    await shot(p, DIR_ADM, '09-essais-actions.png', [
      [btnValider, 1],
      [btnRefuser, 2],
    ])
  }

  // --- Galerie ---
  await p.goto(BASE + '/admin/gallery')
  await settle(p)
  await shot(p, DIR_ADM, '10-galerie.png')
  const albumAdmin = p.locator('main').getByRole('button').or(p.locator('main a')).filter({ hasText: /./ }).first()
  await albumAdmin.click().catch(() => {})
  await settle(p, 600)
  await shot(p, DIR_ADM, '11-galerie-album.png', [
    [action(p, /ajouter|upload|téléverser|media|média/i), 1],
  ])

  // --- Fiches techniques ---
  await p.goto(BASE + '/admin/team-sheets')
  await settle(p)
  await shot(p, DIR_ADM, '12-fiches.png')
  // La fiche est un formulaire inline : on capture le bouton de sauvegarde en bas.
  const btnSaveFiche = action(p, /enregistrer la fiche|créer la fiche/i)
  if (await btnSaveFiche.count()) {
    await btnSaveFiche.scrollIntoViewIfNeeded().catch(() => {})
    await settle(p, 300)
    await shot(p, DIR_ADM, '13-fiche-edition.png', [
      [btnSaveFiche, 1],
    ])
  }

  // --- Blog ---
  await p.goto(BASE + '/admin/blog')
  await settle(p)
  await shot(p, DIR_ADM, '14-blog.png', [
    [action(p, /nouvel article|ajouter|créer/i), 1],
  ])
  await action(p, /nouvel article|ajouter|créer/i).click().catch(() => {})
  await settle(p, 700)
  await shot(p, DIR_ADM, '15-blog-editeur.png')
  await p.keyboard.press('Escape')
  await p.goto(BASE + '/admin/blog')
  await settle(p, 300)

  // --- Résultats ---
  await p.goto(BASE + '/admin/results')
  await settle(p)
  await shot(p, DIR_ADM, '16-resultats.png', [
    [action(p, /ajouter un résultat/i), 1],
  ])
  await action(p, /ajouter un résultat/i).click().catch(() => {})
  await settle(p, 600)
  await shot(p, DIR_ADM, '17-resultat-modal.png')
  await p.keyboard.press('Escape')

  // --- Boutique ---
  await p.goto(BASE + '/admin/shop')
  await settle(p)
  await shot(p, DIR_ADM, '18-boutique.png', [
    [action(p, /ajouter un produit/i), 1],
  ])
  await action(p, /ajouter un produit/i).click().catch(() => {})
  await settle(p, 600)
  await shot(p, DIR_ADM, '19-produit-modal.png')
  await p.keyboard.press('Escape')
  // Section « Demandes de devis » en bas de la page boutique
  const titreDevis = p.getByRole('heading', { name: /demandes de devis/i })
  if (await titreDevis.count()) {
    await titreDevis.scrollIntoViewIfNeeded().catch(() => {})
    await settle(p, 400)
    await shot(p, DIR_ADM, '20-devis.png', [
      [titreDevis, 1],
    ])
  }

  // --- Paramètres ---
  await p.goto(BASE + '/admin/settings')
  await settle(p)
  await shot(p, DIR_ADM, '21-parametres.png')
  await p.evaluate(() => window.scrollTo(0, 1200))
  await settle(p, 300)
  await shot(p, DIR_ADM, '22-parametres-users.png')

  await p.close()
}

/* ---------- main ---------- */

try {
  browser = await chromium.launch()
  await parcoursVisiteur()
  await parcoursAdmin()
  console.log('Terminé.')
} catch (e) {
  console.error('Échec capture:', e)
  process.exitCode = 1
} finally {
  await browser?.close()
}
