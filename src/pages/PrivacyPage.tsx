import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
  Eye,
  Database,
  Lock,
  Share2,
  Cookie,
  Globe,
  UserX,
  Mail,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  {
    id: 'overview',
    icon: Eye,
    title: 'Overview',
    content: `TheBigOne ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and AI image generation service (collectively, the "Service").

We take your privacy seriously and are transparent about our data practices. This policy applies to all users of the Service, regardless of location.

By using the Service, you consent to the collection and use of your information as described in this Privacy Policy. If you do not agree with this policy, please do not use the Service.`,
  },
  {
    id: 'collect',
    icon: Database,
    title: 'Information We Collect',
    content: `We collect the following types of information:

Account Information:
• Email address
• Authentication credentials (passwords are hashed and never stored in plaintext)
• Account creation date and activity logs

Usage Data:
• Images you upload for processing
• Text prompts you provide
• AI-generated outputs
• Credit consumption history
• API request logs (timestamps, endpoints, response status)

Technical Data:
• IP address
• Browser type and version
• Operating system
• Device information
• Referring website
• Pages visited and time spent

Payment Information:
• We do not store your full credit card details on our servers.
• Payment processing is handled by secure third-party providers.
• We retain transaction records (amount, date, plan type) for accounting purposes.`,
  },
  {
    id: 'use',
    icon: Lock,
    title: 'How We Use Your Information',
    content: `We use the information we collect for the following purposes:

To Provide the Service:
• Process your images and generate AI outputs
• Manage your account and credits
• Authenticate your identity
• Respond to your support requests

To Improve the Service:
• Analyze usage patterns to improve performance
• Train and fine-tune our AI models (note: we do not use your personal images for public training datasets without explicit consent)
• Debug technical issues
• Develop new features

To Communicate With You:
• Send account-related notifications (password resets, security alerts)
• Provide customer support
• Send promotional emails (only with your consent; you can opt out at any time)

For Legal Compliance:
• Comply with applicable laws and regulations
• Respond to lawful requests from authorities
• Protect our rights, privacy, safety, or property`,
  },
  {
    id: 'share',
    icon: Share2,
    title: 'Information Sharing and Third Parties',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:

Service Providers:
We engage trusted third-party companies to perform functions on our behalf, including:
• Supabase (database and authentication hosting)
• Cloud storage and CDN providers
• Payment processors
• Analytics providers

These providers have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.

Legal Requirements:
We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).

Business Transfers:
If TheBigOne is involved in a merger, acquisition, or asset sale, your personal information may be transferred. We will provide notice before your personal information is transferred and becomes subject to a different privacy policy.`,
  },
  {
    id: 'security',
    icon: Lock,
    title: 'Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal information:

• All data transmission is encrypted using TLS/SSL.
• Database access is protected by Row Level Security (RLS) policies.
• Passwords are hashed using industry-standard algorithms.
• API endpoints require JWT authentication.
• Regular security audits and vulnerability assessments.

Despite these measures, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.

In the event of a data breach, we will notify affected users within 72 hours of discovery, as required by applicable law.`,
  },
  {
    id: 'retention',
    icon: UserX,
    title: 'Data Retention and Deletion',
    content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:

• Account information: retained while your account is active.
• Uploaded images and prompts: retained for 30 days after generation, then automatically deleted (unless you save them to your account).
• Generated outputs: retained while linked to your account.
• Usage logs: retained for 12 months for analytics and billing purposes.
• Payment records: retained for 7 years for tax and accounting compliance.

You have the right to:
• Access the personal information we hold about you.
• Request correction of inaccurate information.
• Request deletion of your personal information (right to be forgotten).
• Request a copy of your data in a portable format.

To exercise these rights, please contact us at support@thebigone.ai. We will respond to your request within 30 days.`,
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: 'Cookies and Tracking Technologies',
    content: `We use cookies and similar tracking technologies to enhance your experience on our Service:

Essential Cookies:
These are necessary for the Service to function properly, such as maintaining your authentication session and security tokens.

Analytics Cookies:
We use analytics tools to understand how visitors interact with our website. This helps us improve the Service. All analytics data is aggregated and anonymized where possible.

You can control cookies through your browser settings. However, disabling essential cookies may prevent you from using certain features of the Service.

For more information, please see our Cookie Policy.`,
  },
  {
    id: 'international',
    icon: Globe,
    title: 'International Data Transfers',
    content: `Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction.

Our service providers operate globally. By using the Service, you consent to the transfer of your information to countries that may have different data protection standards than your own.

We ensure that any international transfers are subject to appropriate safeguards, such as standard contractual clauses approved by relevant authorities.`,
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Email: support@thebigone.ai

We are committed to resolving any privacy concerns you may have. If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.`,
  },
]

export default function PrivacyPage() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const ctx = gsap.context(() => {
      const items = contentRef.current?.querySelectorAll('.privacy-section')
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
              Privacy Policy
            </h1>
            <p className="text-body text-white/50 max-w-[560px]">
              We value your privacy. This policy describes how we collect, use, and protect your personal information.
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
                  className="privacy-section opacity-0 scroll-mt-24"
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
              Your privacy is important to us. If you have any concerns about how we handle your data, please contact us at support@thebigone.ai.
            </p>
            <p className="text-body-xs text-[#999999]">
              We will never sell your personal information to third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
