import { companies } from '../data/companies'

export function CVCTable() {
  const cvcCompanies = companies
    .filter(c => c.cvc !== null)
    .sort((a, b) => {
      const parseSize = (s: string) => {
        const n = parseFloat(s.replace(/[^0-9.]/g, '')) || 0
        if (s.includes('B')) return n * 1000
        return n
      }
      return parseSize(b.cvc!.fundSize) - parseSize(a.cvc!.fundSize)
    })

  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
            Strategic Investment Programs
          </h2>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Corporate Venture Arms
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {cvcCompanies.length} of {companies.length} companies operate dedicated investment programs
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 sm:px-6 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-[0.08em] text-left">Company</th>
                <th className="px-3 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-[0.08em] text-left">CVC Name</th>
                <th className="px-3 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-[0.08em] text-right">Fund Size</th>
                <th className="px-3 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-[0.08em] text-right">Investments</th>
              </tr>
            </thead>
            <tbody>
              {cvcCompanies.map((c, i) => (
                <tr
                  key={c.ticker}
                  className={`border-t border-border/80 transition-all duration-150 hover:bg-[var(--accent)]/[0.05] ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/60'
                  }`}
                >
                  <td className="px-3 sm:px-6 py-3 font-medium text-slate-900 whitespace-nowrap">
                    {c.name}
                    <span className="text-slate-400 font-mono text-xs ml-2">{c.ticker}</span>
                  </td>
                  <td className="px-3 py-3 text-emerald-700 font-semibold">{c.cvc!.name}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono">{c.cvc!.fundSize}</td>
                  <td className="px-3 py-3 text-right text-slate-600 font-mono">{c.cvc!.investments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
