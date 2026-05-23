import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ===== Letter-split ===== */
function SplitReveal({ text, baseDelay }: { text: string; baseDelay: number }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block hero-letter"
          style={{
            animationDelay: `${baseDelay + i * 0.04}s`,
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const hHand = useRef<HTMLImageElement>(null)
  const rHand = useRef<HTMLImageElement>(null)
  const conn = useRef<HTMLDivElement>(null)
  const fluid = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  /* ---- Mouse parallax ---- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = sectionRef.current?.getBoundingClientRect()
      if (!r) return
      mouse.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      mouse.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2
    }

    let cx = 0, cy = 0
    const tick = () => {
      cx += (mouse.current.x - cx) * 0.05
      cy += (mouse.current.y - cy) * 0.05

      const set = (el: HTMLElement | null, mx: number, my: number) => {
        if (el) {
          el.style.setProperty('--mx', `${cx * mx}px`)
          el.style.setProperty('--my', `${cy * my}px`)
        }
      }
      set(hHand.current, 12, 8)
      set(rHand.current, 28, 18)
      set(conn.current, 45, 32)
      set(fluid.current, 6, 4)
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  /* ---- GSAP entrance + scroll parallax (NO PIN!) ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Entrance timeline - images start visible, GSAP animates them in */
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo(hHand.current, { x: '-20vw', opacity: 0 }, { x: 0, opacity: 1, duration: 1.8 }, 0.2)
      tl.fromTo(rHand.current, { x: '20vw', opacity: 0 }, { x: 0, opacity: 1, duration: 1.8 }, 0.35)
      tl.fromTo(conn.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0 }, 1.1)
      tl.fromTo(fluid.current, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.6)

      /* Scroll parallax - NO PIN, just scrub animations */
      const scrollCfg = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }

      gsap.to(hHand.current, { x: '15vw', y: -60, scale: 1.15, scrollTrigger: scrollCfg })
      gsap.to(rHand.current, { x: '-15vw', y: 80, scale: 1.18, scrollTrigger: scrollCfg })
      gsap.to(conn.current, { scale: 1.8, opacity: 0.5, scrollTrigger: scrollCfg })
      gsap.to('.hero-vignette', { opacity: 1, scrollTrigger: scrollCfg })

      /* Text fades out on scroll */
      gsap.to('.hero-label', { y: -60, opacity: 0, scrollTrigger: scrollCfg })
      gsap.to('.hero-title', { y: -80, opacity: 0, scale: 0.9, scrollTrigger: scrollCfg })
      gsap.to('.hero-subtitle', { y: -100, opacity: 0, scrollTrigger: scrollCfg })
      gsap.to('.hero-desc', { y: -120, opacity: 0, scrollTrigger: scrollCfg })
      gsap.to('.hero-cta', { y: -140, opacity: 0, scrollTrigger: scrollCfg })
      gsap.to('.hero-pills', { y: -160, opacity: 0, scrollTrigger: scrollCfg })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full flex items-center justify-center"
      style={{ minHeight: '100dvh', paddingTop: '72px', background: '#FBFBFB' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute" style={{ left: '50%', top: '55%', transform: 'translate(-50%, -50%)', width: 'min(600px, 45vw)', height: 'min(400px, 30vh)', background: 'radial-gradient(ellipse at center, rgba(230,230,230,0.6) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      </div>

      {/* Hands layer - images start with opacity:0 via GSAP, NOT CSS class */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none" style={{ zIndex: 1 }}>
        <div className="hero-vignette absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(251,251,251,0.5) 50%, rgba(251,251,251,0.95) 80%, #FBFBFB 100%)', opacity: 0.6, zIndex: 2 }} />
        <img ref={hHand} src="/左手.png" alt="Human hand" style={{ width: 'clamp(400px, 60vw, 850px)', position: 'absolute', left: 'clamp(-60px, -5vw, -10px)', bottom: 'clamp(-50px, -6vh, -5px)', filter: 'saturate(0.88) brightness(1.02)', zIndex: 1, transform: 'translate(var(--mx, 0px), var(--my, 0px))', transition: 'transform 0.08s linear', opacity: 0 }} />
        <img ref={rHand} src="/右手.png" alt="Robot hand" style={{ width: 'clamp(400px, 60vw, 850px)', position: 'absolute', right: 'clamp(-60px, -5vw, -10px)', bottom: 'clamp(-50px, -6vh, -5px)', filter: 'saturate(0.82) brightness(1.03)', zIndex: 1, transform: 'translate(var(--mx, 0px), var(--my, 0px))', transition: 'transform 0.08s linear', opacity: 0 }} />
        <div ref={conn} style={{ position: 'absolute', left: '51%', top: '52%', zIndex: 1, transform: 'translate(var(--mx, 0px), var(--my, 0px))', transition: 'transform 0.08s linear', opacity: 0 }}>
          <div className="absolute rounded-full" style={{ width: '140px', height: '140px', left: '50%', top: '50%', margin: '-70px 0 0 -70px', background: 'radial-gradient(circle, rgba(200,200,200,0.18) 0%, transparent 70%)', filter: 'blur(14px)', animation: 'cA 4s ease-in-out infinite' }} />
          <div className="absolute rounded-full" style={{ width: '60px', height: '60px', left: '50%', top: '50%', margin: '-30px 0 0 -30px', background: 'radial-gradient(circle, rgba(170,170,170,0.22) 0%, transparent 70%)', filter: 'blur(5px)', animation: 'cP 3s ease-in-out infinite' }} />
          <div className="absolute rounded-full" style={{ width: '12px', height: '12px', left: '50%', top: '50%', margin: '-6px 0 0 -6px', background: 'rgba(80,80,80,0.35)', boxShadow: '0 0 24px 6px rgba(130,130,130,0.12)', animation: 'cC 2.5s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Fluid */}
      <div ref={fluid} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0, transform: 'translate(var(--mx, 0px), var(--my, 0px))', transition: 'transform 0.08s linear' }}>
        <div className="absolute rounded-full" style={{ width: '500px', height: '500px', top: '20%', left: '20%', background: 'radial-gradient(circle, rgba(30,30,30,0.025) 0%, transparent 70%)', filter: 'blur(100px)', animation: 'fM1 16s ease-in-out infinite' }} />
        <div className="absolute rounded-full" style={{ width: '350px', height: '350px', bottom: '15%', right: '20%', background: 'radial-gradient(circle, rgba(30,30,30,0.02) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'fM2 20s ease-in-out infinite' }} />
      </div>

      {/* TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
        <div className="text-center px-6" style={{ maxWidth: '720px' }}>
          <div className="hero-label label-bracket text-[#1E1E1E] mb-5" style={{ opacity: 0 }}>[THEBIGONE]</div>
          <div className="hero-title">
            <h1 className="text-[clamp(42px,9vw,110px)] font-display font-extralight uppercase tracking-[0.06em] text-[#1E1E1E] leading-[1.0] mb-4 whitespace-nowrap" style={{ textShadow: '0 0 60px rgba(251,251,251,0.85), 0 0 120px rgba(251,251,251,0.6), 0 2px 4px rgba(251,251,251,0.4)' }}>
              <SplitReveal text="THEBIGONE" baseDelay={0.7} />
            </h1>
          </div>
          <div className="hero-subtitle">
            <h2 className="overflow-hidden text-[clamp(14px,2.2vw,22px)] font-display font-light uppercase tracking-[0.25em] text-[#555555] mb-8" style={{ lineHeight: 1.4 }}>
              <span className="inline-block subtitle-reveal" style={{ animationDelay: '1.4s' }}>WHERE HUMAN</span>{' '}
              <span className="inline-block subtitle-reveal" style={{ animationDelay: '1.6s' }}>MEETS</span>{' '}
              <span className="inline-block subtitle-reveal" style={{ animationDelay: '1.8s' }}>AI</span>
            </h2>
          </div>
          <div className="hero-desc">
            <p className="text-body text-[#777777] max-w-[480px] mx-auto mb-10">Seamlessly access AI features across PhotoShop, Figma, Blender, and more. The bridge between human creativity and artificial intelligence.</p>
          </div>
          <div className="hero-cta flex flex-col sm:flex-row items-center gap-4 justify-center pointer-events-auto relative" style={{ opacity: 0, zIndex: 15 }}>
            <button
              onClick={() => window.location.hash = '#/generator-demo'}
              className="bg-[#1E1E1E] text-white font-display font-normal text-sm uppercase tracking-[0.04em] px-10 py-4 hover:bg-black hover:scale-[1.02] transition-all duration-300 pointer-events-auto"
            >
              TRY NOW
            </button>
            <button
              onClick={() => window.location.hash = '#/api-key'}
              className="border border-[rgba(30,30,30,0.2)] text-[#1E1E1E] font-display font-normal text-sm uppercase tracking-[0.04em] px-10 py-3.5 hover:bg-[rgba(30,30,30,0.04)] hover:border-[rgba(30,30,30,0.4)] transition-all duration-300 pointer-events-auto"
            >
              CREATE KEYS
            </button>
          </div>
          <div className="hero-pills text-mono text-[#AAAAAA] mt-12" style={{ opacity: 0 }}>Multi-Platform AI Plugin · PhotoShop · Figma · Blender</div>
        </div>
      </div>

      {/* Brackets */}
      <div className="absolute hidden lg:block pointer-events-none" style={{ left: '8%', top: '18%', zIndex: 5 }}>
        <div className="w-[1px] h-[50px] bg-[rgba(30,30,30,0.05)]" /><div className="w-[18px] h-[1px] bg-[rgba(30,30,30,0.05)]" />
      </div>
      <div className="absolute hidden lg:block pointer-events-none" style={{ right: '8%', bottom: '20%', zIndex: 5 }}>
        <div className="w-[18px] h-[1px] bg-[rgba(30,30,30,0.05)] ml-auto" /><div className="w-[1px] h-[50px] bg-[rgba(30,30,30,0.05)] ml-auto" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" style={{ zIndex: 20 }}>
        <span className="text-mono text-[#CCCCCC] text-[11px] tracking-[0.15em]">SCROLL</span>
        <div className="w-[1px] h-[32px] bg-[rgba(30,30,30,0.1)] relative overflow-hidden">
          <div className="w-full bg-[#888888]" style={{ height: '10px', animation: 'sI 2.2s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes lr{0%{opacity:0;transform:translateY(60px) rotateX(50deg);filter:blur(14px)}100%{opacity:1;transform:translateY(0) rotateX(0deg);filter:blur(0px)}}
        .hero-letter{display:inline-block;opacity:0;animation:lr 0.7s cubic-bezier(0.16,1,0.3,1) forwards;transform-origin:center bottom}
        @keyframes sr{0%{opacity:0;transform:translateY(30px);filter:blur(8px)}100%{opacity:1;transform:translateY(0);filter:blur(0px)}}
        .subtitle-reveal{display:inline-block;opacity:0;animation:sr 0.8s cubic-bezier(0.16,1,0.3,1) forwards}
        @keyframes cA{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.5);opacity:0.2}}
        @keyframes cP{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.3);opacity:0.15}}
        @keyframes cC{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.8);opacity:0.3}}
        @keyframes fM1{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(30px,-20px)scale(1.1)}66%{transform:translate(-20px,15px)scale(0.95)}}
        @keyframes fM2{0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(-40px,-30px)scale(1.15)}}
        @keyframes sI{0%{transform:translateY(-100%)}100%{transform:translateY(320%)}}
      `}</style>
    </section>
  )
}
