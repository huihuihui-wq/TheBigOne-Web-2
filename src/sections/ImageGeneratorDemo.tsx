import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Wand2, Image, Layers, Sparkles, RefreshCw, Download, Maximize2, AlertCircle, Coins, Wallet, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { MODEL_CONFIGS } from '../lib/model-configs'

gsap.registerPlugin(ScrollTrigger)

/* ───────────────────────────────────────────
   Models & Config
   ─────────────────────────────────────────── */

// Extract text-to-image models from the shared config
const TEXT2IMAGE_KEYS = Object.entries(MODEL_CONFIGS)
  .filter(([, cfg]) => cfg.mode === 'text_to_image')
  .map(([key]) => key)

const MODELS = TEXT2IMAGE_KEYS.map((key) => {
  // Build a short description from the model key + known coins (from pricing doc)
  const coinMap: Record<string, number> = {
    anima_turbo: 10,
    anima_base: 15,
    z_image_base: 20,
    gpt_image_2: 35,
    nanobanana: 50,
  }
  const coins = coinMap[key] ?? 0
  const name = key
    .split('_')
    .map((w) => w.toUpperCase())
    .join(' ')
  return {
    id: key,
    name,
    desc: `${coins} coins`,
  }
})

const BIZYAIR_CREATE_URL = 'https://api.bizyair.cn/w/v1/webapp/task/openapi/create'

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', width: 1024, height: 1024 },
  { id: '3:2', label: '3:2', width: 1280, height: 854 },
  { id: '2:3', label: '2:3', width: 854, height: 1280 },
  { id: '16:9', label: '16:9', width: 1280, height: 720 },
]

const PRESETS = [
  'Cyberpunk cityscape at night, neon lights reflecting on wet streets, cinematic lighting',
  'Minimalist product photography, matte black bottle on marble surface, studio lighting',
  'Portrait of a woman in avant-garde fashion, dramatic shadows, monochrome',
  'Futuristic interface design, holographic UI elements, dark background',
]

/* ───────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────── */

function getInputValues(modelKey: string, prompt: string, ratio: { id: string; width: number; height: number }) {
  const cfg = MODEL_CONFIGS[modelKey]
  if (!cfg) return {}

  const values: Record<string, any> = {}
  const n = cfg.nodes

  if (n.prompt) values[n.prompt] = prompt
  if (n.seed) values[n.seed] = Math.floor(Math.random() * 1_000_000_000_000)
  if (n.batchSize) values[n.batchSize] = 1
  if (n.aspectRatio) values[n.aspectRatio] = ratio.id
  if (n.width) values[n.width] = ratio.width
  if (n.height) values[n.height] = ratio.height

  return values
}

async function pollResult(
  requestId: string,
  token: string,
  onProgress: (msg: string) => void
): Promise<string> {
  const maxAttempts = 30
  const interval = 2000

  for (let i = 0; i < maxAttempts; i++) {
    onProgress(`Polling result… (${i + 1}/${maxAttempts})`)

    const res = await fetch(`/api/generate/proxy/result?request_id=${encodeURIComponent(requestId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Poll failed (HTTP ${res.status})`)
    }

    const data = await res.json()

    const status = data.status ?? data.task_status ?? data.state ?? ''

    if (status === 'Success' || status === 'success') {
      const url =
        data.outputs?.[0] ??
        data.output?.[0] ??
        data.image_url ??
        data.url ??
        data.data?.[0]?.url ??
        null
      if (url) return url
      throw new Error('Task succeeded but no image URL found.')
    }

    if (status === 'Failed' || status === 'failed' || status === 'Error') {
      throw new Error(data.error || 'Generation failed on upstream.')
    }

    await new Promise((r) => setTimeout(r, interval))
  }

  throw new Error('Polling timed out. Please check again later.')
}

/* ───────────────────────────────────────────
   Component
   ─────────────────────────────────────────── */

