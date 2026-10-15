import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { consolidatedBRL, expectedCashback, netCost, parseFinanceFile, pointsUsedByProgram, totalsByCurrency, type FinanceEntry } from '../src/utils/finance'

const base: FinanceEntry = { id: 'x', grupo: 'hospedagem', descricao: 'x', moeda: 'BRL', bruto: 1000, dinheiroPago: 1000, dinheiroAPagar: 0 }

describe('financeiro', () => {
  it('não soma moedas diferentes', () => {
    const t = totalsByCurrency([base, { ...base, id: 'y', moeda: 'EUR', bruto: 100, dinheiroPago: 100 }])
    expect(t.BRL?.bruto).toBe(1000)
    expect(t.EUR?.bruto).toBe(100)
  })

  it('consolidado em BRL só existe com taxa datada para cada moeda', () => {
    const t = totalsByCurrency([base, { ...base, id: 'y', moeda: 'EUR', bruto: 100, dinheiroPago: 100 }])
    expect(consolidatedBRL(t, [], 'liquido')).toBeNull()
    expect(consolidatedBRL(t, [{ moeda: 'EUR', valorEmBRL: 6, data: '2026-12-01' }], 'liquido')).toBe(1600)
  })

  it('cashback pendente não reduz o custo líquido', () => {
    const e = { ...base, cashbackPercentual: 3, cashbackStatus: 'pendente' as const }
    expect(expectedCashback(e)).toEqual({ value: 30, estimated: true })
    expect(netCost(e)).toBe(1000)
    expect(netCost({ ...e, cashbackRecebido: 30 })).toBe(970)
  })

  it('rejeita arquivos inválidos', () => {
    expect(() => parseFinanceFile('{')).toThrow(/JSON/)
    expect(() => parseFinanceFile('{"versao":2}')).toThrow()
  })

  const priv = 'privado/financeiro.json'
  it.runIf(existsSync(priv))('arquivo privado confere com os totais informados', () => {
    const d = parseFinanceFile(readFileSync(priv, 'utf8'))
    const hotels = d.lancamentos.filter((e) => e.grupo === 'hospedagem')
    const t = totalsByCurrency(hotels).BRL!
    expect(t.bruto).toBe(27263.75)
    expect(t.credito).toBe(1474.92)
    expect(t.pago + t.aPagar).toBeCloseTo(15823.76, 2) // referência informada: ~15.823,77 (arredondamento)
    expect(t.desconto).toBeCloseTo(9965.07, 2) // referência informada: ~9.965,06
    expect(t.aPagar).toBe(6282.4) // Strasbourg, pagamento no hotel
    expect(pointsUsedByProgram(hotels).ALL).toBe(84000)
  })
})
