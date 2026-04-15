import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts'
import { companies, tierColors } from '../data/companies'

const GRID_STROKE = '#e2e8f0'
const AXIS_FILL = '#64748b'
const TEXT_DARK = '#0f172a'

export function ActivityTierChart() {
  const data = companies
    .filter(c => c.tier !== 'N/A')
    .sort((a, b) => b.dealCount - a.dealCount)
    .slice(0, 20)
    .map(c => ({
      name: c.ticker,
      deals: c.dealCount,
      tier: c.tier,
      company: c.name,
    }))

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          M&A Activity by Company
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Top 20 acquirers (2020-2026), color-coded by activity tier
        </p>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex flex-wrap gap-4 mb-3">
          {Object.entries(tierColors).filter(([k]) => k !== 'N/A').map(([tier, color]) => (
            <div key={tier} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
              {tier}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 8, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
            <XAxis type="number" tick={{ fill: AXIS_FILL, fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: TEXT_DARK, fontSize: 11, fontWeight: 600 }}
              width={52}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }}
              content={({ payload }) => {
                if (!payload?.[0]) return null
                const d = payload[0].payload
                return (
                  <div className="bg-surface border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
                    <div className="font-bold text-[var(--accent)] text-sm">{d.name}</div>
                    <div className="text-slate-700 font-medium">{d.company}</div>
                    <div className="text-slate-900 font-semibold mt-1">{d.deals} acquisitions</div>
                    <div className="text-slate-500">{d.tier}</div>
                  </div>
                )
              }}
            />
            <Bar dataKey="deals" radius={[0, 6, 6, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={tierColors[d.tier]} fillOpacity={0.85} />
              ))}
              <LabelList
                dataKey="deals"
                position="right"
                style={{ fill: TEXT_DARK, fontSize: 11, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
