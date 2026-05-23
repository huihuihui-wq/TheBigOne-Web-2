import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'

/* ───────────────────────────────────────────
   Types
   ─────────────────────────────────────────── */

export interface User {
  id: string
  name: string
  email: string
  picture: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => void
}

type AuthAction =
  | { type: 'AUTH_INIT'; payload: User | null }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }

/* ───────────────────────────────────────────
   Helper: map Supabase user to our User type
   ─────────────────────────────────────────── */

function mapSupabaseUser(raw: any): User | null {
  if (!raw) return null
  const meta = raw.user_metadata || {}
  return {
    id: raw.id,
    name:
      meta.username ||
      meta.full_name ||
      meta.name ||
      raw.email?.split('@')[0] ||
      'User',
    email: raw.email || '',
    picture:
      meta.avatar_url ||
      meta.picture ||
      meta.avatar ||
      '',
  }
}

/* ───────────────────────────────────────────
   Reducer
   ─────────────────────────────────────────── */

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_INIT':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

/* ───────────────────────────────────────────
   Context
   ─────────────────────────────────────────── */

const AuthContext = createContext<AuthContextType | null>(null)

/* ───────────────────────────────────────────
   Provider
   ─────────────────────────────────────────── */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // On mount: check Supabase session and subscribe to auth changes
  useEffect(() => {
    let mounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (mounted) {
        dispatch({
          type: 'AUTH_INIT',
          payload: mapSupabaseUser(data.session?.user ?? null),
        })
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        dispatch({
          type: 'AUTH_INIT',
          payload: mapSupabaseUser(session?.user ?? null),
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback((user: User) => {
    dispatch({ type: 'LOGIN', payload: user })
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    dispatch({ type: 'LOGOUT' })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ───────────────────────────────────────────
   Hook
   ─────────────────────────────────────────── */

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
