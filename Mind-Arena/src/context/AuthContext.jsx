import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function initializeSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (mounted) {
          await handleSession(session)
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error)

        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      await handleSession(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSession(session) {
    if (!session?.user) {
      const savedDemo = localStorage.getItem('mindarena_demo_user')
      if (savedDemo) {
        try {
          setUser(JSON.parse(savedDemo))
          return
        } catch (e) {}
      }
      setUser(null)
      return
    }

    const authUser = session.user

    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'Player'

    const userData = {
      id: authUser.id,
      email: authUser.email,
      full_name: fullName,
    }

    /*
     * Keep a matching profile row in public.profiles.
     *
     * profiles.id = auth.uid()
     * profiles.full_name = user's Google name
     * profiles.email = user's email
     */
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          full_name: fullName,
          email: authUser.email,
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false,
        }
      )

    if (profileError) {
      /*
       * Authentication should still work even if the profile
       * synchronization fails because of an RLS/database issue.
       */
      console.error('Profile synchronization failed:', profileError)
    }

    setUser(userData)
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  async function loginWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Email login failed:', error)
      throw error
    }

    if (data?.session) {
      await handleSession(data.session)
    }

    return data
  }

  async function signUpWithEmail(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.error('Sign up failed:', error)
      throw error
    }

    if (data?.session) {
      await handleSession(data.session)
    }

    return data
  }

  async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      console.error('Password reset failed:', error)
      throw error
    }

    return data
  }

  function loginAsDemo(name = 'Demo Player') {
    const demoId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : '00000000-0000-4000-a000-' + Math.floor(Math.random() * 100000000000).toString(16).padStart(12, '0')

    const demoUser = {
      id: demoId,
      email: 'demo@mindarena.com',
      full_name: name,
    }
    setUser(demoUser)
    localStorage.setItem('mindarena_demo_user', JSON.stringify(demoUser))
    return demoUser
  }

  async function logout() {
    localStorage.removeItem('mindarena_demo_user')
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Supabase signout warning:', err)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        resetPassword,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
