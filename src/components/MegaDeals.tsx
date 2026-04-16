import { companies } from '../data/companies'

export function MegaDeals() {
  // Parse all acquisitions with their parent company
  const allDeals = companies.flatMap(c =>
    c.acquisitions
      .filter(a => !a.failed && a.dealSize !== 'Undisclosed')
      .map(a => {
        const raw = a.dealSize.replace(/[~$,+]/g, '').trim()
        const num = parseFloat(raw) || 0
        const valueM = a.dealSize.includes('B') ? num * 1000 : num
        return {
          acquirer: c.name,
          ticker: c.ticker,
          industry: c.industry,
          target: a.target,
          year: a.year,
          dealSize: a.dealSize,
          valueM,
          description: a.description,
        }
      })
  )
    .sort((a, b) => b.valueM - a.valueM)
    .slice(0, 10)

  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
            Biggest Bets
          </h2>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Top 10 Mega Deals
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            The largest disclosed acquisitions across all {companies.length} companies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {allDeals.map((deal, i) => (
          <div
            key={`${deal.ticker}-${deal.target}`}
            className={`bg-surface border border-border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:border-blue-200 group relative overflow-hidden ${
              i === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
            }`}
          >
            {/* Rank badge */}
            <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold mb-3 ${
              i === 0 ? 'bg-amber-100 text-amber-700' :
              i === 1 ? 'bg-slate-100 text-slate-600' :
              i === 2 ? 'bg-orange-100 text-orange-700' :
              'bg-slate-50 text-slate-500'
            }`}>
              #{i + 1}
            </div>

            {/* Deal size */}
            <div className={`font-bold font-mono leading-none mb-2 ${
              i === 0 ? 'text-3xl sm:text-4xl text-[var(--accent)]' : 'text-xl sm:text-2xl text-slate-900'
            }`}>
              {deal.dealSize}
            </div>

            {/* Target */}
            <div className={`font-semibold text-slate-900 ${i === 0 ? 'text-lg' : 'text-sm'}`}>
              {deal.target}
            </div>

            {/* Acquirer */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-xs text-slate-500">by</span>
              <span className="text-xs font-semibold text-slate-700">{deal.acquirer}</span>
              <span className="text-[10px] font-mono text-[var(--accent)] font-bold">{deal.ticker}</span>
            </div>

            {/* Year + Description */}
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                {deal.year}
              </span>
            </div>
            <p className={`text-slate-500 mt-2 leading-relaxed ${i === 0 ? 'text-sm' : 'text-[11px]'}`}>
              {deal.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
