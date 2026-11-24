// Regras de negócio das metas — funções puras, fáceis de testar.

export const CATEGORIAS = ['Estudo', 'Carreira', 'Saúde', 'Pessoal']

export const FILTROS = {
  todas: 'Todas',
  andamento: 'Em andamento',
  concluidas: 'Concluídas',
}

export const LIMITES = {
  tituloMin: 3,
  tituloMax: 60,
  etapasMin: 1,
  etapasMax: 20,
}

function gerarId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Retorna a lista de erros de validação (vazia quando está tudo certo). */
export function validarMeta({ titulo = '', categoria = '', etapas } = {}) {
  const erros = []
  const tituloLimpo = String(titulo).trim()
  const totalEtapas = Number(etapas)

  if (tituloLimpo.length < LIMITES.tituloMin) {
    erros.push(`O título precisa ter pelo menos ${LIMITES.tituloMin} caracteres.`)
  } else if (tituloLimpo.length > LIMITES.tituloMax) {
    erros.push(`O título pode ter no máximo ${LIMITES.tituloMax} caracteres.`)
  }

  if (!CATEGORIAS.includes(categoria)) {
    erros.push('Escolha uma categoria válida.')
  }

  if (
    !Number.isInteger(totalEtapas) ||
    totalEtapas < LIMITES.etapasMin ||
    totalEtapas > LIMITES.etapasMax
  ) {
    erros.push(`As etapas devem ser um número inteiro entre ${LIMITES.etapasMin} e ${LIMITES.etapasMax}.`)
  }

  return erros
}

/** Cria uma meta nova já normalizada. Lança erro se os dados forem inválidos. */
export function criarMeta(dados, id = gerarId()) {
  const erros = validarMeta(dados)
  if (erros.length > 0) {
    throw new Error(erros[0])
  }

  return {
    id,
    titulo: String(dados.titulo).trim(),
    categoria: dados.categoria,
    etapas: Number(dados.etapas),
    feitas: 0,
  }
}

/** Avança (delta positivo) ou volta (delta negativo) etapas, sem sair dos limites. */
export function moverEtapa(meta, delta) {
  const feitas = Math.min(meta.etapas, Math.max(0, meta.feitas + delta))
  return feitas === meta.feitas ? meta : { ...meta, feitas }
}

/** Progresso da meta em porcentagem inteira (0 a 100). */
export function calcularProgresso(meta) {
  if (!meta || meta.etapas <= 0) return 0
  return Math.round((meta.feitas / meta.etapas) * 100)
}

export function estaConcluida(meta) {
  return meta.feitas >= meta.etapas
}

export function filtrarMetas(metas, filtro) {
  if (filtro === 'concluidas') return metas.filter(estaConcluida)
  if (filtro === 'andamento') return metas.filter((meta) => !estaConcluida(meta))
  return metas
}

/** Números do painel: total, concluídas e progresso médio. */
export function resumirMetas(metas) {
  if (metas.length === 0) {
    return { total: 0, concluidas: 0, media: 0 }
  }

  const soma = metas.reduce((acc, meta) => acc + calcularProgresso(meta), 0)

  return {
    total: metas.length,
    concluidas: metas.filter(estaConcluida).length,
    media: Math.round(soma / metas.length),
  }
}
