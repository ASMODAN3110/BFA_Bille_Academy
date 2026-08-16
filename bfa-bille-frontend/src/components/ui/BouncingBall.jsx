/* ============================================================
   BouncingBall — Ballon de football qui rebondit (v4, image réelle)
   ------------------------------------------------------------
   Remplace le SVG dessiné à la main (v3) par une vraie image
   PNG de ballon (fond transparent), tournée en 2D pendant le
   rebond.

   Pourquoi c'est plus simple ET plus fiable que la v3 :
   l'image est déjà un cercle avec fond transparent. Faire
   tourner l'élément <img> entier avec un simple `rotate()`
   ne déforme JAMAIS son contour (contrairement à une rotation
   3D `rotateY`, qui aplatirait un sprite plat en une ligne à
   90°). Plus besoin de séparer "contour fixe" / "motif qui
   tourne" comme dans la v3 : ici tout l'élément peut tourner
   ensemble sans jamais casser la silhouette circulaire.

   Toujours conservé (physique du rebond) :
     - Easing asymétrique (chute accélère, montée décélère).
     - 3 rebonds d'amplitude décroissante (perte d'énergie).
     - Squash & stretch à l'impact.
     - Flou de mouvement pendant les phases de vitesse max.
     - Ombre en dégradé radial, synchronisée en inverse.
     - Rotation 2D continue du ballon en l'air.

   Props :
     - `src`             : chemin de l'image du ballon (voir
                            l'import ci-dessous à adapter à votre
                            arborescence de projet)
     - `height`          : taille du ballon (nombre en px, ou
                            toute valeur CSS)
     - `speed`            : durée d'un cycle de rebond (s)
     - `bounceHeight`     : hauteur du premier rebond (px)
     - `shadowIntensity`  : opacité max de l'ombre (0 à 1)
     - `tint`             : filtre CSS optionnel (ex.
                            'sepia(1) hue-rotate(20deg)') pour
                            teinter l'image sans la retoucher
     - `className`        : classes ajoutées sur le conteneur

   Responsive : la taille et le rebond sont pilotés par des variables
   CSS (`--bb-size`, `--bb-bounce`) posées sur le conteneur `.bb-ball`.
   Deux media queries réduisent la taille + le rebond quand le Hero est
   empilé (colonne unique) pour que le ballon ne recouvre JAMAIS le
   texte ni les boutons au-dessus :
     - < 1024px  : taille clamp(7rem, 24vw, 10rem), rebond 48px
     - ≤ 770px   : taille clamp(6rem, 24vw, 7.5rem), rebond 40px
   L'ombre au sol suit automatiquement (calculée en var(--bb-size)).
   ============================================================ */

// Adaptez ce chemin à l'emplacement réel du fichier dans votre
// projet. Deux options :
//  1) Import statique (recommandé avec Vite/CRA/webpack) :
//     placez l'image dans src/assets/ puis importez-la ainsi :
import ballonFootball from '../../assets/ballon-football.png'
//  2) Fichier servi depuis /public : supprimez l'import ci-dessus
//     et utilisez directement src="/ballon-football.png" comme
//     valeur par défaut de la prop `src`.

