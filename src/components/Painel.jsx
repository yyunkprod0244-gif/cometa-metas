export function Painel({ resumo }) {
  const itens = [
    { rotulo: 'Metas', valor: resumo.total },
    { rotulo: 'Concluídas', valor: resumo.concluidas },
    { rotulo: 'Progresso médio', valor: `${resumo.media}%` },
  ]

  return (
    <dl className="painel">
      {itens.map((item) => (
        <div key={item.rotulo} className="painel__item">
          <dt className="painel__rotulo">{item.rotulo}</dt>
          <dd className="painel__valor">{item.valor}</dd>
        </div>
      ))}
    </dl>
  )
}
