import { motion } from 'framer-motion'
import Card from '../ui/Card'
import logo from '../../assets/logo-removebg-preview.png'

/* ============================================================
   LoginCard — Carte de connexion centrée (back-office)
   ------------------------------------------------------------
   - Logo en haut, titre + sous-titre
   - Apparition en fade-in vers le haut (0,5 s)
   - Largeur max 420 px (desktop), responsive mobile
   - Liseré doré en haut + anneau doré discret (bordure de carte)
   ============================================================ */

export default function LoginCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-[420px]"
    >
      <Card className="overflow-hidden ring-1 ring-dore/40 shadow-xl shadow-vert/10">
        {/* Liseré doré */}
        <div className="h-1.5 bg-gradient-to-r from-dore via-dore-dark to-dore" />

        <div className="px-8 py-9 md:px-10">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Logo BFA Bille Academy"
              className="h-20 w-20 object-contain"
            />
          </div>

          <h1 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-vert">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-center text-sm leading-relaxed text-sombre/60">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </Card>
    </motion.div>
  )
}
