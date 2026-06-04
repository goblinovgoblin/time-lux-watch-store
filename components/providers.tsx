'use client'

import { AuthProvider } from '@/lib/auth-context'
import { WatchProvider } from '@/lib/watch-context'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WatchProvider>
        {children}
      </WatchProvider>
    </AuthProvider>
  )
}
