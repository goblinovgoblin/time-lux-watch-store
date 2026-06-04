'use client'

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWatches } from '@/lib/watch-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice, categoryLabels, genderLabels, mechanismLabels } from '@/lib/data'
import { ArrowLeft, Shield, Truck, RotateCcw, Phone } from 'lucide-react'

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getWatch } = useWatches()
  const watch = getWatch(id)

  if (!watch) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold mb-4">Часы не найдены</h1>
            <Link href="/catalog">
              <Button>Вернуться в каталог</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const hasDiscount = watch.originalPrice && watch.originalPrice > watch.price
  const discountPercent = hasDiscount
    ? Math.round((1 - watch.price / watch.originalPrice!) * 100)
    : 0

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад в каталог
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden">
              <Image
                src={watch.image}
                alt={watch.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm">
                  -{discountPercent}%
                </Badge>
              )}
              {!watch.inStock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">Нет в наличии</Badge>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-primary font-medium uppercase tracking-wider mb-2">
                  {watch.brand}
                </p>
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  {watch.name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold">
                    {formatPrice(watch.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(watch.originalPrice!)}
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              <p className="text-muted-foreground leading-relaxed">
                {watch.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Категория</p>
                  <p className="font-medium">{categoryLabels[watch.category]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Пол</p>
                  <p className="font-medium">{genderLabels[watch.gender]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Механизм</p>
                  <p className="font-medium">{mechanismLabels[watch.mechanism]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Материал корпуса</p>
                  <p className="font-medium">{watch.caseMaterial}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Размер корпуса</p>
                  <p className="font-medium">{watch.caseSize} мм</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Водозащита</p>
                  <p className="font-medium">{watch.waterResistance} м</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Гарантия</p>
                  <p className="font-medium">{watch.warranty} {watch.warranty === 1 ? 'год' : watch.warranty < 5 ? 'года' : 'лет'}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" disabled={!watch.inStock}>
                  {watch.inStock ? 'Оформить заказ' : 'Нет в наличии'}
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Связаться с нами
                </Button>
              </div>

              {/* Features */}
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
