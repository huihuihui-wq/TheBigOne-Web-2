import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const PLATFORMS = [
  {
    id: 'photoshop',
    number: '1',
    name: 'PHOTOSHOP',
    description: 'Click to switch modes. Review history, iterate in real-time, and keep your layers intact.',
    tags: ['AI Drawing', 'History', 'Real-time'],
    steps: [
      { title: 'INSTALL PLUGIN', desc: 'Install via Creative Cloud / Exchange, then restart Photoshop to enable the panel.' },
      { title: 'OPEN AI PANEL', desc: 'Window → Extensions → The Big One. Sign in and choose a model preset.' },
      { title: 'START CREATING', desc: 'Select a layer or region, write a prompt, generate, then compare versions in history.' },
    ],
  },
  {
    id: 'blender',
    number: '2',
    name: 'BLENDER',
    description: 'Generate 3D models from images, then refine topology and materials inside your pipeline.',
    tags: ['3D Model', 'Image → 3D', 'Pipeline'],
    steps: [
      { title: 'INSTALL ADD-ON', desc: 'Download from our website, then install via Edit → Preferences → Add-ons.' },
      { title: 'OPEN AI PANEL', desc: 'Press N to open the sidebar, find "TheBigOne" tab, and sign in.' },
      { title: 'START CREATING', desc: 'Select a mesh or image, choose a generation mode, and let AI do the work.' },
    ],
  },
  {
    id: 'figma',
    number: '3',
    name: 'FIGMA',
    description: 'Generate blueprints and auto-annotations, then keep specs synced as designs change.',
    tags: ['Blueprint', 'Auto Annotate', 'Sync'],
    steps: [
      { title: 'INSTALL PLUGIN', desc: 'Search "TheBigOne" in Figma Community plugins and click Install.' },
      { title: 'OPEN AI PANEL', desc: 'Plugins → TheBigOne → Open. Sign in to access all features.' },
      { title: 'START CREATING', desc: 'Select a frame, choose a tool, and generate or edit directly on the canvas.' },
    ],
  },
  {
    id: 'other',
    number: '4',
    name: 'OTHER',
    description: 'Extend into more tools with APIs, SDKs, and custom plugins for your team\'s workflow.',
    tags: ['API', 'Custom', 'Extend'],
    steps: [
      { title: 'GET API KEY', desc: 'Sign up and generate your API key from the dashboard.' },
      { title: 'INTEGRATE', desc: 'Use our REST API or SDKs for Python, JavaScript, and more.' },
      { title: 'START BUILDING', desc: 'Send requests, receive AI-generated results, and embed them in your app.' },
    ],
  },
]

export default function HowToUse() {
  const [activePlatform, setActivePlatform] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.htu-heading', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.htu-platform', { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
      gsap.fromTo('.htu-steps', { opacity: 0, x: 20 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const platform = PLATFORMS[activePlatform]

  return (
    <section
      id="how-to-use"
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44"
      style={{ background: '#FBFBFB' }}
    >
      <div className="container-main">
        {/* Header */}
        <div className="htu-heading mb-12 lg:mb-16" style={{ opacity: 0 }}>
          <div className="label-bracket text-[#1E1E1E] mb-5">[04] [HOW TO USE]</div>
          <h2 className="text-display-subsection text-[#1E1E1E] mb-4">
            How to use the different plugins of TheBigOne
          </h2>
          <p className="text-body-sm text-[#666666] max-w-[560px]">
            Simply share how to use different plugins. Select a platform to see the step-by-step guide.
          </p>
        </div>

        {/* Main grid: Platform selector + Steps */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left: Platform list */}
          <div className="w-full lg:w-[45%] xl:w-[420px] flex-shrink-0">
            <div className="flex flex-col gap-2">
              {PLATFORMS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActivePlatform(i)}
                  className={`htu-platform text-left transition-all duration-300 ${
                    activePlatform === i
                      ? 'bg-white border-[rgba(30,30,30,0.2)]'
                      : 'bg-transparent border-transparent hover:bg-[rgba(30,30,30,0.02)]'
                  }`}
                  style={{
                    opacity: 0,
                    border: '1px solid',
                    borderColor: activePlatform === i ? 'rgba(30,30,30,0.15)' : 'transparent',
                  }}
                >
                  <div className="flex items-start gap-4 p-5">
                    <span
                      className={`font-display font-extralight text-4xl leading-none transition-colors duration-300 ${
                        activePlatform === i ? 'text-[#1E1E1E]' : 'text-[#CCCCCC]'
                      }`}
                    >
                      {p.number}
                    </span>
                    <div className="flex-1">
                      <h3
                        className={`font-display font-normal text-base uppercase tracking-[0.04em] transition-colors duration-300 ${
                          activePlatform === i ? 'text-[#1E1E1E]' : 'text-[#888888]'
                        }`}
                      >
                        {p.name}
                      </h3>
                      <p className="text-body-xs text-[#999999] mt-1">{p.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-mono text-[11px] uppercase tracking-[0.06em] px-3 py-1 transition-all duration-300 ${
                              activePlatform === i
                                ? 'bg-[#1E1E1E] text-white'
                                : 'bg-[rgba(30,30,30,0.04)] text-[#999999]'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Steps panel */}
          <div className="htu-steps flex-1" style={{ opacity: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlatform}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border border-[rgba(30,30,30,0.12)] bg-white p-8 lg:p-10"
              >
                {/* Platform header */}
                <div className="mb-8 pb-6 border-b border-[rgba(30,30,30,0.08)]">
                  <div className="text-mono text-[#999999] text-[11px] uppercase tracking-[0.1em] mb-2">
                    {platform.name} PLUGIN
                  </div>
                  <p className="text-body-sm text-[#666666]">
                    AI-powered real-time drawing and editing.
                  </p>
                </div>

                {/* Steps timeline */}
                <div className="relative pl-10">
                  {/* Vertical line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[rgba(30,30,30,0.1)]" />

                  {platform.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.4 }}
                      className="relative mb-8 last:mb-0"
                    >
                      {/* Number circle */}
                      <div className="absolute -left-10 top-0 w-[30px] h-[30px] border border-[#1E1E1E] bg-white flex items-center justify-center">
                        <span className="text-xs font-display text-[#1E1E1E]">{i + 1}</span>
                      </div>
                      <h4 className="font-display font-normal text-sm uppercase tracking-[0.04em] text-[#1E1E1E]">
                        {step.title}
                      </h4>
                      <p className="text-body-xs text-[#888888] mt-2 leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Organic shape accent */}
      <img
        src="/organic-shape-4.png"
        alt=""
        className="absolute bottom-0 left-0 w-[200px] h-[200px] object-contain opacity-[0.03] pointer-events-none"
        style={{ transform: 'translateX(-30%)' }}
      />
    </section>
  )
}
