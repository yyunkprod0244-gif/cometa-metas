import { useCallback, useEffect, useState } from 'react'

const CHAVE = 'cometa:tema'

function temaInicial() {
  // O script do index.html já aplicou o tema salvo; aproveitamos esse valor.
  const atual = document.documentElement.dataset.tema
  return atual === 'claro' ? 'claro' : 'escuro'
}

export function useTema() {
  const [tema, setTema] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      window.localStorage.setItem(CHAVE, tema)
    } catch {
      // Sem persistência do tema: segue só na sessão.
    }
  }, [tema])

  const alternarTema = useCallback(() => {
    setTema((anterior) => (anterior === 'escuro' ? 'claro' : 'escuro'))
  }, [])

  return { tema, alternarTema }
}
