import { describe, expect, it } from 'vitest'
import {
  calcularProgresso,
  criarMeta,
  estaConcluida,
  filtrarMetas,
  moverEtapa,
  resumirMetas,
  validarMeta,
} from './metas'

const base = { titulo: 'Aprender GitHub Actions', categoria: 'Estudo', etapas: 4 }

describe('validarMeta', () => {
  it('aceita dados válidos', () => {
    expect(validarMeta(base)).toEqual([])
  })

  it('recusa título curto ou só com espaços', () => {
    expect(validarMeta({ ...base, titulo: '  ab  ' })[0]).toMatch(/pelo menos 3/)
  })

  it('recusa título longo demais', () => {
    expect(validarMeta({ ...base, titulo: 'x'.repeat(61) })[0]).toMatch(/no máximo 60/)
  })

  it('recusa categoria fora da lista', () => {
    expect(validarMeta({ ...base, categoria: 'Viagem' })).toContain('Escolha uma categoria válida.')
  })

  it.each([0, 21, 2.5, '', 'abc'])('recusa etapas inválidas (%s)', (etapas) => {
    expect(validarMeta({ ...base, etapas })).toHaveLength(1)
  })

  it('aceita etapas vindas do input como texto', () => {
    expect(validarMeta({ ...base, etapas: '7' })).toEqual([])
  })
})

describe('criarMeta', () => {
  it('normaliza título e etapas e começa com zero feitas', () => {
    const meta = criarMeta({ ...base, titulo: '  Ler 4 livros  ', etapas: '4' }, 'id-1')
    expect(meta).toEqual({ id: 'id-1', titulo: 'Ler 4 livros', categoria: 'Estudo', etapas: 4, feitas: 0 })
  })

  it('gera ids diferentes quando nenhum é informado', () => {
    expect(criarMeta(base).id).not.toBe(criarMeta(base).id)
  })

  it('lança erro com a primeira mensagem de validação', () => {
    expect(() => criarMeta({ ...base, titulo: '' })).toThrow(/pelo menos 3/)
  })
})

describe('moverEtapa e calcularProgresso', () => {
  const meta = { id: 'a', titulo: 'Meta', categoria: 'Estudo', etapas: 3, feitas: 1 }

  it('avança e volta etapas', () => {
    expect(moverEtapa(meta, 1).feitas).toBe(2)
    expect(moverEtapa(meta, -1).feitas).toBe(0)
  })

  it('não passa dos limites e devolve o mesmo objeto quando nada muda', () => {
    const cheia = { ...meta, feitas: 3 }
    const vazia = { ...meta, feitas: 0 }
    expect(moverEtapa(cheia, 1)).toBe(cheia)
    expect(moverEtapa(vazia, -1)).toBe(vazia)
  })

  it('não altera a meta original (imutável)', () => {
    moverEtapa(meta, 1)
    expect(meta.feitas).toBe(1)
  })

  it('calcula a porcentagem arredondada', () => {
    expect(calcularProgresso(meta)).toBe(33)
    expect(calcularProgresso({ ...meta, feitas: 3 })).toBe(100)
    expect(calcularProgresso({ ...meta, etapas: 0 })).toBe(0)
    expect(calcularProgresso(undefined)).toBe(0)
  })
})

describe('filtrarMetas e resumirMetas', () => {
  const metas = [
    { id: '1', titulo: 'A', categoria: 'Estudo', etapas: 2, feitas: 2 },
    { id: '2', titulo: 'B', categoria: 'Saúde', etapas: 4, feitas: 1 },
    { id: '3', titulo: 'C', categoria: 'Pessoal', etapas: 5, feitas: 0 },
  ]

  it('identifica metas concluídas', () => {
    expect(estaConcluida(metas[0])).toBe(true)
    expect(estaConcluida(metas[1])).toBe(false)
  })

  it('filtra por situação', () => {
    expect(filtrarMetas(metas, 'todas')).toHaveLength(3)
    expect(filtrarMetas(metas, 'concluidas').map((m) => m.id)).toEqual(['1'])
    expect(filtrarMetas(metas, 'andamento').map((m) => m.id)).toEqual(['2', '3'])
  })

  it('resume total, concluídas e média de progresso', () => {
    // (100 + 25 + 0) / 3 = 41,67 -> 42
    expect(resumirMetas(metas)).toEqual({ total: 3, concluidas: 1, media: 42 })
  })

  it('devolve zeros para lista vazia', () => {
    expect(resumirMetas([])).toEqual({ total: 0, concluidas: 0, media: 0 })
  })
})
