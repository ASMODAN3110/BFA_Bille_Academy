/* ============================================================
   TrialSteps — « Comment ça se passe » (maquette Claude Design)
   ------------------------------------------------------------
   Les trois étapes d'une demande d'essai, en cartes numérotées.
   ============================================================ */

const STEPS = [
  {
    title: 'Envoyez votre demande',
    text: 'Le formulaire prend moins de deux minutes.',
  },
  {
    title: 'Confirmation par e-mail',
    text: "Nous vous proposons une date d'essai.",
  },
  {
    title: "Séance d'essai",
    text: 'Le joueur est évalué par nos entraîneurs.',
  },
]

export default function TrialSteps() {
  return (
    <div>
      <h2 className="mb-6 font-display text-3xl font-bold leading-none text-[#14231a] md:text-4xl">
        Comment ça se passe
      </h2>
      <ol className="flex flex-col gap-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex gap-4 rounded-[20px] border border-[#e3ede6] bg-white px-5 py-[18px]"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vert font-bold text-white"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-[17px] font-semibold text-[#14231a]">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-sombre/70">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