export default function BouncingBall({
  src = ballonFootball,
  height = 'clamp(11rem, 20vw, 14rem)',
  speed = 1.8,
  bounceHeight = 140,
  shadowIntensity = 0.35,
  tint,
  className = '',
}) {
  const sizeValue = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`bb-ball flex flex-col items-center ${className}`}
      style={{
        '--bb-size': sizeValue,
        '--bb-bounce': `${bounceHeight}px`,
        '--bb-speed': `${speed}s`,
        '--bb-shadow-intensity': shadowIntensity,
      }}
    >
      <style>{`
        /* ---------- Rebond + squash/stretch + flou de mouvement ---------- */
        @keyframes ball-bounce-realistic {
          0%   { transform: translateY(calc(var(--bounce-height) * -1))    scale(0.92, 1.1) rotate(-6deg); filter: blur(0px); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
          11%  { filter: blur(2.2px); }
          22%  { transform: translateY(0) scale(1.28, 0.7) rotate(0deg);   filter: blur(0px); animation-timing-function: cubic-bezier(0, 0.55, 0.45, 1); }
          28%  { transform: translateY(0) scale(0.96, 1.06) rotate(2deg);  filter: blur(0px); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
          36%  { filter: blur(1px); }
          45%  { transform: translateY(calc(var(--bounce-height) * -0.514)) scale(0.95, 1.07) rotate(6deg); filter: blur(0px); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
          52%  { filter: blur(1.6px); }
          60%  { transform: translateY(0) scale(1.18, 0.8) rotate(0deg);   filter: blur(0px); animation-timing-function: cubic-bezier(0, 0.55, 0.45, 1); }
          65%  { transform: translateY(0) scale(0.98, 1.03) rotate(-2deg); filter: blur(0px); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
          70%  { filter: blur(0.6px); }
          76%  { transform: translateY(calc(var(--bounce-height) * -0.214)) scale(0.98, 1.03) rotate(-4deg); filter: blur(0px); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
          81%  { filter: blur(1px); }
          86%  { transform: translateY(0) scale(1.1, 0.88) rotate(0deg);   filter: blur(0px); animation-timing-function: cubic-bezier(0, 0.55, 0.45, 1); }
          92%  { transform: translateY(0) scale(1, 1) rotate(0deg);       filter: blur(0px); }
          96%  { filter: blur(1.4px); }
          100% { transform: translateY(calc(var(--bounce-height) * -1))    scale(0.92, 1.1) rotate(-6deg); filter: blur(0px); }
        }

        /* ---------- Rotation du ballon sur lui-même (2D, sûr avec une image) ---------- */
        @keyframes ball-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ---------- Ombre au sol : dégradé radial + pulsation inverse ---------- */
        @keyframes shadow-bounce-realistic {
          0%   { transform: scale(0.55); opacity: calc(var(--shadow-intensity) * 0.4545); }
          22%  { transform: scale(1.15); opacity: calc(var(--shadow-intensity) * 1); }
          28%  { transform: scale(0.8);  opacity: calc(var(--shadow-intensity) * 0.7273); }
          45%  { transform: scale(0.68); opacity: calc(var(--shadow-intensity) * 0.5455); }
          60%  { transform: scale(1.05); opacity: calc(var(--shadow-intensity) * 0.9091); }
          65%  { transform: scale(0.85); opacity: calc(var(--shadow-intensity) * 0.7636); }
          76%  { transform: scale(0.75); opacity: calc(var(--shadow-intensity) * 0.6364); }
          86%  { transform: scale(1);    opacity: calc(var(--shadow-intensity) * 0.8727); }
          92%  { transform: scale(0.92); opacity: calc(var(--shadow-intensity) * 0.8182); }
          100% { transform: scale(0.55); opacity: calc(var(--shadow-intensity) * 0.4545); }
        }

        .animate-ball-bounce-realistic {
          animation-name: ball-bounce-realistic;
          animation-iteration-count: infinite;
          transform-origin: center bottom;
          will-change: transform, filter;
        }
        .animate-ball-spin {
          animation-name: ball-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .animate-shadow-bounce-realistic {
          animation-name: shadow-bounce-realistic;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ball-bounce-realistic,
          .animate-ball-spin,
          .animate-shadow-bounce-realistic {
            animation: none !important;
          }
        }

        /* ---------- Responsive : en colonne unique (< 1024px, Hero
           empilé), le ballon doit rester dans SA propre ligne pour ne
           jamais recouvrir le texte ni les boutons au-dessus. On réduit
           sa taille et son rebond via des variables CSS (inline — d'où
           le !important) ; l'ombre suit automatiquement (calculée en
           var(--bb-size)). Sur 2 colonnes (>= 1024px), rien ne change. */
        @media (max-width: 1023px) {
          .bb-ball {
            --bb-size: clamp(7rem, 24vw, 10rem) !important;
            --bb-bounce: 48px !important;
          }
        }
        /* Mobile / tablette étroite (≤ 770px) : ballon plus petit et
           rebond court → il reste sous les boutons « Inscrire » et
           « Découvrir les équipes ». */
        @media (max-width: 770px) {
          .bb-ball {
            --bb-size: clamp(6rem, 24vw, 7.5rem) !important;
            --bb-bounce: 40px !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="animate-ball-bounce-realistic"
        style={{
          width: 'var(--bb-size)',
          height: 'var(--bb-size)',
          animationDuration: 'var(--bb-speed)',
          '--bounce-height': 'var(--bb-bounce)',
        }}
      >
        <img
          src={src}
          alt=""
          draggable="false"
          className="animate-ball-spin block w-full h-full select-none pointer-events-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
          style={{
            animationDuration: `${Math.max(speed * 0.6, 0.4)}s`,
            filter: tint,
          }}
        />
      </div>

      {/* Ombre au sol : dégradé radial (centre sombre -> bords transparents) */}
      <span
        aria-hidden="true"
        className="animate-shadow-bounce-realistic rounded-[50%] block"
        style={{
          width: 'calc(var(--bb-size) * 0.62)',
          height: 'calc(var(--bb-size) * 0.11)',
          marginTop: 'calc(var(--bb-size) * 0.1)',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 80%)',
          filter: 'blur(2px)',
          animationDuration: 'var(--bb-speed)',
          '--shadow-intensity': 'var(--bb-shadow-intensity)',
        }}
      />
    </div>
  )
}