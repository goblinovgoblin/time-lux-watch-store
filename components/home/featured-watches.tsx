'use client'

import Link from 'next/link'
import { useWatches } from '@/lib/watch-context'
import { WatchCard } from '@/components/watch-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function FeaturedWatches() {
  const { watches } = useWatches()
  const featuredWatches = watches.filter(w => w.featured).slice(0, 4)

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Избранная коллекция
            </h2>
            <p className="text-muted-foreground">
              Уникальные модели, отобранные нашими экспертами
            </p>
          </div>
          <Link href="/catalog">
            <Button variant="outline" className="gap-2">
              Весь каталог
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWatches.map(watch => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>
      </div>
    </section>
  )
}
