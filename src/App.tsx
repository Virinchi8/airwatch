import { Navbar, TocRail, BackToTop } from './components/Chrome'
import { Hero, Intro } from './sections/Hero'
import { Science } from './sections/Science'
import { Assessment } from './sections/Assessment'
import { Chennai } from './sections/Chennai'
import { Dashboard } from './sections/Dashboard'
import { Mitigation } from './sections/Mitigation'
import { Simulator } from './sections/Simulator'
import { Laws } from './sections/Laws'
import { Management } from './sections/Management'
import { Conclusion } from './sections/Conclusion'

export default function App() {
  return (
    <>
      <Navbar />
      <TocRail />
      <main>
        <Hero />
        <Intro />
        <Science />
        <Assessment />
        <Chennai />
        <Dashboard />
        <Mitigation />
        <Simulator />
        <Laws />
        <Management />
        <Conclusion />
      </main>
      <BackToTop />
    </>
  )
}
