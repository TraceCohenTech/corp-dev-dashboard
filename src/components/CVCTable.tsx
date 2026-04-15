import { companies } from '../data/companies'

export function CVCTable() {
  const cvcCompanies = companies
    .filter(c => c.cvc !== null)
    .sort((a, b) => {
      // Sort by fund size (rough parse)
      const parseSize = (s: string) => {
        const n = parseFloat(s.replace(/[^0-9.]/g, '')) || 0
        if (s.includes('B')) return n * 1000
        return n
      }
      return parseSize(b.cvc!.fundSize) - parseSize(a.cvc!.fundSize)
    })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Corporate Venture Arms</h2>
      <p className="text-sm text-slate-500 mb-4">
        {cvcCompanies.length} of {companies.length} companies operate dedicated investment programs
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="pb-3 font-semibold text-slate-600">Company</th>
              <th className="pb-3 font-semibold text-slate-600">CVC Name</th>
              <th className="pb-3 font-semibold text-slate-600">Fund Size</th>
              <th className="pb-3 font-semibold text-slate-600">Investments</th>
            </tr>
          </thead>
          <tbody>
            {cvcCompanies.map(c => (
              <tr key={c.ticker} className="border-b border-slate-50">
                <td className="py-2.5 font-medium text-slate-900">{c.name} <span className="text-slate-400 font-mono text-xs ml-1">{c.ticker}</span></td>
                <td className="py-2.5 text-emerald-700 font-medium">{c.cvc!.name}</td>
                <td className="py-2.5 text-slate-600">{c.cvc!.fundSize}</td>
                <td className="py-2.5 text-slate-600">{c.cvc!.investments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
