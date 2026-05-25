import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, KeyRound, LogOut } from 'lucide-react'
import type Lenis from 'lenis'
import type { RefObject } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface NavbarProps {
  lenisRef: RefObject<Lenis | null>
}

const PAGE_LINKS = [
  { label: 'HOME', path: '/' },
  { label: 'GUIDE', path: '/guide' },
  { label: 'PRICING', path: '/pricing' },
  { label: 'API KEY', path: '/api-key' },
]

export default function Navbar({ lenisRef }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userBalance, setUserBalance] = useState<number>(0)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isHomePage = location.pathname === '/'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  useEffect(() => {
    async function fetchBalance() {
      if (!isAuthenticated) {
        setUserBalance(0)
        return
      }
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const { data, error } = await supabase
          .from('user_balances')
          .select('balance')
          .eq('user_id', session.user.id)
          .maybeSingle()
        if (error) throw error
        setUserBalance(data?.balance || 0)
      } catch {
        setUserBalance(0)
      }
    }
    fetchBalance()
  }, [isAuthenticated])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogoClick = useCallback(() => {
    setMobileOpen(false)
    navigate('/')
    if (isHomePage && lenisRef.current) {
      lenisRef.current.scrollTo(0)
    }
  }, [isHomePage, lenisRef, navigate])

  const handleLogout = useCallback(async () => {
    setDropdownOpen(false)
    setMobileOpen(false)
    await logout()
    navigate('/')
  }, [logout, navigate])

  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          height: '72px',
          backgroundColor: scrolled ? 'rgba(251, 251, 251, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(30, 30, 30, 0.06)' : '1px solid transparent',
        }}
      >
        <div className="container-main h-full flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-nav text-[#1E1E1E] tracking-[0.08em]"
          >
            <img
              src="/logo.png"
              alt="TheBigOne"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            THEBIGONE
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* Page Links */}
            {!isAuthPage && PAGE_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="text-nav text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300"
                style={{
                  padding: '8px 16px',
                  backgroundColor: location.pathname === link.path ? '#1E1E1E' : 'transparent',
                  color: location.pathname === link.path ? '#FFFFFF' : '#1E1E1E',
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                {/* Gold Balance */}
                <button
                  onClick={() => navigate('/api-key')}
                  className="flex items-center gap-1.5 transition-opacity duration-300 hover:opacity-70"
                  title="View balance"
                >
                  <img
                    src="/gold.png"
                    alt="gold"
                    style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                  />
                  <span className="font-display text-[13px] text-[#1E1E1E] tracking-[0.02em]">
                    {userBalance.toFixed(2)}
                  </span>
                </button>

                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-70"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="object-cover"
                      style={{ width: '32px', height: '32px', borderRadius: 0 }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center bg-[#1E1E1E] text-white font-display"
                      style={{ width: '32px', height: '32px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em' }}
                    >
                      {user ? getInitials(user.name) : '?'}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 top-full bg-white"
                      style={{
                        marginTop: '8px',
                        minWidth: '220px',
                        border: '1px solid rgba(30, 30, 30, 0.06)',
                        boxShadow: '0 8px 32px rgba(30, 30, 30, 0.08)',
                        zIndex: 100,
                      }}
                    >
                      <div style={{ padding: '16px 20px' }}>
                        <p className="font-display text-[#1E1E1E] uppercase" style={{ fontWeight: 400, fontSize: '13px', letterSpacing: '0.08em' }}>
                          {user?.name}
                        </p>
                        <p className="text-body-xs text-[#666666] mt-1">{user?.email}</p>
                      </div>
                      <div style={{ height: '1px', backgroundColor: 'rgba(30, 30, 30, 0.06)' }} />
                      <button
                        onClick={() => { setDropdownOpen(false); navigate('/api-key') }}
                        className="w-full flex items-center gap-3 text-[#1E1E1E] hover:bg-[rgba(30,30,30,0.04)] transition-colors duration-200"
                        style={{ padding: '12px 20px' }}
                      >
                        <KeyRound size={14} strokeWidth={1.5} />
                        <span className="font-display uppercase" style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '0.08em' }}>API KEYS</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 text-[#1E1E1E] hover:bg-[rgba(30,30,30,0.04)] transition-colors duration-200"
                        style={{ padding: '12px 20px' }}
                      >
                        <LogOut size={14} strokeWidth={1.5} />
                        <span className="font-display uppercase" style={{ fontWeight: 400, fontSize: '12px', letterSpacing: '0.08em' }}>SIGN OUT</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-nav text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: location.pathname === '/login' ? '#1E1E1E' : 'transparent',
                    color: location.pathname === '/login' ? '#FFFFFF' : '#1E1E1E',
                  }}
                >
                  LOG IN
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-nav text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: location.pathname === '/signup' ? '#1E1E1E' : 'transparent',
                    color: location.pathname === '/signup' ? '#FFFFFF' : '#1E1E1E',
                  }}
                >
                  SIGN UP
                </button>
              </div>
            )}

            {/* Social Icons with QR Code */}
            <div className="hidden md:flex items-center gap-1 ml-2">
              {/* WeChat */}
              <div className="relative group">
                <button
                  className="w-9 h-9 flex items-center justify-center text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300"
                  aria-label="WeChat"
                >
                  <img
                    src="/wechat-icon.png"
                    alt="WeChat"
                    style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                  />
                </button>
                <div
                  className="absolute top-full opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(30, 30, 30, 0.06)',
                    boxShadow: '0 8px 32px rgba(30, 30, 30, 0.08)',
                    zIndex: 100,
                    width: '232px',
                  }}
                >
                  <img
                    src="/qr-contact.png"
                    alt="WeChat QR Code"
                    style={{ width: '200px', height: '200px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>

              {/* Discord */}
              <div className="relative group">
                <button
                  className="w-9 h-9 flex items-center justify-center text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300"
                  aria-label="Discord"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.007.128 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </button>
                <div
                  className="absolute top-full opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(30, 30, 30, 0.06)',
                    boxShadow: '0 8px 32px rgba(30, 30, 30, 0.08)',
                    zIndex: 100,
                    width: '232px',
                  }}
                >
                  <img
                    src="/qr-discord.jpg"
                    alt="Discord QR Code"
                    style={{ width: '200px', height: '200px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#1E1E1E]" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#FBFBFB] flex flex-col items-center justify-center"
          >
            <button className="absolute top-6 right-6 text-[#1E1E1E]" onClick={() => setMobileOpen(false)}>
              <X size={24} />
            </button>

            <div className="flex flex-col items-center gap-8">
              {isAuthenticated && user && (
                <div className="flex flex-col items-center gap-3 mb-4">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="object-cover" style={{ width: '48px', height: '48px', borderRadius: 0 }} />
                  ) : (
                    <div className="flex items-center justify-center bg-[#1E1E1E] text-white font-display" style={{ width: '48px', height: '48px', fontSize: '16px' }}>
                      {getInitials(user.name)}
                    </div>
                  )}
                  <p className="font-display text-[#1E1E1E] uppercase text-sm tracking-[0.08em]">{user.name}</p>
                  <p className="text-body-xs text-[#666666]">{user.email}</p>
                </div>
              )}

              {!isAuthPage && PAGE_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { setMobileOpen(false); navigate(link.path) }}
                  className="text-display-subsection text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300"
                  style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}
                >
                  {link.label}
                </button>
              ))}

              {isAuthenticated ? (
                <>
                  <button onClick={() => { setMobileOpen(false); navigate('/api-key') }} className="text-display-subsection text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>API KEYS</button>
                  <button onClick={handleLogout} className="text-display-subsection text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>SIGN OUT</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMobileOpen(false); navigate('/login') }} className="text-display-subsection text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>LOG IN</button>
                  <button onClick={() => { setMobileOpen(false); navigate('/signup') }} className="text-display-subsection text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300" style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>SIGN UP</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
