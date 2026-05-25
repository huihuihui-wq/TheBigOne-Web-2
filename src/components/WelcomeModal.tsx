import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, MessageCircle } from 'lucide-react'

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
          <div className="flex items-center justify-center gap-3 mb-6">
            {['Blender', 'Figma', 'Premiere'].map((name) => (
              <div
                key={name}
                className="bg-[#1E1E1E] text-white text-center"
                style={{ padding: '12px 16px' }}
              >
                <span className="text-mono text-[10px] uppercase tracking-[0.08em]">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-body text-[#1E1E1E] mb-3">
            Join our exclusive beta community
          </p>
          <p className="text-body-sm text-[#666666] mb-6">
            Get early access to Blender, Figma, and Premiere Pro plugins.
            Your feedback shapes the future of creative AI.
          </p>
          <div className="bg-[#F5F5F5] flex items-center gap-3" style={{ padding: '16px' }}>
            <MessageCircle size={20} className="text-[#1E1E1E]" />
            <div className="text-left">
              <span className="text-mono text-[10px] text-[#999999] block">WECHAT GROUP</span>
              <span className="font-body font-medium text-[14px] text-[#1E1E1E]">TheBigOne Beta</span>
            </div>
          </div>
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
