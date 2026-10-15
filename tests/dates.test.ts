import { describe, expect, it } from 'vitest'
import { beforeAll } from 'vitest'
import { localDate, tripPhase, daysBetween, longDate } from '../src/utils/dates'
import { setActiveTrip } from '../src/data/active'
import { tripBySlug } from '../src/trips'

beforeAll(() => setActiveTrip(tripBySlug['europa-natal-2026']))

describe('datas e fusos', () => {
  it('calcula a data local no fuso de cada destino', () => {
    // 23h30 em Fortaleza (UTC-3) já é dia seguinte em Paris (UTC+1)
    const d = new Date('2026-12-03T02:30:00Z')
    expect(localDate(d, 'America/Fortaleza')).toBe('2026-12-02')
    expect(localDate(d, 'Europe/Paris')).toBe('2026-12-03')
  })

  it('mostra contagem regressiva antes da viagem', () => {
    const p = tripPhase(new Date('2026-11-16T15:00:00Z'))
    expect(p).toEqual({ phase: 'antes', daysLeft: 10 })
  })

  it('identifica o dia e a cidade durante a viagem', () => {
    const p = tripPhase(new Date('2026-12-04T09:00:00Z'))
    expect(p.phase).toBe('durante')
    if (p.phase === 'durante') {
      expect(p.day.date).toBe('2026-12-04')
      expect(p.day.cityId).toBe('paris')
      expect(p.dayNumber).toBe(9)
    }
  })

  it('o dia da partida usa o fuso de Fortaleza', () => {
    const p = tripPhase(new Date('2026-11-26T12:00:00Z'))
    expect(p.phase === 'durante' && p.day.cityId).toBe('voo')
  })

  it('marca a viagem como concluída depois de 20/12', () => {
    expect(tripPhase(new Date('2026-12-22T12:00:00Z'))).toEqual({ phase: 'depois' })
  })

  it('formata datas por extenso', () => {
    expect(longDate('2026-11-27')).toBe('sexta-feira, 27 de novembro')
    expect(daysBetween('2026-11-27', '2026-12-01')).toBe(4)
  })
})
