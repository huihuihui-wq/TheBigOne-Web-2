import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
}

export default function WelcomeModal({ isOpen, onClose, onStart }: WelcomeModalProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (isOpen) setStep(0)
  }, [isOpen])

  const steps = [
    {
      title: '🎉 Welcome Aboard!',
      content: (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/gold.png" alt="gold" className="w-8 h-8 object-contain animate-bounce" />
            <span className="font-display text-[32px] text-[#1E1E1E] tracking-[0.02em]">× 500</span>
          </div>
          <p className="text-body text-[#1E1E1E] mb-2">
            Congratulations! You've received
          </p>
          <p className="font-display text-[24px] text-[#1E1E1E] tracking-[0.02em] mb-4">
            500 Gold Coins
          </p>
          <p className="text-body-sm text-[#666666]">
            Experience credits to explore all AI features.
            Valid for 30 days.
          </p>
        </div>
      ),
      button: 'Next',
    },
    {
      title: '🚀 Start Creating Now',
      content: (
        <div className="text-center">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '🎨', label: 'Text to Image' },
              { icon: '✨', label: 'Inpainting' },
              { icon: '🖼️', label: 'Upscale' },
              { icon: '🔄', label: 'Style Transfer' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#F5F5F5] text-center"
                style={{ padding: '16px 8px' }}
              >
                <span className="block text-[24px] mb-1">{item.icon}</span>
                <span className="text-mono text-[10px] text-[#666666]">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-body-sm text-[#666666]">
            Your 500 gold coins are ready. Try generating your first AI artwork!
          </p>
        </div>
      ),
      button: 'Start Creating',
    },
    {
      title: '🔮 Join Beta Program',
      content: (
        <div className="text-center">
          <p className="text-body text-[#1E1E1E] mb-2">
            Join our exclusive beta community
          </p>
          <p className="text-body-sm text-[#666666] mb-6">
            Scan the QR code to join our WeChat group or Discord server.
          </p>

          {/* Two QR flip cards */}
          <div className="flex items-center justify-center gap-4">
            {/* WeChat Card */}
            <div className="group relative" style={{ width: '140px', height: '140px' }}>
              {/* Front: WeChat Icon */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E1E1E] transition-opacity duration-300 group-hover:opacity-0"
              >
                <img
                  src="/wechat-icon.png"
                  alt="WeChat"
                  style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                />
                <span className="text-mono text-[10px] text-white/60 uppercase tracking-[0.08em] mt-3">
                  WeChat
                </span>
              </div>
              {/* Back: QR Code */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-white border border-[rgba(30,30,30,0.08)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <img
                  src="/qr-contact.png"
                  alt="WeChat QR"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Discord Card */}
            <div className="group relative" style={{ width: '140px', height: '140px' }}>
              {/* Front: Discord Icon */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E1E1E] transition-opacity duration-300 group-hover:opacity-0"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.007.128 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span className="text-mono text-[10px] text-white/60 uppercase tracking-[0.08em] mt-3">
                  Discord
                </span>
              </div>
              {/* Back: QR Code */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-white border border-[rgba(30,30,30,0.08)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <img
                  src="/qr-discord.jpg"
                  alt="Discord QR"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          <p className="text-body-xs text-[#999999] mt-5">
            Your feedback shapes the future of creative AI.
          </p>
        </div>
      ),
      button: 'Got it',
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white w-full relative"
            style={{ maxWidth: '460px', padding: '48px 40px 40px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#999999] hover:text-[#1E1E1E] transition-colors"
            >
              <X size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="transition-all duration-300"
                  style={{
                    width: i === step ? '24px' : '6px',
                    height: '6px',
                    backgroundColor: i === step ? '#1E1E1E' : 'rgba(30, 30, 30, 0.15)',
                    borderRadius: i === step ? '3px' : '50%',
                  }}
                />
              ))}
            </div>

            {/* Title */}
            <h3
              className="text-display-subsection text-[#1E1E1E] text-center mb-6"
              style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
            >
              {current.title}
            </h3>

            {/* Content */}
            <div className="mb-8">
              {current.content}
            </div>

            {/* Button */}
            <button
              onClick={() => {
                if (isLast) {
                  onClose()
                  onStart()
                } else {
                  setStep(step + 1)
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-[#FFFFFF] font-body font-medium text-sm uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: '#1E1E1E', padding: '16px 32px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000000' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E' }}
            >
              {current.button}
              <ArrowRight size={14} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
