import { companies } from '../data/companies'

export function Header() {
  const totalDeals = companies.reduce((s, c) => s + c.acquisitions.filter(a => !a.failed).length, 0)
  return (
    <header className="text-center py-10">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Corporate Development & M&A Intelligence
      </h1>
      <p className="mt-3 text-lg text-slate-600">
        {companies.length} Public SaaS & Technology Companies &middot; {totalDeals}+ Acquisitions Tracked (2020&ndash;2026)
      </p>
      <p className="mt-1 text-sm text-slate-400">Last updated April 2026</p>
    </header>
  )
}
