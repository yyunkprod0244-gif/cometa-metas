import { useRef } from 'react'
import { calcularProgresso, estaConcluida } from '../utils/metas'

const RAIO = 30
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

// "Saúde" -> "saude" (nome de classe sem acento)
function paraClasse(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function CartaoMeta({ meta, aoAvancar, aoVoltar, aoRemover }) {
  const cartaoRef = useRef(null)
  const progresso = calcularProgresso(meta)
  const concluida = estaConcluida(meta)

  // Inclinação 3D acompanhando o ponteiro
  function inclinar(evento) {
    const cartao = cartaoRef.current
    if (!cartao) return
    const caixa = cartao.getBoundingClientRect()
    const x = (evento.clientX - caixa.left) / caixa.width - 0.5
    const y = (evento.clientY - caixa.top) / caixa.height - 0.5
    cartao.style.setProperty('--giro-y', `${x * 14}deg`)
    cartao.style.setProperty('--giro-x', `${y * -14}deg`)
  }

  function endireitar() {
    cartaoRef.current?.style.setProperty('--giro-x', '0deg')
    cartaoRef.current?.style.setProperty('--giro-y', '0deg')
  }

  return (
    <article
      ref={cartaoRef}
      className={`cartao-meta${concluida ? ' cartao-meta--concluida' : ''}`}
      onPointerMove={inclinar}
      onPointerLeave={endireitar}
      aria-label={meta.titulo}
    >
      <div className="cartao-meta__topo">
        <span className={`etiqueta etiqueta--${paraClasse(meta.categoria)}`}>{meta.categoria}</span>
        {concluida && <span className="selo">Concluída</span>}
      </div>

      <div className="cartao-meta__corpo">
        <svg
          className="anel"
          viewBox="0 0 72 72"
          role="progressbar"
          aria-label={`Progresso de ${meta.titulo}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progresso}
        >
          <circle className="anel__fundo" cx="36" cy="36" r={RAIO} />
          <circle
            className="anel__valor"
            cx="36"
            cy="36"
            r={RAIO}
            strokeDasharray={CIRCUNFERENCIA}
            strokeDashoffset={CIRCUNFERENCIA * (1 - progresso / 100)}
          />
          <text className="anel__texto" x="36" y="40" textAnchor="middle">
            {progresso}%
          </text>
        </svg>

        <div>
          <h3 className="cartao-meta__titulo">{meta.titulo}</h3>
          <p className="cartao-meta__etapas">
            {meta.feitas} de {meta.etapas} etapas
          </p>
        </div>
      </div>

      <div className="cartao-meta__acoes">
        <button
          type="button"
          className="botao botao--icone"
          onClick={() => aoVoltar(meta.id)}
          disabled={meta.feitas === 0}
          aria-label={`Voltar etapa de ${meta.titulo}`}
        >
          −
        </button>
        <button
          type="button"
          className="botao botao--suave"
          onClick={() => aoAvancar(meta.id)}
          disabled={concluida}
          aria-label={`Avançar etapa de ${meta.titulo}`}
        >
          + Etapa
        </button>
        <button
          type="button"
          className="botao botao--perigo"
          onClick={() => aoRemover(meta.id)}
          aria-label={`Remover ${meta.titulo}`}
        >
          Remover
        </button>
      </div>
    </article>
  )
}
