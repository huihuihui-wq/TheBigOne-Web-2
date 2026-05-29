import { supabase } from './supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'https://sg.thebigone.top'

export interface CheckoutOptions {
  planId: 'lite' | 'pro' | 'studio'
  billingInterval: 'monthly' | 'yearly'
}

/**
 * Call backend to create a Stripe Checkout Session and redirect user
 * (Legacy redirect flow - kept for backward compatibility)
 */
export async function redirectToCheckout(options: CheckoutOptions): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData?.session?.access_token

  if (!token) {
    // Not logged in - redirect to signup
    window.location.href = '/#/signup'
    return
  }

  try {
    const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(options),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }

    const { url } = await res.json()
    if (url) {
      window.location.href = url
    } else {
      throw new Error('No checkout URL returned')
    }
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    throw err
  }
}

/**
 * Create an embedded Stripe Checkout Session for in-site payment
 * Returns client_secret to be used with EmbeddedCheckout
 */
export async function createEmbeddedCheckout(
  options: CheckoutOptions
): Promise<{ clientSecret: string }> {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData?.session?.access_token

  if (!token) {
    window.location.href = '/#/signup'
    throw new Error('Not authenticated')
  }

  try {
    const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...options,
        ui_mode: 'embedded',
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }

    const { client_secret } = await res.json()
    if (!client_secret) {
      throw new Error('No client secret returned from server')
    }

    return { clientSecret: client_secret }
  } catch (err: any) {
    console.error('Stripe embedded checkout error:', err)
    throw err
  }
}

/**
 * Open Stripe Customer Portal for managing subscription
 */
export async function openCustomerPortal(): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData?.session?.access_token

  if (!token) {
    window.location.href = '/#/signup'
    return
  }

  try {
    const res = await fetch(`${API_BASE}/api/stripe/portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `HTTP ${res.status}`)
    }

    const { url } = await res.json()
    if (url) {
      window.open(url, '_blank')
    }
  } catch (err: any) {
    console.error('Stripe portal error:', err)
    throw err
  }
}

/**
 * Get user's current subscription status from Supabase
 */
export async function getUserSubscription() {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData?.session?.user?.id
  if (!userId) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}
