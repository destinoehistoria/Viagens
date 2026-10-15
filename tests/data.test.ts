import { describe, expect, it } from 'vitest'
import { trips, tripBySlug } from '../src/trips'
import { daysBetween } from '../src/utils/dates'
import { categoryMeta } from '../src/components/categories'

describe.each(trips.map((t) => [t.slug, t] as const))('viagem %s', (_slug, trip) => {
  it('tem dias em ordem, sem lacunas, do início ao fim', () => {
    expect(trip.days.length).toBeGreaterThan(0)
    expect(trip.days[0].date).toBe(trip.start)
    expect(trip.days[trip.days.length - 1].date).toBe(trip.end)
    for (let i = 1; i < trip.days.length; i++) expect(daysBetween(trip.days[i - 1].date, trip.days[i].date)).toBe(1)
  })

  it('todas as atrações referenciadas existem, e os ids são únicos', () => {
    const ids = trip.attractions.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    const set = new Set(ids)
    for (const d of trip.days) for (const it of d.items) if (it.attractionId) expect(set.has(it.attractionId), it.attractionId).toBe(true)
  })

  it('cidades referenciadas existem', () => {
    const cities = new Set(trip.cities.map((c) => c.id))
    for (const d of trip.days) if (d.cityId !== 'voo') expect(cities.has(d.cityId), `${d.date}: ${d.cityId}`).toBe(true)
    for (const a of trip.attractions) expect(cities.has(a.cityId), a.id).toBe(true)
    for (const h of trip.hotels) expect(cities.has(h.cityId), h.name).toBe(true)
  })

  it('noites dos hotéis batem com as datas', () => {
    for (const h of trip.hotels) expect(daysBetween(h.checkIn, h.checkOut), h.name).toBe(h.nights)
  })

  it('categorias conhecidas', () => {
    for (const a of trip.attractions) expect(categoryMeta[a.category], a.id).toBeDefined()
  })
})

describe('regras editoriais', () => {
  it('Europa: Mont-Saint-Michel fica fora do roteiro ativo', () => {
    const t = tripBySlug['europa-natal-2026']
    expect(JSON.stringify({ d: t.days, a: t.attractions, tr: t.transport })).not.toMatch(/Mont-Saint-Michel/i)
    expect(t.futureIdeas?.map((f) => f.name)).toContain('Mont-Saint-Michel')
  })

  it('Portugal: lugares não visitados nunca aparecem como dias visitados', () => {
    const t = tripBySlug['portugal-madeira-2026']
    const days = JSON.stringify(t.days.map((d) => [d.title, d.items.map((i) => i.text)]))
    for (const nome of ['Coimbra', 'Amarante', 'Arrábida', 'Cascais']) expect(days).not.toMatch(new RegExp(nome, 'i'))
  })

  it('Curitiba/Foz: São Paulo e Campos do Jordão não estão no roteiro', () => {
    const t = tripBySlug['curitiba-foz-2026']
    expect(JSON.stringify({ d: t.days, c: t.cities })).not.toMatch(/Campos do Jordão/i)
    expect(t.cities.map((c) => c.id)).not.toContain('sao-paulo')
  })
})
