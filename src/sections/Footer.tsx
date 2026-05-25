import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterColumn {
  header: string
  links: FooterLink[]
}

const COLUMNS: FooterColumn[] = [
  {
    header: 'PAGES',
    links: [
      { label: 'Home', href: '#/' },
      { label: 'Api Key', href: '#/api-key' },
      { label: 'Pricing', href: '#/pricing' },
      { label: 'Guide', href: '#/guide' },
    ],
  },
  {
    header: 'SOCIALS',
    links: [
      { label: 'Twitter', href: 'https://twitter.com', external: true },
      { label: 'Instagram', href: 'https://instagram.com', external: true },
      { label: 'Discord', href: 'https://discord.com', external: true },
    ],
  },
  {
    header: 'LEGAL',
    links: [
      { label: 'Privacy Policy', href: '#/privacy' },
      { label: 'Terms of Service', href: '#/terms' },
      { label: 'Cookie Policy', href: '#/cookies' },
    ],
  },
  {
    header: 'ACCOUNT',
    links: [
      { label: 'Sign Up', href: '#/signup' },
      { label: 'Log In', href: '#/login' },
      { label: 'Contact', href: 'mailto:support@thebigone.ai' },
    ],
  },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const columnsRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = columnsRef.current?.querySelectorAll('.footer-col')
      if (cols) {
        gsap.fromTo(cols, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
        })
      }
      gsap.fromTo(watermarkRef.current, { opacity: 0 }, {
        opacity: 1, duration: 1.2,
        scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
      })
    }, footerRef)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="bg-[#FBFBFB] border-t border-[rgba(30,30,30,0.12)] relative overflow-hidden">
      {/* Giant watermark */}
      <div
        ref={watermarkRef}
        className="footer-brand text-[#F0F0F0] absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-0 hidden md:flex"
        style={{ zIndex: 0 }}
      >
        THEBIGONE
      </div>

      <div className="container-main relative z-10" style={{ paddingTop: '144px', paddingBottom: '64px' }}>
        {/* Brand + Columns */}
        <div ref={columnsRef} className="flex flex-wrap gap-10 md:gap-16 mb-20">
          {/* Brand column */}
          <div className="footer-col w-full md:w-auto md:flex-1 opacity-0">
            <div className="font-display font-normal text-base uppercase tracking-[0.04em] text-[#1E1E1E]">
              THEBIGONE
            </div>
            <p className="text-body-xs text-[#999999] mt-4 max-w-[240px]">
              AI plugin for designers. Generate, edit, and enhance inside your tools.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.header} className="footer-col opacity-0">
              <div className="text-mono text-[#999999] mb-6">{col.header}</div>
              <ul className="flex flex-col gap-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-body-sm text-[#666666] hover:text-[#1E1E1E] transition-colors duration-300"
                      style={{ lineHeight: '2.2' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright bar */}
        <div className="border-t border-[rgba(30,30,30,0.12)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-body-xs text-[#999999]">
            © 2026 TheBigOne. All rights reserved.
          </span>
          <a
            href="mailto:support@thebigone.ai"
            className="text-body-xs text-[#666666] hover:text-[#1E1E1E] transition-colors duration-300"
          >
            support@thebigone.ai
          </a>
        </div>
      </div>
    </footer>
  )
}
