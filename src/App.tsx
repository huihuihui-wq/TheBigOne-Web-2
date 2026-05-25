import { HashRouter, Routes, Route } from 'react-router'
import { useEffect, useRef } from 'react'
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

gsap.registerPlugin(ScrollTrigger)

function AppContent() {
  const lenisRef = useRef<Lenis | null>(null)

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
