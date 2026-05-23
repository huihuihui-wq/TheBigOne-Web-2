import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Wand2, Image, Layers, Sparkles, RefreshCw, Download, Maximize2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const MODELS = [
  { id: 'flux-2-pro', name: 'FLUX 2 PRO', desc: 'Highest quality' },
  { id: 'seedream', name: 'SEEDREAM 4.5', desc: 'Fast generation' },
  { id: 'nano', name: 'NANO BANANA', desc: 'Lightweight' },
]

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1' },
  { id: '3:2', label: '3:2' },
  { id: '2:3', label: '2:3' },
  { id: '16:9', label: '16:9' },
]

const PRESETS = [
  'Cyberpunk cityscape at night, neon lights reflecting on wet streets, cinematic lighting',
  'Minimalist product photography, matte black bottle on marble surface, studio lighting',
  'Portrait of a woman in avant-garde fashion, dramatic shadows, monochrome',
  'Futuristic interface design, holographic UI elements, dark background',
]

const SAMPLE_IMAGES = [
  { id: 1, src: '/gen-text2image.jpg', prompt: 'Text to Image', model: 'FLUX 2 PRO' },
  { id: 2, src: '/gen-edittext.jpg', prompt: 'Edit to Image', model: 'SEEDREAM 4.5' },
  { id: 3, src: '/gen-text2model.jpg', prompt: 'Text to Model', model: 'NANO BANANA' },
  { id: 4, src: '/feature-generative.jpg', prompt: 'Generative Paint', model: 'FLUX 2 PRO' },
]

export default function ImageGeneratorDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeModel, setActiveModel] = useState(MODELS[0].id)
  const [activeRatio, setActiveRatio] = useState('1:1')
  const [prompt, setPrompt] = useState(PRESETS[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gen-heading', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.gen-panel', { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.0, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })
      gsap.fromTo('.gen-preview', { opacity: 0, x: 40 }, {
        opacity: 1, x: 0, duration: 1.0, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowPreview(true)
    }, 2000)
  }

  return (
    <section
      id="generator-demo"
      ref={sectionRef}
      className="relative w-full py-32 lg:py-44"
      style={{ background: '#FBFBFB' }}
    >
      <div className="container-main">
        {/* Header */}
        <div className="gen-heading text-center mb-16">
          <div className="label-bracket text-[#1E1E1E] mb-5">[IMAGE GENERATOR]</div>
          <h2 className="text-display-section text-[#1E1E1E] mb-5">
            CREATE WITH AI
          </h2>
          <p className="text-body text-[#666666] max-w-[560px] mx-auto">
            Type your idea, select a model, and watch your vision come to life. Professional-grade AI image generation at your fingertips.
          </p>
        </div>

        {/* Main layout: Control Panel + Preview */}
        <div className="gen-panel flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* LEFT: Control Panel */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
            <div className="border border-[rgba(30,30,30,0.12)] bg-white p-6 lg:p-8">

              {/* Model Selector */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-mono text-[#999999] text-[11px] uppercase tracking-[0.1em] mb-3">
                  <Layers size={14} strokeWidth={1.5} />
                  Model
                </label>
                <div className="flex flex-col gap-2">
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setActiveModel(model.id)}
                      className={`flex items-center gap-3 px-4 py-3 border text-left transition-all duration-200 ${
                        activeModel === model.id
                          ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                          : 'border-[rgba(30,30,30,0.1)] text-[#1E1E1E] hover:border-[rgba(30,30,30,0.3)]'
                      }`}
                    >
                      <Sparkles size={16} strokeWidth={1.5} />
                      <div>
                        <div className="font-display font-normal text-sm uppercase tracking-[0.04em]">
                          {model.name}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${activeModel === model.id ? 'text-[#AAAAAA]' : 'text-[#999999]'}`}>
                          {model.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-mono text-[#999999] text-[11px] uppercase tracking-[0.1em] mb-3">
                  <Wand2 size={14} strokeWidth={1.5} />
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full border border-[rgba(30,30,30,0.12)] bg-[#FAFAFA] p-4 text-[#1E1E1E] text-sm font-body resize-none focus:border-[#1E1E1E] focus:outline-none transition-colors"
                  placeholder="Describe your image..."
                />
                {/* Preset buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(preset)}
                      className="text-[11px] text-[#888888] border border-[rgba(30,30,30,0.08)] px-3 py-1.5 hover:border-[rgba(30,30,30,0.3)] hover:text-[#1E1E1E] transition-all font-body"
                    >
                      Preset {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-mono text-[#999999] text-[11px] uppercase tracking-[0.1em] mb-3">
                  <Image size={14} strokeWidth={1.5} />
                  Aspect Ratio
                </label>
                <div className="flex gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setActiveRatio(ratio.id)}
                      className={`flex-1 py-2.5 text-center font-display text-xs uppercase tracking-[0.04em] border transition-all duration-200 ${
                        activeRatio === ratio.id
                          ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                          : 'border-[rgba(30,30,30,0.1)] text-[#666666] hover:border-[rgba(30,30,30,0.3)]'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#1E1E1E] text-white font-display font-normal text-sm uppercase tracking-[0.04em] py-4 hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    GENERATE NOW
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Preview Area */}
          <div className="gen-preview flex-1 min-h-[500px]">
            {!showPreview ? (
              /* Empty state */
              <div className="w-full h-full min-h-[500px] border border-[rgba(30,30,30,0.08)] border-dashed flex flex-col items-center justify-center bg-[#FAFAFA]">
                <div className="w-16 h-16 border border-[rgba(30,30,30,0.1)] flex items-center justify-center mb-4">
                  <Image size={24} strokeWidth={1} className="text-[#CCCCCC]" />
                </div>
                <p className="text-mono text-[#CCCCCC] text-[11px] uppercase tracking-[0.15em]">
                  YOUR GENERATIONS WILL APPEAR HERE
                </p>
              </div>
            ) : (
              /* Generated images grid */
              <div className="grid grid-cols-2 gap-4 h-full">
                {SAMPLE_IMAGES.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative group overflow-hidden bg-[#F0F0F0] animate-fadeIn"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <img
                      src={img.src}
                      alt={img.prompt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-white text-xs font-body mb-1">{img.prompt}</p>
                      <p className="text-[#AAAAAA] text-[10px] font-mono uppercase tracking-[0.1em]">{img.model}</p>
                      <div className="flex gap-3 mt-3">
                        <button className="text-white/70 hover:text-white transition-colors">
                          <Maximize2 size={14} />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors">
                          <RefreshCw size={14} />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="mt-16 pt-10 border-t border-[rgba(30,30,30,0.06)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '4', label: 'AI Models', desc: 'Optimized for different needs' },
              { num: '<3s', label: 'Avg. Speed', desc: 'Fast generation time' },
              { num: '2K', label: 'Resolution', desc: 'Up to 2048px output' },
              { num: '99%', label: 'Uptime', desc: 'Reliable service' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[32px] lg:text-[40px] font-display font-extralight text-[#1E1E1E]">
                  {stat.num}
                </div>
                <div className="text-mono text-[#1E1E1E] text-[11px] uppercase tracking-[0.1em] mt-1">
                  {stat.label}
                </div>
                <div className="text-[12px] text-[#999999] font-body mt-1">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
