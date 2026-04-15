import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { companies } from '../data/companies'

const GRID_STROKE = '#e2e8f0'
const AXIS_FILL = '#64748b'

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
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          Deal Activity by Year
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Total acquisitions and disclosed deal value across all {companies.length} companies
        </p>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-2">Deal Count</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: AXIS_FILL }} />
                <YAxis tick={{ fontSize: 12, fill: AXIS_FILL }} />
                <Tooltip
                  cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }}
                  content={({ payload }) => {
                    if (!payload?.[0]) return null
                    const d = payload[0].payload
                    return (
                      <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
                        <div className="font-semibold text-slate-900">{d.year}</div>
                        <div className="text-slate-600 font-mono mt-0.5">{d.deals} acquisitions</div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="deals" fill="#0284c7" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-2">Disclosed Value</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: AXIS_FILL }} />
                <YAxis tick={{ fontSize: 12, fill: AXIS_FILL }} tickFormatter={v => v >= 1000 ? `$${v / 1000}B` : `$${v}M`} />
                <Tooltip
                  cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
                  content={({ payload }) => {
                    if (!payload?.[0]) return null
                    const d = payload[0].payload
                    return (
                      <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
                        <div className="font-semibold text-slate-900">{d.year}</div>
                        <div className="text-slate-600 font-mono mt-0.5">{d.valueStr} disclosed</div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
