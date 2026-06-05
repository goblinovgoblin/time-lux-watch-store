'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CatalogWatch } from '@/lib/api'
import { getMockWatchById, getWatchById } from '@/lib/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/data'
import { ArrowLeft, Shield, Truck, RotateCcw, Phone } from 'lucide-react'

function isAvailable(status: string) {
  return ['available', 'in_stock', 'active'].includes(status.toLowerCase())
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [watch, setWatch] = useState<CatalogWatch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadWatch() {
      setIsLoading(true)
      setError('')

      try {
        const catalogWatch = await getWatchById(id)

        if (isMounted) {
          setWatch(catalogWatch)
        }
      } catch {
        const fallbackWatch = getMockWatchById(id)

        if (isMounted) {
          setWatch(fallbackWatch ?? null)
          setError(
            fallbackWatch
              ? 'Не удалось загрузить часы из базы. Показаны демо-данные.'
              : 'Не удалось загрузить данные о часах.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadWatch()

    return () => {
      isMounted = false
    }
  }, [id])

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

  if (!watch) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold mb-4">Часы не найдены</h1>
            {error && (
              <p className="text-muted-foreground mb-4">{error}</p>
            )}
            <Link href="/catalog">
              <Button>Вернуться в каталог</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const available = isAvailable(watch.status)
  const price = Number(watch.price)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад в каталог
          </Link>

          {error && (
            <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden">
              <Image
                src={watch.image_url || '/placeholder.svg'}
                alt={`${watch.brand_name} ${watch.model_name}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {!available && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">Нет в наличии</Badge>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium uppercase tracking-wider mb-2">
                  {watch.brand_name}
                </p>
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  {watch.model_name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold">
                    {formatPrice(Number.isFinite(price) ? price : 0)}
                  </span>
                </div>
              </div>

              <Separator />

              <p className="text-muted-foreground leading-relaxed">
                {watch.brand_name} {watch.model_name}, Ref. {watch.reference_code}. Экземпляр находится в магазине {watch.store_name}, {watch.city}.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Категория</p>
                  <p className="font-medium">{watch.category_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Механизм</p>
                  <p className="font-medium">{watch.mechanism_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-medium">{watch.reference_code}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Serial</p>
                  <p className="font-medium">{watch.serial_number}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{watch.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Магазин</p>
                  <p className="font-medium">{watch.store_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Город</p>
                  <p className="font-medium">{watch.city}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" disabled={!available}>
                  {available ? 'Оформить заказ' : 'Нет в наличии'}
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Связаться с нами
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm">Гарантия подлинности</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Truck className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm">Бесплатная доставка</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm">Возврат 14 дней</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
