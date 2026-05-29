import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { X, Loader2 } from 'lucide-react'
import { createEmbeddedCheckout } from '../lib/stripe'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null

interface StripeCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  planId: 'pro'
  billingInterval: 'monthly' | 'yearly'
  onComplete?: () => void
}

export default function StripeCheckoutModal({
  isOpen,
  onClose,
  planId,
  billingInterval,
  onComplete,
}: StripeCheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setClientSecret(null)
      setError(null)
      setLoading(false)
      return
    }

    if (!stripePromise) {
      setError('Stripe is not configured. Please contact support.')
      return
    }

    // Fetch client secret when modal opens
    setLoading(true)
    setError(null)
    createEmbeddedCheckout({ planId, billingInterval })
      .then(({ clientSecret }) => {
        setClientSecret(clientSecret)
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to initialize checkout')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [isOpen, planId, billingInterval])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[520px] max-h-[92vh] bg-white shadow-2xl overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(30,30,30,0.08)] shrink-0">
          <h3 className="font-display text-sm uppercase tracking-[0.08em] text-[#1E1E1E]">
            Secure Checkout
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[rgba(30,30,30,0.04)] transition-colors"
          >
            <X size={18} className="text-[#999999]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <p className="text-red-500 text-sm mb-6 text-center">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  createEmbeddedCheckout({ planId, billingInterval })
                    .then(({ clientSecret }) => setClientSecret(clientSecret))
                    .catch((err: any) => setError(err.message || 'Failed to initialize checkout'))
                    .finally(() => setLoading(false))
                }}
                className="bg-[#1E1E1E] text-white font-display text-sm uppercase tracking-[0.04em] px-8 py-3 hover:bg-black transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading || !clientSecret ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#1E1E1E] mb-4" />
              <p className="text-[13px] text-[#999999] font-body">Preparing your checkout...</p>
            </div>
          ) : stripePromise ? (
            <div className="p-4">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{
                  clientSecret,
                  onComplete: () => {
                    onComplete?.()
                    onClose()
                  },
                }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
