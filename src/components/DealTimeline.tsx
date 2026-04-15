import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { companies } from '../data/companies'

export function DealTimeline() {
  const yearMap: Record<number, { count: number; disclosed: number }> = {}
  for (const c of companies) {
    for (const a of c.acquisitions) {
      if (a.failed) continue
      if (!yearMap[a.year]) yearMap[a.year] = { count: 0, disclosed: 0 }
      yearMap[a.year].count++
      if (a.dealSize !== 'Undisclosed') {
        const num = a.dealSize.replace(/[~$,+BM]/g, '').trim()
        const val = parseFloat(num) || 0
        yearMap[a.year].disclosed += a.dealSize.includes('B') ? val * 1000 : val
      }
    }
  }

  const data = Object.entries(yearMap)
    .sort(([a], [b]) => +a - +b)
    .map(([year, d]) => ({
      year,
      deals: d.count,
      value: Math.round(d.disclosed),
      valueStr: d.disclosed >= 1000 ? `$${(d.disclosed / 1000).toFixed(1)}B` : `$${Math.round(d.disclosed)}M`,
    }))

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Deal Activity by Year</h2>
      <p className="text-sm text-slate-500 mb-4">Total acquisitions and disclosed deal value across all 36 companies</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Deal Count</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-sm">
                      <p className="font-semibold text-slate-900">{d.year}</p>
                      <p className="text-slate-600">{d.deals} acquisitions</p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="deals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Disclosed Value ($M)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => v >= 1000 ? `$${v / 1000}B` : `$${v}M`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-sm">
                      <p className="font-semibold text-slate-900">{d.year}</p>
                      <p className="text-slate-600">{d.valueStr} disclosed</p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
