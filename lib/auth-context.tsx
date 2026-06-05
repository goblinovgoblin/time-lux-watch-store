'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type RoleName = 'ADMIN' | 'CUSTOMER'

export interface AuthUser {
  user_id: string
  full_name: string
  email: string
  role_name: RoleName
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type RegisterCredentials = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

function normalizeRoleName(roleName: string): RoleName {
  return roleName.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
}

function normalizeUser(user: AuthUser): AuthUser {
  return {
    ...user,
    role_name: normalizeRoleName(user.role_name),
  }
}

function getDemoFallbackUser(email: string, password: string): AuthUser | null {
  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail === 'admin@timelux.ru' && password === 'admin123') {
    return {
      user_id: 'demo-admin',
      full_name: 'Администратор',
      email: normalizedEmail,
      role_name: 'ADMIN',
    }
  }

  if (normalizedEmail === 'user@timelux.ru' && password === 'user123') {
    return {
      user_id: 'demo-user',
      full_name: 'Покупатель',
      email: normalizedEmail,
      role_name: 'CUSTOMER',
    }
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadCurrentUser() {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
          credentials: 'include',
        })

        if (!response.ok) {
          if (isMounted) {
            setUser(null)
          }
          return
        }

        const currentUser = await response.json()

        if (isMounted) {
          setUser(normalizeUser(currentUser))
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCurrentUser()

    return () => {
      isMounted = false
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return false
      }

      const loggedInUser = await response.json()
      setUser(normalizeUser(loggedInUser))
      return true
    } catch {
      const fallbackUser = getDemoFallbackUser(email, password)

      if (!fallbackUser) {
        return false
      }

      setUser(fallbackUser)
      return true
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        return {
          success: false,
          error: result?.error || 'Не удалось зарегистрироваться',
        }
      }

      const registeredUser = await response.json()
      setUser(normalizeUser(registeredUser))
      return { success: true }
    } catch {
      return {
        success: false,
        error: 'Не удалось зарегистрироваться',
      }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
