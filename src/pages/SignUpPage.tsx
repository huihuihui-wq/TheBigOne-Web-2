import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import WelcomeModal from '../components/WelcomeModal'

/* ───────────────────────────────────────────
   Google "G" SVG Icon
   ─────────────────────────────────────────── */

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}

/* ───────────────────────────────────────────
   Animation Variants
   ─────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

/* ───────────────────────────────────────────
   Component: SignUpPage
   ─────────────────────────────────────────── */

export default function SignUpPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [shakePassword, setShakePassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)

  /* ── Google OAuth Sign Up ── */
  const handleGoogleSignUp = useCallback(async () => {
    setIsLoading(true)
    setFormError('')
    const redirectTo = `${window.location.origin}${window.location.pathname}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) {
      setFormError(error.message || 'Google sign-up failed')
      setIsLoading(false)
    }
  }, [])

  /* ── Form Submit ── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setPasswordError('')
      setFormError('')
      setSignupSuccess('')

      if (!fullName.trim() || !email.trim() || !password.trim()) return

      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match')
        setShakePassword(true)
        setTimeout(() => setShakePassword(false), 500)
        return
      }

      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters')
        setShakePassword(true)
        setTimeout(() => setShakePassword(false), 500)
        return
      }

      if (!agreedToTerms) {
        alert('Please agree to the Terms of Service and Privacy Policy')
        return
      }

      setIsLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { username: fullName.trim() } },
      })
      setIsLoading(false)

      if (error) {
        setFormError(error.message || 'Sign up failed.')
        return
      }

      if (data?.session) {
        // Auto-confirmed: grant 500 welcome gold coins
        try {
          await supabase.from('user_balances').upsert({
            user_id: data.session.user.id,
            balance: 500,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
        } catch {
          // Ignore balance grant errors; user can still proceed
        }
        await supabase.auth.signOut()
        setShowWelcome(true)
        return
      }

      setSignupSuccess('Account created. Please check your email to verify, then sign in.')
    },
    [fullName, email, password, confirmPassword, agreedToTerms]
  )

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FBFBFB' }}>
      {/* ═══════════════ LEFT SIDE (decorative) ═══════════════ */}
      <div
        className="hidden lg:flex lg:w-[40%] relative overflow-hidden items-center justify-center"
        style={{ backgroundColor: '#1E1E1E' }}
      >
        {/* Background watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        >
          <span
            className="font-display text-white text-center leading-none"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(80px, 12vw, 160px)',
              letterSpacing: '0.02em',
            }}
          >
            THE
            <br />
            BIG
            <br />
            ONE
          </span>
        </div>

        {/* Floating organic shape */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative z-10"
        >
          <img
            src="/organic-hero.png"
            alt=""
            className="animate-float"
            style={{
              width: '280px',
              height: 'auto',
              filter: 'brightness(0.9)',
            }}
          />
        </motion.div>

        {/* Tagline */}
        <div className="absolute bottom-12 left-0 right-0 text-center z-10">
          <p
            className="font-display text-white uppercase"
            style={{
              fontWeight: 200,
              fontSize: '14px',
              letterSpacing: '0.12em',
            }}
          >
            CREATIVE INTELLIGENCE. UNLOCKED.
          </p>
        </div>
      </div>

      {/* ═══════════════ RIGHT SIDE (form) ═══════════════ */}
      <div className="flex-1 flex items-center justify-center relative" style={{ backgroundColor: '#FBFBFB' }}>
        {/* Top-right link */}
        <div
          className="absolute top-6 right-6 flex items-center gap-2"
          style={{ padding: '0 clamp(24px, 5vw, 80px)' }}
        >
          <span className="text-body-sm text-[#666666]">Already have an account?</span>
          <button
            onClick={() => navigate('/login')}
            className="font-display text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300 uppercase"
            style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '0.08em' }}
          >
            SIGN IN
          </button>
        </div>

        {/* Form container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
          style={{ maxWidth: '420px', padding: '0 24px', paddingTop: '80px', paddingBottom: '60px' }}
        >
          {/* Bracket label */}
          <motion.span variants={itemVariants} className="label-bracket text-[#1E1E1E] block" style={{ marginBottom: '16px' }}>
            [SIGN UP]
          </motion.span>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-display-subsection text-[#1E1E1E]"
            style={{ marginBottom: '12px' }}
          >
            CREATE YOUR ACCOUNT
          </motion.h1>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-body-sm text-[#666666]" style={{ marginBottom: '32px' }}>
            Join thousands of creators using AI to transform their workflow.
          </motion.p>

          {/* Google Sign Up */}
          <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(30, 30, 30, 0.12)',
                padding: '16px 32px',
              }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(30, 30, 30, 0.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
            >
              {isLoading ? (
                <Loader size={18} className="animate-spin text-[#1E1E1E]" />
              ) : (
                <GoogleIcon size={18} />
              )}
              <span
                className="font-display text-[#1E1E1E] uppercase"
                style={{ fontWeight: 400, fontSize: '13px', letterSpacing: '0.04em' }}
              >
                CONTINUE WITH GOOGLE
              </span>
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
            style={{ marginBottom: '24px' }}
          >
            <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(30, 30, 30, 0.12)' }} />
            <span
              className="font-display text-[#999999] uppercase"
              style={{ fontWeight: 400, fontSize: '11px', letterSpacing: '0.1em' }}
            >
              OR
            </span>
            <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(30, 30, 30, 0.12)' }} />
          </motion.div>

          {/* Form feedback */}
          {formError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <span className="text-body-xs" style={{ color: '#CC0000' }}>{formError}</span>
            </motion.div>
          )}
          {signupSuccess && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <span className="text-body-xs" style={{ color: '#1E1E1E' }}>{signupSuccess}</span>
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
              <label
                className="font-display text-[#1E1E1E] uppercase block"
                style={{
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                FULL NAME
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Name"
                className="w-full text-body text-[#1E1E1E] placeholder:text-[#CCCCCC] outline-none transition-colors duration-300 focus:border-[#1E1E1E]"
                style={{
                  border: '1px solid rgba(30, 30, 30, 0.12)',
                  backgroundColor: '#FFFFFF',
                  padding: '14px 16px',
                  fontSize: '14px',
                }}
                required
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
              <label
                className="font-display text-[#1E1E1E] uppercase block"
                style={{
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-body text-[#1E1E1E] placeholder:text-[#CCCCCC] outline-none transition-colors duration-300 focus:border-[#1E1E1E]"
                style={{
                  border: '1px solid rgba(30, 30, 30, 0.12)',
                  backgroundColor: '#FFFFFF',
                  padding: '14px 16px',
                  fontSize: '14px',
                }}
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
              <label
                className="font-display text-[#1E1E1E] uppercase block"
                style={{
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError('')
                  }}
                  placeholder="Min 8 characters"
                  className="w-full text-body text-[#1E1E1E] placeholder:text-[#CCCCCC] outline-none transition-colors duration-300 focus:border-[#1E1E1E]"
                  style={{
                    border: '1px solid rgba(30, 30, 30, 0.12)',
                    backgroundColor: '#FFFFFF',
                    padding: '14px 48px 14px 16px',
                    fontSize: '14px',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1E1E1E] transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              variants={itemVariants}
              animate={shakePassword ? { x: [0, -8, 8, -8, 8, 0] } : undefined}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: passwordError ? '8px' : '20px' }}
            >
              <label
                className="font-display text-[#1E1E1E] uppercase block"
                style={{
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setPasswordError('')
                  }}
                  placeholder="Repeat password"
                  className="w-full text-body text-[#1E1E1E] placeholder:text-[#CCCCCC] outline-none transition-colors duration-300 focus:border-[#1E1E1E]"
                  style={{
                    border: passwordError
                      ? '1px solid #CC0000'
                      : '1px solid rgba(30, 30, 30, 0.12)',
                    backgroundColor: '#FFFFFF',
                    padding: '14px 48px 14px 16px',
                    fontSize: '14px',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1E1E1E] transition-colors duration-300"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Password Error */}
            <AnimatePresence>
              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: '16px' }}
                >
                  <span className="text-body-xs" style={{ color: '#CC0000' }}>
                    {passwordError}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms Checkbox */}
            <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  className="flex-shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{
                    width: '18px',
                    height: '18px',
                    border: agreedToTerms
                      ? '1px solid #1E1E1E'
                      : '1px solid rgba(30, 30, 30, 0.3)',
                    backgroundColor: agreedToTerms ? '#1E1E1E' : 'transparent',
                    marginTop: '2px',
                  }}
                  onClick={() => setAgreedToTerms((v) => !v)}
                >
                  {agreedToTerms && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="font-display text-[#1E1E1E] uppercase"
                  style={{
                    fontWeight: 400,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    lineHeight: 1.5,
                  }}
                >
                  I AGREE TO THE{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Terms of Service coming soon')
                    }}
                    className="underline hover:text-[#666666] transition-colors duration-300"
                  >
                    TERMS OF SERVICE
                  </button>{' '}
                  AND{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Privacy Policy coming soon')
                    }}
                    className="underline hover:text-[#666666] transition-colors duration-300"
                  >
                    PRIVACY POLICY
                  </button>
                </span>
              </label>
            </motion.div>

            {/* Create Account Button */}
            <motion.div variants={itemVariants} style={{ marginBottom: '32px' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-[#FFFFFF] font-body font-medium text-sm uppercase tracking-[0.04em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#1E1E1E',
                  padding: '16px',
                }}
                onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E' }}
              >
                {isLoading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>
            </motion.div>
          </form>

          {/* Bottom Sign In Link */}
          <motion.div variants={itemVariants} className="text-center">
            <span className="text-body-sm text-[#666666]">ALREADY HAVE AN ACCOUNT? </span>
            <button
              onClick={() => navigate('/login')}
              className="font-display text-[#1E1E1E] hover:underline transition-all duration-300 uppercase"
              style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '0.04em' }}
            >
              SIGN IN
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStart={() => navigate('/login')}
      />
    </div>
  )
}
