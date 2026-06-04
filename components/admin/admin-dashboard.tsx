'use client'

import { useState } from 'react'
import { useWatches } from '@/lib/watch-context'
import { Watch } from '@/lib/types'
import { formatPrice, categoryLabels, brands, categories, genders, mechanisms, genderLabels, mechanismLabels } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

type WatchFormData = Omit<Watch, 'id' | 'createdAt'>

const initialFormData: WatchFormData = {
  name: '',
  brand: '',
  price: 0,
  originalPrice: undefined,
  description: '',
  image: '',
  category: 'luxury',
  gender: 'men',
  mechanism: 'automatic',
  caseMaterial: '',
  caseSize: 40,
  waterResistance: 50,
  warranty: 2,
  inStock: true,
  featured: false,
}

export function AdminDashboard() {
  const { watches, addWatch, updateWatch, deleteWatch } = useWatches()
  const [search, setSearch] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<WatchFormData>(initialFormData)

  const filteredWatches = watches.filter(
    w =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.brand.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setFormData(initialFormData)
    setIsAddDialogOpen(true)
  }

  const handleEdit = (watch: Watch) => {
    setFormData({
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      originalPrice: watch.originalPrice,
      description: watch.description,
      image: watch.image,
      category: watch.category,
      gender: watch.gender,
      mechanism: watch.mechanism,
      caseMaterial: watch.caseMaterial,
      caseSize: watch.caseSize,
      waterResistance: watch.waterResistance,
      warranty: watch.warranty,
      inStock: watch.inStock,
      featured: watch.featured,
    })
    setEditingWatch(watch)
  }

  const handleSave = () => {
    if (editingWatch) {
      updateWatch(editingWatch.id, formData)
      setEditingWatch(null)
    } else {
      addWatch(formData)
      setIsAddDialogOpen(false)
    }
    setFormData(initialFormData)
  }

  const handleDelete = (id: string) => {
    deleteWatch(id)
    setDeleteConfirm(null)
  }

  const updateFormField = <K extends keyof WatchFormData>(
    field: K,
    value: WatchFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const WatchForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => updateFormField('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Бренд</Label>
          <Select value={formData.brand} onValueChange={v => updateFormField('brand', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите бренд" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Цена (руб.)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={e => updateFormField('price', Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Старая цена (руб.)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice || ''}
            onChange={e => updateFormField('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Оставьте пустым если нет скидки"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <textarea
          id="description"
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={formData.description}
          onChange={e => updateFormField('description', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL изображения</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={e => updateFormField('image', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Категория</Label>
          <Select value={formData.category} onValueChange={v => updateFormField('category', v as Watch['category'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Пол</Label>
          <Select value={formData.gender} onValueChange={v => updateFormField('gender', v as Watch['gender'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {genders.map(g => (
                <SelectItem key={g} value={g}>{genderLabels[g]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Механизм</Label>
          <Select value={formData.mechanism} onValueChange={v => updateFormField('mechanism', v as Watch['mechanism'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mechanisms.map(m => (
                <SelectItem key={m} value={m}>{mechanismLabels[m]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="caseMaterial">Материал корпуса</Label>
          <Input
            id="caseMaterial"
            value={formData.caseMaterial}
            onChange={e => updateFormField('caseMaterial', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="caseSize">Размер корпуса (мм)</Label>
          <Input
            id="caseSize"
            type="number"
            value={formData.caseSize}
            onChange={e => updateFormField('caseSize', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="waterResistance">Водозащита (м)</Label>
          <Input
            id="waterResistance"
            type="number"
            value={formData.waterResistance}
            onChange={e => updateFormField('waterResistance', Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warranty">Гарантия (лет)</Label>
          <Input
            id="warranty"
            type="number"
            value={formData.warranty}
            onChange={e => updateFormField('warranty', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={e => updateFormField('inStock', e.target.checked)}
            className="w-4 h-4 rounded border-input"
          />
          <span className="text-sm">В наличии</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={e => updateFormField('featured', e.target.checked)}
            className="w-4 h-4 rounded border-input"
          />
          <span className="text-sm">Избранное</span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или бренду..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить часы
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Добавить новые часы</DialogTitle>
              <DialogDescription>
                Заполните информацию о новой модели часов
              </DialogDescription>
            </DialogHeader>
            <WatchForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>Добавить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Всего моделей</p>
          <p className="text-2xl font-bold">{watches.length}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">В наличии</p>
          <p className="text-2xl font-bold">{watches.filter(w => w.inStock).length}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Избранных</p>
          <p className="text-2xl font-bold">{watches.filter(w => w.featured).length}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Брендов</p>
          <p className="text-2xl font-bold">{new Set(watches.map(w => w.brand)).size}</p>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Название</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-center">Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWatches.map(watch => (
              <TableRow key={watch.id}>
                <TableCell className="font-medium">{watch.name}</TableCell>
                <TableCell>{watch.brand}</TableCell>
                <TableCell>{categoryLabels[watch.category]}</TableCell>
                <TableCell className="text-right">{formatPrice(watch.price)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    {watch.inStock ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">В наличии</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-500/10 text-red-600">Нет</Badge>
                    )}
                    {watch.featured && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">Избранное</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {/* Edit Dialog */}
                    <Dialog open={editingWatch?.id === watch.id} onOpenChange={open => !open && setEditingWatch(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(watch)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Редактировать часы</DialogTitle>
                          <DialogDescription>
                            Измените информацию о модели
                          </DialogDescription>
                        </DialogHeader>
                        <WatchForm />
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingWatch(null)}>
                            Отмена
                          </Button>
                          <Button onClick={handleSave}>Сохранить</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Confirm */}
                    <Dialog open={deleteConfirm === watch.id} onOpenChange={open => !open && setDeleteConfirm(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(watch.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Удалить часы?</DialogTitle>
                          <DialogDescription>
                            Вы уверены, что хотите удалить {watch.brand} {watch.name}? Это действие нельзя отменить.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                            Отмена
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(watch.id)}>
                            Удалить
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredWatches.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Ничего не найдено
        </div>
      )}
    </div>
  )
}
