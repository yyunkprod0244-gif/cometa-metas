import { FILTROS } from '../utils/metas'

export function Filtros({ ativo, aoMudar }) {
  return (
    <div className="filtros" role="group" aria-label="Filtrar metas">
      {Object.entries(FILTROS).map(([chave, rotulo]) => (
        <button
          key={chave}
          type="button"
          className={`filtros__opcao${ativo === chave ? ' filtros__opcao--ativa' : ''}`}
          aria-pressed={ativo === chave}
          onClick={() => aoMudar(chave)}
        >
          {rotulo}
        </button>
      ))}
    </div>
  )
}
