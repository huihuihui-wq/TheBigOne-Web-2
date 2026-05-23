import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const TABS = [
  {
    id: 'text2image',
    label: 'TEXT TO IMAGE',
    prompt: '"A futuristic cityscape at sunset, neon lights reflecting on wet streets, cyberpunk aesthetic"',
    image: '/gen-text2image.jpg',
    title: 'TEXT TO IMAGE',
    description: 'Generate high-quality images from text descriptions. Supports multiple artistic style controls and fine parameter adjustments for instant creative visualization.',
    stats: [
      { label: 'SPEED', value: '3-5 seconds average' },
      { label: 'STYLES', value: '50+ artistic styles' },
      { label: 'CONTROL', value: 'Multi-dimensional parameters' },
    ],
  },
  {
    id: 'edit2image',
    label: 'EDIT TO IMAGE',
    prompt: '"Transform this fashion photo into a Renaissance oil painting portrait..."',
    image: '/gen-edittext.jpg',
    title: 'EDIT TO IMAGE',
    description: 'Upload an image and edit it through natural language. Change styles, add elements, modify compositions — all guided by text prompts.',
    stats: [
      { label: 'PRECISION', value: 'Pixel-perfect edits' },
      { label: 'CONTEXT', value: 'Smart understanding' },
      { label: 'LAYERS', value: 'Non-destructive' },
    ],
  },
  {
    id: 'up2image',
    label: 'UP TO IMAGE',
    prompt: '"Upscale this product photo to 4K resolution while preserving all fine details..."',
    image: '/gen-uptext.jpg',
    title: 'UP TO IMAGE',
    description: 'Transform low-resolution images into ultra-high-definition masterpieces. AI reconstructs detail that was never there.',
    stats: [
      { label: '4X UPSCALE', value: 'Resolution boost' },
      { label: 'DETAIL', value: 'AI reconstruction' },
      { label: 'RESTORE', value: 'Fix compression' },
    ],
  },
  {
    id: 'text2model',
    label: 'TEXT TO MODEL',
    prompt: '"A smooth abstract sculpture inspired by wind and water, organic flowing forms, matte white finish..."',
    image: '/gen-text2model.jpg',
    title: 'TEXT TO MODEL',
    description: 'Generate 3D models directly from text descriptions. Perfect for concept art, prototyping, and rapid 3D asset creation.',
    stats: [
      { label: '3D READY', value: 'Printable meshes' },
      { label: 'TOPOLOGY', value: 'Clean geometry' },
      { label: 'EXPORT', value: 'All formats' },
    ],
  },
]

export default function ImageGeneration() {
  const [activeTab, setActiveTab] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ig-header', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.ig-content', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.0, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const tab = TABS[activeTab]

  return (
    <section
      id="image-generation"
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44"
      style={{ background: '#F5F5F5' }}
    >
      <div className="container-main">
        {/* Header */}
        <div className="ig-header mb-12 lg:mb-16" style={{ opacity: 0 }}>
          <div className="label-bracket text-[#1E1E1E] mb-4">[03] [IMAGE GENERATION]</div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <h2 className="text-display-subsection text-[#1E1E1E] whitespace-nowrap">
              IMAGE GENERATION
            </h2>
          </div>

          <p className="text-body-sm text-[#666666] max-w-[560px] mb-8">
            Powerful AI image generation — from text descriptions to high-quality visual creation in seconds.
          </p>

          {/* Tabs row */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(i)}
                className="text-mono px-6 py-3 transition-all duration-300"
                style={{
                  backgroundColor: activeTab === i ? '#1E1E1E' : 'transparent',
                  color: activeTab === i ? '#FFFFFF' : '#666666',
                  border: activeTab === i ? '1px solid #1E1E1E' : '1px solid rgba(30,30,30,0.12)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content: image + info side by side */}
        <div className="ig-content" style={{ opacity: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row gap-8 lg:gap-12"
            >
              {/* Left: Image */}
              <div className="w-full lg:w-[55%]">
                <div className="relative overflow-hidden bg-white border border-[rgba(30,30,30,0.06)]">
                  <img
                    src={tab.image}
                    alt={tab.title}
                    className="w-full object-cover"
                    style={{ maxHeight: '520px', aspectRatio: '4/3' }}
                  />
                  {/* Prompt overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent">
                    <div className="text-mono text-[#AAAAAA] text-[10px] uppercase tracking-[0.1em] mb-1">PROMPT</div>
                    <p className="text-white text-xs font-body">{tab.prompt}</p>
                  </div>
                </div>
              </div>

              {/* Right: Info */}
              <div className="w-full lg:w-[45%] flex flex-col justify-between">
                <div>
                  <h3 className="heading-feature text-[#1E1E1E] mb-4">{tab.title}</h3>
                  <p className="text-body text-[#666666] mb-8">{tab.description}</p>

                  {/* Stats */}
                  <div className="space-y-3 mb-8">
                    {tab.stats.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 py-3 border-b border-[rgba(30,30,30,0.06)]"
                      >
                        <span className="text-mono text-[#1E1E1E] text-[11px] uppercase tracking-[0.1em] w-[100px] flex-shrink-0">
                          {stat.label}
                        </span>
                        <span className="text-body-sm text-[#666666]">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button className="bg-[#1E1E1E] text-white font-display font-normal text-sm uppercase tracking-[0.04em] py-4 hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 mt-auto">
                  TRY {tab.label} <span className="text-lg">→</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative shape */}
      <img
        src="/organic-shape-3.png"
        alt=""
        className="absolute bottom-0 right-0 w-[200px] h-[200px] object-contain opacity-[0.03] pointer-events-none hidden lg:block"
        style={{ transform: 'translateX(30%)' }}
      />
    </section>
  )
}
