'use client'

import { brands, categories, genders, mechanisms, categoryLabels, genderLabels, mechanismLabels } from '@/lib/data'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface CatalogFiltersProps {
  brand: string
  setBrand: (value: string) => void
  category: string
  setCategory: (value: string) => void
  gender: string
  setGender: (value: string) => void
  mechanism: string
  setMechanism: (value: string) => void
}

export function CatalogFilters({
  brand,
  setBrand,
  category,
  setCategory,
  gender,
  setGender,
  mechanism,
  setMechanism,
}: CatalogFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-semibold text-lg mb-4">Фильтры</h3>
        <Separator />
      </div>

      <div className="space-y-3">
        <Label>Бренд</Label>
        <Select value={brand || 'all'} onValueChange={value => setBrand(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Все бренды" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все бренды</SelectItem>
            {brands.map(b => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Категория</Label>
        <Select value={category || 'all'} onValueChange={value => setCategory(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Пол</Label>
        <Select value={gender || 'all'} onValueChange={value => setGender(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Все" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            {genders.map(g => (
              <SelectItem key={g} value={g}>{genderLabels[g]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Механизм</Label>
        <Select value={mechanism || 'all'} onValueChange={value => setMechanism(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Все типы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {mechanisms.map(m => (
              <SelectItem key={m} value={m}>{mechanismLabels[m]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
