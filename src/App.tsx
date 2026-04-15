import { Header } from './components/Header'
import { KPICards } from './components/KPICards'
import { ActivityTierChart } from './components/ActivityTierChart'
import { DealTimeline } from './components/DealTimeline'
import { CompanyTable } from './components/CompanyTable'
import { CVCTable } from './components/CVCTable'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Header />
        <KPICards />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ActivityTierChart />
          <DealTimeline />
        </div>
        <CompanyTable />
        <CVCTable />
        <Footer />
      </main>
    </div>
  )
}

export default App
