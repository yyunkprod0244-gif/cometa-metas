import { useTema } from './hooks/useTema'
import { useMetas } from './hooks/useMetas'
import { BotaoTema } from './components/BotaoTema'
import { CenaCometa } from './components/CenaCometa'
import { Painel } from './components/Painel'
import { FormularioMeta } from './components/FormularioMeta'
import { Filtros } from './components/Filtros'
import { CartaoMeta } from './components/CartaoMeta'

// O workflow injeta o hash do commit no build (VITE_COMMIT_SHA).
// Assim dá para conferir no rodapé qual versão está publicada.
const COMMIT = (import.meta.env.VITE_COMMIT_SHA ?? '').slice(0, 7) || 'local'

export default function App() {
  const { tema, alternarTema } = useTema()
  const { metas, resumo, filtro, setFiltro, adicionarMeta, avancar, voltar, removerMeta } = useMetas()

  return (
    <div className="pagina">
      <div className="fundo" aria-hidden="true">
        <span className="fundo__brilho fundo__brilho--a" />
        <span className="fundo__brilho fundo__brilho--b" />
        <span className="fundo__estrelas" />
      </div>

      <header className="topo">
        <a className="marca" href="#metas">
          <span className="marca__ponto" aria-hidden="true" />
          Cometa
        </a>
        <BotaoTema tema={tema} aoAlternar={alternarTema} />
      </header>

      <section className="destaque">
        <div className="destaque__texto">
          <p className="destaque__chamada">Metas · etapa por etapa</p>
          <h1 className="destaque__titulo">
            Coloque suas metas <span className="texto-degrade">em órbita</span>
          </h1>
          <p className="destaque__descricao">
            Divida cada objetivo em etapas, avance um passo de cada vez e acompanhe tudo num só lugar.
            Seus dados ficam salvos no próprio navegador.
          </p>
          <Painel resumo={resumo} />
        </div>
        <CenaCometa />
      </section>

      <main className="conteudo" id="metas">
        <FormularioMeta aoAdicionar={adicionarMeta} />

        <section className="lista" aria-labelledby="titulo-lista">
          <div className="lista__cabecalho">
            <h2 id="titulo-lista" className="lista__titulo">
              Suas metas
            </h2>
            <Filtros ativo={filtro} aoMudar={setFiltro} />
          </div>

          {metas.length === 0 ? (
            <p className="lista__vazia">Nenhuma meta por aqui ainda. Que tal lançar a primeira?</p>
          ) : (
            <div className="lista__grade">
              {metas.map((meta) => (
                <CartaoMeta
                  key={meta.id}
                  meta={meta}
                  aoAvancar={avancar}
                  aoVoltar={voltar}
                  aoRemover={removerMeta}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="rodape">
        <p>© 2026 Douglas Henrique</p>
        <p className="rodape__build">
          Publicado automaticamente via GitHub Actions · build <code>{COMMIT}</code>
        </p>
      </footer>
    </div>
  )
}
