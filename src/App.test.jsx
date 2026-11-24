import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

function valorDoPainel(rotulo) {
  return screen.getByText(rotulo, { selector: 'dt' }).nextElementSibling.textContent
}

async function lancarMeta(user, { titulo, categoria = 'Estudo', etapas = '3' }) {
  await user.type(screen.getByLabelText('Título da meta'), titulo)
  await user.selectOptions(screen.getByLabelText('Categoria'), categoria)
  const campoEtapas = screen.getByLabelText('Etapas')
  await user.clear(campoEtapas)
  await user.type(campoEtapas, etapas)
  await user.click(screen.getByRole('button', { name: 'Lançar meta' }))
}

describe('App Cometa', () => {
  beforeEach(() => {
    window.localStorage.clear()
    delete document.documentElement.dataset.tema
  })

  it('mostra o título e as metas de exemplo na primeira visita', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('em órbita')
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(valorDoPainel('Metas')).toBe('3')
  })

  it('mostra erro de validação quando o título é curto demais', async () => {
    const user = userEvent.setup()
    render(<App />)

    await lancarMeta(user, { titulo: 'Oi' })

    expect(screen.getByRole('alert')).toHaveTextContent('pelo menos 3 caracteres')
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('adiciona uma meta nova e limpa o formulário', async () => {
    const user = userEvent.setup()
    render(<App />)

    await lancarMeta(user, { titulo: 'Ler 4 livros técnicos', categoria: 'Carreira', etapas: '4' })

    const cartao = screen.getByRole('article', { name: 'Ler 4 livros técnicos' })
    expect(within(cartao).getByText('Carreira')).toBeInTheDocument()
    expect(within(cartao).getByText('0 de 4 etapas')).toBeInTheDocument()
    expect(screen.getByLabelText('Título da meta')).toHaveValue('')
    expect(valorDoPainel('Metas')).toBe('4')
  })

  it('avança etapas até concluir a meta', async () => {
    const user = userEvent.setup()
    render(<App />)
    await lancarMeta(user, { titulo: 'Meta rápida', etapas: '2' })

    const cartao = screen.getByRole('article', { name: 'Meta rápida' })
    const avancar = within(cartao).getByRole('button', { name: 'Avançar etapa de Meta rápida' })

    await user.click(avancar)
    expect(within(cartao).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')

    await user.click(avancar)
    expect(within(cartao).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(within(cartao).getByText('Concluída')).toBeInTheDocument()
    expect(avancar).toBeDisabled()
  })

  it('volta uma etapa e não deixa ficar abaixo de zero', async () => {
    const user = userEvent.setup()
    render(<App />)
    await lancarMeta(user, { titulo: 'Meta de teste', etapas: '3' })

    const cartao = screen.getByRole('article', { name: 'Meta de teste' })
    const voltar = within(cartao).getByRole('button', { name: 'Voltar etapa de Meta de teste' })
    expect(voltar).toBeDisabled()

    await user.click(within(cartao).getByRole('button', { name: 'Avançar etapa de Meta de teste' }))
    await user.click(voltar)
    expect(within(cartao).getByText('0 de 3 etapas')).toBeInTheDocument()
  })

  it('filtra metas concluídas e em andamento', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Concluídas' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Concluídas' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Em andamento' }))
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('remove uma meta e mostra o estado vazio quando não sobra nenhuma', async () => {
    const user = userEvent.setup()
    render(<App />)

    for (const botao of screen.getAllByRole('button', { name: /^Remover / })) {
      await user.click(botao)
    }

    expect(screen.queryAllByRole('article')).toHaveLength(0)
    expect(screen.getByText(/Nenhuma meta por aqui/)).toBeInTheDocument()
  })

  it('salva as metas no localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await lancarMeta(user, { titulo: 'Meta persistida' })

    const salvas = JSON.parse(window.localStorage.getItem('cometa:metas'))
    expect(salvas[0].titulo).toBe('Meta persistida')
  })

  it('alterna entre tema escuro e claro e lembra a escolha', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ativar tema claro' }))
    expect(document.documentElement.dataset.tema).toBe('claro')
    expect(window.localStorage.getItem('cometa:tema')).toBe('claro')

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))
    expect(document.documentElement.dataset.tema).toBe('escuro')
  })

  it('mostra no rodapé o build publicado', () => {
    render(<App />)
    expect(screen.getByText(/Publicado automaticamente via GitHub Actions/)).toBeInTheDocument()
  })
})