export default function ImageGeneratorDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeModel, setActiveModel] = useState(MODELS[0]?.id ?? '')
  const [activeRatio, setActiveRatio] = useState('1:1')
  const [prompt, setPrompt] = useState(PRESETS[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [pollMsg, setPollMsg] = useState<string | null>(null)

  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [deductionInfo, setDeductionInfo] = useState<{
    deducted: string
    balance: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { isAuthenticated } = useAuth()

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

  const handleGenerate = useCallback(async () => {
    if (!activeModel) return

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)
    setDeductionInfo(null)
    setPollMsg(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Please sign in to generate images.')
        setIsGenerating(false)
        return
      }

      const ratio = ASPECT_RATIOS.find((r) => r.id === activeRatio) || ASPECT_RATIOS[0]
      const generationId = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const cfg = MODEL_CONFIGS[activeModel]

      const createRes = await fetch('/api/generate/proxy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: BIZYAIR_CREATE_URL,
          headers: {
            Authorization: 'Bearer ${BIZYAIR_API_KEY}',
          },
          data: {
            web_app_id: cfg.webAppId,
            input_values: getInputValues(activeModel, prompt, ratio),
          },
          model_key: activeModel,
          generation_id: generationId,
        }),
      })

      const deductedCoins = createRes.headers.get('X-Deducted-Coins')
      const balanceAfter = createRes.headers.get('X-Balance-After')

      if (createRes.status === 402) {
        setError('Insufficient balance. Please top up your account.')
        setIsGenerating(false)
        return
      }

      if (!createRes.ok) {
        const errData = await createRes.json().catch(() => ({}))
        setError(errData.error || `Request failed (HTTP ${createRes.status})`)
        setIsGenerating(false)
        return
      }

      const createData = await createRes.json()
      const requestId = createData.request_id ?? createData.task_id ?? createData.id ?? null

      if (!requestId) {
        setError('Generation started but no request ID was returned.')
        setIsGenerating(false)
        return
      }

      const imageUrl = await pollResult(requestId, session.access_token, setPollMsg)
      setGeneratedImage(imageUrl)

      if (deductedCoins || balanceAfter) {
        setDeductionInfo({
          deducted: deductedCoins || '—',
          balance: balanceAfter || '—',
        })
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setIsGenerating(false)
      setPollMsg(null)
    }
  }, [activeModel, activeRatio, prompt])

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
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-[#1E1E1E] text-white font-display font-normal text-sm uppercase tracking-[0.04em] py-4 hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    {pollMsg || 'GENERATING...'}
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    GENERATE NOW
                  </>
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-start gap-2 text-[13px] text-[#CC0000]">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Deduction Info */}
              {deductionInfo && (
                <div className="mt-4 border border-[rgba(30,30,30,0.08)] bg-[#FAFAFA] p-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#555555]">
                      <Coins size={12} strokeWidth={2} />
                      <span className="font-body">Deducted:</span>
                      <span className="font-display text-[#1E1E1E]">{deductionInfo.deducted}</span>
                    </div>
                    <div className="w-px h-3 bg-[rgba(30,30,30,0.12)]" />
                    <div className="flex items-center gap-1.5 text-[12px] text-[#555555]">
                      <Wallet size={12} strokeWidth={2} />
                      <span className="font-body">Balance:</span>
                      <span className="font-display text-[#1E1E1E]">{deductionInfo.balance}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Preview Area */}
          <div className="gen-preview flex-1 min-h-[500px]">
            {!generatedImage ? (
              <div className="w-full h-full min-h-[500px] border border-[rgba(30,30,30,0.08)] border-dashed flex flex-col items-center justify-center bg-[#FAFAFA]">
                <div className="w-16 h-16 border border-[rgba(30,30,30,0.1)] flex items-center justify-center mb-4">
                  {isGenerating ? (
                    <Loader size={24} className="animate-spin text-[#1E1E1E]" />
                  ) : (
                    <Image size={24} strokeWidth={1} className="text-[#CCCCCC]" />
                  )}
                </div>
                <p className="text-mono text-[#CCCCCC] text-[11px] uppercase tracking-[0.15em]">
                  {isGenerating ? (pollMsg || 'GENERATING...') : 'YOUR GENERATIONS WILL APPEAR HERE'}
                </p>
                {!isAuthenticated && !isGenerating && (
                  <p className="mt-2 text-[12px] text-[#999999] font-body">
                    Sign in to start generating
                  </p>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[500px] bg-[#F0F0F0] overflow-hidden group">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-body mb-1 line-clamp-2">{prompt}</p>
                  <p className="text-[#AAAAAA] text-[10px] font-mono uppercase tracking-[0.1em]">
                    {MODELS.find((m) => m.id === activeModel)?.name || activeModel}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => window.open(generatedImage, '_blank')}
                      className="text-white/70 hover:text-white transition-colors"
                      title="Open in new tab"
                    >
                      <Maximize2 size={14} />
                    </button>
                    <a
                      href={generatedImage}
                      download={`thebigone-${Date.now()}.png`}
                      className="text-white/70 hover:text-white transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </a>
                    <button
                      onClick={handleGenerate}
                      className="text-white/70 hover:text-white transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="mt-16 pt-10 border-t border-[rgba(30,30,30,0.06)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '8', label: 'AI Models', desc: 'Optimized for different needs' },
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
    </section>
  )
}
