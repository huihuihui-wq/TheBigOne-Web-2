import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  KeyRound,
  MousePointerClick,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface TabItem {
  id: string
  title: string
  subtitle: string
  desc: string
  points: string[]
  image: string
}

const TABS: TabItem[] = [
  {
    id: 't2i',
    title: 'T2I',
    subtitle: 'Text to Image',
    desc: 'Input a prompt and let AI generate brand-new images directly inside Photoshop.',
    points: [
      'Multiple models: Z-Image Base, GPT-2, Nano Banana, Anima',
      '14 aspect ratios + custom size matching canvas',
      'Batch generate 1–4 images at once',
      'Auto-translates Chinese prompts to English',
    ],
    image: '/t2i-screenshot.png',
  },
  {
    id: 'edit',
    title: 'EDIT',
    subtitle: 'Image to Image',
    desc: 'Upload references or use the current canvas to restyle, repaint, or expand your image.',
    points: [
      'Supports up to 5 reference images',
      'Photoshop selection auto-becomes inpaint mask',
      'Models: Gpt-image-2, Qwen, Flux-Klenin, Kein',
      'Great for costume change, style transfer, line-art colorization',
    ],
    image: '/edit-screenshot.png',
  },
  {
    id: 'other',
    title: 'OTHER',
    subtitle: 'Toolbox',
    desc: 'A collection of one-click professional image processing tools.',
    points: [
      'Upscale: 2x / 4x super-resolution',
      'Remove Background: universal or targeted by prompt',
      'Face Restore: fix blurry or low-quality faces',
      'Anime Upscale & Add Details for illustrations',
    ],
    image: '/other-screenshot.png',
  },
  {
    id: 'live',
    title: 'LIVE',
    subtitle: 'Real-time',
    desc: 'Continuous image-to-image loop. Paint in Photoshop and watch AI update in real time.',
    points: [
      'Auto-captures canvas on every change',
      'Denoise slider controls creativity vs fidelity',
      'Perfect for sketch refinement and style experiments',
      'Click any result to drop it back as a new layer',
    ],
    image: '/live-screenshot.png',
  },
  {
    id: 'history',
    title: 'HISTORY',
    subtitle: 'Auto-save',
    desc: 'Every generated image is saved locally. Browse, manage, and reuse anytime.',
    points: [
      'Auto-sorted by function: generate, edit, upscale, remove-bg…',
      'Each image keeps its generation metadata',
      'Click thumbnail to place it back onto the canvas',
      'Watch a local folder to import external images',
    ],
    image: '/history-screenshot.png',
  },
  {
    id: 'profile',
    title: 'PROFILE',
    subtitle: 'Account',
    desc: 'Activate your license, check balance, and pick the fastest server.',
    points: [
      'Enter License Key (sk-xxx) to activate',
      'Auto-refreshes balance and token status',
      'Switch China / Global route with live latency test',
      'Auto-logout when token expires; re-activate anytime',
    ],
    image: '/profile-screenshot.png',
  },
]

const STEPS = [
  {
    icon: Download,
    title: 'INSTALL',
    desc: 'Double-click .ccx file, then open Window > Plugins > A_Big_Pulgin.',
  },
  {
    icon: KeyRound,
    title: 'ACTIVATE',
    desc: 'Go to Profile tab, enter your License Key (sk-xxx), and verify.',
  },
  {
    icon: MousePointerClick,
    title: 'GENERATE',
    desc: 'Pick a model, write a prompt in any language, and hit Generate.',
  },
]

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
}

const textVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
}

