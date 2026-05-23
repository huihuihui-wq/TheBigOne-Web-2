import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero from '../sections/Hero'
import ImageGeneratorDemo from '../sections/ImageGeneratorDemo'
import PlatformFeatures from '../sections/PlatformFeatures'
import AIPainting from '../sections/AIPainting'
import ImageGeneration from '../sections/ImageGeneration'
import HowToUse from '../sections/HowToUse'
import Gallery from '../sections/Gallery'
import FAQ from '../sections/FAQ'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  return (
    <main ref={mainRef}>
      <Hero />
      <ImageGeneratorDemo />
      <PlatformFeatures />
      <AIPainting />
      <ImageGeneration />
      <HowToUse />
      <Gallery />
      <FAQ />
    </main>
  )
}
