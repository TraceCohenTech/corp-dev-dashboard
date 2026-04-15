import { companies } from '../data/companies'

export function KPICards() {
  const totalDeals = companies.reduce((s, c) => s + c.acquisitions.filter(a => !a.failed).length, 0)

  // Sum disclosed spend
  const disclosedValues = companies.flatMap(c =>
    c.acquisitions.filter(a => !a.failed && a.dealSize !== 'Undisclosed').map(a => {
      const num = a.dealSize.replace(/[~$,+BM]/g, '').trim()
      const val = parseFloat(num) || 0
      if (a.dealSize.includes('B')) return val * 1000
      return val
    })
  )
  const totalValueM = disclosedValues.reduce((s, v) => s + v, 0)
  const totalValueStr = totalValueM >= 1000 ? `$${(totalValueM / 1000).toFixed(1)}B+` : `$${totalValueM.toFixed(0)}M+`

  const withCVC = companies.filter(c => c.cvc !== null).length
  const avgDeals = (totalDeals / companies.filter(c => c.tier !== 'N/A').length).toFixed(1)

  const cards = [
    { label: 'Total Acquisitions', value: totalDeals.toString(), sub: '2020 - 2026' },
    { label: 'Disclosed Deal Value', value: totalValueStr, sub: 'Across all companies' },
    { label: 'Corporate Venture Arms', value: `${withCVC} / ${companies.length}`, sub: `${Math.round(withCVC / companies.length * 100)}% have a CVC` },
    { label: 'Avg Deals per Company', value: avgDeals, sub: 'Excluding Figma' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{c.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{c.value}</p>
          <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  )
}
