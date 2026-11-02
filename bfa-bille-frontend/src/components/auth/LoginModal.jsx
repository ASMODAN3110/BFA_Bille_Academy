import Modal from '../ui/Modal'
import LoginForm from './LoginForm'
import logo from '../../assets/logo-removebg-preview.png'

/* ============================================================
   LoginModal — Connexion au back-office en fenêtre modale
   ------------------------------------------------------------
   - Ouverte depuis le lien « Back-office » du pied de page
   - Réutilise LoginForm (validation, appel login(), redirection
     vers /admin/dashboard) ; la page /admin reste disponible
     pour les redirections des routes protégées
   - Props : open, onClose
   ============================================================ */

export default function LoginModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connexion Administration"
      subtitle="Accédez à votre espace pour gérer le contenu du site de la BFA."
      size="sm"
    >
      <div className="mb-5 flex justify-center">
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="h-16 w-16 object-contain"
        />
      </div>
      {/* `open` en clé : le formulaire repart vierge à chaque ouverture. */}
      {open && <LoginForm />}
    </Modal>
  )
}
