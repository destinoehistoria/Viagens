import type { Category } from '../types'

export const categoryMeta: Record<Category, { label: string; emoji: string; color: string }> = {
  museu: { label: 'Museu', emoji: '🏛️', color: '#4B5D7A' },
  monumento: { label: 'Monumento', emoji: '🏰', color: '#8A6A2F' },
  igreja: { label: 'Igreja', emoji: '⛪', color: '#6B4E7A' },
  mercado: { label: 'Mercado', emoji: '🧺', color: '#176B65' },
  bairro: { label: 'Bairro / passeio', emoji: '🚶', color: '#5E6B3F' },
  parque: { label: 'Parque', emoji: '🌳', color: '#3F7A4E' },
  natureza: { label: 'Natureza', emoji: '🌿', color: '#2F6B3F' },
  praia: { label: 'Praia', emoji: '🏖️', color: '#2F7A8A' },
  cultura: { label: 'Cultura / eventos', emoji: '🎭', color: '#7A3F6B' },
  compras: { label: 'Compras', emoji: '🛍️', color: '#9C4F6B' },
  biblioteca: { label: 'Biblioteca / livraria', emoji: '📚', color: '#7A4E2F' },
  mirante: { label: 'Mirante', emoji: '🔭', color: '#3F6E7A' },
  gastronomia: { label: 'Gastronomia', emoji: '🍷', color: '#A35A4A' },
  hotel: { label: 'Hotel', emoji: '🛏️', color: '#152638' },
  estacao: { label: 'Estação', emoji: '🚆', color: '#33475E' },
  aeroporto: { label: 'Aeroporto', emoji: '✈️', color: '#33475E' },
}
