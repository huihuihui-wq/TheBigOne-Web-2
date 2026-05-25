import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ApiKeyPage from './pages/ApiKeyPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import PricingPage from './pages/PricingPage'
import GuidePage from './pages/GuidePage'
import Footer from './sections/Footer'
import WelcomeModal from './components/WelcomeModal'

gsap.registerPlugin(ScrollTrigger)

function AppContent() {
  const lenisRef = useRef<Lenis | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf as any)
    }
  }, [])

  // Check for welcome modal flag on route change (set after successful registration)
  useEffect(() => {
    if (localStorage.getItem('showWelcome') === 'true') {
      setShowWelcome(true)
    }
  }, [location.pathname])

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    localStorage.removeItem('showWelcome')
  }

  return (
    <div>
      <Navbar lenisRef={lenisRef} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/api-key" element={<ApiKeyPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
      <Footer />
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
        onStart={() => {
          handleWelcomeClose()
          navigate('/api-key')
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  )
}
