import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    title: 'REAL-TIME GENERATIVE PAINT',
    description: 'AI brush syncs with your canvas live. Paint naturally while the AI generates detail, texture, and completion in real time.',
  },
  {
    title: 'SMART INPAINTING',
    description: 'Select any area, describe the fill, done. The AI understands context and seamlessly blends the inpainted region with surrounding content.',
  },
  {
    title: 'STYLE TRANSFER',
    description: 'Apply any artistic style with a single click. Transform photographs into oil paintings, watercolors, sketches, or any custom artistic direction.',
  },
  {
    title: 'AI UPSCALE + RESTORE',
    description: 'Enhance resolution and fix damaged images. Reconstruct missing details, remove noise, and upscale to print-ready quality.',
  },
]

export default function AIPainting() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      const items = rightRef.current?.querySelectorAll('.feature-item')
      if (items) {
        gsap.fromTo(items, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.15, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="ai-painting" ref={sectionRef} className="section-padding bg-black">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left column */}
          <div ref={leftRef} className="w-full lg:w-[40%] opacity-0">
            <div className="label-bracket text-white">[02] [AI PAINTING]</div>
            <h2 className="text-display-subsection text-white mt-6">
              AI Painting, In Real Time
            </h2>
            <p className="text-body-sm text-[rgba(255,255,255,0.6)] mt-4">
              Describe what you want, watch it appear. Real-time AI brush lets you paint with intelligence — blend, extend, and reimagine any layer without leaving your creative tool.
            </p>
            {/* Organic shape mask */}
            <div className="mt-10 relative w-full max-w-[400px] aspect-[4/3] overflow-hidden" style={{ clipPath: 'url(#blob2)' }}>
              <svg width="0" height="0" className="absolute">
                <defs>
                  <clipPath id="blob2" clipPathUnits="objectBoundingBox">
                    <path d="M0.5,0.05 C0.75,0.05 0.85,0.15 0.9,0.3 C0.95,0.5 0.9,0.7 0.8,0.82 C0.7,0.95 0.3,0.95 0.2,0.82 C0.1,0.7 0.05,0.5 0.1,0.3 C0.15,0.15 0.25,0.05 0.5,0.05 Z" />
                  </clipPath>
                </defs>
              </svg>
              <img
                src="/feature-generative.jpg"
                alt="Generative painting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right column - feature list */}
          <div ref={rightRef} className="w-full lg:w-[60%]">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="feature-item py-10 border-b border-[rgba(255,255,255,0.1)] opacity-0"
              >
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full border border-[rgba(255,255,255,0.3)] mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-display font-normal text-xl uppercase tracking-[0.04em] text-white">
                      {feature.title}
                    </h3>
                    <p className="text-body-sm text-[rgba(255,255,255,0.6)] mt-3">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
