import Link from 'next/link'
import { brands } from '@/lib/data'

export function BrandsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            Престижные бренды
          </h2>
          <p className="text-muted-foreground">
            Официальный дистрибьютор ведущих часовых мануфактур
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map(brand => (
            <Link
              key={brand}
              href={`/catalog?brand=${encodeURIComponent(brand)}`}
              className="text-lg md:text-xl font-heading font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
