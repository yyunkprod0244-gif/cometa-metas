// Acesso seguro ao localStorage (pode falhar em modo privado ou cota cheia).

export function lerDoArmazenamento(chave, padrao) {
  try {
    const bruto = window.localStorage.getItem(chave)
    return bruto === null ? padrao : JSON.parse(bruto)
  } catch {
    return padrao
  }
}

export function salvarNoArmazenamento(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // Sem persistência: o app continua funcionando só em memória.
  }
}
