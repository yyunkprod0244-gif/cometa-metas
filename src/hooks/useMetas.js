import { useCallback, useEffect, useMemo, useState } from 'react'
import { criarMeta, filtrarMetas, moverEtapa, resumirMetas } from '../utils/metas'
import { lerDoArmazenamento, salvarNoArmazenamento } from '../utils/armazenamento'

const CHAVE = 'cometa:metas'

export const METAS_EXEMPLO = [
  { id: 'exemplo-1', titulo: 'Configurar CI/CD no GitHub Actions', categoria: 'Estudo', etapas: 5, feitas: 5 },
  { id: 'exemplo-2', titulo: 'Correr 5 km sem parar', categoria: 'Saúde', etapas: 8, feitas: 3 },
  { id: 'exemplo-3', titulo: 'Montar portfólio com 6 projetos', categoria: 'Carreira', etapas: 6, feitas: 4 },
]

export function useMetas() {
  const [metas, setMetas] = useState(() => lerDoArmazenamento(CHAVE, METAS_EXEMPLO))
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    salvarNoArmazenamento(CHAVE, metas)
  }, [metas])

  const adicionarMeta = useCallback((dados) => {
    const nova = criarMeta(dados)
    setMetas((anteriores) => [nova, ...anteriores])
    return nova
  }, [])

  const mover = useCallback((id, delta) => {
    setMetas((anteriores) =>
      anteriores.map((meta) => (meta.id === id ? moverEtapa(meta, delta) : meta)),
    )
  }, [])

  const removerMeta = useCallback((id) => {
    setMetas((anteriores) => anteriores.filter((meta) => meta.id !== id))
  }, [])

  const visiveis = useMemo(() => filtrarMetas(metas, filtro), [metas, filtro])
  const resumo = useMemo(() => resumirMetas(metas), [metas])

  return {
    metas: visiveis,
    resumo,
    filtro,
    setFiltro,
    adicionarMeta,
    avancar: (id) => mover(id, 1),
    voltar: (id) => mover(id, -1),
    removerMeta,
  }
}
