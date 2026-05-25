import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  Scale,
  Shield,
  Wallet,
  Image,
  AlertTriangle,
  RotateCcw,
  Gavel,
  Mail,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  {
    id: 'acceptance',
    icon: Scale,
    title: 'Acceptance of Terms',
    content: `By accessing or using TheBigOne ("the Service", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you may not access or use the Service.

These Terms constitute a legally binding agreement between you and TheBigOne regarding your use of the Service. We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on this page with a revised "Last Updated" date. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.`,
  },
  {
    id: 'eligibility',
    icon: Shield,
    title: 'Eligibility and Accounts',
    content: `You must be at least 13 years of age (or the minimum age of digital consent in your jurisdiction) to use the Service. By using the Service, you represent and warrant that you meet this eligibility requirement.

To access certain features, you must create an account. You agree to:

• Provide accurate, current, and complete information during registration.
• Maintain the security of your password and accept all risks of unauthorized access.
• Notify us immediately of any breach of security or unauthorized use of your account.
• Accept responsibility for all activities that occur under your account.

We reserve the right to suspend or terminate your account if any information provided is inaccurate, false, or incomplete, or if you violate these Terms.`,
  },
  {
    id: 'credits',
    icon: Wallet,
    title: 'Credits and Payments',
    content: `TheBigOne operates on a credit-based system. Upon registration, new users receive 500 welcome credits. Additional credits may be purchased through our pricing plans.

• Credits are non-refundable, non-transferable, and have no cash value.
• Credits are consumed when you use the Service to generate, edit, or enhance images.
• Credit consumption rates are displayed before each operation.
• We reserve the right to adjust credit pricing and consumption rates with reasonable notice.
• Fraudulent chargebacks or payment disputes may result in account suspension.

All payments are processed securely through our payment providers. By making a purchase, you agree to the terms of the applicable payment processor.`,
  },
  {
    id: 'content',
    icon: Image,
    title: 'User Content and AI-Generated Outputs',
    content: `You retain ownership of any images, text prompts, or other materials ("User Content") that you upload to the Service.

When you use the Service, you grant us a limited license to process your User Content solely for the purpose of providing the Service to you.

AI-Generated Outputs:
• You are granted a worldwide, non-exclusive, royalty-free license to use AI-generated outputs for both personal and commercial purposes.
• We do not claim ownership of AI-generated outputs.
• Due to the nature of AI generation, similar outputs may be produced for different users. We do not guarantee uniqueness.
• You may not use the Service to generate content that violates applicable laws or these Terms, including but not limited to: illegal content, hate speech, harassment, violence, sexually explicit material involving minors, or content that infringes third-party intellectual property rights.

We reserve the right to review, monitor, and remove any User Content or outputs that violate these Terms.`,
  },
  {
    id: 'restrictions',
    icon: AlertTriangle,
    title: 'Prohibited Uses',
    content: `You agree not to use the Service to:

• Violate any applicable local, state, national, or international law or regulation.
• Infringe upon the intellectual property rights of others.
• Transmit any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable.
• Impersonate or attempt to impersonate TheBigOne, a TheBigOne employee, another user, or any other person or entity.
• Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.
• Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service.
• Circumvent or attempt to circumvent any credit or usage limits.
• Reverse engineer, decompile, or disassemble any portion of the Service.

Violation of these restrictions may result in immediate termination of your account and legal action.`,
  },
  {
    id: 'termination',
    icon: Gavel,
    title: 'Termination and Suspension',
    content: `We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including but not limited to:

• Breach of these Terms.
• Fraudulent or abusive activity.
• Non-payment of fees.
• Extended periods of inactivity.

Upon termination:
• Your right to use the Service will immediately cease.
• All licenses and rights granted to you under these Terms will immediately terminate.
• Any credits remaining in your account will be forfeited without refund.
• Provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.

You may terminate your account at any time by contacting us at support@thebigone.ai.`,
  },
  {
    id: 'disclaimer',
    icon: RotateCcw,
    title: 'Disclaimer and Limitation of Liability',
    content: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.

We do not warrant that:
• The Service will be uninterrupted, timely, secure, or error-free.
• The results obtained from the use of the Service will be accurate or reliable.
• Any errors in the Service will be corrected.

AI GENERATION DISCLAIMER:
The Service uses artificial intelligence to generate images. Outputs may contain imperfections, inaccuracies, or unexpected results. We do not guarantee that generated images will meet your specific requirements or expectations.

TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THEBIGONE, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
• YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
• ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE.
• ANY CONTENT OBTAINED FROM THE SERVICE.
• UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.`,
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact Us',
    content: `If you have any questions about these Terms, please contact us at:

Email: support@thebigone.ai

We will make every effort to respond to your inquiry within 48 business hours.

These Terms are governed by and construed in accordance with the laws of the jurisdiction in which TheBigOne operates, without regard to its conflict of law provisions.`,
  },
]

export default function TermsPage() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      const items = contentRef.current?.querySelectorAll('.terms-section')
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 85%',
            },
          }
        )
      }
    }, contentRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      {/* Header */}
      <div className="bg-[#1E1E1E] text-white" style={{ paddingTop: '120px', paddingBottom: '64px' }}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="text-white/60 hover:text-white text-body-sm mb-8 transition-colors duration-300 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
              Back
            </button>
            <h1
              className="font-display font-normal text-white uppercase"
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              Terms of Service
            </h1>
            <p className="text-body text-white/50 max-w-[560px]">
              Please read these terms carefully before using TheBigOne. By using our service, you agree to these terms.
            </p>
            <p className="text-mono text-white/30 mt-4">Last Updated: May 26, 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-main" style={{ paddingTop: '64px', paddingBottom: '120px' }}>
        <div ref={contentRef} className="max-w-[800px] mx-auto">
          <div className="flex flex-col gap-12">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="terms-section opacity-0 scroll-mt-24"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#1E1E1E] flex items-center justify-center">
                      <Icon size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                    <h2
                      className="font-display font-normal text-[#1E1E1E] uppercase pt-2"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '0.02em',
                        lineHeight: 1.3,
                      }}
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div
                    className="text-body text-[#666666] pl-[56px] whitespace-pre-line"
                    style={{ lineHeight: 1.8 }}
                  >
                    {section.content}
                  </div>
                </section>
              )
            })}
          </div>

          {/* Agreement notice */}
          <div
            className="mt-16 p-6 border border-[rgba(30,30,30,0.12)] bg-white"
            style={{ borderLeft: '3px solid #1E1E1E' }}
          >
            <p className="text-body-sm text-[#1E1E1E] font-medium mb-2">
              By creating an account or using TheBigOne, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
            <p className="text-body-xs text-[#999999]">
              If you do not agree, please do not use the Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
