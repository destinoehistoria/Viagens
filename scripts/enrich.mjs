#!/usr/bin/env node
/**
 * Enriquecimento de fotos e coordenadas — todas as viagens do app.
 *
 * Para cada atração com `wiki` (título de artigo da Wikipédia em inglês):
 *   1. consulta a Wikipédia: imagem principal do artigo (pageimage) e coordenadas;
 *   2. consulta o Wikimedia Commons: autor, licença e URL da imagem;
 *   3. aceita SOMENTE licenças livres (CC0, domínio público, CC BY, CC BY-SA);
 *   4. baixa uma versão de 1280 px para public/images/<viagem>/<cidade>/<id>.jpg;
 *   5. grava créditos e coordenadas em src/data/generated/enrichment.json.
 * Para cada cidade: foto do artigo da cidade e, se houver `photoSearch`, uma busca no Commons.
 *
 * Uso: npm run enrich [slug…]   (requer acesso à internet; sem slug, todas as viagens)
 * Viagens já enriquecidas são puladas, a menos que o slug seja passado explicitamente.
 * Overrides manuais: scripts/photo-overrides.json  { "<slug>/<id-da-atracao>": "File:Nome.jpg" }
 * Nada é inventado: se a consulta falhar, a atração continua com placeholder.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'src/data/generated/enrichment.json')
const UA = 'ViagensAndreRicardo/1.0 (guia pessoal de viagem; https://github.com/alsrocha/Viagens)'
const WIDTH = 1280
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Carrega as viagens (TypeScript) pelo próprio Vite. */
async function loadTrips() {
  const server = await createServer({ root: ROOT, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
  try {
    const mod = await server.ssrLoadModule('/src/trips/index.ts')
    return mod.trips
  } finally {
    await server.close()
  }
}

async function api(host, params) {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } })
      if (res.ok) return res.json()
      if (res.status === 429) await sleep(3000 * (i + 1))
    } catch {
      await sleep(1000 * (i + 1))
    }
  }
  throw new Error(`Falha ao consultar ${host}`)
}

const stripHtml = (s = '') => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const FREE = /^(cc0|public domain|pd|cc by(-sa)?( \d\.\d)?|cc-by(-sa)?-\d\.\d)/i

