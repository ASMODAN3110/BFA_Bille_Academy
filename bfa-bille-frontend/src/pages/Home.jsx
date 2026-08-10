import Hero from '../components/home/Hero'
import Values from '../components/home/Values'
import Stats from '../components/home/Stats'
import News from '../components/home/News'
import Rankings from '../components/home/Rankings'
import Matches from '../components/home/Matches'
import Gallery from '../components/home/Gallery'
import Testimonials from '../components/home/Testimonials'
import CTA from '../components/home/CTA'

/* ============================================================
   Home — Page d'accueil du site BFA Bille Academy
   ------------------------------------------------------------
   Composition des sections dans l'ordre de la maquette.
   ============================================================ */

export default function Home() {
  return (
    <>
      <Hero />
      <Values />
      <Stats />
      <News />
      <Rankings />
      <Matches />
      <Gallery />
      <Testimonials />
      <CTA />
    </>
  )
}
