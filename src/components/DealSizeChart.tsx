import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { companies } from '../data/companies'

const GRID_STROKE = '#e2e8f0'
const AXIS_FILL = '#64748b'

const BUCKET_COLORS = [
  '#10b981', // < $100M
  '#0284c7', // $100M-$500M
  '#6366f1', // $500M-$1B
  '#f59e0b', // $1B-$5B
  '#ef4444', // $5B-$10B
  '#7c3aed', // $10B+
]

export function DealSizeChart() {
  // Parse all disclosed deal values
  const deals = companies.flatMap(c =>
    c.acquisitions
      .filter(a => !a.failed && a.dealSize !== 'Undisclosed')
      .map(a => {
        const raw = a.dealSize.replace(/[~$,+]/g, '').trim()
        const num = parseFloat(raw) || 0
        return a.dealSize.includes('B') ? num * 1000 : num
      })
  )

  const buckets = [
    { label: '<$100M', min: 0, max: 100, count: 0 },
    { label: '$100M-$500M', min: 100, max: 500, count: 0 },
    { label: '$500M-$1B', min: 500, max: 1000, count: 0 },
    { label: '$1B-$5B', min: 1000, max: 5000, count: 0 },
    { label: '$5B-$10B', min: 5000, max: 10000, count: 0 },
    { label: '$10B+', min: 10000, max: Infinity, count: 0 },
  ]

  for (const val of deals) {
    const bucket = buckets.find(b => val >= b.min && val < b.max)
    if (bucket) bucket.count++
  }

  const totalDisclosed = deals.length
  const totalUndisclosed = companies.reduce(
    (sum, c) => sum + c.acquisitions.filter(a => !a.failed && a.dealSize === 'Undisclosed').length,
    0
  )

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          Deal Size Distribution
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {totalDisclosed} disclosed deals out of {totalDisclosed + totalUndisclosed} total
        </p>
      </div>
      <div className="p-3 sm:p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={buckets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: AXIS_FILL }} />
            <YAxis tick={{ fontSize: 12, fill: AXIS_FILL }} />
            <Tooltip
              cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }}
              content={({ payload }) => {
                if (!payload?.[0]) return null
                const d = payload[0].payload
                const pct = totalDisclosed > 0 ? ((d.count / totalDisclosed) * 100).toFixed(0) : '0'
                return (
                  <div className="bg-surface border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
                    <div className="font-bold text-slate-900">{d.label}</div>
                    <div className="text-slate-600 mt-0.5">{d.count} deals ({pct}%)</div>
                  </div>
                )
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {buckets.map((_b, i) => (
                <Cell key={i} fill={BUCKET_COLORS[i]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend row */}
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {buckets.map((b, i) => (
            <div key={b.label} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: BUCKET_COLORS[i] }} />
              {b.label}: {b.count}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
