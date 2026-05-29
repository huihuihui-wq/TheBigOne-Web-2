import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import StripeCheckoutModal from '../components/StripeCheckoutModal'

gsap.registerPlugin(ScrollTrigger)

const PLANS = [
  {
    id: 'free',
    name: 'FREE',
    subtitle: 'For creators starting out',
    priceMonthly: 0,
    priceYearly: 0,
    icon: Sparkles,
    popular: false,
    cta: 'GET STARTED',
    features: [
      '500 coins / month',
      'All AI models (GPT Image 2, NanoBanana & more)',
      'Up to 4K resolution',
      'Image editing, inpainting & upscaling',
      'Character upscale & Anime upscale',
      'Photoshop plugin support',
      'Local history: unlimited (device only, not cloud)',
      'Standard generation speed',
    ],
    unavailable: [
      'Commercial license',
      'Priority queue',
      'Figma / Blender / Premiere plugins',
      'Batch processing',
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    subtitle: 'For professional creators',
    priceMonthly: 19,
    priceYearly: 180,
    icon: Zap,
    popular: true,
    cta: 'GET STARTED',
    features: [
      '5,000 coins / month',
      'All AI models (GPT Image 2, NanoBanana & more)',
      'Up to 4K resolution',
      'Advanced editing, inpainting & outpainting',
      'Character upscale & Anime upscale',
      'Photoshop plugin + Figma / Blender / Premiere',
      'Batch processing: Limited (5 images)',
      'Local history: unlimited (device only, not cloud)',
      '2× accelerated generation',
      'Commercial license',
      'Email support',
    ],
    unavailable: [
      'Team management',
      'White-label solution',
      'Dedicated account manager',
    ],
  },
  {
    id: 'studio',
    name: 'STUDIO',
    subtitle: 'For teams and studios',
    priceMonthly: 39,
    priceYearly: 390,
    icon: Crown,
    popular: false,
    cta: 'GET STARTED',
    features: [
      '10,000 coins / month',
      'All AI models (GPT Image 2, NanoBanana & more)',
      'Up to 4K resolution',
      'Full editing suite & batch processing (Unlimited)',
      'Character upscale & Anime upscale',
      'Full plugin suite: PS / Figma / Blender / Premiere',
      'Local history: unlimited (device only, not cloud)',
      '4× accelerated + priority queue',
      'Full commercial license',
      'SSO & team management (coming soon)',
      'Priority support',
    ],
    unavailable: [],
  },
]

const FAQ_ITEMS = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. You can upgrade, downgrade, or cancel your plan at any time. When upgrading, you will be charged the prorated difference. When downgrading, the new rate applies at the next billing cycle.',
  },
  {
    q: 'What payment methods do we accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and Link. All transactions are processed securely via Stripe.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Yes. The Pro plan includes a 7-day free trial with full access to all features. No credit card required to start. You can cancel anytime during the trial without being charged.',
  },
  {
    q: 'What happens if I exceed my monthly coin limit?',
    a: 'You can purchase additional coin packs at any time, or upgrade to a higher plan instantly. Unused coins do not roll over to the next month.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 14-day money-back guarantee for all paid plans. If you are not satisfied, contact support within 14 days of your purchase for a full refund.',
  },
  {
    q: 'Can I use generated images commercially?',
    a: 'Pro and Studio plans include a full commercial license. Free plan images are for personal use only. Studio plans also include indemnification coverage.',
  },
]

function CoinTooltip({ popular }: { popular: boolean }) {
  return (
    <div className="group/tooltip relative inline-block ml-1 align-middle">
      <span className={`text-[11px] cursor-help transition-colors ${popular ? 'text-[#888888]' : 'text-[#999999] group-hover/card:text-[#888888]'}`}>ⓘ</span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[260px] p-3 bg-[#1E1E1E] text-white text-[11px] font-body leading-relaxed opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none">
        Coins are TheBigOne's unified credits. All models share the same coin balance. 1 CNY = 100 coins. Unused coins reset monthly.
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E1E1E]" />
      </div>
    </div>
  )
}

