import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { companies, tierColors } from '../data/companies'

export function ActivityTierChart() {
  const data = companies
    .filter(c => c.tier !== 'N/A')
    .sort((a, b) => b.dealCount - a.dealCount)
    .map(c => ({
      name: c.ticker,
      deals: c.dealCount,
      tier: c.tier,
      company: c.name,
    }))

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-1">M&A Activity by Company</h2>
      <p className="text-sm text-slate-500 mb-4">Number of acquisitions (2020&ndash;2026), color-coded by activity tier</p>
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(tierColors).filter(([k]) => k !== 'N/A').map(([tier, color]) => (
          <div key={tier} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
            {tier}
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} layout="horizontal" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-sm">
                  <p className="font-semibold text-slate-900">{d.company} ({d.name})</p>
                  <p className="text-slate-600">{d.deals} acquisitions &middot; {d.tier}</p>
                </div>
              )
            }}
          />
          <Bar dataKey="deals" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={tierColors[d.tier]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
