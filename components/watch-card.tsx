import Link from 'next/link'
import Image from 'next/image'
import { Watch } from '@/lib/types'
import { formatPrice, categoryLabels } from '@/lib/data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface WatchCardProps {
  watch: Watch
}

export function WatchCard({ watch }: WatchCardProps) {
  const hasDiscount = watch.originalPrice && watch.originalPrice > watch.price
  const discountPercent = hasDiscount
    ? Math.round((1 - watch.price / watch.originalPrice!) * 100)
    : 0

  return (
    <Link href={`/watch/${watch.id}`}>
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={watch.image}
            alt={watch.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              -{discountPercent}%
            </Badge>
          )}
          {!watch.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-base">Нет в наличии</Badge>
            </div>
          )}
          <Badge variant="secondary" className="absolute top-3 right-3">
            {categoryLabels[watch.category]}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-2">
          <p className="text-xs text-primary font-medium uppercase tracking-wider">
            {watch.brand}
          </p>
          <h3 className="font-heading font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {watch.name}
          </h3>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-semibold">
              {formatPrice(watch.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(watch.originalPrice!)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