export default function GuidePage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const activeTab = TABS[activeIdx]

  const goNext = useCallback(() => {
    setDirection(1)
    setActiveIdx((i) => (i + 1) % TABS.length)
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setActiveIdx((i) => (i - 1 + TABS.length) % TABS.length)
  }, [])

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeIdx ? 1 : -1)
    setActiveIdx(idx)
  }, [activeIdx])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.guide-download',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.guide-hero',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.guide-step',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power4.out',
          scrollTrigger: { trigger: '.guide-steps', start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.guide-showcase',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
          scrollTrigger: { trigger: '.guide-showcase', start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.guide-tips',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power4.out',
          scrollTrigger: { trigger: '.guide-tips', start: 'top 85%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <main ref={sectionRef} className="w-full" style={{ background: '#FBFBFB', paddingTop: '72px' }}>
      {/* Download Plugin */}
      <section className="container-main pt-20 lg:pt-28 pb-10">
        <div className="guide-download" style={{ opacity: 0 }}>
          <div className="label-bracket text-[#1E1E1E] mb-5">[DOWNLOAD]</div>
          <h1 className="text-display-section text-[#1E1E1E] mb-4">
            Plugin Installer
          </h1>
          <p className="text-body text-[#666666] max-w-[560px] mb-8">
            Download the latest UXP plugin for Adobe Photoshop and start creating with AI.
          </p>
          <a
            href="/com.huihuihui_4.uxp_PS.ccx"
            download
            className="inline-flex items-center gap-4 bg-white border border-[rgba(30,30,30,0.1)] hover:border-[rgba(30,30,30,0.3)] transition-all duration-300 group"
            style={{ padding: '20px 24px' }}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[#1E1E1E] text-white group-hover:bg-black transition-colors duration-300">
              <Download size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-display text-sm uppercase tracking-[0.04em] text-[#1E1E1E]">
                com.huihuihui_4.uxp_PS.ccx
              </div>
              <div className="text-mono text-[11px] text-[#999999] tracking-[0.04em] mt-1">
                UXP PLUGIN • 1.5 MB
              </div>
            </div>
            <div className="ml-4 text-[#1E1E1E] group-hover:translate-x-1 transition-transform duration-300">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </div>
          </a>
        </div>
      </section>

      {/* Hero */}
      <section className="container-main py-20 lg:py-28">
        <div className="guide-hero" style={{ opacity: 0 }}>
          <div className="label-bracket text-[#1E1E1E] mb-5">[QUICK START]</div>
          <h1 className="text-display-section text-[#1E1E1E] mb-4">
            Getting Started
          </h1>
          <p className="text-body text-[#666666] max-w-[560px]">
            Three steps from install to your first AI-generated image inside Photoshop.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="guide-steps container-main pb-20 lg:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="guide-step bg-white border border-[rgba(30,30,30,0.1)] p-6 lg:p-8"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1E1E1E] text-white">
                  <step.icon size={18} strokeWidth={1.5} />
                </div>
                <span className="font-display text-sm uppercase tracking-[0.08em] text-[#999999]">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg uppercase tracking-[0.04em] text-[#1E1E1E] mb-2">
                {step.title}
              </h3>
              <p className="text-body-sm text-[#666666] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase — Image + Text slider */}
      <section className="guide-showcase container-main pb-20 lg:pb-28" style={{ opacity: 0 }}>
        <div className="mb-10 lg:mb-14">
          <div className="label-bracket text-[#1E1E1E] mb-5">[FEATURES]</div>
          <h2 className="text-display-subsection text-[#1E1E1E]">
            Explore Every Tab
          </h2>
        </div>

        <div className="bg-white border border-[rgba(30,30,30,0.1)]">
          {/* Tab navigation */}
          <div className="flex overflow-x-auto border-b border-[rgba(30,30,30,0.08)]">
            {TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => goTo(idx)}
                className="flex-shrink-0 relative px-5 py-4 font-display text-xs uppercase tracking-[0.08em] transition-colors duration-300"
                style={{
                  color: activeIdx === idx ? '#1E1E1E' : '#999999',
                  backgroundColor: activeIdx === idx ? 'rgba(30,30,30,0.02)' : 'transparent',
                }}
              >
                {tab.title}
                {activeIdx === idx && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1E1E1E]"
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="flex flex-col lg:flex-row">
            {/* Text side */}
            <div className="lg:w-[45%] xl:w-[420px] flex-shrink-0 p-6 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[rgba(30,30,30,0.08)]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTab.id}
                  custom={direction}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <p className="text-mono text-[11px] uppercase tracking-[0.1em] text-[#999999] mb-2">
                    {activeTab.subtitle}
                  </p>
                  <h3 className="font-display text-2xl uppercase tracking-[0.04em] text-[#1E1E1E] mb-4">
                    {activeTab.title}
                  </h3>
                  <p className="text-body text-[#666666] leading-relaxed mb-6">
                    {activeTab.desc}
                  </p>
                  <ul className="space-y-3">
                    {activeTab.points.map((pt, i) => (
                      <motion.li
                        key={pt}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                        className="flex items-start gap-3 text-body-sm text-[#555555]"
                      >
                        <span
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-[#1E1E1E] text-white text-[10px] font-display mt-0.5"
                        >
                          {i + 1}
                        </span>
                        {pt}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              {/* Arrows (desktop) */}
              <div className="hidden lg:flex items-center gap-3 mt-10">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 flex items-center justify-center border border-[rgba(30,30,30,0.12)] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white transition-colors duration-300"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button
                  onClick={goNext}
                  className="w-10 h-10 flex items-center justify-center border border-[rgba(30,30,30,0.12)] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white transition-colors duration-300"
                  aria-label="Next"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
                <span className="text-mono text-[11px] uppercase tracking-[0.06em] text-[#999999] ml-2">
                  {activeIdx + 1} / {TABS.length}
                </span>
              </div>
            </div>

            {/* Image side */}
            <div className="flex-1 relative bg-[#F5F5F5] flex items-center justify-center p-6 lg:p-10 min-h-[400px] lg:min-h-[560px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTab.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex items-center justify-center w-full h-full"
                >
                  <motion.img
                    src={activeTab.image}
                    alt={`${activeTab.title} Interface`}
                    className="max-h-[480px] lg:max-h-[520px] w-auto object-contain shadow-xl"
                    style={{ borderRadius: 0 }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1] as const,
                      delay: 0.1,
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Arrows (mobile) */}
              <div className="flex lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-3">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-[rgba(30,30,30,0.12)] text-[#1E1E1E]"
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <span className="text-mono text-[11px] uppercase tracking-[0.06em] text-[#666666]">
                  {activeIdx + 1} / {TABS.length}
                </span>
                <button
                  onClick={goNext}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-[rgba(30,30,30,0.12)] text-[#1E1E1E]"
                  aria-label="Next"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="guide-tips container-main pb-20 lg:pb-28" style={{ opacity: 0 }}>
        <div className="bg-[#1E1E1E] text-white p-8 lg:p-12">
          <div className="label-bracket text-white/50 mb-5">[TIPS]</div>
          <h2 className="text-display-subsection text-white mb-6">
            Pro Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h4 className="font-display text-sm uppercase tracking-[0.08em] text-white mb-2">
                Chinese Prompts
              </h4>
              <p className="text-body-sm text-white/60 leading-relaxed">
                Type in Chinese — the plugin auto-translates to English before sending to the model.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm uppercase tracking-[0.08em] text-white mb-2">
                Selection = Inpaint
              </h4>
              <p className="text-body-sm text-white/60 leading-relaxed">
                Draw a selection in Photoshop before generating in Edit mode to repaint only that area.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm uppercase tracking-[0.08em] text-white mb-2">
                Fixed Seed
              </h4>
              <p className="text-body-sm text-white/60 leading-relaxed">
                Set seed to Fixed to reproduce the same image with identical settings.
              </p>
            </div>
            <div>
              <h4 className="font-display text-sm uppercase tracking-[0.08em] text-white mb-2">
                Batch Size
              </h4>
              <p className="text-body-sm text-white/60 leading-relaxed">
                Generate 2–4 images at once to compare variations. Higher batch costs more balance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
