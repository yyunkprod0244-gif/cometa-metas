export function BotaoTema({ tema, aoAlternar }) {
  const proximo = tema === 'escuro' ? 'claro' : 'escuro'

  return (
    <button
      type="button"
      className="botao-tema"
      onClick={aoAlternar}
      aria-label={`Ativar tema ${proximo}`}
      title={`Ativar tema ${proximo}`}
    >
      <span className="botao-tema__trilho" aria-hidden="true">
        <span className="botao-tema__astro" />
      </span>
      <span className="botao-tema__texto">{tema === 'escuro' ? 'Noite' : 'Dia'}</span>
    </button>
  )
}
