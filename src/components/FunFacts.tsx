import { companies } from '../data/companies'

export function FunFacts() {
  const allAcqs = companies.flatMap(c =>
    c.acquisitions.filter(a => !a.failed).map(a => ({
      ...a,
      acquirer: c.name,
      ticker: c.ticker,
      industry: c.industry,
    }))
  )

  // Biggest single deal
  const biggestDeal = allAcqs
    .filter(a => a.dealSize !== 'Undisclosed')
    .sort((a, b) => {
      const parse = (s: string) => {
        const n = parseFloat(s.replace(/[~$,+BM]/g, '')) || 0
        return s.includes('B') ? n * 1000 : n
      }
      return parse(b.dealSize) - parse(a.dealSize)
    })[0]

  // Most acquisitive year
  const yearCounts: Record<number, number> = {}
  allAcqs.forEach(a => { yearCounts[a.year] = (yearCounts[a.year] || 0) + 1 })
  const hottestYear = Object.entries(yearCounts).sort(([, a], [, b]) => b - a)[0]

  // Most active industry
  const industryCounts: Record<string, number> = {}
  allAcqs.forEach(a => { industryCounts[a.industry] = (industryCounts[a.industry] || 0) + 1 })
  const topIndustry = Object.entries(industryCounts).sort(([, a], [, b]) => b - a)[0]

  // Companies with zero acquisitions
  const zeroDeal = companies.filter(c => c.acquisitions.filter(a => !a.failed).length === 0)

  // Failed deals
  const failedDeals = companies.flatMap(c =>
    c.acquisitions.filter(a => a.failed).map(a => ({ ...a, acquirer: c.name }))
  )

  // CVC stats
  const cvcCompanies = companies.filter(c => c.cvc !== null)

  // Average deals
  const avgDeals = (allAcqs.length / companies.filter(c => c.tier !== 'N/A').length).toFixed(1)

  const facts: { emoji: string; text: string }[] = [
    {
      emoji: '💎',
      text: `Largest single deal: ${biggestDeal.acquirer} acquired ${biggestDeal.target} for ${biggestDeal.dealSize} (${biggestDeal.year})`,
    },
    {
      emoji: '🔥',
      text: `Hottest year: ${hottestYear[0]} saw ${hottestYear[1]} acquisitions across all companies`,
    },
    {
      emoji: '🏭',
      text: `Most active industry: ${topIndustry[0]} with ${topIndustry[1]} total acquisitions`,
    },
    {
      emoji: '📊',
      text: `Average acquirer makes ${avgDeals} deals over the 2020-2026 period`,
    },
    {
      emoji: '🚫',
      text: `${zeroDeal.length} companies have made zero acquisitions — pure organic growth (${zeroDeal.map(c => c.ticker).join(', ')})`,
    },
    {
      emoji: '💔',
      text: `${failedDeals.length} major deal${failedDeals.length !== 1 ? 's' : ''} failed or collapsed, including ${failedDeals.map(d => `${d.acquirer}'s bid for ${d.target}`).join('; ')}`,
    },
    {
      emoji: '💰',
      text: `${cvcCompanies.length} of ${companies.length} companies (${Math.round(cvcCompanies.length / companies.length * 100)}%) operate corporate venture arms`,
    },
    {
      emoji: '🎯',
      text: `Cybersecurity is the #1 acquisition target category — fueled by AI security, zero trust, and identity consolidation`,
    },
  ]

  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
            Key Insights
          </h2>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Fun Facts & Highlights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {facts.map((fact, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300 group"
          >
            <span className="text-2xl">{fact.emoji}</span>
            <p className="text-sm text-slate-700 mt-2.5 leading-relaxed">
              {fact.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
