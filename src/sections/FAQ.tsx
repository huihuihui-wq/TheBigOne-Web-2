import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FAQS = [
  {
    question: 'WHAT IS THEBIGONE AND HOW DOES IT WORK?',
    answer: 'TheBigOne is a multi-platform AI plugin that connects seamlessly with your favorite creative tools including PhotoShop, Figma, and Blender. It provides AI-powered features like real-time generative painting, smart inpainting, style transfer, and image generation directly inside your existing workflow.',
  },
  {
    question: 'WHICH PLATFORMS AND TOOLS ARE SUPPORTED?',
    answer: 'Currently, TheBigOne supports Adobe Photoshop, Figma, and Blender. We\'re continuously expanding our platform support and also offer APIs and SDKs for custom integrations with other tools in your workflow.',
  },
  {
    question: 'DO I NEED PRIOR AI EXPERIENCE TO USE THEBIGONE?',
    answer: 'Not at all. TheBigOne is designed for creators of all skill levels. Our intuitive interface integrates directly into the tools you already know, making AI-powered creation as simple as describing what you want.',
  },
  {
    question: 'HOW DO I INSTALL AND SET UP THE PLUGIN?',
    answer: 'Installation varies by platform: For Photoshop, install via Creative Cloud / Exchange and restart. For Figma, add from the Figma Community plugins. For Blender, install from our website. Each platform has a detailed setup guide in our Tutorial section.',
  },
  {
    question: 'WHAT AI MODELS ARE AVAILABLE FOR IMAGE GENERATION?',
    answer: 'We curate the best AI models including Flux 2 Pro, Seedream 4.5, and Nano Banana, among others. Our model selection is regularly updated to ensure you always have access to the highest quality generation capabilities.',
  },
  {
    question: 'IS THERE A FREE TRIAL OR PRICING PLAN?',
    answer: 'Yes, we offer a free tier with limited generations so you can try before you subscribe. Paid plans offer unlimited generations, priority processing, and access to all premium models. Visit our Pricing page for detailed plan information.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current, { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.8, ease: "power4.out",
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      const items = rightRef.current?.querySelectorAll('.faq-item')
      if (items) {
        gsap.fromTo(items, { x: 20, opacity: 0 }, {
          x: 0, opacity: 1, stagger: 0.1, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="faq" ref={sectionRef} className="section-padding bg-[#FBFBFB]">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left column */}
          <div ref={leftRef} className="w-full lg:w-[35%] opacity-0">
            <div className="label-bracket text-[#1E1E1E]">[06] [FAQ]</div>
            <h2 className="text-display-subsection text-[#1E1E1E] mt-6">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-body-sm text-[#666666] mt-4">
              We are here to help you with any questions you may have. If you don't find what you need, please contact us at{' '}
              <a href="mailto:support@thebigone.ai" className="text-[#1E1E1E] underline hover:no-underline">
                support@thebigone.ai
              </a>
            </p>
          </div>

          {/* Right column - Accordion */}
          <div ref={rightRef} className="w-full lg:w-[65%]">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="faq-item border-t border-[rgba(30,30,30,0.12)] opacity-0"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between py-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-mono text-[#999999] w-10 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display font-normal text-[clamp(16px,2vw,20px)] uppercase tracking-[0.04em] text-[#1E1E1E]">
                      {faq.question}
                    </span>
                  </div>
                  <span className="text-[#1E1E1E] flex-shrink-0 ml-4">
                    {openIndex === i ? (
                      <X size={20} strokeWidth={1} />
                    ) : (
                      <Plus size={20} strokeWidth={1} />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
                        opacity: { duration: 0.3, delay: 0.1 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pl-14 pb-6 max-w-[720px]">
                        <p className="text-body text-[#666666]">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {/* Last border */}
            <div className="section-divider" />
          </div>
        </div>
      </div>
    </section>
  )
}
