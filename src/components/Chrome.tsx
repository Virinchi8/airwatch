import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowUp, Menu, X, Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { downloadSummary } from '../lib/summary'

export const NAV = [
  { id: 'home', label: 'Home', num: '01' },
  { id: 'science', label: 'Air Pollution', num: '02' },
  { id: 'assessment', label: 'Impact Assessment', num: '03' },
  { id: 'chennai', label: 'Chennai Case Study', num: '04' },
  { id: 'dashboard', label: 'Dashboard', num: '05' },
  { id: 'mitigation', label: 'Mitigation', num: '06' },
  { id: 'simulator', label: 'Simulator', num: '07' },
  { id: 'laws', label: 'Laws & Standards', num: '08' },
  { id: 'management', label: 'Management', num: '09' },
  { id: 'conclusion', label: 'Conclusion', num: '10' },
]

function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const els = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5" aria-label="AIRWATCH home">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-ink-800 ring-1 ring-leaf-400/40">
        <span className="absolute h-4 w-4 rounded-full border-2 border-leaf-400" />
        <span className="absolute h-4 w-4 rounded-full border border-leaf-400" style={{ animation: 'pulse-ring 2.4s ease-out infinite' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-leaf-400" />
      </span>
      <span className="font-display text-lg font-bold tracking-[0.18em] text-white">AIR<span className="text-leaf-400">WATCH</span></span>
    </a>
  )
}

export function Navbar() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-[1000] transition-all ${scrolled ? 'border-b border-white/5 bg-ink-950/75 backdrop-blur-xl' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="hidden items-center gap-0.5 xl:flex">
            {NAV.slice(1).map(n => (
              <a key={n.id} href={`#${n.id}`}
                className={`relative rounded-md px-2.5 py-1.5 text-[13px] transition ${active === n.id ? 'text-white' : 'text-mist/60 hover:text-white'}`}>
                {active === n.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-white/[0.07] ring-1 ring-leaf-400/30" />}
                <span className="relative">{n.label}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={downloadSummary} className="hidden items-center gap-1.5 rounded-lg border border-leaf-400/40 px-3 py-1.5 text-xs font-medium text-leaf-300 transition hover:bg-leaf-400/10 sm:flex">
              <Download size={14} /> Summary
            </button>
            <button className="rounded-lg p-2 text-white xl:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          </div>
        </div>
        <motion.div style={{ scaleX }} className="h-[2px] origin-left bg-gradient-to-r from-leaf-400 via-cyan-glow to-leaf-300" />
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[1100] bg-ink-950/95 backdrop-blur-xl xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <Logo />
              <button className="rounded-lg p-2 text-white" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
            </div>
            <div className="grid gap-1 px-4 pt-4 sm:px-6">
              {NAV.map((n, i) => (
                <motion.a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className={`flex items-baseline gap-4 rounded-lg px-3 py-3 font-display text-xl ${active === n.id ? 'bg-white/5 text-leaf-300' : 'text-white'}`}>
                  <span className="font-mono text-xs text-leaf-400/70">{n.num}</span>{n.label}
                </motion.a>
              ))}
              <button onClick={() => { downloadSummary(); setOpen(false) }} className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-leaf-400/40 py-3 text-leaf-300">
                <Download size={16} /> Download case study summary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Vertical table-of-contents rail (desktop) */
export function TocRail() {
  const active = useActiveSection()
  return (
    <aside className="fixed right-5 top-1/2 z-[900] hidden -translate-y-1/2 2xl:block" aria-label="Table of contents">
      <ul className="space-y-2.5">
        {NAV.map(n => (
          <li key={n.id}>
            <a href={`#${n.id}`} className="group flex items-center justify-end gap-3">
              <span className={`rounded bg-ink-800/90 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100 ${active === n.id ? 'opacity-100' : ''}`}>{n.label}</span>
              <span className={`block h-2 rounded-full transition-all ${active === n.id ? 'w-6 bg-leaf-400' : 'w-2 bg-white/25 group-hover:bg-white/60'}`} />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 800)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="no-print fixed bottom-5 right-5 z-[950] grid h-12 w-12 place-items-center rounded-full bg-leaf-400 text-ink-950 shadow-[0_10px_30px_-5px_rgba(52,211,153,.6)] transition hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
