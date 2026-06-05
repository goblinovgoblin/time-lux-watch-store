import Link from 'next/link'
import Image from 'next/image'
import type { CatalogWatch } from '@/lib/api'
import type { Watch } from '@/lib/types'
import { formatPrice, categoryLabels } from '@/lib/data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'

interface WatchCardProps {
  watch: Watch | CatalogWatch
}

function isCatalogWatch(watch: Watch | CatalogWatch): watch is CatalogWatch {
  return 'instance_id' in watch
}

function isAvailable(status: string) {
  return ['available', 'in_stock', 'active'].includes(status.toLowerCase())
}

export function WatchCard({ watch }: WatchCardProps) {
  const isApiWatch = isCatalogWatch(watch)
  const href = `/watch/${isApiWatch ? watch.instance_id : watch.id}`
  const image = isApiWatch ? watch.image_url || '/placeholder.svg' : watch.image
  const brandName = isApiWatch ? watch.brand_name : watch.brand
  const modelName = isApiWatch ? watch.model_name : watch.name
  const referenceCode = isApiWatch ? watch.reference_code : null
  const categoryName = isApiWatch ? watch.category_name : categoryLabels[watch.category]
  const mechanismName = isApiWatch ? watch.mechanism_name : null
  const serialNumber = isApiWatch ? watch.serial_number : null
  const status = isApiWatch ? watch.status : watch.inStock ? 'available' : 'unavailable'
  const storeName = isApiWatch ? watch.store_name : null
  const city = isApiWatch ? watch.city : null
  const price = Number(watch.price)
  const hasDiscount = !isApiWatch && watch.originalPrice && watch.originalPrice > watch.price
  const discountPercent = hasDiscount
    ? Math.round((1 - watch.price / watch.originalPrice!) * 100)
    : 0
  const available = isApiWatch ? isAvailable(status) : watch.inStock

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={image}
            alt={`${brandName} ${modelName}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              -{discountPercent}%
            </Badge>
          )}
          {!available && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary" className="text-base">Нет в наличии</Badge>
            </div>
          )}
          <Badge variant="secondary" className="absolute top-3 right-3">
            {categoryName}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <p className="text-xs text-primary font-medium uppercase tracking-wider">
            {brandName}
          </p>
          <h3 className="font-heading font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {modelName}
          </h3>
          {referenceCode && (
            <p className="text-xs text-muted-foreground">Ref. {referenceCode}</p>
          )}
        </div>

        {isApiWatch && (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>{mechanismName}</p>
            <p>Serial: {serialNumber}</p>
            <p>{storeName}, {city}</p>
            <p>Status: {status}</p>
          </div>
        )}

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold">
            {formatPrice(Number.isFinite(price) ? price : 0)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(watch.originalPrice!)}
            </span>
          )}
        </div>

        <Link href={href} className={buttonVariants({ variant: 'outline', className: 'w-full' })}>
          Подробнее
        </Link>
      </CardContent>
    </Card>
  )
}
