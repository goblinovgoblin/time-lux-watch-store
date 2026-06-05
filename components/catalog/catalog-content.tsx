'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { CatalogWatch } from '@/lib/api'
import { getCatalog, mockCatalogWatches } from '@/lib/api'
import { WatchCard } from '@/components/watch-card'
import { CatalogFilters } from './catalog-filters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

function sortWatches(watches: CatalogWatch[], sortBy: string) {
  const result = [...watches]

  switch (sortBy) {
    case 'price-asc':
      result.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case 'price-desc':
      result.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case 'name':
      result.sort((a, b) => a.model_name.localeCompare(b.model_name))
      break
    case 'newest':
    default:
      break
  }

  return result
}

function filterMockWatches(watches: CatalogWatch[], search: string) {
  if (!search) {
    return watches
  }

  const searchLower = search.toLowerCase()
  return watches.filter(
    watch =>
      watch.model_name.toLowerCase().includes(searchLower) ||
      watch.brand_name.toLowerCase().includes(searchLower) ||
      watch.reference_code.toLowerCase().includes(searchLower)
  )
}

export function CatalogContent() {
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [brand, setBrand] = useState(searchParams.get('brandId') || searchParams.get('brand') || '')
  const [category, setCategory] = useState(searchParams.get('categoryId') || searchParams.get('category') || '')
  const [gender, setGender] = useState(searchParams.get('gender') || '')
  const [mechanism, setMechanism] = useState(searchParams.get('mechanismId') || searchParams.get('mechanism') || '')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [watches, setWatches] = useState<CatalogWatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const city = searchParams.get('city')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const availableOnly = searchParams.get('availableOnly') !== 'false'

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setIsLoading(true)
      setError('')

      try {
        const catalog = await getCatalog({
          search,
          brandId: brand,
          categoryId: category,
          mechanismId: mechanism,
          city,
          minPrice,
          maxPrice,
          availableOnly,
        })

        if (isMounted) {
          setWatches(catalog)
        }
      } catch {
        if (isMounted) {
          setWatches(filterMockWatches(mockCatalogWatches, search))
          setError('Не удалось загрузить каталог из базы. Показаны демо-данные.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCatalog()

    return () => {
      isMounted = false
    }
  }, [search, brand, category, mechanism, city, minPrice, maxPrice, availableOnly])

  const sortedWatches = useMemo(() => sortWatches(watches, sortBy), [watches, sortBy])
  const activeFiltersCount = [brand, category, gender, mechanism].filter(Boolean).length

  const clearFilters = () => {
    setSearch('')
    setBrand('')
    setCategory('')
    setGender('')
    setMechanism('')
  }

  const filterProps = {
    brand,
    setBrand,
    category,
    setCategory,
    gender,
    setGender,
    mechanism,
    setMechanism,
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="hidden lg:block w-64 shrink-0">
        <CatalogFilters {...filterProps} />
      </aside>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или бренду..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetTitle className="sr-only">Фильтры каталога</SheetTitle>
                <div className="mt-6">
                  <CatalogFilters {...filterProps} />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Сначала новые</SelectItem>
                <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(search || activeFiltersCount > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Активные фильтры:</span>
            {search && (
              <Button variant="secondary" size="sm" onClick={() => setSearch('')} className="gap-1 h-7">
                Поиск: {search}
                <X className="h-3 w-3" />
              </Button>
            )}
            {brand && (
              <Button variant="secondary" size="sm" onClick={() => setBrand('')} className="gap-1 h-7">
                {brand}
                <X className="h-3 w-3" />
              </Button>
            )}
            {category && (
              <Button variant="secondary" size="sm" onClick={() => setCategory('')} className="gap-1 h-7">
                {category}
                <X className="h-3 w-3" />
              </Button>
            )}
            {gender && (
              <Button variant="secondary" size="sm" onClick={() => setGender('')} className="gap-1 h-7">
                {gender}
                <X className="h-3 w-3" />
              </Button>
            )}
            {mechanism && (
              <Button variant="secondary" size="sm" onClick={() => setMechanism('')} className="gap-1 h-7">
                {mechanism}
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
              Сбросить все
            </Button>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-6">
          Найдено: {sortedWatches.length} {sortedWatches.length === 1 ? 'модель' : 'моделей'}
        </p>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : sortedWatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedWatches.map(watch => (
              <WatchCard key={watch.instance_id} watch={watch} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">По вашему запросу ничего не найдено</p>
            <Button variant="outline" onClick={clearFilters}>
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
