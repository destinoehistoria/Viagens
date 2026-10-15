import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { FinanceEntry } from '../utils/finance'
import { formatMoney } from '../utils/finance'

export default function FinanceChart({ entries }: { entries: FinanceEntry[] }) {
  const data = entries.map((e) => ({
    nome: e.descricao.replace(/^Hotel\s+/, '').split(' — ')[0],
    Bruto: e.bruto,
    'Pontos/créditos': (e.desconto ?? 0) + (e.credito ?? 0),
    Dinheiro: e.dinheiroPago + e.dinheiroAPagar,
  }))
  return (
    <div className="surface h-80 rounded-2xl p-3" role="img" aria-label="Gráfico de barras comparando valor bruto, pontos/créditos e dinheiro por hospedagem">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="nome" tick={{ fill: 'var(--text-2)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--text-2)', fontSize: 11 }} tickFormatter={(v: number) => `R$ ${Math.round(v / 1000)}k`} />
          <Tooltip formatter={(v) => formatMoney(Number(v), 'BRL')} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }} />
          <Legend />
          <Bar dataKey="Bruto" fill="#C6A56B" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Pontos/créditos" fill="#176B65" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Dinheiro" fill="#5B7FA6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
