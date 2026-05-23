import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, KeyRound, LogOut } from 'lucide-react'
import type Lenis from 'lenis'
import type { RefObject } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  lenisRef: RefObject<Lenis | null>
}

const PAGE_LINKS = [
  { label: 'HOME', path: '/' },
  { label: 'PRICING', path: '/pricing' },
  { label: 'API KEY', path: '/api-key' },
]

export default function Navbar({ lenisRef }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isHomePage = location.pathname === '/'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

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
            className="text-nav text-[#1E1E1E] tracking-[0.08em]"
          >
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
              <div className="relative" ref={dropdownRef}>
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
