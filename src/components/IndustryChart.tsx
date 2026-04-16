import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { companies } from '../data/companies'
import type { Industry } from '../types'

const INDUSTRY_COLORS: Record<Industry, string> = {
  'Cybersecurity': '#ef4444',
  'Cloud & Infrastructure': '#0284c7',
  'Enterprise Software': '#7c3aed',
  'Developer Tools': '#0d9488',
  'Productivity & Design': '#f59e0b',
  'Marketing & CX': '#ec4899',
  'Fintech & Commerce': '#10b981',
  'Data & Analytics': '#6366f1',
  'Vertical SaaS': '#f97316',
  'HR Tech': '#64748b',
}

const GRID_STROKE = '#e2e8f0'
const AXIS_FILL = '#64748b'

export function IndustryChart() {
  // Count companies and deals by industry
  const industryData = Object.entries(
    companies.reduce<Record<string, { count: number; deals: number; spend: number }>>((acc, c) => {
      if (!acc[c.industry]) acc[c.industry] = { count: 0, deals: 0, spend: 0 }
      acc[c.industry].count++
      acc[c.industry].deals += c.acquisitions.filter(a => !a.failed).length
      acc[c.industry].spend += c.totalSpendNum
      return acc
    }, {})
  )
    .map(([industry, data]) => ({
      name: industry,
      companies: data.count,
      deals: data.deals,
      spend: data.spend,
      color: INDUSTRY_COLORS[industry as Industry] || '#94a3b8',
    }))
    .sort((a, b) => b.deals - a.deals)

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          Industry Breakdown
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {Object.keys(INDUSTRY_COLORS).length} industries across {companies.length} companies
        </p>
      </div>
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut chart */}
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-2">
              Companies by Industry
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="companies"
                  nameKey="name"
                  stroke="none"
                >
                  {industryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.[0]) return null
                    const d = payload[0].payload
                    return (
                      <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
                        <div className="font-bold text-slate-900">{d.name}</div>
                        <div className="text-slate-600 mt-0.5">{d.companies} companies</div>
                        <div className="text-slate-600">{d.deals} acquisitions</div>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
              {industryData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                  {d.name} ({d.companies})
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart — deals by industry */}
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-2">
              Acquisitions by Industry
            </p>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={industryData} layout="vertical" margin={{ top: 5, right: 30, left: 8, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis type="number" tick={{ fill: AXIS_FILL, fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: '#0f172a', fontSize: 10, fontWeight: 500 }}
                  width={120}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }}
                  content={({ payload }) => {
                    if (!payload?.[0]) return null
                    const d = payload[0].payload
                    const spendStr = d.spend >= 1000 ? `$${(d.spend / 1000).toFixed(1)}B` : `$${d.spend}M`
                    return (
                      <div className="bg-surface border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
                        <div className="font-bold text-slate-900">{d.name}</div>
                        <div className="text-slate-600 mt-0.5">{d.deals} acquisitions</div>
                        <div className="text-slate-600">{spendStr} total spend</div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="deals" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {industryData.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
