import { motion, useScroll, useTransform, animate, useInView } from 'framer-motion'
import { ArrowRight, Gauge, Car, Factory, HardHat, Flame, Building2, Wind, ScanSearch, Radar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Section, SectionHeader, Reveal, Card, DataBadge } from '../components/ui'

/** Particle field: drifting PM particles that thicken toward the skyline. Respects reduced motion. */
function SmogCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; hue: number }
    let ps: P[] = []
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight
      cv.width = w * dpr; cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(260, Math.floor((w * h) / 5200))
      ps = Array.from({ length: n }, () => {
        const y = Math.pow(Math.random(), 0.6) * h
        return {
          x: Math.random() * w, y,
          r: Math.random() * 1.8 + 0.4 + (y / h) * 1.4,
          vx: 0.15 + Math.random() * 0.35, vy: -0.05 - Math.random() * 0.12,
          a: 0.15 + (y / h) * 0.55, hue: Math.random() < 0.18 ? 30 : 160,
        }
      })
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy + Math.sin((p.x + p.y) * 0.01) * 0.08
        if (p.x > w + 5) p.x = -5
        if (p.y < -5) p.y = h * (0.6 + Math.random() * 0.4)
        ctx.beginPath()
        ctx.fillStyle = p.hue === 30 ? `rgba(251,146,60,${p.a * 0.8})` : `rgba(167,243,208,${p.a * 0.55})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}

/** Stylised Chennai-inspired skyline (generic towers, a lighthouse, a smokestack). */
function Skyline() {
  const towers = [
    [0, 70], [40, 110], [70, 90], [105, 150], [140, 120], [175, 80], [200, 170], [240, 130], [275, 95], [300, 200], [345, 140],
    [380, 110], [410, 175], [450, 125], [480, 90], [510, 210], [555, 150], [590, 105], [620, 165], [660, 120], [700, 85],
    [730, 190], [770, 135], [805, 100], [840, 160], [880, 115], [915, 230], [960, 140], [1000, 95], [1035, 175], [1075, 120],
    [1110, 85], [1140, 150], [1180, 110], [1215, 180], [1255, 125], [1290, 90], [1320, 145], [1360, 100], [1400, 130],
  ]
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 left-0 h-[46%] w-full" aria-hidden>
      <defs>
        <linearGradient id="tw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#16294a" />
          <stop offset="1" stopColor="#07111f" />
        </linearGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0" />
          <stop offset=".55" stopColor="#f97316" stopOpacity=".18" />
          <stop offset="1" stopColor="#040a14" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="smoke" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#94a3b8" stopOpacity=".55" />
          <stop offset="1" stopColor="#94a3b8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* back row */}
      <g opacity=".45">
        {towers.map(([x, hgt], i) => <rect key={`b${i}`} x={x + 15} y={320 - hgt * 0.8 - 40} width={30} height={hgt * 0.8 + 40} fill="#0e1d33" />)}
      </g>
      {/* smokestack + plume */}
      <rect x="1180" y="120" width="16" height="200" fill="#16294a" />
      <rect x="1180" y="130" width="16" height="6" fill="#ef4444" opacity=".7" />
      <path d="M1188 118 C 1170 80, 1230 70, 1250 40 S 1340 0, 1440 10 L 1440 40 C 1360 40, 1300 60, 1260 80 S 1200 110, 1196 120 Z" fill="url(#smoke)">
        <animate attributeName="opacity" values=".6;.9;.6" dur="6s" repeatCount="indefinite" />
      </path>
      {/* lighthouse */}
      <rect x="92" y="110" width="14" height="210" fill="#1b3156" />
      <rect x="88" y="102" width="22" height="10" fill="#22385e" />
      <circle cx="99" cy="96" r="4" fill="#fde68a"><animate attributeName="opacity" values="1;.2;1" dur="3s" repeatCount="indefinite" /></circle>
      {/* front row with windows */}
      {towers.map(([x, hgt], i) => (
        <g key={i}>
          <rect x={x} y={320 - hgt} width={32} height={hgt} fill="url(#tw)" />
          {Array.from({ length: Math.floor(hgt / 22) }).map((_, k) => (
            (i * 7 + k * 3) % 5 === 0 ? <rect key={k} x={x + 8 + ((k % 2) * 10)} y={320 - hgt + 12 + k * 22} width={5} height={7} fill="#fbbf24" opacity=".55" /> : null
          ))}
        </g>
      ))}
      <rect x="0" y="0" width="1440" height="320" fill="url(#haze)" />
    </svg>
  )
}

function Counter({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2, ease: 'easeOut', onUpdate: setV })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>
}

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 120])
  const op = useTransform(scrollY, [0, 500], [1, 0.2])
  return (
    <header id="home" className="noise relative flex min-h-[100svh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_70%_20%,#13305a_0%,#07111f_45%,#040a14_100%)]">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <SmogCanvas />
      <Skyline />
      <motion.div style={{ y, opacity: op }} className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-40 pt-28 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-leaf-400/30 bg-ink-900/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-leaf-300 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf-400" /> Environmental Studies · Unit IV Case Study
        </motion.div>
        <h1 className="max-w-5xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
          {['THE AIR', 'WE BREATHE', 'IS CHANGING.'].map((line, i) => (
            <motion.span key={line} className={`block ${i === 2 ? 'text-gradient' : ''}`}
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              {line}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-mist/85 sm:text-xl">
          Understanding, assessing and mitigating urban air pollution through environmental impact assessment.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-9 flex flex-wrap gap-3">
          <a href="#chennai" className="group inline-flex items-center gap-2 rounded-xl bg-leaf-400 px-6 py-3.5 font-semibold text-ink-950 shadow-[0_10px_40px_-10px_rgba(52,211,153,.8)] transition hover:bg-leaf-300">
            Explore Case Study <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </a>
          <a href="#dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:border-leaf-400/60 hover:bg-white/10">
            <Gauge size={18} /> View Air Quality Dashboard
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="glass mt-14 grid max-w-4xl grid-cols-2 gap-6 rounded-2xl p-6 sm:grid-cols-4">
          <div>
            <div className="font-display text-3xl font-semibold text-white"><Counter to={99} suffix="%" /></div>
            <div className="mt-1 text-xs text-mist/70">of the world's population lived where WHO air-quality guideline levels were not met (2019)</div>
          </div>
          <div>
            <div className="font-display text-3xl font-semibold text-white"><Counter to={4.2} decimals={1} suffix="M" /></div>
            <div className="mt-1 text-xs text-mist/70">premature deaths worldwide linked to ambient air pollution (WHO estimate, 2019)</div>
          </div>
          <div>
            <div className="font-display text-3xl font-semibold text-white"><Counter to={12} /></div>
            <div className="mt-1 text-xs text-mist/70">pollutants covered by India's National Ambient Air Quality Standards, 2009</div>
          </div>
          <div>
            <div className="font-display text-3xl font-semibold text-white"><Counter to={6} /></div>
            <div className="mt-1 text-xs text-mist/70">categories in India's National Air Quality Index (CPCB, 2014)</div>
          </div>
          <div className="col-span-2 sm:col-span-4"><DataBadge kind="verified" label="Sources: WHO fact sheet · CPCB — see References" /></div>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-mist/50">Scroll</div>
    </header>
  )
}

const SOURCES = [
  { Icon: Car, title: 'Transportation', text: 'Exhaust from petrol and diesel vehicles releases CO, NOx, VOCs and fine particles at street level, where people breathe.' },
  { Icon: Factory, title: 'Industry & power', text: 'Combustion and process emissions from stacks — SO₂, NOx, PM and toxic compounds — travel kilometres downwind.' },
  { Icon: HardHat, title: 'Construction', text: 'Excavation, demolition, cement handling and truck movement lift large volumes of coarse dust (PM10).' },
  { Icon: Flame, title: 'Waste burning', text: 'Open burning of mixed refuse and dumpsite fires emit smoke, PM2.5, CO and harmful organic compounds.' },
  { Icon: Building2, title: 'Urbanisation', text: 'Dense buildings trap air in street canyons, add heat, and concentrate millions of small emission sources.' },
]

export function Intro() {
  return (
    <Section id="intro" className="grid-bg">
      <SectionHeader index="01" kicker="Introduction" title={<>Pollution is an <span className="text-gradient">urban story.</span></>}
        intro="Cities concentrate people, vehicles, industries and construction into small areas. The result is a mixture of gases and particles that can exceed safe levels — and an urgent need to measure, predict and manage it." />

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal><Card className="h-full">
          <Wind className="mb-4 text-leaf-400" />
          <h3 className="font-display text-xl font-semibold text-white">What is air pollution?</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist/80">
            Air pollution is the presence in the atmosphere of substances — gases, liquid droplets or solid particles — in concentrations
            that harm human health, living organisms, materials or the environment. India's Air (Prevention and Control of Pollution) Act, 1981
            defines an “air pollutant” as any solid, liquid or gaseous substance (including noise) present in the atmosphere in a concentration that
            may be or tend to be injurious to human beings, other living creatures, plants, property or the environment.
          </p>
        </Card></Reveal>
        <Reveal delay={0.1}><Card className="h-full">
          <Building2 className="mb-4 text-leaf-400" />
          <h3 className="font-display text-xl font-semibold text-white">Why are cities vulnerable?</h3>
          <ul className="mt-3 space-y-2 text-sm text-mist/80">
            <li>• High density of emission sources in a small area.</li>
            <li>• Tall buildings reduce ventilation (street-canyon effect).</li>
            <li>• Heavy traffic congestion increases idling emissions.</li>
            <li>• Continuous construction and road-dust resuspension.</li>
            <li>• Large exposed population, including vulnerable groups.</li>
            <li>• Night-time inversions trap pollutants close to the ground.</li>
          </ul>
        </Card></Reveal>
        <Reveal delay={0.2}><Card className="h-full">
          <ScanSearch className="mb-4 text-leaf-400" />
          <h3 className="font-display text-xl font-semibold text-white">Why assess impacts?</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist/80">
            Environmental Impact Assessment (EIA) predicts how a project or policy will change air quality <em>before</em> it happens.
            It lets planners compare alternatives, check compliance with standards, protect sensitive receptors such as schools and
            hospitals, and design mitigation measures in advance — far cheaper than correcting damage later.
          </p>
        </Card></Reveal>
      </div>

      <Reveal className="mt-16">
        <h3 className="mb-6 font-display text-2xl font-semibold text-white">Major sources of urban air pollution</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SOURCES.map(({ Icon, title, text }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass glass-hover group rounded-2xl p-5">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-leaf-400/10 text-leaf-400 ring-1 ring-leaf-400/20 transition group-hover:bg-leaf-400 group-hover:text-ink-950">
                <Icon size={22} />
              </div>
              <div className="font-display font-semibold text-white">{title}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-mist/70">{text}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-leaf-400/20 bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900 p-8 sm:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-leaf-400/10 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-leaf-400"><Radar size={14} /> Introducing AIRWATCH</div>
              <h3 className="font-display text-3xl font-semibold text-white">A research portal, a model lab and a monitoring dashboard — in one place.</h3>
              <p className="mt-4 leading-relaxed text-mist/80">
                AIRWATCH walks through the full logic of Unit IV: identifying sources, establishing a baseline, predicting concentrations
                with mass-balance, box and Gaussian dispersion models, judging significance against Indian standards, and planning
                mitigation — then applies it to Chennai.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Interactive models', 'Box & Gaussian plume'], ['Live model data', 'CAMS via Open-Meteo'], ['AQI calculator', 'CPCB breakpoints'], ['What-if simulator', 'Educational index']].map(([a, b]) => (
                <div key={a} className="rounded-xl border border-white/10 bg-ink-950/50 p-4">
                  <div className="font-semibold text-white">{a}</div>
                  <div className="mt-1 text-xs text-mist/60">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