async function commonsInfo(fileTitle) {
  const r = await api('commons.wikimedia.org', {
    action: 'query',
    titles: fileTitle.startsWith('File:') ? fileTitle : `File:${fileTitle}`,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|mime',
    iiurlwidth: String(WIDTH),
  })
  const page = r.query?.pages?.[0]
  const ii = page?.imageinfo?.[0]
  if (!ii || !/^image\/(jpeg|png|webp)$/.test(ii.mime)) return null
  const md = ii.extmetadata ?? {}
  const license = stripHtml(md.LicenseShortName?.value)
  if (!FREE.test(license) || /fair use|non-free/i.test(md.UsageTerms?.value ?? '')) return null
  return {
    file: page.title,
    thumb: ii.thumburl ?? ii.url,
    sourceUrl: ii.descriptionurl,
    author: stripHtml(md.Artist?.value) || undefined,
    license,
    licenseUrl: md.LicenseUrl?.value,
    description: stripHtml(md.ImageDescription?.value).slice(0, 200) || undefined,
    date: stripHtml(md.DateTimeOriginal?.value) || undefined,
  }
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

async function photoFrom(info, rel, alt, title) {
  await download(info.thumb, path.join(ROOT, 'public', rel))
  return { src: rel, alt: `${alt}${info.description ? ` — ${info.description}` : ''}`, title, author: info.author, license: info.license, licenseUrl: info.licenseUrl, sourceUrl: info.sourceUrl }
}

async function enrichTrip(trip, overrides) {
  const out = { generatedAt: new Date().toISOString(), attractions: {}, cities: {} }
  let ok = 0
  let failed = 0
  for (const a of trip.attractions) {
    const override = overrides[`${trip.slug}/${a.id}`]
    if (!a.wiki && !override) continue
    try {
      let fileTitle = override
      const entry = {}
      if (a.wiki) {
        const r = await api('en.wikipedia.org', { action: 'query', titles: a.wiki, redirects: '1', prop: 'pageimages|coordinates', piprop: 'name', coprimary: 'primary' })
        const page = r.query?.pages?.[0]
        const co = page?.coordinates?.[0]
        if (co) {
          entry.coords = { lat: +co.lat.toFixed(5), lng: +co.lon.toFixed(5) }
          entry.coordsSource = `Wikipédia: ${page.title}`
        }
        fileTitle ??= page?.pageimage
      }
      if (fileTitle) {
        const info = await commonsInfo(fileTitle)
        if (info) entry.photo = await photoFrom(info, `images/${trip.slug}/${a.cityId}/${a.id}.jpg`, a.name, a.name)
      }
      if (entry.coords || entry.photo) {
        out.attractions[a.id] = entry
        ok++
        console.log(`✓ ${trip.slug}/${a.id}${entry.photo ? ' [foto]' : ''}${entry.coords ? ' [coord]' : ''}`)
      }
    } catch (e) {
      failed++
      console.warn(`✗ ${trip.slug}/${a.id}: ${e.message}`)
    }
    await sleep(250)
  }

  for (const city of trip.cities) {
    const c = (out.cities[city.id] = { gallery: [] })
    const hero = city.heroAttraction ? out.attractions[city.heroAttraction]?.photo : undefined
    if (hero) c.hero = hero
    if (city.wiki) {
      try {
        const r = await api('en.wikipedia.org', { action: 'query', titles: city.wiki, redirects: '1', prop: 'pageimages', piprop: 'name' })
        const file = r.query?.pages?.[0]?.pageimage
        const info = file ? await commonsInfo(file) : null
        if (info) {
          const photo = await photoFrom(info, `images/${trip.slug}/${city.id}/cidade.jpg`, `Vista de ${city.name}`, city.name)
          c.gallery.push(photo)
          c.hero ??= photo
          console.log(`✓ cidade ${trip.slug}/${city.id}: ${file}`)
        }
      } catch (e) {
        console.warn(`✗ cidade ${city.id}: ${e.message}`)
      }
    }
    if (city.photoSearch) {
      try {
        const r = await api('commons.wikimedia.org', { action: 'query', list: 'search', srsearch: `${city.photoSearch.query} filetype:bitmap`, srnamespace: '6', srlimit: '6' })
        for (const hit of r.query?.search ?? []) {
          const info = await commonsInfo(hit.title)
          if (!info) continue
          const year = /(\d{4})/.exec(info.date ?? '')?.[1]
          c.gallery.push(await photoFrom(info, `images/${trip.slug}/${city.id}/extra.jpg`, `${city.photoSearch.alt}${year ? `, foto de ${year}` : ''}`, `${city.photoSearch.title}${year ? ` (${year})` : ''}`))
          console.log(`✓ busca ${trip.slug}/${city.id}: ${hit.title}`)
          break
        }
      } catch (e) {
        console.warn(`✗ busca ${city.id}: ${e.message}`)
      }
    }
    await sleep(250)
  }
  console.log(`${trip.slug}: ${ok} atrações enriquecidas, ${failed} falhas.`)
  return out
}

async function main() {
  const only = process.argv.slice(2)
  const trips = await loadTrips()
  const overridesPath = path.join(ROOT, 'scripts/photo-overrides.json')
  const overrides = existsSync(overridesPath) ? JSON.parse(await readFile(overridesPath, 'utf8')) : {}
  const result = existsSync(OUT) ? JSON.parse(await readFile(OUT, 'utf8')) : {}
  result.note = 'Gerado por scripts/enrich.mjs. Não edite manualmente; rode `npm run enrich`.'
  result.trips ??= {}
  for (const trip of trips) {
    const forced = only.includes(trip.slug)
    if (only.length && !forced) continue
    if (!forced && result.trips[trip.slug]?.generatedAt) {
      console.log(`${trip.slug}: já enriquecida, pulando.`)
      continue
    }
    result.trips[trip.slug] = await enrichTrip(trip, overrides)
  }
  await writeFile(OUT, JSON.stringify(result, null, 2) + '\n')
  console.log(`Arquivo: ${path.relative(ROOT, OUT)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
