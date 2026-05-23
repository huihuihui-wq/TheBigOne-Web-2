import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FILTERS = ['ALL', 'GRAPHIC DESIGN', 'FASHION', 'PRODUCT', 'PHOTOGRAPHY']

const IMAGES = [
  {
    src: '/gallery-fashion.jpg',
    model: 'FLUX 2 PRO',
    title: 'High Fashion Editorial',
    meta: '2.1s · 1024×1536 · 4.9',
    category: 'FASHION',
  },
  {
    src: '/gallery-street.jpg',
    model: 'SEEDREAM 4.5',
    title: 'Street Style Look',
    meta: '1.9s · 1024×1536 · 4.8',
    category: 'PHOTOGRAPHY',
  },
  {
    src: '/gallery-avantgarde.jpg',
    model: 'NANO BANANA',
    title: 'Avant-Garde Collection',
    meta: '2.5s · 1024×1536 · 4.7',
    category: 'PRODUCT',
  },
]

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredImages = activeFilter === 'ALL'
    ? IMAGES
    : IMAGES.filter((img) => img.category === activeFilter)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      const items = gridRef.current?.querySelectorAll('.gallery-item')
      if (items) {
        gsap.fromTo(items, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.15, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="gallery" ref={sectionRef} className="section-padding bg-black">
      <div className="container-main">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 opacity-0">
          <div className="label-bracket text-white">[05] [AI GALLERY]</div>
          <h2 className="text-display-subsection text-white mt-6">
            See What's Possible With
            <br />
            TheBigONE AI IMAGE Generator
          </h2>
          <p className="text-body-sm text-[rgba(255,255,255,0.6)] max-w-[600px] mx-auto mt-4">
            Edit, retouch, and enhance with AI-enhanced precision. From background removal to cinematic upscales, make images and footage production-ready.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="text-mono px-6 py-3 transition-all duration-300"
                style={{
                  backgroundColor: activeFilter === filter ? '#FFFFFF' : 'transparent',
                  color: activeFilter === filter ? '#000000' : 'rgba(255,255,255,0.6)',
                  border: activeFilter === filter ? '1px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            ref={gridRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredImages.map((img, i) => (
              <div
                key={i}
                className="gallery-item relative overflow-hidden group cursor-pointer opacity-0"
                style={{ aspectRatio: '2/3' }}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-600"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                {/* Hover info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="text-mono text-white text-xs mb-1">{img.model}</div>
                  <div className="text-body-sm text-white/80">{img.meta}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Models button */}
        <div className="text-center mt-16">
          <button className="border border-[rgba(255,255,255,0.3)] text-white font-display font-normal text-sm uppercase tracking-[0.08em] px-8 py-3.5 hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 inline-flex items-center gap-2">
            VIEW ALL MODELS <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}
