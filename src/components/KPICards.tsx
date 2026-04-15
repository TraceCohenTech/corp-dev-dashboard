import { companies } from '../data/companies'
import { tierColors } from '../data/companies'

export function KPICards() {
  const totalDeals = companies.reduce((s, c) => s + c.acquisitions.filter(a => !a.failed).length, 0)

  const veryActive = companies.filter(c => c.tier === 'Very Active').length
  const active = companies.filter(c => c.tier === 'Active').length
  const withCVC = companies.filter(c => c.cvc !== null).length

  // Biggest acquirer
  const topAcquirer = [...companies].sort((a, b) => b.dealCount - a.dealCount)[0]

  const cards: {
    label: string
    value: string
    icon: string
    accent: 'blue' | 'emerald' | 'amber' | 'red'
    sub?: string
  }[] = [
    {
      label: 'Very Active + Active',
      value: `${veryActive + active}`,
      icon: '🔥',
      accent: 'red',
      sub: `${veryActive} very active, ${active} active`,
    },
    {
      label: 'Total Acquisitions',
      value: totalDeals.toString(),
      icon: '📊',
      accent: 'blue',
      sub: '2020 - 2026 tracked',
    },
    {
      label: 'Corporate Venture Arms',
      value: `${withCVC} / ${companies.length}`,
      icon: '💰',
      accent: 'emerald',
      sub: `${Math.round(withCVC / companies.length * 100)}% have a CVC`,
    },
    {
      label: 'Top Acquirer',
      value: topAcquirer.ticker,
      icon: '🏆',
      accent: 'amber',
      sub: `${topAcquirer.dealCount} deals since 2020`,
    },
  ]

  const palette = {
    blue: {
      text: 'text-[var(--accent)]',
      iconBg: 'bg-blue-50',
      hover: 'hover:border-blue-300 hover:shadow-blue-500/10',
    },
    emerald: {
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      hover: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
    },
    amber: {
      text: 'text-amber-600',
      iconBg: 'bg-amber-50',
      hover: 'hover:border-amber-300 hover:shadow-amber-500/10',
    },
    red: {
      text: 'text-red-600',
      iconBg: 'bg-red-50',
      hover: 'hover:border-red-300 hover:shadow-red-500/10',
    },
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map(c => {
        const p = palette[c.accent]
        return (
          <div
            key={c.label}
            className={`bg-surface border border-border rounded-2xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg ${p.hover} group shadow-sm`}
          >
            <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.1em] sm:tracking-[0.12em] leading-tight">
                {c.label}
              </div>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${p.iconBg} flex items-center justify-center shrink-0 text-sm`}>
                {c.icon}
              </div>
            </div>
            <div className={`text-[22px] sm:text-[32px] font-bold font-mono ${p.text} leading-none break-words`}>
              {c.value}
            </div>
            {c.sub && (
              <div className="text-[10px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2">{c.sub}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
