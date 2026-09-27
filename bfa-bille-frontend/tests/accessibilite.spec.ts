import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* ============================================================
   Audit accessibilité WCAG 2.1 AA — @ENF-ACC-03
   ------------------------------------------------------------
   axe-core analyse le DOM rendu de chaque page publique et
   signale les violations des règles WCAG 2.1 niveaux A et AA.
   Les pages admin sont exclues (protégées par authentification).
   ============================================================ */

const PAGES_PUBLIQUES = [
  { nom: 'Accueil', url: '/' },
  { nom: 'Joueurs', url: '/equipes' },
  { nom: 'Calendrier', url: '/calendrier' },
  { nom: 'Essais', url: '/essais' },
  { nom: 'Galerie', url: '/galerie' },
  { nom: 'Blog', url: '/blog' },
  { nom: 'Résultats', url: '/resultats' },
  { nom: 'Boutique', url: '/boutique' },
  { nom: 'Connexion admin', url: '/admin' },
];

for (const { nom, url } of PAGES_PUBLIQUES) {
  test(`A11y — ${nom} (WCAG 2.1 AA)`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    /* Auditer l'état FINAL rendu : framer-motion anime opacity/transform
       à l'arrivée — axe mesurerait sinon des couleurs intermédiaires
       (faux positifs de contraste). */
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }',
    });
    await page.waitForTimeout(300);

    const resultats = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log détaillé pour faciliter la correction des violations
    if (resultats.violations.length > 0) {
      console.log(`\n=== ${nom} — ${resultats.violations.length} violation(s) ===`);
      for (const v of resultats.violations) {
        console.log(`  [${v.impact}] ${v.id} : ${v.help}`);
        for (const node of v.nodes.slice(0, 3)) {
          console.log(`    → ${node.target.join(' ')}`);
        }
      }
    }

    // Tolérance zéro sur les violations critiques et sérieuses
    const graves = resultats.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(graves).toEqual([]);
  });
}

test('A11y — structure sémantique des pages publiques', async ({ page }) => {
  for (const { url } of PAGES_PUBLIQUES.slice(0, 4)) {
    await page.goto(url);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  }
});

test('A11y — navigation clavier (Tab) sur l\'accueil', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Les premiers Tab doivent activer des éléments focusables
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(tag);
  }
});

test('A11y — images informatives avec attribut alt', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const sansAlt = await page.locator('img:not([alt])').count();
  expect(sansAlt).toBe(0);
});
