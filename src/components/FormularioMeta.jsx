import { useState } from 'react'
import { CATEGORIAS, LIMITES, validarMeta } from '../utils/metas'

const VAZIO = { titulo: '', categoria: CATEGORIAS[0], etapas: 5 }

export function FormularioMeta({ aoAdicionar }) {
  const [dados, setDados] = useState(VAZIO)
  const [erros, setErros] = useState([])

  function atualizar(evento) {
    const { name, value } = evento.target
    setDados((anterior) => ({ ...anterior, [name]: value }))
  }

  function enviar(evento) {
    evento.preventDefault()
    const encontrados = validarMeta(dados)
    if (encontrados.length > 0) {
      setErros(encontrados)
      return
    }
    aoAdicionar(dados)
    setDados(VAZIO)
    setErros([])
  }

  return (
    <form className="formulario cartao-vidro" onSubmit={enviar} noValidate>
      <h2 className="formulario__titulo">Nova meta</h2>

      <label className="campo">
        <span className="campo__rotulo">Título da meta</span>
        <input
          className="campo__entrada"
          name="titulo"
          value={dados.titulo}
          onChange={atualizar}
          maxLength={LIMITES.tituloMax}
          placeholder="Ex.: Ler 4 livros técnicos"
          autoComplete="off"
        />
      </label>

      <div className="formulario__linha">
        <label className="campo">
          <span className="campo__rotulo">Categoria</span>
          <select className="campo__entrada" name="categoria" value={dados.categoria} onChange={atualizar}>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </label>

        <label className="campo">
          <span className="campo__rotulo">Etapas</span>
          <input
            className="campo__entrada"
            type="number"
            name="etapas"
            min={LIMITES.etapasMin}
            max={LIMITES.etapasMax}
            value={dados.etapas}
            onChange={atualizar}
          />
        </label>
      </div>

      {erros.length > 0 && (
        <ul className="formulario__erros" role="alert">
          {erros.map((erro) => (
            <li key={erro}>{erro}</li>
          ))}
        </ul>
      )}

      <button type="submit" className="botao botao--primario">
        Lançar meta
      </button>
    </form>
  )
}
