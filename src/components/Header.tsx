import { companies } from '../data/companies'

export function Header() {
  const totalDeals = companies.reduce((s, c) => s + c.acquisitions.filter(a => !a.failed).length, 0)
  const withCVC = companies.filter(c => c.cvc !== null).length

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

  const avgDeals = (totalDeals / companies.filter(c => c.tier !== 'N/A').length).toFixed(1)

  return (
    <header className="relative overflow-hidden bg-surface border-b border-border">
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div className="absolute -top-32 left-1/3 w-[620px] h-[620px] bg-blue-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[520px] h-[520px] bg-emerald-500/[0.08] rounded-full blur-[130px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 pt-10 sm:pt-20 pb-10 sm:pb-16">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 mb-5 sm:mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-blue-700 tracking-[0.12em] sm:tracking-[0.14em] uppercase">
            Live M&A Intelligence Tracker
          </span>
        </div>

        <h1 className="text-[36px] sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] sm:leading-[1.02] max-w-4xl text-slate-900">
          Corporate Development{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              & M&A Intelligence
            </span>
            <svg className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full" viewBox="0 0 500 10" fill="none" preserveAspectRatio="none">
              <path d="M0 5 Q125 10 250 5 T500 5" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
            </svg>
          </span>
        </h1>

        <p className="text-lg sm:text-2xl text-slate-700 mt-5 sm:mt-7 max-w-3xl leading-[1.45] font-medium">
          <span className="text-slate-900 font-bold">{totalDeals}+ acquisitions</span>{" "}
          tracked across {companies.length} public SaaS & tech companies — representing{" "}
          <span className="text-accent font-bold">{totalValueStr}</span>{" "}
          in disclosed deal value since 2020.
        </p>

        <p className="text-sm sm:text-base text-slate-500 mt-4 sm:mt-5 max-w-2xl leading-relaxed">
          Corp dev leaders, acquisition histories, deal sizes, CVC arms, and M&A activity tiers
          — everything you need for competitive intelligence.
        </p>

        {/* Hero stat strip */}
        <div className="mt-7 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-[var(--border)] shadow-sm">
          <HeroStat label="Companies tracked" value={`${companies.length}`} sub={`${withCVC} with CVC arms`} />
          <HeroStat label="Total acquisitions" value={`${totalDeals}+`} sub="2020 - 2026" accent="blue" />
          <HeroStat label="Disclosed value" value={totalValueStr} sub="Across all deals" accent="emerald" />
          <HeroStat label="Avg deals / company" value={avgDeals} sub="Excluding pre-IPO" />
        </div>
      </div>
    </header>
  )
}

function HeroStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: 'blue' | 'emerald'
}) {
  const color =
    accent === 'blue' ? 'text-[var(--accent)]' : accent === 'emerald' ? 'text-emerald-600' : 'text-slate-900'
  return (
    <div className="bg-surface px-4 py-4 sm:px-6 sm:py-6">
      <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className={`text-xl sm:text-3xl font-bold font-mono mt-1 sm:mt-1.5 ${color} break-words`}>{value}</div>
      <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate">{sub}</div>
    </div>
  )
}
