import { Header } from './components/Header'
import { KPICards } from './components/KPICards'
import { ActivityTierChart } from './components/ActivityTierChart'
import { DealTimeline } from './components/DealTimeline'
import { IndustryChart } from './components/IndustryChart'
import { DealSizeChart } from './components/DealSizeChart'
import { MegaDeals } from './components/MegaDeals'
import { FunFacts } from './components/FunFacts'
import { CompanyTable } from './components/CompanyTable'
import { CVCTable } from './components/CVCTable'
import { Footer } from './components/Footer'
import { companies } from './data/companies'

function App() {
  return (
    <div className="min-h-screen bg-base text-[var(--text-primary)]">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* KPI stat cards */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.18em]">
              Key Metrics
            </h2>
            <span className="text-xs text-slate-500 hidden sm:block font-medium">
              {companies.length} companies · updated Apr 2026
            </span>
          </div>
          <KPICards />
        </section>

        {/* Activity + Timeline charts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
          <ActivityTierChart />
          <DealTimeline />
        </section>

        {/* Industry + Deal Size charts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
          <IndustryChart />
          <DealSizeChart />
        </section>

        {/* Mega deals spotlight */}
        <MegaDeals />

        {/* Fun facts */}
        <FunFacts />

        {/* Company directory */}
        <CompanyTable />

        {/* CVC table */}
        <CVCTable />
      </main>

      <Footer />
    </div>
  )
}

export default App
