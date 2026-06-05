'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    if (!isLoading && user?.role_name !== 'ADMIN') {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user || user.role_name !== 'ADMIN') {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Панель администратора
            </h1>
            <p className="text-muted-foreground">
              Управление каталогом часов
            </p>
          </div>
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
