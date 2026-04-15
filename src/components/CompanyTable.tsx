import { useState, useMemo } from 'react'
import { companies, tierColors } from '../data/companies'
import type { Company, MATier } from '../types'

type SortKey = 'name' | 'dealCount' | 'totalSpendNum' | 'tier'

const tierOrder: Record<MATier, number> = {
  'Very Active': 0,
  'Active': 1,
  'Moderate': 2,
  'Low': 3,
  'Minimal': 4,
  'N/A': 5,
}

export function CompanyTable() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<MATier | 'All'>('All')
  const [cvcFilter, setCvcFilter] = useState<'All' | 'Yes' | 'No'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('dealCount')
  const [sortAsc, setSortAsc] = useState(false)

  const filtered = useMemo(() => {
    let list = [...companies]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q) ||
        c.corpDev.name.toLowerCase().includes(q)
      )
    }
    if (tierFilter !== 'All') list = list.filter(c => c.tier === tierFilter)
    if (cvcFilter === 'Yes') list = list.filter(c => c.cvc !== null)
    if (cvcFilter === 'No') list = list.filter(c => c.cvc === null)

    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'dealCount') cmp = a.dealCount - b.dealCount
      else if (sortKey === 'totalSpendNum') cmp = a.totalSpendNum - b.totalSpendNum
      else if (sortKey === 'tier') cmp = tierOrder[a.tier] - tierOrder[b.tier]
      return sortAsc ? cmp : -cmp
    })
    return list
  }, [search, tierFilter, cvcFilter, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
            Explore the data
          </h2>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Full Company Directory
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            All {companies.length} companies. Click any row for a full breakdown.
          </p>
        </div>
        <span className="text-xs text-slate-500 hidden sm:block font-medium">
          {filtered.length} of {companies.length} shown
        </span>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="px-3 sm:px-4 pt-4 pb-2 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Filter by ticker, name, or contact..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-base border border-border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 flex-1 min-w-[200px] sm:w-64 transition-all"
          />
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as MATier | 'All')}
            className="bg-base border border-border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          >
            <option value="All">All Tiers</option>
            <option value="Very Active">Very Active</option>
            <option value="Active">Active</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
            <option value="Minimal">Minimal</option>
          </select>
          <select
            value={cvcFilter}
            onChange={e => setCvcFilter(e.target.value as 'All' | 'Yes' | 'No')}
            className="bg-base border border-border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          >
            <option value="All">All CVC Status</option>
            <option value="Yes">Has CVC</option>
            <option value="No">No CVC</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th
                  className="px-3 sm:px-6 py-3 font-semibold text-slate-500 whitespace-nowrap cursor-pointer hover:text-slate-900 transition-colors select-none text-[11px] uppercase tracking-[0.08em] text-left"
                  onClick={() => handleSort('name')}
                >
                  <span className="inline-flex items-center gap-1">
                    Company {sortKey === 'name' ? (sortAsc ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th className="px-3 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-[0.08em] text-left">Ticker</th>
                <th className="px-3 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-[0.08em] text-left">Corp Dev Lead</th>
                <th
                  className="px-3 py-3 font-semibold text-slate-500 whitespace-nowrap cursor-pointer hover:text-slate-900 transition-colors select-none text-[11px] uppercase tracking-[0.08em] text-left"
                  onClick={() => handleSort('tier')}
                >
                  <span className="inline-flex items-center gap-1">
                    Tier {sortKey === 'tier' ? (sortAsc ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th
                  className="px-3 py-3 font-semibold text-slate-500 whitespace-nowrap cursor-pointer hover:text-slate-900 transition-colors select-none text-[11px] uppercase tracking-[0.08em] text-right"
                  onClick={() => handleSort('dealCount')}
                >
                  <span className="inline-flex items-center gap-1">
                    Deals {sortKey === 'dealCount' ? (sortAsc ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th
                  className="px-3 py-3 font-semibold text-slate-500 whitespace-nowrap cursor-pointer hover:text-slate-900 transition-colors select-none text-[11px] uppercase tracking-[0.08em] text-right"
                  onClick={() => handleSort('totalSpendNum')}
                >
                  <span className="inline-flex items-center gap-1">
                    Spend {sortKey === 'totalSpendNum' ? (sortAsc ? '↑' : '↓') : '↕'}
                  </span>
                </th>
                <th className="px-3 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-[0.08em] text-left">CVC</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <CompanyRow
                  key={c.ticker}
                  company={c}
                  index={i}
                  isExpanded={expanded === c.ticker}
                  onToggle={() => setExpanded(expanded === c.ticker ? null : c.ticker)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-3 text-xs text-slate-500 border-t border-border">
          Showing {filtered.length} of {companies.length} companies
        </div>
      </div>
    </section>
  )
}

function CompanyRow({ company: c, index, isExpanded, onToggle }: { company: Company; index: number; isExpanded: boolean; onToggle: () => void }) {
  const completedAcqs = c.acquisitions.filter(a => !a.failed)
  return (
    <>
      <tr
        className={`border-t border-border/80 cursor-pointer transition-all duration-150 hover:bg-[var(--accent)]/[0.05] hover:shadow-[inset_3px_0_0_0_#0284c7] ${
          index % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/60'
        }`}
        onClick={onToggle}
      >
        <td className="px-3 sm:px-6 py-3 font-medium text-slate-900 whitespace-nowrap">
          <span className={`mr-1.5 text-slate-400 text-xs transition-transform duration-200 inline-block ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
          {c.name}
        </td>
        <td className="px-3 py-3 font-mono font-bold text-[var(--accent)] text-xs">{c.ticker}</td>
        <td className="px-3 py-3">
          {c.corpDev.name ? (
            <div>
              <span className="text-slate-800">
                {c.corpDev.linkedIn ? (
                  <a
                    href={c.corpDev.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline font-medium"
                    onClick={e => e.stopPropagation()}
                  >
                    {c.corpDev.name}
                  </a>
                ) : c.corpDev.name}
              </span>
              <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{c.corpDev.title}</p>
            </div>
          ) : (
            <span className="text-slate-400 text-xs">Not identified</span>
          )}
        </td>
        <td className="px-3 py-3">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-white"
            style={{ background: tierColors[c.tier] }}
          >
            {c.tier}
          </span>
        </td>
        <td className="px-3 py-3 text-right font-mono font-semibold text-slate-900 tabular-nums">{c.dealCount}</td>
        <td className="px-3 py-3 text-right text-slate-600 font-mono whitespace-nowrap">{c.totalSpend}</td>
        <td className="px-3 py-3">
          {c.cvc ? (
            <span className="text-emerald-600 font-medium text-xs">{c.cvc.name}</span>
          ) : (
            <span className="text-slate-400 text-xs">--</span>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="bg-slate-50/80 px-4 sm:px-6 py-4 border-t border-border/60">
            <div className="max-w-4xl">
              {c.notes && (
                <p className="text-sm text-slate-600 mb-3 italic">{c.notes}</p>
              )}
              {c.cvc && (
                <div className="mb-3 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs">
                  <span className="font-semibold text-emerald-700">CVC:</span>
                  <span className="text-slate-700">{c.cvc.name}</span>
                  <span className="text-slate-500">&middot; {c.cvc.fundSize} &middot; {c.cvc.investments} investments</span>
                </div>
              )}
              {completedAcqs.length > 0 ? (
                <div className="bg-surface border border-border rounded-xl overflow-hidden mt-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[10px] uppercase tracking-[0.08em]">Year</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[10px] uppercase tracking-[0.08em]">Target</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[10px] uppercase tracking-[0.08em]">Deal Size</th>
                        <th className="text-left px-3 py-2.5 font-semibold text-slate-500 text-[10px] uppercase tracking-[0.08em]">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.acquisitions.map((a, i) => (
                        <tr key={i} className={`border-t border-border/60 ${a.failed ? 'opacity-50 line-through' : ''} ${i % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                          <td className="px-3 py-2 text-slate-500 font-mono tabular-nums">{a.year}</td>
                          <td className="px-3 py-2 font-medium text-slate-800">{a.target}</td>
                          <td className="px-3 py-2 text-slate-600 font-mono whitespace-nowrap">
                            {a.dealSize}
                            {a.failed && <span className="ml-1 text-red-500 no-underline font-sans">(FAILED)</span>}
                          </td>
                          <td className="px-3 py-2 text-slate-500">{a.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-400 mt-2">No acquisitions recorded (2020&ndash;2026)</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
