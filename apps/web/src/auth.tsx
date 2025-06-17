import * as React from 'react'
import { sleep } from './utils'
import { fetchMe } from "./api/auth";
import { useQuery } from '@tanstack/react-query';
import { useMe } from './hooks/useUsers';

export interface AuthContext {
  isAuthenticated: boolean
  login: (username: string) => Promise<void>
  logout: () => Promise<void>
  user: any
}

const AuthContext = React.createContext<AuthContext | null>(null)

const key = 'tanstack.auth.user'

function getStoredUser() {
  console.log('Getting user')
  return localStorage.getItem(key)
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user)
  } else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const { data: userData } = useMe()
  const [user, setUser] = React.useState<string | null>(null)
  // get access_token and refresh_token from cookies
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {
    await sleep(250)

    setStoredUser(null)
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string) => {
    await sleep(500)

    setStoredUser(username)
    setUser(username)
  }, [])

  const contextValue = React.useMemo(() => ({
    isAuthenticated,
    user: {},
    login,
    logout,
  }), [isAuthenticated, login, logout])


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}