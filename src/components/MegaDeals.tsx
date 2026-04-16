import { companies } from '../data/companies'

// Extra context for the biggest deals — post-deal outcomes, premiums, strategic rationale
const DEAL_CONTEXT: Record<string, {
  premium?: string
  postDeal?: string
  category: string
  acquirerMarketCap?: string
  dealAsPercent?: string
}> = {
  'Afterpay': {
    premium: '~30% premium to market',
    postDeal: 'Integrated into Cash App. BNPL segment now drives 20%+ of Block revenue.',
    category: 'Fintech Consolidation',
    acquirerMarketCap: '~$100B at time of deal',
    dealAsPercent: '29% of market cap',
  },
  'Splunk': {
    premium: '~31% premium to undisturbed price',
    postDeal: 'Largest pure-play SaaS acquisition ever. Cisco now a top-5 security vendor by revenue.',
    category: 'Platform Expansion',
    acquirerMarketCap: '~$220B at time of deal',
    dealAsPercent: '13% of market cap',
  },
  'Slack': {
    premium: '~54% premium to pre-rumor price',
    postDeal: 'Became the UI layer for Salesforce. Slack AI launched 2024. 200K+ paid customers.',
    category: 'Workplace Platform',
    acquirerMarketCap: '~$225B at time of deal',
    dealAsPercent: '12% of market cap',
  },
  'Figma': {
    premium: '~100% premium to last private valuation',
    postDeal: 'Deal blocked by regulators. Adobe paid $1B breakup fee. Figma IPO expected.',
    category: 'Design Monopoly Play',
  },
  'Nuance': {
    premium: '~23% premium to market',
    postDeal: 'Powers Microsoft\'s DAX Copilot in healthcare. Key AI/voice asset for Copilot strategy.',
    category: 'AI / Healthcare',
    acquirerMarketCap: 'N/A (MSFT)',
  },
  'Cerner': {
    premium: '~16% premium to undisturbed price',
    postDeal: 'Rebranded to Oracle Health. $2B+ annual revenue. Oracle\'s biggest healthcare push.',
    category: 'Healthcare IT',
    acquirerMarketCap: 'N/A (ORCL)',
  },
  'Citrix': {
    premium: '~24% premium to market',
    postDeal: 'Taken private by Vista/Elliott. Combined with TIBCO. Massive layoffs followed.',
    category: 'Take-Private / VDI',
  },
  'Auth0': {
    premium: '~650% return for Auth0 investors vs. Series F',
    postDeal: 'Runs as separate product line. Okta now dominates both workforce + developer identity.',
    category: 'Identity Platform',
    acquirerMarketCap: '~$35B at time of deal',
    dealAsPercent: '19% of market cap',
  },
  'Tidal': {
    category: 'Media / Streaming',
  },
  'Segment': {
    premium: '~50% premium to prior valuation',
    postDeal: 'Core of Twilio CDP. Segment processes 1T+ API calls/month.',
    category: 'Data Infrastructure',
    acquirerMarketCap: '~$50B at time of deal',
    dealAsPercent: '6.4% of market cap',
  },
  'Moveworks': {
    premium: 'Down from $5.1B peak private valuation',
    postDeal: 'Core of ServiceNow\'s agentic AI strategy. Largest AI-native acquisition of 2025.',
    category: 'Agentic AI',
    acquirerMarketCap: '~$200B at time of deal',
    dealAsPercent: '1.4% of market cap',
  },
  'Deliverr': {
    category: 'Logistics / Fulfillment',
    postDeal: 'Built out Shopify Fulfillment Network. Later scaled back to focus on 3PL partnerships.',
  },
  'Divvy': {
    category: 'Spend Management',
    postDeal: 'Transformed BILL from AP-only to full spend management platform.',
  },
}

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

  // Failed mega-deals
  const failedDeals = companies.flatMap(c =>
    c.acquisitions
      .filter(a => a.failed && a.dealSize !== 'Undisclosed')
      .map(a => {
        const raw = a.dealSize.replace(/[~$,+]/g, '').trim()
        const num = parseFloat(raw) || 0
        const valueM = a.dealSize.includes('B') ? num * 1000 : num
        return {
          acquirer: c.name,
          ticker: c.ticker,
          target: a.target,
          year: a.year,
          dealSize: a.dealSize,
          valueM,
          description: a.description,
        }
      })
  ).sort((a, b) => b.valueM - a.valueM)

  // Summary stats
  const totalMegaValue = allDeals.reduce((s, d) => s + d.valueM, 0)
  const avgDealSize = totalMegaValue / allDeals.length
  const uniqueAcquirers = new Set(allDeals.map(d => d.ticker)).size
  const billisonPlusDeals = allDeals.filter(d => d.valueM >= 1000).length

  const formatVal = (m: number) => m >= 1000 ? `$${(m / 1000).toFixed(1)}B` : `$${Math.round(m)}M`

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

      {/* Summary stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden border border-border bg-[var(--border)] mb-5 shadow-sm">
        <div className="bg-surface px-4 py-3 sm:px-5 sm:py-4">
          <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Combined Value</div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-[var(--accent)] mt-0.5">{formatVal(totalMegaValue)}</div>
          <div className="text-[10px] text-slate-500">Top 10 deals only</div>
        </div>
        <div className="bg-surface px-4 py-3 sm:px-5 sm:py-4">
          <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Avg Deal Size</div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-slate-900 mt-0.5">{formatVal(avgDealSize)}</div>
          <div className="text-[10px] text-slate-500">Across top 10</div>
        </div>
        <div className="bg-surface px-4 py-3 sm:px-5 sm:py-4">
          <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">$1B+ Deals</div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-600 mt-0.5">{billisonPlusDeals}</div>
          <div className="text-[10px] text-slate-500">Billion-dollar acquisitions</div>
        </div>
        <div className="bg-surface px-4 py-3 sm:px-5 sm:py-4">
          <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Unique Acquirers</div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-slate-900 mt-0.5">{uniqueAcquirers}</div>
          <div className="text-[10px] text-slate-500">Different companies</div>
        </div>
      </div>

      {/* Deal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {allDeals.map((deal, i) => {
          const ctx = DEAL_CONTEXT[deal.target]
          return (
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

              {/* Tags row: year + category + industry */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                  {deal.year}
                </span>
                {ctx?.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700">
                    {ctx.category}
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-500">
                  {deal.industry}
                </span>
              </div>

              {/* Premium / deal-as-% info */}
              {ctx?.premium && (
                <div className="mt-2 text-[10px] sm:text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 font-medium">
                  {ctx.premium}
                  {ctx.dealAsPercent && (
                    <span className="text-amber-600 block sm:inline sm:ml-1">· {ctx.dealAsPercent} of acquirer mkt cap</span>
                  )}
                </div>
              )}

              {/* Description */}
              <p className={`text-slate-500 mt-2 leading-relaxed ${i === 0 ? 'text-sm' : 'text-[11px]'}`}>
                {deal.description}
              </p>

              {/* Post-deal outcome */}
              {ctx?.postDeal && (
                <p className={`text-slate-700 mt-1.5 leading-relaxed font-medium ${i === 0 ? 'text-[13px]' : 'text-[11px]'}`}>
                  <span className="text-emerald-600">Outcome:</span> {ctx.postDeal}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Failed mega-deals section */}
      {failedDeals.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em] mb-3">
            Deals That Fell Apart
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {failedDeals.map(deal => {
              const ctx = DEAL_CONTEXT[deal.target]
              return (
                <div
                  key={`failed-${deal.ticker}-${deal.target}`}
                  className="bg-surface border border-red-100 rounded-2xl p-4 sm:p-5 relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-50 px-2 py-0.5 rounded-md">
                    Failed
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-red-500/80 leading-none mb-1.5 line-through decoration-red-300">
                    {deal.dealSize}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{deal.target}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-slate-500">by</span>
                    <span className="text-xs font-semibold text-slate-700">{deal.acquirer}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{deal.ticker}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500 ml-1">
                      {deal.year}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{deal.description}</p>
                  {ctx?.postDeal && (
                    <p className="text-[11px] text-red-600 mt-1.5 leading-relaxed font-medium">
                      {ctx.postDeal}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
