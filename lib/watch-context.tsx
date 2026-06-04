'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { Watch } from '@/lib/types'
import { watches as initialWatches } from '@/lib/data'

interface WatchContextType {
  watches: Watch[]
  addWatch: (watch: Omit<Watch, 'id' | 'createdAt'>) => void
  updateWatch: (id: string, watch: Partial<Watch>) => void
  deleteWatch: (id: string) => void
  getWatch: (id: string) => Watch | undefined
}

const WatchContext = createContext<WatchContextType | undefined>(undefined)

export function WatchProvider({ children }: { children: ReactNode }) {
  const [watches, setWatches] = useState<Watch[]>(initialWatches)

  const addWatch = useCallback((watchData: Omit<Watch, 'id' | 'createdAt'>) => {
    const newWatch: Watch = {
      ...watchData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setWatches(prev => [newWatch, ...prev])
  }, [])

  const updateWatch = useCallback((id: string, watchData: Partial<Watch>) => {
    setWatches(prev =>
      prev.map(watch =>
        watch.id === id ? { ...watch, ...watchData } : watch
      )
    )
  }, [])

  const deleteWatch = useCallback((id: string) => {
    setWatches(prev => prev.filter(watch => watch.id !== id))
  }, [])

  const getWatch = useCallback((id: string) => {
    return watches.find(watch => watch.id === id)
  }, [watches])

  return (
    <WatchContext.Provider value={{ watches, addWatch, updateWatch, deleteWatch, getWatch }}>
      {children}
    </WatchContext.Provider>
  )
}

export function useWatches() {
  const context = useContext(WatchContext)
  if (context === undefined) {
    throw new Error('useWatches must be used within a WatchProvider')
  }
  return context
}
