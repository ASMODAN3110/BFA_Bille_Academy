import Hero from '../components/home/Hero'
import Values from '../components/home/Values'
import Stats from '../components/home/Stats'
import News from '../components/home/News'
import ShopTeaser from '../components/home/ShopTeaser'
import MatchesRankings from '../components/home/MatchesRankings'
import Gallery from '../components/home/Gallery'
import Testimonials from '../components/home/Testimonials'
import CTA from '../components/home/CTA'

/* ============================================================
   Home — Page d'accueil du site BFA Bille Academy
   ------------------------------------------------------------
   Composition des sections dans l'ordre de la maquette Claude Design :
   Hero · Chiffres · Piliers · Matchs + Classement · Actualités · Boutique · …
   ============================================================ */

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Values />
      <MatchesRankings />
      <News />
      <ShopTeaser />
      <Gallery />
      <Testimonials />
      <CTA />
    </>
  )
}