export default function PricingPage() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isYearly, setIsYearly] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [modalPlan, setModalPlan] = useState<{ id: 'pro'; interval: 'monthly' | 'yearly' } | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-heading', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.pricing-toggle', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power4.out', delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.pricing-card', { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', stagger: 0.15,
        scrollTrigger: { trigger: '.pricing-cards', start: 'top 75%' },
      })
      gsap.fromTo('.pricing-faq', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: '.pricing-faq', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleCheckout = async (planId: string) => {
    // Free plan: redirect to signup
    if (planId === 'free') {
      window.location.href = '/#/signup'
      return
    }

    // Studio: contact sales
    if (planId === 'studio') {
      window.open('mailto:sales@thebigone.ai?subject=Studio Plan Inquiry', '_blank')
      return
    }

    // Paid plans: open embedded checkout modal
    if (planId === 'pro') {
      if (!isAuthenticated) {
        window.location.href = '/#/signup'
        return
      }

      setModalPlan({
        id: 'pro',
        interval: isYearly ? 'yearly' : 'monthly',
      })
      return
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ paddingTop: '72px', background: '#FBFBFB', minHeight: '100dvh' }}
    >
      {/* Hero Header */}
      <div className="py-24 lg:py-32 text-center">
        <div className="container-main">
          <div className="pricing-heading">
            <div className="label-bracket text-[#1E1E1E] mb-5">[PRICING]</div>
            <h1 className="text-display-section text-[#1E1E1E] mb-5">
              SIMPLE, TRANSPARENT PRICING
            </h1>
            <p className="text-body text-[#666666] max-w-[560px] mx-auto">
              Choose the plan that fits your creative workflow. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="pricing-toggle flex items-center justify-center gap-4 mt-10">
            <span className={`font-display text-sm uppercase tracking-[0.08em] transition-colors ${!isYearly ? 'text-[#1E1E1E]' : 'text-[#999999]'}`}>
              MONTHLY
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-[56px] h-[28px] transition-colors"
              style={{
                background: isYearly ? '#1E1E1E' : '#E5E5E5',
                border: '1px solid rgba(30,30,30,0.12)',
              }}
            >
              <div
                className="absolute top-[2px] w-[22px] h-[22px] bg-white transition-all duration-300"
                style={{ left: isYearly ? '30px' : '2px' }}
              />
            </button>
            <span className={`font-display text-sm uppercase tracking-[0.08em] transition-colors ${isYearly ? 'text-[#1E1E1E]' : 'text-[#999999]'}`}>
              YEARLY
            </span>
            <span className="font-display text-[11px] uppercase tracking-[0.08em] text-white bg-[#1E1E1E] px-2 py-1">
              SAVE UP TO 21%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-cards container-main pb-12 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan) => {
            const Icon = plan.icon
            const price = isYearly ? plan.priceYearly : plan.priceMonthly
            const monthlyEquiv = plan.priceYearly > 0 ? Math.round(plan.priceYearly / 12) : 0
            const savePct =
              plan.id === 'pro'
                ? '21%'
                : plan.id === 'studio'
                  ? '17%'
                  : ''
            return (
              <div
                key={plan.id}
                className={`pricing-card relative border transition-all duration-300 group/card ${
                  plan.popular
                    ? 'border-[#1E1E1E] bg-[#1E1E1E]'
                    : 'border-[rgba(30,30,30,0.12)] bg-white hover:border-[#1E1E1E] hover:bg-[#1E1E1E]'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#1E1E1E] font-display text-[11px] uppercase tracking-[0.1em] px-4 py-1">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 lg:p-10">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 flex items-center justify-center transition-colors ${plan.popular ? 'bg-white/10' : 'bg-[rgba(30,30,30,0.04)] group-hover/card:bg-white/10'}`}>
                      <Icon size={20} strokeWidth={1.5} className={`transition-colors ${plan.popular ? 'text-white' : 'text-[#1E1E1E] group-hover/card:text-white'}`} />
                    </div>
                    <div>
                      <h3 className={`font-display text-lg uppercase tracking-[0.08em] transition-colors ${plan.popular ? 'text-white' : 'text-[#1E1E1E] group-hover/card:text-white'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-[12px] font-body transition-colors ${plan.popular ? 'text-[#AAAAAA]' : 'text-[#999999] group-hover/card:text-[#AAAAAA]'}`}>
                        {plan.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-display text-[48px] font-extralight transition-colors ${plan.popular ? 'text-white' : 'text-[#1E1E1E] group-hover/card:text-white'}`}>
                        ${isYearly && plan.priceYearly > 0 ? monthlyEquiv : price}
                      </span>
                      <span className={`font-body text-sm transition-colors ${plan.popular ? 'text-[#AAAAAA]' : 'text-[#999999] group-hover/card:text-[#AAAAAA]'}`}>
                        /month
                      </span>
                    </div>
                    {isYearly && plan.priceYearly > 0 && (
                      <p className={`text-[11px] font-body mt-1 transition-colors ${plan.popular ? 'text-[#888888]' : 'text-[#999999] group-hover/card:text-[#888888]'}`}>
                        Billed annually (${plan.priceYearly}/year) · Save {savePct}
                      </p>
                    )}
                    {plan.priceYearly === 0 && plan.priceMonthly > 0 && (
                      <p className={`text-[11px] font-body mt-1 transition-colors ${plan.popular ? 'text-[#888888]' : 'text-[#999999] group-hover/card:text-[#888888]'}`}>
                        Monthly billing only
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    className={`w-full font-display text-sm uppercase tracking-[0.04em] py-4 transition-all duration-300 flex items-center justify-center gap-2 mb-8 ${
                      plan.popular
                        ? 'bg-white text-[#1E1E1E] hover:bg-[#F0F0F0]'
                        : 'bg-[#1E1E1E] text-white hover:bg-black group-hover/card:bg-white group-hover/card:text-[#1E1E1E]'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={14} />
                  </button>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className={`font-display text-[11px] uppercase tracking-[0.1em] mb-4 transition-colors ${plan.popular ? 'text-[#888888]' : 'text-[#999999] group-hover/card:text-[#888888]'}`}>
                      INCLUDED
                    </p>
                    {plan.features.map((feature) => (
                      <div key={feature}>
                        <div className="flex items-start gap-3">
                          <Check size={14} strokeWidth={2} className={`mt-0.5 transition-colors ${plan.popular ? 'text-white' : 'text-[#1E1E1E] group-hover/card:text-white'}`} />
                          <div className="flex items-center flex-wrap">
                            <span className={`text-[13px] font-body transition-colors ${plan.popular ? 'text-[#DDDDDD]' : 'text-[#555555] group-hover/card:text-[#DDDDDD]'}`}>
                              {feature}
                            </span>
                            {feature.includes('coins / month') && <CoinTooltip popular={plan.popular} />}
                          </div>
                        </div>
                        {feature.includes('Local history') && (
                          <p className={`text-[11px] font-body mt-1 ml-[26px] transition-colors ${plan.popular ? 'text-[#888888]' : 'text-[#999999] group-hover/card:text-[#888888]'}`}>
                            All history is stored locally on your device. No cloud upload. Clearing browser cache or uninstalling the plugin will erase history.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Unavailable features */}
                  {plan.unavailable.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-[rgba(30,30,30,0.08)]">
                      <p className={`font-display text-[11px] uppercase tracking-[0.1em] mb-4 transition-colors ${plan.popular ? 'text-[#666666]' : 'text-[#BBBBBB] group-hover/card:text-[#666666]'}`}>
                        NOT INCLUDED
                      </p>
                      {plan.unavailable.map((feature) => (
                        <div key={feature} className="flex items-start gap-3 opacity-40">
                          <div className="w-[14px] h-[14px] flex items-center justify-center mt-0.5">
                            <div className={`w-[10px] h-[1px] ${plan.popular ? 'bg-[#666666]' : 'bg-[#CCCCCC]'}`} />
                          </div>
                          <span className={`text-[13px] font-body ${plan.popular ? 'text-[#888888]' : 'text-[#AAAAAA]'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="container-main py-16 lg:py-24 border-t border-[rgba(30,30,30,0.06)]">
        <div className="pricing-faq">
          <h2 className="text-display-subsection text-[#1E1E1E] text-center mb-12">
            FEATURE COMPARISON
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[rgba(30,30,30,0.12)]">
                  <th className="text-left font-display text-[11px] uppercase tracking-[0.1em] text-[#999999] py-4 px-4">Feature</th>
                  <th className="text-center font-display text-[11px] uppercase tracking-[0.1em] text-[#999999] py-4 px-4">Free</th>
                  <th className="text-center font-display text-[11px] uppercase tracking-[0.1em] text-[#999999] py-4 px-4 bg-[rgba(30,30,30,0.02)]">Pro</th>
                  <th className="text-center font-display text-[11px] uppercase tracking-[0.1em] text-[#999999] py-4 px-4">Studio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Monthly Price', '$0 / month', '$19 / month', '$39 / month'],
                  ['Monthly Coins', '500', '5,000', '10,000'],
                  ['AI Models', 'All', 'All', 'All'],
                  ['Max Resolution', 'Up to 4K', 'Up to 4K', 'Up to 4K'],
                  ['Commercial License', '—', '✓', '✓'],
                  ['Image Editing & Inpainting', 'Basic', 'Advanced + Outpainting', 'Full Suite'],
                  ['Upscaling', 'Character + Anime', 'Character + Anime', 'Character + Anime'],
                  ['Batch Processing', '—', 'Limited (5)', 'Unlimited'],
                  ['Generation Speed', 'Standard', '2× Accelerated', '4× + Priority'],
                  ['Photoshop Plugin', '✓', '✓', '✓'],
                  ['Figma / Blender / Premiere', '—', 'Beta', 'Beta'],
                  ['Local History', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['Cloud History', '—', '—', '—'],
                  ['Team Management', '—', '—', 'Coming Soon'],
                  ['SSO / SAML', '—', '—', 'Coming Soon'],
                  ['Support', 'Community', 'Email', 'Priority'],
                ].map(([feature, free, pro, studio], i) => (
                  <tr key={feature} className={`border-b border-[rgba(30,30,30,0.06)] ${i % 2 === 0 ? 'bg-[rgba(30,30,30,0.01)]' : ''}`}>
                    <td className="py-4 px-4 text-[13px] font-body text-[#555555]">{feature}</td>
                    <td className="text-center py-4 px-4 text-[13px] font-body text-[#999999]">{free}</td>
                    <td className="text-center py-4 px-4 text-[13px] font-body text-[#1E1E1E] bg-[rgba(30,30,30,0.02)]">{pro}</td>
                    <td className="text-center py-4 px-4 text-[13px] font-body text-[#1E1E1E]">{studio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container-main py-16 lg:py-24 border-t border-[rgba(30,30,30,0.06)]">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-display-subsection text-[#1E1E1E] text-center mb-12">
            BILLING FAQ
          </h2>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border border-[rgba(30,30,30,0.1)]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[rgba(30,30,30,0.02)] transition-colors"
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-[11px] text-[#AAAAAA] uppercase tracking-[0.1em]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[13px] uppercase tracking-[0.04em] text-[#1E1E1E]">
                      {item.q}
                    </span>
                  </span>
                  <span className="font-display text-[18px] text-[#999999] w-6 text-center">
                    {openFaq === i ? '×' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pl-[52px]">
                    <p className="text-[14px] font-body text-[#666666] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="container-main py-16 lg:py-24 border-t border-[rgba(30,30,30,0.06)]">
        <div className="text-center">
          <div className="label-bracket text-[#1E1E1E] mb-5">[STILL HAVE QUESTIONS?]</div>
          <h2 className="text-display-subsection text-[#1E1E1E] mb-5">
            LET'S TALK
          </h2>
          <p className="text-body text-[#666666] max-w-[480px] mx-auto mb-8">
            Our team is here to help you find the perfect plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:sales@thebigone.ai"
              className="bg-[#1E1E1E] text-white font-display font-normal text-sm uppercase tracking-[0.04em] px-10 py-4 hover:bg-black transition-all duration-300 inline-flex items-center gap-2"
            >
              CONTACT SALES <ArrowRight size={14} />
            </a>
            <button
              onClick={() => window.open('https://calendly.com/thebigone', '_blank')}
              className="border border-[rgba(30,30,30,0.2)] text-[#1E1E1E] font-display font-normal text-sm uppercase tracking-[0.04em] px-10 py-3.5 hover:bg-[rgba(30,30,30,0.04)] transition-all duration-300"
            >
              SCHEDULE A DEMO
            </button>
          </div>
        </div>
      </div>

      {/* Stripe Embedded Checkout Modal */}
      {modalPlan && (
        <StripeCheckoutModal
          isOpen={!!modalPlan}
          onClose={() => setModalPlan(null)}
          planId={modalPlan.id}
          billingInterval={modalPlan.interval}
          onComplete={() => {
            // Optionally refresh subscription status or navigate
            window.location.reload()
          }}
        />
      )}

      {/* Organic shape decoration */}
      <div className="absolute pointer-events-none opacity-[0.03]" style={{ right: '5%', top: '20%', zIndex: 0 }}>
        <img src="/organic-shape-1.png" alt="" className="w-[300px] h-auto" style={{ filter: 'grayscale(100%)' }} />
      </div>
    </section>
  )
}
