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

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="ml-1 text-slate-400">
      {sortKey === col ? (sortAsc ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 pb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Company Directory</h2>
        <p className="text-sm text-slate-500 mb-4">Click any row to expand acquisition history</p>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search company, ticker, or contact..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as MATier | 'All')}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All CVC Status</option>
            <option value="Yes">Has CVC</option>
            <option value="No">No CVC</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-slate-100 bg-slate-50 text-left">
              <th className="px-6 py-3 font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('name')}>
                Company <SortIcon col="name" />
              </th>
              <th className="px-4 py-3 font-semibold text-slate-600">Ticker</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Corp Dev Lead</th>
              <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('tier')}>
                Tier <SortIcon col="tier" />
              </th>
              <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('dealCount')}>
                Deals <SortIcon col="dealCount" />
              </th>
              <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('totalSpendNum')}>
                Spend <SortIcon col="totalSpendNum" />
              </th>
              <th className="px-4 py-3 font-semibold text-slate-600">CVC</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <CompanyRow
                key={c.ticker}
                company={c}
                isExpanded={expanded === c.ticker}
                onToggle={() => setExpanded(expanded === c.ticker ? null : c.ticker)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 text-xs text-slate-400 border-t border-slate-100">
        Showing {filtered.length} of {companies.length} companies
      </div>
    </div>
  )
}

function CompanyRow({ company: c, isExpanded, onToggle }: { company: Company; isExpanded: boolean; onToggle: () => void }) {
  const completedAcqs = c.acquisitions.filter(a => !a.failed)
  return (
    <>
      <tr
        className="border-t border-slate-50 hover:bg-slate-50/60 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-6 py-3 font-medium text-slate-900 whitespace-nowrap">
          <span className="mr-1.5 text-slate-400 text-xs">{isExpanded ? '▼' : '▶'}</span>
          {c.name}
        </td>
        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{c.ticker}</td>
        <td className="px-4 py-3">
          {c.corpDev.name ? (
            <div>
              <span className="text-slate-800">
                {c.corpDev.linkedIn ? (
                  <a
                    href={c.corpDev.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    {c.corpDev.name}
                  </a>
                ) : c.corpDev.name}
              </span>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{c.corpDev.title}</p>
            </div>
          ) : (
            <span className="text-slate-400 text-xs">Not identified</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ background: tierColors[c.tier] }}
          >
            {c.tier}
          </span>
        </td>
        <td className="px-4 py-3 font-semibold text-slate-900 tabular-nums">{c.dealCount}</td>
        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.totalSpend}</td>
        <td className="px-4 py-3">
          {c.cvc ? (
            <span className="text-emerald-600 font-medium text-xs">{c.cvc.name}</span>
          ) : (
            <span className="text-slate-300 text-xs">--</span>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="bg-slate-50/80 px-6 py-4">
            <div className="max-w-4xl">
              {c.notes && (
                <p className="text-sm text-slate-600 mb-3 italic">{c.notes}</p>
              )}
              {c.cvc && (
                <div className="mb-3 text-xs text-slate-500">
                  <strong className="text-slate-700">CVC:</strong> {c.cvc.name} &middot; {c.cvc.fundSize} &middot; {c.cvc.investments} investments
                </div>
              )}
              {completedAcqs.length > 0 ? (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200">
                      <th className="text-left py-2 pr-4 font-semibold">Year</th>
                      <th className="text-left py-2 pr-4 font-semibold">Target</th>
                      <th className="text-left py-2 pr-4 font-semibold">Deal Size</th>
                      <th className="text-left py-2 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.acquisitions.map((a, i) => (
                      <tr key={i} className={`border-b border-slate-100 ${a.failed ? 'opacity-50 line-through' : ''}`}>
                        <td className="py-1.5 pr-4 text-slate-500 tabular-nums">{a.year}</td>
                        <td className="py-1.5 pr-4 font-medium text-slate-800">{a.target}</td>
                        <td className="py-1.5 pr-4 text-slate-600 whitespace-nowrap">
                          {a.dealSize}
                          {a.failed && <span className="ml-1 text-red-500 no-underline">(FAILED)</span>}
                        </td>
                        <td className="py-1.5 text-slate-500">{a.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-slate-400">No acquisitions recorded (2020&ndash;2026)</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
