'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWatches } from '@/lib/watch-context'
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

export function CatalogContent() {
  const { watches } = useWatches()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [brand, setBrand] = useState(searchParams.get('brand') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [gender, setGender] = useState(searchParams.get('gender') || '')
  const [mechanism, setMechanism] = useState(searchParams.get('mechanism') || '')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filteredWatches = useMemo(() => {
    let result = [...watches]

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        w =>
          w.name.toLowerCase().includes(searchLower) ||
          w.brand.toLowerCase().includes(searchLower) ||
          w.description.toLowerCase().includes(searchLower)
      )
    }

    if (brand) {
      result = result.filter(w => w.brand === brand)
    }

    if (category) {
      result = result.filter(w => w.category === category)
    }

    if (gender) {
      result = result.filter(w => w.gender === gender)
    }

    if (mechanism) {
      result = result.filter(w => w.mechanism === mechanism)
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [watches, search, brand, category, gender, mechanism, sortBy])

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
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-64 shrink-0">
        <CatalogFilters {...filterProps} />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search and Sort Bar */}
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
            {/* Mobile Filters Button */}
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

        {/* Active Filters */}
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

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Найдено: {filteredWatches.length} {filteredWatches.length === 1 ? 'модель' : 'моделей'}
        </p>

        {/* Watch Grid */}
        {filteredWatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWatches.map(watch => (
              <WatchCard key={watch.id} watch={watch} />
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
