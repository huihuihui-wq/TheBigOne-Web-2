import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock,
  Key,
  Copy,
  Trash2,
  Check,
  ArrowRight,
  Loader,
  AlertCircle,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { isToday, isYesterday, subDays, isSameDay, format } from 'date-fns'
import { Calendar } from '../components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'

gsap.registerPlugin(ScrollTrigger)

/* ───────────────────────────────────────────
   Types
   ─────────────────────────────────────────── */

interface License {
  id: string
  name: string
  license_key: string
  status: 'active' | 'revoked' | 'expired'
  created_at: string
}

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
  showProgress?: boolean
}

/* ───────────────────────────────────────────
   Constants
   ─────────────────────────────────────────── */

const FUNC_URL = 'https://fwusxlammxgowaxdubcm.supabase.co/functions/v1'

// NOTE: usageData, usageLabels, and recentRequests are now fetched dynamically
// from Supabase. Placeholder constants removed to avoid confusion.
// TODO: Replace empty states with real data once usage_logs table is created.

/* ───────────────────────────────────────────
   Tab type
   ─────────────────────────────────────────── */

type TabId = 'keys' | 'billing' | 'usage'

/* ───────────────────────────────────────────
   Component: ApiKeyPage
   ─────────────────────────────────────────── */

export default function ApiKeyPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('keys')

  /* ── License Keys State ── */
  const [licenses, setLicenses] = useState<License[]>([])
  const [licensesLoading, setLicensesLoading] = useState(false)
  const [licensesError, setLicensesError] = useState<string | null>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    visible: false,
    showProgress: false,
  })
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedTopUp, setSelectedTopUp] = useState<number | null>(null)
  const [userBalance, setUserBalance] = useState<number>(0)
  const [balanceLoading, setBalanceLoading] = useState(false)

  const [usageLogs, setUsageLogs] = useState<any[]>([])
  const [usageLogsLoading, setUsageLogsLoading] = useState(false)

  /* ── Date filter for usage logs ── */
  type DateFilterType = 'all' | 'today' | 'yesterday' | '7days' | '30days' | 'custom'
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('all')
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined)

  const getFilteredLogs = useCallback(() => {
    if (!usageLogs.length) return []
    const now = new Date()
    return usageLogs.filter((log) => {
      const logDate = new Date(log.created_at)
      switch (dateFilterType) {
        case 'today':
          return isToday(logDate)
        case 'yesterday':
          return isYesterday(logDate)
        case '7days':
          return logDate >= subDays(now, 7)
        case '30days':
          return logDate >= subDays(now, 30)
        case 'custom':
          return customDate ? isSameDay(logDate, customDate) : true
        default:
          return true
      }
    })
  }, [usageLogs, dateFilterType, customDate])

  const filteredLogs = getFilteredLogs()

  const dateFilterButtons: { key: DateFilterType; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'today', label: 'TODAY' },
    { key: 'yesterday', label: 'YESTERDAY' },
    { key: '7days', label: '7 DAYS' },
    { key: '30days', label: '30 DAYS' },
  ]

  const pageRef = useRef<HTMLDivElement>(null)

  /* ── Fetch Licenses ── */
  const fetchLicenses = useCallback(async () => {
    setLicensesLoading(true)
    setLicensesError(null)
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLicenses(data || [])
    } catch (err: any) {
      setLicensesError(err.message || 'Failed to load license keys')
    } finally {
      setLicensesLoading(false)
    }
  }, [])

  /* ── Fetch User Balance ── */
  const fetchUserBalance = useCallback(async () => {
    setBalanceLoading(true)
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
    } catch (err: any) {
      console.error('Failed to load balance:', err.message)
      setUserBalance(0)
    } finally {
      setBalanceLoading(false)
    }
  }, [])

  /* ── Fetch Usage Logs ── */
  const fetchUsageLogs = useCallback(async () => {
    setUsageLogsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data, error } = await supabase
        .from('balance_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('type', 'deduct')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      setUsageLogs(data || [])
    } catch (err: any) {
      console.error('Failed to load usage logs:', err.message)
      setUsageLogs([])
    } finally {
      setUsageLogsLoading(false)
    }
  }, [])

  /* ── Initial load ── */
  useEffect(() => {
    if (isAuthenticated) {
      fetchLicenses()
      fetchUserBalance()
      fetchUsageLogs()
    }
  }, [isAuthenticated, fetchLicenses, fetchUserBalance, fetchUsageLogs])

  /* ── Scroll-triggered reveals ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              once: true,
            },
          }
        )
      })
    }, pageRef)

    return () => ctx.revert()
  }, [activeTab, isAuthenticated])

  /* ── Toast system with progress ── */
  const hideToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    setToast((prev) => ({ ...prev, visible: false, showProgress: false }))
  }, [])

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success', duration = 2500) => {
    hideToast()
    // Force a micro-task flush so the previous hide renders before showing again
    setTimeout(() => {
      setToast({ message, type, visible: true, showProgress: false })
      toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, duration)
    }, 0)
  }, [hideToast])

  const showProgressToast = useCallback((message: string, duration = 1500) => {
    hideToast()
    setTimeout(() => {
      setToast({ message, type: 'success', visible: true, showProgress: true })
      toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false, showProgress: false }))
      }, duration)
    }, 0)
  }, [hideToast])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  /* ── Copy License Key (with fallback) ── */
  const handleCopyKey = useCallback(async (keyValue: string) => {
    let copied = false
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(keyValue)
        copied = true
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = keyValue
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          copied = true
        } catch {}
        document.body.removeChild(textArea)
      }
    } catch {
      copied = false
    }

    if (copied) {
      showToast('License key copied to clipboard!', 'success')
    } else {
      showToast('Copy failed. Please copy manually.', 'error')
    }
  }, [showToast])

  /* ── Create License Key (Edge Function) ── */
  const handleCreateKey = useCallback(async () => {
    const name = newKeyName.trim()
    if (!name) return
    setIsCreating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        showToast('Please sign in first', 'error')
        setIsCreating(false)
        return
      }

      // ── Frontend duplicate-name guard ──
      const { data: existing } = await supabase
        .from('licenses')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('name', name)
        .maybeSingle()

      if (existing) {
        showToast(`You already have a key named "${name}". Please use a different name.`, 'error')
        setIsCreating(false)
        return
      }

      const res = await fetch(`${FUNC_URL}/generate-key`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      setNewKeyName('')
      setShowCreateModal(false)
      await fetchLicenses()
      // Show progress toast for 3s after creation
      showProgressToast('License key created successfully!')
    } catch (err: any) {
      showToast('Create failed: ' + (err.message || 'Unknown error'), 'error')
    } finally {
      setIsCreating(false)
    }
  }, [newKeyName, showToast, showProgressToast, fetchLicenses])

  /* ── Delete License Key ── */
  const handleDeleteKey = useCallback(async (id: string) => {
    if (!confirm('确定删除？插件将无法激活。')) return
    try {
      const { error } = await supabase.from('licenses').delete().eq('id', id)
      if (error) throw error
      await fetchLicenses()
      showToast('License key deleted successfully', 'info')
    } catch (err: any) {
      showToast('Delete failed: ' + (err.message || 'Unknown error'), 'error')
    }
  }, [showToast, fetchLicenses])

  const activeKeysCount = licenses.filter((k) => k.status === 'active').length
  const totalRequests = 0  // TODO: 接入真实请求统计表后替换
  const balance = userBalance

  const tabs: { id: TabId; label: string }[] = [
    { id: 'keys', label: 'LICENSE KEYS' },
    { id: 'billing', label: 'BILLING & TOP-UP' },
    { id: 'usage', label: 'USAGE DETAILS' },
  ]

  const topUpOptions = [10, 25, 50, 100]

  /* ── Helpers ── */
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toISOString().split('T')[0]
  }

  const statusLabel = (s: string) => {
    if (s === 'active') return 'ACTIVE'
    if (s === 'revoked') return 'REVOKED'
    return 'EXPIRED'
  }

  const statusStyle = (s: string) => {
    if (s === 'active') return { backgroundColor: '#1E1E1E', color: '#FFFFFF' }
    return { backgroundColor: '#E0E0E0', color: '#999999' }
  }

  const toastIcon = () => {
    if (toast.type === 'error') return <AlertCircle size={16} className="text-[#FF4444]" />
    return <Check size={16} />
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FBFBFB]" style={{ paddingTop: '72px' }}>
      {/* ═══════════════ Page Header ═══════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#FBFBFB', padding: '96px 0 80px' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none hidden lg:block"
          style={{ width: '400px' }}>
          <img src="/organic-shape-2.png" alt="" className="w-full h-auto animate-float" />
        </div>

        <div className="container-main">
          <span className="label-bracket text-[#1E1E1E] block gsap-reveal">[LICENSE KEY MANAGEMENT]</span>
          <h1 className="text-display-section text-[#1E1E1E] mt-4 gsap-reveal">
            MANAGE YOUR KEYS
          </h1>
          <p className="text-body-sm text-[#666666] mt-6 max-w-[640px] gsap-reveal">
            Create and manage secure License Keys to activate TheBigONE plugins across your creative workflow.
          </p>
        </div>
      </section>

      {/* ═══════════════ Main Content ═══════════════ */}
      <section className="container-main" style={{ paddingBottom: '144px' }}>
        <div className="relative">
          {/* ───── Sign-In Overlay ───── */}
          {!isAuthenticated && (
            <div className="absolute inset-0 z-10 flex items-center justify-center"
              style={{ minHeight: '600px', backgroundColor: 'rgba(251, 251, 251, 0.85)', backdropFilter: 'blur(8px)' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border text-center"
                style={{
                  borderColor: 'rgba(30, 30, 30, 0.06)',
                  padding: '64px 48px',
                  maxWidth: '440px',
                  width: '100%',
                }}
              >
                <Lock size={48} className="mx-auto text-[#1E1E1E] mb-6" strokeWidth={1} />
                <h2 className="text-display-subsection text-[#1E1E1E]" style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>
                  SIGN IN REQUIRED
                </h2>
                <p className="text-body-sm text-[#666666] mt-4">
                  Please log in to manage your License Keys, view usage, and top up your balance.
                </p>
                <div className="flex flex-col items-center gap-4 mt-8">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center justify-center gap-2 text-[#FFFFFF] font-body font-medium text-sm uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02]"
                    style={{ backgroundColor: '#1E1E1E', padding: '16px 32px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000000' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E' }}
                  >
                    LOG IN <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="font-body font-medium text-sm uppercase tracking-[0.04em] text-[#1E1E1E] hover:opacity-50 transition-opacity duration-300"
                    style={{ padding: '14px 30px' }}
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ───── Tab Navigation ───── */}
          <div className="flex flex-wrap gap-0 gsap-reveal" style={{ marginBottom: '48px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="text-mono transition-all duration-300"
                style={{
                  padding: '14px 28px',
                  backgroundColor: activeTab === tab.id ? '#1E1E1E' : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : '#666666',
                  border: activeTab === tab.id ? '1px solid #1E1E1E' : '1px solid rgba(30, 30, 30, 0.12)',
                  borderRightWidth: '1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ───── Tab Content ───── */}
          <AnimatePresence mode="wait">
            {/* ======== LICENSE KEYS TAB ======== */}
            {activeTab === 'keys' && (
              <motion.div
                key="keys"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 gsap-reveal"
                  style={{ marginBottom: '64px', border: '1px solid rgba(30, 30, 30, 0.06)' }}>
                  {[
                    { label: 'ACTIVE KEYS', value: activeKeysCount.toString() },
                    { label: 'TOTAL REQUESTS', value: totalRequests > 0 ? totalRequests.toLocaleString() : '--' },
                    { label: 'REMAINING BALANCE', value: balanceLoading ? '--' : balance.toFixed(2), isGold: true },
                  ].map((stat, i) => (
                    <div key={stat.label}
                      className="bg-white text-center"
                      style={{
                        padding: '32px 24px',
                        borderRight: i < 2 ? '1px solid rgba(30, 30, 30, 0.06)' : 'none',
                      }}>
                      <span className="text-mono text-[#999999] block" style={{ marginBottom: '8px' }}>
                        {stat.label}
                      </span>
                      <span className="font-body font-medium text-[32px] text-[#1E1E1E] leading-tight inline-flex items-center gap-2 justify-center">
                        {'isGold' in stat && stat.isGold ? (
                          <>
                            <img src="/gold.png" alt="gold" className="inline-block" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                            {stat.value}
                          </>
                        ) : stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between gsap-reveal" style={{ marginBottom: '32px' }}>
                  <h2 className="heading-feature text-[#1E1E1E]">YOUR LICENSE KEYS</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 text-[#FFFFFF] font-body font-medium text-sm uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02]"
                    style={{ backgroundColor: '#1E1E1E', padding: '16px 32px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000000' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E' }}
                  >
                    GENERATE NEW KEY <Key size={14} />
                  </button>
                </div>

                {/* Error */}
                {licensesError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white text-center gsap-reveal"
                    style={{ padding: '40px 24px', border: '1px solid rgba(30, 30, 30, 0.06)', marginBottom: '32px' }}
                  >
                    <p className="text-body-sm text-[#CC0000]">{licensesError}</p>
                  </motion.div>
                )}

                {/* Loading */}
                {licensesLoading && (
                  <div className="flex items-center justify-center gsap-reveal" style={{ padding: '80px 24px' }}>
                    <Loader size={32} className="animate-spin text-[#1E1E1E]" />
                  </div>
                )}

                {/* License Key List */}
                {!licensesLoading && licenses.length > 0 && (
                  <div className="flex flex-col gsap-reveal" style={{ gap: '1px', backgroundColor: 'rgba(30, 30, 30, 0.06)' }}>
                    {licenses.map((lic, index) => (
                      <motion.div
                        key={lic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white"
                        style={{ padding: '24px 32px' }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-body font-medium text-[16px] text-[#1E1E1E]">
                                {lic.name || 'License Key'}
                              </span>
                              <span
                                className="text-mono text-[11px] px-3 py-1"
                                style={statusStyle(lic.status)}
                              >
                                {statusLabel(lic.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <code className="text-mono text-[#888888] text-[12px]">
                                {lic.license_key}
                              </code>
                              <span className="text-body-xs text-[#999999]">Created {formatDate(lic.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyKey(lic.license_key)}
                              className="flex items-center gap-2 text-body-sm text-[#666666] hover:text-[#1E1E1E] transition-colors duration-300"
                              style={{ padding: '8px 16px', border: '1px solid rgba(30, 30, 30, 0.12)' }}
                              title="Copy key"
                            >
                              <Copy size={14} />
                              <span className="text-mono text-[11px]">COPY</span>
                            </button>
                            <button
                              onClick={() => handleDeleteKey(lic.id)}
                              className="flex items-center gap-2 text-body-sm text-[#666666] hover:text-[#1E1E1E] transition-colors duration-300"
                              style={{ padding: '8px 16px', border: '1px solid rgba(30, 30, 30, 0.12)' }}
                              title="Delete key"
                            >
                              <Trash2 size={14} />
                              <span className="text-mono text-[11px]">DELETE</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!licensesLoading && !licensesError && licenses.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white text-center"
                    style={{
                      padding: '80px 24px',
                      border: '1px solid rgba(30, 30, 30, 0.06)',
                    }}
                  >
                    <Key size={48} className="mx-auto text-[#CCCCCC] mb-4" strokeWidth={1} />
                    <h3 className="text-display-subsection text-[#1E1E1E]" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}>
                      NO LICENSE KEYS YET
                    </h3>
                    <p className="text-body-sm text-[#666666] mt-3">
                      Create your first License Key to activate your plugins.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-6 inline-flex items-center gap-2 text-[#FFFFFF] font-body font-medium text-sm uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02]"
                      style={{ backgroundColor: '#1E1E1E', padding: '16px 32px' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000000' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E' }}
                    >
                      CREATE KEY <Key size={14} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ======== BILLING TAB ======== */}
            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bg-white gsap-reveal" style={{ padding: '64px', border: '1px solid rgba(30, 30, 30, 0.06)', marginBottom: '48px' }}>
                  <span className="text-mono text-[#999999] block" style={{ marginBottom: '16px' }}>AVAILABLE BALANCE</span>
                  <div className="flex items-center gap-4">
                    <img src="/gold.png" alt="gold" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                    <span className="font-display font-extralight text-[#1E1E1E]" style={{ fontSize: 'clamp(48px, 8vw, 64px)', lineHeight: 1.1, letterSpacing: '0.04em' }}>
                      {balance.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="gsap-reveal" style={{ marginBottom: '48px' }}>
                  <h3 className="heading-feature text-[#1E1E1E]" style={{ marginBottom: '24px' }}>SELECT AMOUNT</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', backgroundColor: 'rgba(30, 30, 30, 0.06)' }}>
                    {topUpOptions.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSelectedTopUp(amount)}
                        className="bg-white text-center transition-all duration-300"
                        style={{
                          padding: '40px 24px',
                          border: 'none',
                          backgroundColor: selectedTopUp === amount ? '#1E1E1E' : '#FFFFFF',
                          color: selectedTopUp === amount ? '#FFFFFF' : '#1E1E1E',
                        }}
                      >
                        <span className="font-display font-normal text-[32px]" style={{ letterSpacing: '0.04em' }}>
                          ${amount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white gsap-reveal" style={{ padding: '40px 48px', border: '1px solid rgba(30, 30, 30, 0.06)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-mono text-[#999999] block" style={{ marginBottom: '12px' }}>PAYMENT METHOD</span>
                      <span className="font-body font-medium text-[16px] text-[#1E1E1E]">
                        No payment method added
                      </span>
                    </div>
                    <button className="font-body font-medium text-sm uppercase tracking-[0.04em] text-[#666666] hover:text-[#1E1E1E] transition-colors duration-300">
                      ADD CARD
                    </button>
                  </div>
                </div>

                <div className="mt-8 gsap-reveal">
                  <button
                    disabled={selectedTopUp === null}
                    className="text-[#FFFFFF] font-body font-medium text-sm uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ backgroundColor: '#1E1E1E', padding: '16px 48px' }}
                    onMouseEnter={(e) => { if (selectedTopUp !== null) e.currentTarget.style.backgroundColor = '#000000' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E' }}
                  >
                    TOP UP {selectedTopUp !== null ? `$${selectedTopUp}` : ''}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======== USAGE TAB ======== */}
            {activeTab === 'usage' && (
              <motion.div
                key="usage"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 gsap-reveal"
                  style={{ marginBottom: '64px', border: '1px solid rgba(30, 30, 30, 0.06)' }}>
                  {[
                    { label: 'TOTAL REQUESTS', value: usageLogs.length.toString() },
                    { label: 'SUCCESS RATE', value: usageLogs.length > 0 ? '100%' : '--' },
                    { label: 'TOTAL COST', value: usageLogs.length > 0 ? `${usageLogs.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)} coins` : '--' },
                  ].map((stat, i) => (
                    <div key={stat.label}
                      className="bg-white text-center"
                      style={{
                        padding: '32px 24px',
                        borderRight: i < 2 ? '1px solid rgba(30, 30, 30, 0.06)' : 'none',
                      }}>
                      <span className="text-mono text-[#999999] block" style={{ marginBottom: '8px' }}>
                        {stat.label}
                      </span>
                      <span className="font-body font-medium text-[32px] text-[#1E1E1E] leading-tight">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="gsap-reveal">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4" style={{ marginBottom: '24px' }}>
                    <h3 className="heading-feature text-[#1E1E1E]">RECENT REQUESTS</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {dateFilterButtons.map((btn) => (
                        <button
                          key={btn.key}
                          onClick={() => { setDateFilterType(btn.key); setCustomDate(undefined) }}
                          className="text-mono text-[11px] transition-all duration-300"
                          style={{
                            padding: '8px 14px',
                            backgroundColor: dateFilterType === btn.key ? '#1E1E1E' : '#FFFFFF',
                            color: dateFilterType === btn.key ? '#FFFFFF' : '#666666',
                            border: '1px solid rgba(30, 30, 30, 0.12)',
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="flex items-center gap-1.5 text-mono text-[11px] transition-all duration-300"
                            style={{
                              padding: '8px 14px',
                              backgroundColor: dateFilterType === 'custom' ? '#1E1E1E' : '#FFFFFF',
                              color: dateFilterType === 'custom' ? '#FFFFFF' : '#666666',
                              border: '1px solid rgba(30, 30, 30, 0.12)',
                            }}
                          >
                            <CalendarIcon size={12} />
                            {customDate ? format(customDate, 'MM/dd') : 'DATE'}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={customDate}
                            onSelect={(date) => {
                              setCustomDate(date)
                              if (date) setDateFilterType('custom')
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {dateFilterType === 'custom' && customDate && (
                        <button
                          onClick={() => { setDateFilterType('all'); setCustomDate(undefined) }}
                          className="flex items-center justify-center transition-all duration-300 hover:bg-[rgba(30,30,30,0.04)]"
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '1px solid rgba(30, 30, 30, 0.12)',
                          }}
                          title="Clear filter"
                        >
                          <X size={12} className="text-[#666666]" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter status hint */}
                  {dateFilterType === 'custom' && customDate && (
                    <div className="flex items-center gap-2" style={{ marginBottom: '16px' }}>
                      <span className="text-mono text-[11px] text-[#999999]">
                        FILTERED BY {format(customDate, 'MM/dd/yyyy')} ({filteredLogs.length} requests)
                      </span>
                    </div>
                  )}

                  <div style={{ border: '1px solid rgba(30, 30, 30, 0.06)' }}>
                    <div className="hidden md:grid bg-[#F5F5F5]" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr', padding: '16px 32px', gap: '16px' }}>
                      {['TIME', 'MODEL', 'COINS', 'BALANCE'].map((h) => (
                        <span key={h} className="text-mono text-[#999999] text-[11px]">{h}</span>
                      ))}
                    </div>
                    {usageLogsLoading && (
                      <div className="bg-white text-center" style={{ padding: '40px 24px' }}>
                        <Loader size={24} className="animate-spin mx-auto text-[#1E1E1E]" />
                      </div>
                    )}
                    {!usageLogsLoading && usageLogs.length === 0 && (
                      <div className="bg-white text-center" style={{ padding: '40px 24px' }}>
                        <span className="text-body-sm text-[#999999]">No requests recorded yet</span>
                      </div>
                    )}
                    {!usageLogsLoading && usageLogs.length > 0 && filteredLogs.length === 0 && (
                      <div className="bg-white text-center" style={{ padding: '40px 24px' }}>
                        <span className="text-body-sm text-[#999999]">No requests found for the selected date range</span>
                      </div>
                    )}
                    {!usageLogsLoading && filteredLogs.length > 0 && filteredLogs.map((log, i) => (
                      <div
                        key={log.id || i}
                        className="grid bg-white md:items-center"
                        style={{
                          gridTemplateColumns: '1fr',
                          padding: '16px 32px',
                          gap: '8px',
                          borderTop: '1px solid rgba(30, 30, 30, 0.06)',
                        }}
                      >
                        <div className="md:hidden flex flex-wrap gap-2 mb-2">
                          <span className="text-body-xs text-[#666666]">{new Date(log.created_at).toLocaleString()}</span>
                          <span className="text-body-xs text-[#888888]">{log.model_key || '—'}</span>
                          <span className="text-mono text-[11px] text-[#1E1E1E]">{Number(log.amount || 0)} coins</span>
                          <span className="text-body-xs text-[#999999]">{Number(log.balance_after || 0).toFixed(0)}</span>
                        </div>
                        <div className="hidden md:contents">
                          <span className="text-body-xs text-[#666666]">{new Date(log.created_at).toLocaleString()}</span>
                          <span className="text-mono text-[12px] text-[#1E1E1E]">{log.model_key || '—'}</span>
                          <span className="text-mono text-[11px] text-[#1E1E1E]">
                            {Number(log.amount || 0)} coins
                          </span>
                          <span className="text-body-xs text-[#999999]">{Number(log.balance_after || 0).toFixed(0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════ Create Key Modal ═══════════════ */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white w-full"
              style={{ maxWidth: '480px', padding: '48px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-display-subsection text-[#1E1E1E]" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', marginBottom: '8px' }}>
                GENERATE NEW LICENSE KEY
              </h3>
              <p className="text-body-sm text-[#666666]" style={{ marginBottom: '32px' }}>
                Give your key a descriptive name to identify its purpose.
              </p>
              <div style={{ marginBottom: '32px' }}>
                <label className="text-mono text-[#999999] block" style={{ marginBottom: '8px' }}>KEY NAME</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreateKey() }}
                  placeholder="e.g., PS Workstation"
                  className="w-full text-body text-[#1E1E1E] placeholder:text-[#CCCCCC] outline-none transition-colors duration-300 focus:border-[#1E1E1E]"
                  style={{
                    padding: '14px 16px',
                    border: '1px solid rgba(30, 30, 30, 0.12)',
                    backgroundColor: '#F5F5F5',
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCreateModal(false); setNewKeyName('') }}
                  className="flex-1 font-body font-medium text-sm uppercase tracking-[0.04em] text-[#1E1E1E] transition-all duration-300 hover:bg-[rgba(30,30,30,0.04)]"
                  style={{ padding: '14px 24px', border: '1px solid rgba(30, 30, 30, 0.2)' }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={!newKeyName.trim() || isCreating}
                  className="flex-1 text-[#FFFFFF] font-body font-medium text-sm uppercase tracking-[0.04em] transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ backgroundColor: '#1E1E1E', padding: '14px 24px' }}
                  onMouseEnter={(e) => { if (newKeyName.trim() && !isCreating) e.currentTarget.style.backgroundColor = '#000000' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E1E1E' }}
                >
                  {isCreating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size={14} className="animate-spin" /> CREATING...
                    </span>
                  ) : (
                    'CREATE'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ Toast Notification ═══════════════ */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
            onClick={() => hideToast()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ minWidth: '360px', maxWidth: '520px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center gap-3"
                style={{
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  padding: '18px 28px',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                }}
              >
                {toastIcon()}
                <span className="text-body-sm flex-1">{toast.message}</span>
              </div>
              {/* Progress bar */}
              {toast.showProgress && (
                <div className="w-full" style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: 'linear' }}
                    style={{ height: '100%', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
