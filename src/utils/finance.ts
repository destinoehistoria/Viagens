import type { Currency } from '../types'

export interface FinanceEntry {
  id: string
  grupo: 'hospedagem' | 'transporte' | 'alimentacao' | 'atracoes' | 'transporte-urbano' | 'compras' | 'outros'
  descricao: string
  data?: string
  moeda: Currency
  bruto: number
  desconto?: number
  descontoDescricao?: string
  credito?: number
  creditoDescricao?: string
  dinheiroPago: number
  dinheiroAPagar: number
  pontosUtilizados?: number
  pontosUtilizadosPrograma?: string
  pontosPrograma?: string
  /** Pontos por unidade de moeda (ex.: 7 pontos/R$ 1). */
  pontosTaxa?: number
  pontosPrevistos?: number
  pontosCreditados?: number
  pontosStatus?: string
  cashbackPrograma?: string
  cashbackPercentual?: number
  cashbackPrevisto?: number
  cashbackRecebido?: number
  cashbackStatus?: 'pendente' | 'confirmado' | 'recebido' | 'negado'
  observacoes?: string
}

export interface ExchangeRate {
  moeda: Exclude<Currency, 'BRL'>
  /** Valor de 1 unidade da moeda em BRL. */
  valorEmBRL: number
  /** Data de referência AAAA-MM-DD, obrigatória. */
  data: string
  fonte?: string
}

export interface FinanceData {
  versao: 1
  descricao?: string
  taxas: ExchangeRate[]
  lancamentos: FinanceEntry[]
}

export const groupLabel: Record<FinanceEntry['grupo'], string> = {
  hospedagem: 'Hospedagem',
  transporte: 'Transporte',
  alimentacao: 'Alimentação',
  atracoes: 'Atrações',
  'transporte-urbano': 'Transporte urbano',
  compras: 'Compras',
  outros: 'Outros',
}

const n = (v: number | undefined) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
const round2 = (v: number) => Math.round(v * 100) / 100

/** Pontos previstos: valor informado ou estimativa taxa × dinheiro (pago + a pagar). */
export function expectedPoints(e: FinanceEntry): { value: number; estimated: boolean } {
  if (typeof e.pontosPrevistos === 'number') return { value: e.pontosPrevistos, estimated: false }
  if (e.pontosTaxa) return { value: Math.floor(e.pontosTaxa * (n(e.dinheiroPago) + n(e.dinheiroAPagar))), estimated: true }
  return { value: 0, estimated: false }
}

/** Cashback previsto: valor informado ou estimativa percentual × dinheiro. */
export function expectedCashback(e: FinanceEntry): { value: number; estimated: boolean } {
  if (typeof e.cashbackPrevisto === 'number') return { value: e.cashbackPrevisto, estimated: false }
  if (e.cashbackPercentual) return { value: round2((e.cashbackPercentual / 100) * (n(e.dinheiroPago) + n(e.dinheiroAPagar))), estimated: true }
  return { value: 0, estimated: false }
}

/**
 * Custo líquido estimado = dinheiro pago + a pagar − cashback efetivamente RECEBIDO.
 * Cashback pendente nunca é descontado.
 */
export function netCost(e: FinanceEntry): number {
  return round2(n(e.dinheiroPago) + n(e.dinheiroAPagar) - n(e.cashbackRecebido))
}

export interface CurrencyTotals {
  bruto: number
  desconto: number
  credito: number
  pago: number
  aPagar: number
  cashbackPrevisto: number
  cashbackRecebido: number
  liquido: number
  count: number
}

/** Totais SEPARADOS por moeda — nunca soma moedas diferentes. */
export function totalsByCurrency(entries: FinanceEntry[]): Partial<Record<Currency, CurrencyTotals>> {
  const out: Partial<Record<Currency, CurrencyTotals>> = {}
  for (const e of entries) {
    const t = (out[e.moeda] ??= { bruto: 0, desconto: 0, credito: 0, pago: 0, aPagar: 0, cashbackPrevisto: 0, cashbackRecebido: 0, liquido: 0, count: 0 })
    t.bruto = round2(t.bruto + n(e.bruto))
    t.desconto = round2(t.desconto + n(e.desconto))
    t.credito = round2(t.credito + n(e.credito))
    t.pago = round2(t.pago + n(e.dinheiroPago))
    t.aPagar = round2(t.aPagar + n(e.dinheiroAPagar))
    t.cashbackPrevisto = round2(t.cashbackPrevisto + expectedCashback(e).value)
    t.cashbackRecebido = round2(t.cashbackRecebido + n(e.cashbackRecebido))
    t.liquido = round2(t.liquido + netCost(e))
    t.count++
  }
  return out
}

/** Pontos utilizados agrupados por programa. */
export function pointsUsedByProgram(entries: FinanceEntry[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const e of entries) if (e.pontosUtilizados && e.pontosUtilizadosPrograma) out[e.pontosUtilizadosPrograma] = (out[e.pontosUtilizadosPrograma] ?? 0) + e.pontosUtilizados
  return out
}

/**
 * Conversão para BRL, somente quando há taxa informada com data. Retorna null se
 * faltar alguma taxa — nesse caso a interface não exibe um total consolidado.
 */
export function consolidatedBRL(totals: Partial<Record<Currency, CurrencyTotals>>, rates: ExchangeRate[], field: keyof CurrencyTotals): number | null {
  let sum = 0
  for (const [cur, t] of Object.entries(totals) as [Currency, CurrencyTotals][]) {
    if (cur === 'BRL') sum += t[field]
    else {
      const r = rates.find((x) => x.moeda === cur && x.data && x.valorEmBRL > 0)
      if (!r) return null
      sum += t[field] * r.valorEmBRL
    }
  }
  return round2(sum)
}

export function formatMoney(v: number, currency: Currency): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(v)
}

export function formatNumber(v: number): string {
  return new Intl.NumberFormat('pt-BR').format(v)
}

/** Valida um arquivo importado. Lança Error com mensagem amigável. */
export function parseFinanceFile(text: string): FinanceData {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('O arquivo não é um JSON válido.')
  }
  const d = raw as Partial<FinanceData>
  if (!d || d.versao !== 1 || !Array.isArray(d.lancamentos)) throw new Error('Formato não reconhecido: esperado { "versao": 1, "lancamentos": [...] }.')
  const currencies = ['BRL', 'EUR', 'GBP', 'USD']
  d.lancamentos.forEach((e, i) => {
    if (!e.id || !e.descricao) throw new Error(`Lançamento ${i + 1}: faltam "id" ou "descricao".`)
    if (!currencies.includes(e.moeda)) throw new Error(`Lançamento "${e.descricao}": moeda inválida (${String(e.moeda)}).`)
    if (typeof e.bruto !== 'number') throw new Error(`Lançamento "${e.descricao}": "bruto" deve ser numérico.`)
  })
  return { versao: 1, descricao: d.descricao, taxas: Array.isArray(d.taxas) ? d.taxas : [], lancamentos: d.lancamentos as FinanceEntry[] }
}
