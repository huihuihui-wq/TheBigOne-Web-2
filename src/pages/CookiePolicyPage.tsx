import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Cookie, Settings, ShieldCheck, X } from 'lucide-react'

export default function CookiePolicyPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
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
              Cookie Policy
            </h1>
            <p className="text-body text-white/50 max-w-[560px]">
              This Cookie Policy explains how TheBigOne uses cookies and similar technologies.
            </p>
            <p className="text-mono text-white/30 mt-4">Last Updated: May 26, 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-main" style={{ paddingTop: '64px', paddingBottom: '120px' }}>
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col gap-12">
            {/* Section 1 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1E1E1E] flex items-center justify-center">
                  <Cookie size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <h2
                  className="font-display font-normal text-[#1E1E1E] uppercase pt-2"
                  style={{ fontSize: '20px', letterSpacing: '0.02em', lineHeight: 1.3 }}
                >
                  What Are Cookies
                </h2>
              </div>
              <div className="text-body text-[#666666] pl-[56px]" style={{ lineHeight: 1.8 }}>
                Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the website owners.

                In addition to cookies, we may use other similar technologies such as web beacons, pixel tags, and local storage to achieve similar purposes.
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1E1E1E] flex items-center justify-center">
                  <Settings size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <h2
                  className="font-display font-normal text-[#1E1E1E] uppercase pt-2"
                  style={{ fontSize: '20px', letterSpacing: '0.02em', lineHeight: 1.3 }}
                >
                  Types of Cookies We Use
                </h2>
              </div>
              <div className="text-body text-[#666666] pl-[56px]" style={{ lineHeight: 1.8 }}>
                <strong className="text-[#1E1E1E]">Essential Cookies:</strong>
                These cookies are necessary for the Service to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.

                <strong className="text-[#1E1E1E]">Functional Cookies:</strong>
                These cookies allow us to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.

                <strong className="text-[#1E1E1E]">Analytics Cookies:</strong>
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve our Service.

                <strong className="text-[#1E1E1E]">Authentication Cookies:</strong>
                These cookies maintain your login session and security tokens, allowing you to stay signed in as you navigate the Service.
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1E1E1E] flex items-center justify-center">
                  <ShieldCheck size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <h2
                  className="font-display font-normal text-[#1E1E1E] uppercase pt-2"
                  style={{ fontSize: '20px', letterSpacing: '0.02em', lineHeight: 1.3 }}
                >
                  Third-Party Cookies
                </h2>
              </div>
              <div className="text-body text-[#666666] pl-[56px]" style={{ lineHeight: 1.8 }}>
                We may allow third-party service providers to place cookies on your device. These providers include:

• <strong>Supabase</strong> — for authentication and database services
• <strong>Google Analytics</strong> — for website usage analytics (if enabled)
• <strong>Payment processors</strong> — for secure payment processing

These third parties may use cookies to collect information about your online activities over time and across different websites. We do not control these third-party cookies. Please review the privacy policies of these providers for more information.              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#1E1E1E] flex items-center justify-center">
                  <X size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <h2
                  className="font-display font-normal text-[#1E1E1E] uppercase pt-2"
                  style={{ fontSize: '20px', letterSpacing: '0.02em', lineHeight: 1.3 }}
                >
                  Managing Cookies
                </h2>
              </div>
              <div className="text-body text-[#666666] pl-[56px]" style={{ lineHeight: 1.8 }}>
                Most web browsers allow you to control cookies through their settings. You can:

• Delete existing cookies
• Block all cookies
• Allow cookies from specific sites
• Set preferences for different types of cookies

Please note that disabling essential cookies may prevent you from using certain features of the Service or accessing your account.

To learn more about managing cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="underline text-[#1E1E1E] hover:text-[#666666]">allaboutcookies.org</a>.
              </div>
            </section>
          </div>

          {/* Contact notice */}
          <div
            className="mt-16 p-6 border border-[rgba(30,30,30,0.12)] bg-white"
            style={{ borderLeft: '3px solid #1E1E1E' }}
          >
            <p className="text-body-sm text-[#1E1E1E] font-medium mb-2">
              If you have any questions about our Cookie Policy, please contact us at support@thebigone.ai.
            </p>
            <p className="text-body-xs text-[#999999]">
              You can also refer to our <a href="#/privacy" className="underline hover:text-[#1E1E1E]">Privacy Policy</a> for more information about how we handle your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
