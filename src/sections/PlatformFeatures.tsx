import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const TABS = [
  {
    id: 'photoshop',
    label: 'PHOTOSHOP',
    image: '/platform-photoshop.jpg',
    platform: 'ADOBE PHOTOSHOP',
    title: 'AI Painting, In Real Time',
    description: 'Describe what you want, watch it appear. Real-time AI brush lets you paint with intelligence — blend, extend, and reimagine any layer without leaving Photoshop.',
  },
  {
    id: 'figma',
    label: 'FIGMA',
    image: '/platform-figma.jpg',
    platform: 'FIGMA',
    title: 'Design with Intelligence',
    description: 'Generate blueprints and auto-annotations, then keep specs synced as designs change. AI-powered layout suggestions and component generation right inside Figma.',
  },
  {
    id: 'blender',
    label: 'BLENDER',
    image: '/platform-blender.jpg',
    platform: 'BLENDER',
    title: '3D Creation, Amplified',
    description: 'Generate 3D models from images, then refine topology and materials inside your pipeline. AI texture generation and mesh optimization for Blender.',
  },
]

export default function PlatformFeatures() {
  const [activeTab, setActiveTab] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.fromTo(rightRef.current, { x: 30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="platform-features" ref={sectionRef} className="section-padding bg-[#FBFBFB]">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left column */}
          <div ref={leftRef} className="w-full lg:w-[35%] lg:sticky lg:top-[120px] lg:self-start opacity-0">
            <div className="label-bracket text-[#1E1E1E]">[01] [PLATFORM FEATURES]</div>
            <h2 className="text-display-subsection text-[#1E1E1E] mt-6">
              One plugin. Every tool.
            </h2>
            <p className="text-body-sm text-[#666666] mt-4 max-w-[360px]">
              A single plugin that brings AI-powered creativity to every tool in your workflow. No switching apps. No broken pipelines.
            </p>
            <img
              src="/organic-shape-1.png"
              alt=""
              className="w-[200px] h-[260px] object-contain mt-10 opacity-60 animate-float-slow hidden lg:block"
            />
          </div>

          {/* Right column */}
          <div ref={rightRef} className="w-full lg:w-[65%] opacity-0">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(i)}
                  className="text-mono px-6 py-3 transition-all duration-300"
                  style={{
                    backgroundColor: activeTab === i ? '#1E1E1E' : 'transparent',
                    color: activeTab === i ? '#FFFFFF' : '#666666',
                    border: activeTab === i ? '1px solid #1E1E1E' : '1px solid rgba(30,30,30,0.12)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-[rgba(30,30,30,0.06)] p-8 md:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={TABS[activeTab].image}
                    alt={TABS[activeTab].platform}
                    className="w-full aspect-[3/2] object-cover mb-8"
                  />
                  <div className="text-mono text-[#999999] mb-2">{TABS[activeTab].platform}</div>
                  <h3 className="heading-feature text-[#1E1E1E] mb-4">{TABS[activeTab].title}</h3>
                  <p className="text-body-sm text-[#666666]">{TABS[activeTab].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
