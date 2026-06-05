'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPrice } from '@/lib/data'
import { Search } from 'lucide-react'

type AdminTab =
  | 'users'
  | 'stores'
  | 'brands'
  | 'categories'
  | 'mechanisms'
  | 'watchModels'
  | 'watchInstances'
  | 'orders'

type AdminUser = {
  user_id: string | number
  full_name: string
  email: string
  role_id: string | number
  role_name: string
  removed: boolean
}

type AdminStore = {
  store_id: string | number
  store_name: string
  city: string
  removed: boolean
}

type AdminBrand = {
  brand_id: string | number
  brand_name: string
  removed: boolean
}

type AdminCategory = {
  category_id: string | number
  category_name: string
  removed: boolean
}

type AdminMechanism = {
  mechanism_id: string | number
  mechanism_name: string
  removed: boolean
}

type AdminWatchModel = {
  model_id: string | number
  brand_id: string | number
  brand_name: string
  category_id: string | number
  category_name: string
  mechanism_id: string | number
  mechanism_name: string
  model_name: string
  reference_code: string
  image_url: string | null
  removed: boolean
}

type AdminWatchInstance = {
  instance_id: string | number
  model_id: string | number
  brand_name: string
  model_name: string
  reference_code: string
  store_id: string | number
  store_name: string
  city: string
  serial_number: string
  price: string | number
  status: string
  removed: boolean
}

type AdminOrder = {
  order_id: string | number
  customer_id: string | number
  customer_name: string
  customer_email: string
  order_date: string
  status: string
  total_amount: string | number
  removed: boolean
}

type AdminData = {
  users: AdminUser[]
  stores: AdminStore[]
  brands: AdminBrand[]
  categories: AdminCategory[]
  mechanisms: AdminMechanism[]
  watchModels: AdminWatchModel[]
  watchInstances: AdminWatchInstance[]
  orders: AdminOrder[]
}

type SimpleTab = 'stores' | 'brands' | 'categories' | 'mechanisms'

type SimpleForm = {
  name: string
  city: string
}

type WatchModelForm = {
  brand_id: string
  category_id: string
  mechanism_id: string
  model_name: string
  reference_code: string
  image_url: string
}

type WatchInstanceForm = {
  model_id: string
  store_id: string
  serial_number: string
  price: string
  status: string
}

type SimpleResourceConfig = {
  endpoint: string
  idKey: string
  nameKey: string
  nameLabel: string
  hasCity?: boolean
}

type TabConfig = {
  id: AdminTab
  label: string
}

const tabs: TabConfig[] = [
  { id: 'users', label: 'Пользователи' },
  { id: 'stores', label: 'Магазины' },
  { id: 'brands', label: 'Бренды' },
  { id: 'categories', label: 'Категории' },
  { id: 'mechanisms', label: 'Механизмы' },
  { id: 'watchModels', label: 'Модели часов' },
  { id: 'watchInstances', label: 'Экземпляры часов' },
  { id: 'orders', label: 'Заказы' },
]

const simpleResourceConfigs: Record<SimpleTab, SimpleResourceConfig> = {
  stores: {
    endpoint: '/api/admin/stores',
    idKey: 'store_id',
    nameKey: 'store_name',
    nameLabel: 'Магазин',
    hasCity: true,
  },
  brands: {
    endpoint: '/api/admin/brands',
    idKey: 'brand_id',
    nameKey: 'brand_name',
    nameLabel: 'Бренд',
  },
  categories: {
    endpoint: '/api/admin/categories',
    idKey: 'category_id',
    nameKey: 'category_name',
    nameLabel: 'Категория',
  },
  mechanisms: {
    endpoint: '/api/admin/mechanisms',
    idKey: 'mechanism_id',
    nameKey: 'mechanism_name',
    nameLabel: 'Механизм',
  },
}

const initialData: AdminData = {
  users: [],
  stores: [],
  brands: [],
  categories: [],
  mechanisms: [],
  watchModels: [],
  watchInstances: [],
  orders: [],
}

const emptySimpleForm: SimpleForm = {
  name: '',
  city: '',
}

const emptyWatchModelForm: WatchModelForm = {
  brand_id: '',
  category_id: '',
  mechanism_id: '',
  model_name: '',
  reference_code: '',
  image_url: '',
}

const emptyWatchInstanceForm: WatchInstanceForm = {
  model_id: '',
  store_id: '',
  serial_number: '',
  price: '',
  status: 'AVAILABLE',
}

const watchStatuses = ['AVAILABLE', 'RESERVED', 'SOLD']

async function fetchAdminResource<T>(path: string): Promise<T[]> {
  const response = await fetch(path, {
    cache: 'no-store',
    credentials: 'include',
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error('NO_ACCESS')
  }

  if (!response.ok) {
    throw new Error('LOAD_FAILED')
  }

  return response.json() as Promise<T[]>
}

async function mutateAdminResource(path: string, init: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error('Нет доступа')
  }

  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.error || 'Не удалось сохранить изменения')
  }
}

function isSimpleTab(tab: AdminTab): tab is SimpleTab {
  return tab === 'stores' || tab === 'brands' || tab === 'categories' || tab === 'mechanisms'
}

function getRemovedBadge(removed: boolean) {
  return removed ? (
    <Badge variant="destructive">Удалено</Badge>
  ) : (
    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
      Активно
    </Badge>
  )
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function matchesSearch(row: unknown, search: string) {
  if (!search) {
    return true
  }

  return JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [search, setSearch] = useState('')
  const [data, setData] = useState<AdminData>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<SimpleForm>(emptySimpleForm)
  const [watchModelForm, setWatchModelForm] = useState<WatchModelForm>(emptyWatchModelForm)
  const [watchInstanceForm, setWatchInstanceForm] = useState<WatchInstanceForm>(emptyWatchInstanceForm)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [isWatchFormOpen, setIsWatchFormOpen] = useState(false)
  const [actionError, setActionError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const loadAdminData = async () => {
    setIsLoading(true)
    setError('')

    try {
      const [
        users,
        stores,
        brands,
        categories,
        mechanisms,
        watchModels,
        watchInstances,
        orders,
      ] = await Promise.all([
        fetchAdminResource<AdminUser>('/api/admin/users'),
        fetchAdminResource<AdminStore>('/api/admin/stores'),
        fetchAdminResource<AdminBrand>('/api/admin/brands'),
        fetchAdminResource<AdminCategory>('/api/admin/categories'),
        fetchAdminResource<AdminMechanism>('/api/admin/mechanisms'),
        fetchAdminResource<AdminWatchModel>('/api/admin/watch-models'),
        fetchAdminResource<AdminWatchInstance>('/api/admin/watch-instances'),
        fetchAdminResource<AdminOrder>('/api/admin/orders'),
      ])

      setData({
        users,
        stores,
        brands,
        categories,
        mechanisms,
        watchModels,
        watchInstances,
        orders,
      })
    } catch (loadError) {
      setData(initialData)
      setError(loadError instanceof Error && loadError.message === 'NO_ACCESS'
        ? 'Нет доступа'
        : 'Не удалось загрузить данные админки')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  useEffect(() => {
    setForm(emptySimpleForm)
    setWatchModelForm(emptyWatchModelForm)
    setWatchInstanceForm(emptyWatchInstanceForm)
    setEditingId(null)
    setIsWatchFormOpen(false)
    setActionError('')
  }, [activeTab])

  const counts = {
    users: data.users.length,
    models: data.watchModels.length,
    instances: data.watchInstances.length,
    orders: data.orders.length,
  }

  const filteredData = useMemo(() => ({
    users: data.users.filter(row => matchesSearch(row, search)),
    stores: data.stores.filter(row => matchesSearch(row, search)),
    brands: data.brands.filter(row => matchesSearch(row, search)),
    categories: data.categories.filter(row => matchesSearch(row, search)),
    mechanisms: data.mechanisms.filter(row => matchesSearch(row, search)),
    watchModels: data.watchModels.filter(row => matchesSearch(row, search)),
    watchInstances: data.watchInstances.filter(row => matchesSearch(row, search)),
    orders: data.orders.filter(row => matchesSearch(row, search)),
  }), [data, search])

  const handleSimpleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSimpleTab(activeTab)) {
      return
    }

    const config = simpleResourceConfigs[activeTab]
    const name = form.name.trim()
    const city = form.city.trim()

    if (!name || (config.hasCity && !city)) {
      setActionError('Заполните обязательные поля')
      return
    }

    const body = config.hasCity
      ? { [config.nameKey]: name, city }
      : { [config.nameKey]: name }

    setIsSaving(true)
    setActionError('')

    try {
      if (editingId) {
        await mutateAdminResource(`${config.endpoint}/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      } else {
        await mutateAdminResource(config.endpoint, {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }

      setForm(emptySimpleForm)
      setEditingId(null)
      await loadAdminData()
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить изменения')
    } finally {
      setIsSaving(false)
    }
  }

  const startEditSimpleRow = (row: Record<string, unknown>, config: SimpleResourceConfig) => {
    setEditingId(row[config.idKey] as string | number)
    setForm({
      name: String(row[config.nameKey] ?? ''),
      city: config.hasCity ? String(row.city ?? '') : '',
    })
    setActionError('')
  }

  const handleDeleteSimpleRow = async (id: string | number) => {
    if (!isSimpleTab(activeTab)) {
      return
    }

    const confirmed = window.confirm('Пометить запись как удаленную?')

    if (!confirmed) {
      return
    }

    const config = simpleResourceConfigs[activeTab]
    setIsSaving(true)
    setActionError('')

    try {
      await mutateAdminResource(`${config.endpoint}/${id}`, {
        method: 'DELETE',
      })
      await loadAdminData()
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить запись')
    } finally {
      setIsSaving(false)
    }
  }

  const openCreateWatchForm = () => {
    setEditingId(null)
    setActionError('')
    setIsWatchFormOpen(true)

    if (activeTab === 'watchModels') {
      setWatchModelForm(emptyWatchModelForm)
    }

    if (activeTab === 'watchInstances') {
      setWatchInstanceForm(emptyWatchInstanceForm)
    }
  }

  const closeWatchForm = () => {
    setEditingId(null)
    setActionError('')
    setIsWatchFormOpen(false)
    setWatchModelForm(emptyWatchModelForm)
    setWatchInstanceForm(emptyWatchInstanceForm)
  }

  const handleWatchModelSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const body = {
      brand_id: watchModelForm.brand_id,
      category_id: watchModelForm.category_id,
      mechanism_id: watchModelForm.mechanism_id,
      model_name: watchModelForm.model_name.trim(),
      reference_code: watchModelForm.reference_code.trim(),
      image_url: watchModelForm.image_url.trim(),
    }

    if (!body.brand_id || !body.category_id || !body.mechanism_id || !body.model_name || !body.reference_code) {
      setActionError('Заполните обязательные поля')
      return
    }

    setIsSaving(true)
    setActionError('')

    try {
      await mutateAdminResource(
        editingId ? `/api/admin/watch-models/${editingId}` : '/api/admin/watch-models',
        {
          method: editingId ? 'PATCH' : 'POST',
          body: JSON.stringify(body),
        }
      )
      closeWatchForm()
      await loadAdminData()
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить модель часов')
    } finally {
      setIsSaving(false)
    }
  }

  const startEditWatchModel = (row: AdminWatchModel) => {
    setEditingId(row.model_id)
    setWatchModelForm({
      brand_id: String(row.brand_id),
      category_id: String(row.category_id),
      mechanism_id: String(row.mechanism_id),
      model_name: row.model_name,
      reference_code: row.reference_code,
      image_url: row.image_url ?? '',
    })
    setActionError('')
    setIsWatchFormOpen(true)
  }

  const handleDeleteWatchModel = async (id: string | number) => {
    const confirmed = window.confirm('Пометить модель часов как удаленную?')

    if (!confirmed) {
      return
    }

    setIsSaving(true)
    setActionError('')

    try {
      await mutateAdminResource(`/api/admin/watch-models/${id}`, {
        method: 'DELETE',
      })
      await loadAdminData()
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить модель часов')
    } finally {
      setIsSaving(false)
    }
  }

  const handleWatchInstanceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const body = {
      model_id: watchInstanceForm.model_id,
      store_id: watchInstanceForm.store_id,
      serial_number: watchInstanceForm.serial_number.trim(),
      price: watchInstanceForm.price,
      status: watchInstanceForm.status,
    }

    if (!body.model_id || !body.store_id || !body.serial_number || !body.price || !watchStatuses.includes(body.status)) {
      setActionError('Заполните обязательные поля')
      return
    }

    setIsSaving(true)
    setActionError('')

    try {
      await mutateAdminResource(
        editingId ? `/api/admin/watch-instances/${editingId}` : '/api/admin/watch-instances',
        {
          method: editingId ? 'PATCH' : 'POST',
          body: JSON.stringify(body),
        }
      )
      closeWatchForm()
      await loadAdminData()
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить экземпляр часов')
    } finally {
      setIsSaving(false)
    }
  }

  const startEditWatchInstance = (row: AdminWatchInstance) => {
    setEditingId(row.instance_id)
    setWatchInstanceForm({
      model_id: String(row.model_id),
      store_id: String(row.store_id),
      serial_number: row.serial_number,
      price: String(row.price),
      status: row.status,
    })
    setActionError('')
    setIsWatchFormOpen(true)
  }

  const handleDeleteWatchInstance = async (id: string | number) => {
    const confirmed = window.confirm('Пометить экземпляр часов как удаленный?')

    if (!confirmed) {
      return
    }

    setIsSaving(true)
    setActionError('')

    try {
      await mutateAdminResource(`/api/admin/watch-instances/${id}`, {
        method: 'DELETE',
      })
      await loadAdminData()
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить экземпляр часов')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteOrder = async (id: string | number) => {
    const confirmed = window.confirm('Пометить заказ как удаленный?')

    if (!confirmed) {
      return
    }

    setIsSaving(true)
    setActionError('')

    try {
      await mutateAdminResource(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      })
      await loadAdminData()
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить заказ')
    } finally {
      setIsSaving(false)
    }
  }

  const simpleConfig = isSimpleTab(activeTab) ? simpleResourceConfigs[activeTab] : null
  const isWatchResourceTab = activeTab === 'watchModels' || activeTab === 'watchInstances'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по данным..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Пользователей</p>
          <p className="text-2xl font-bold">{counts.users}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Моделей</p>
          <p className="text-2xl font-bold">{counts.models}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Экземпляров</p>
          <p className="text-2xl font-bold">{counts.instances}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Заказов</p>
          <p className="text-2xl font-bold">{counts.orders}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg bg-muted p-1">
        {tabs.map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {simpleConfig && (
        <form onSubmit={handleSimpleSubmit} className="rounded-lg border border-border/50 p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder={simpleConfig.nameLabel}
              value={form.name}
              onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
            />
            {simpleConfig.hasCity && (
              <Input
                placeholder="Город"
                value={form.city}
                onChange={event => setForm(prev => ({ ...prev, city: event.target.value }))}
              />
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {editingId ? 'Сохранить' : 'Добавить'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptySimpleForm)
                    setActionError('')
                  }}
                >
                  Отмена
                </Button>
              )}
            </div>
          </div>
          {actionError && (
            <p className="text-sm text-destructive">{actionError}</p>
          )}
        </form>
      )}

      {activeTab === 'watchModels' && (
        <div className="rounded-lg border border-border/50 p-4 space-y-4">
          {!isWatchFormOpen ? (
            <Button type="button" onClick={openCreateWatchForm}>
              Создать
            </Button>
          ) : (
            <form onSubmit={handleWatchModelSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <select
                  value={watchModelForm.brand_id}
                  onChange={event => setWatchModelForm(prev => ({ ...prev, brand_id: event.target.value }))}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Бренд</option>
                  {data.brands.map(brand => (
                    <option key={String(brand.brand_id)} value={String(brand.brand_id)}>
                      {brand.brand_name}{brand.removed ? ' (Удалено)' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={watchModelForm.category_id}
                  onChange={event => setWatchModelForm(prev => ({ ...prev, category_id: event.target.value }))}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Категория</option>
                  {data.categories.map(category => (
                    <option key={String(category.category_id)} value={String(category.category_id)}>
                      {category.category_name}{category.removed ? ' (Удалено)' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={watchModelForm.mechanism_id}
                  onChange={event => setWatchModelForm(prev => ({ ...prev, mechanism_id: event.target.value }))}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Механизм</option>
                  {data.mechanisms.map(mechanism => (
                    <option key={String(mechanism.mechanism_id)} value={String(mechanism.mechanism_id)}>
                      {mechanism.mechanism_name}{mechanism.removed ? ' (Удалено)' : ''}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Название модели"
                  value={watchModelForm.model_name}
                  onChange={event => setWatchModelForm(prev => ({ ...prev, model_name: event.target.value }))}
                />
                <Input
                  placeholder="Reference code"
                  value={watchModelForm.reference_code}
                  onChange={event => setWatchModelForm(prev => ({ ...prev, reference_code: event.target.value }))}
                />
                <Input
                  placeholder="Image URL"
                  value={watchModelForm.image_url}
                  onChange={event => setWatchModelForm(prev => ({ ...prev, image_url: event.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {editingId ? 'Сохранить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={closeWatchForm}>
                  Отмена
                </Button>
              </div>
              {actionError && (
                <p className="text-sm text-destructive">{actionError}</p>
              )}
            </form>
          )}
        </div>
      )}

      {activeTab === 'watchInstances' && (
        <div className="rounded-lg border border-border/50 p-4 space-y-4">
          {!isWatchFormOpen ? (
            <Button type="button" onClick={openCreateWatchForm}>
              Создать
            </Button>
          ) : (
            <form onSubmit={handleWatchInstanceSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <select
                  value={watchInstanceForm.model_id}
                  onChange={event => setWatchInstanceForm(prev => ({ ...prev, model_id: event.target.value }))}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Модель</option>
                  {data.watchModels.map(model => (
                    <option key={String(model.model_id)} value={String(model.model_id)}>
                      {model.brand_name} {model.model_name} / {model.reference_code}{model.removed ? ' (Удалено)' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={watchInstanceForm.store_id}
                  onChange={event => setWatchInstanceForm(prev => ({ ...prev, store_id: event.target.value }))}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Магазин</option>
                  {data.stores.map(store => (
                    <option key={String(store.store_id)} value={String(store.store_id)}>
                      {store.store_name}, {store.city}{store.removed ? ' (Удалено)' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={watchInstanceForm.status}
                  onChange={event => setWatchInstanceForm(prev => ({ ...prev, status: event.target.value }))}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {watchStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <Input
                  placeholder="Serial number"
                  value={watchInstanceForm.serial_number}
                  onChange={event => setWatchInstanceForm(prev => ({ ...prev, serial_number: event.target.value }))}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Цена"
                  value={watchInstanceForm.price}
                  onChange={event => setWatchInstanceForm(prev => ({ ...prev, price: event.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {editingId ? 'Сохранить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={closeWatchForm}>
                  Отмена
                </Button>
              </div>
              {actionError && (
                <p className="text-sm text-destructive">{actionError}</p>
              )}
            </form>
          )}
        </div>
      )}

      {!simpleConfig && (!isWatchResourceTab || !isWatchFormOpen) && actionError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Загрузка...
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {activeTab === 'users' && <UsersTable rows={filteredData.users} />}
          {activeTab === 'stores' && (
            <StoresTable
              rows={filteredData.stores}
              onEdit={row => startEditSimpleRow(row as unknown as Record<string, unknown>, simpleResourceConfigs.stores)}
              onDelete={handleDeleteSimpleRow}
              disabled={isSaving}
            />
          )}
          {activeTab === 'brands' && (
            <SimpleDictionaryTable
              rows={filteredData.brands as Array<Record<string, unknown> & { removed: boolean }>}
              config={simpleResourceConfigs.brands}
              onEdit={row => startEditSimpleRow(row as unknown as Record<string, unknown>, simpleResourceConfigs.brands)}
              onDelete={handleDeleteSimpleRow}
              disabled={isSaving}
            />
          )}
          {activeTab === 'categories' && (
            <SimpleDictionaryTable
              rows={filteredData.categories as Array<Record<string, unknown> & { removed: boolean }>}
              config={simpleResourceConfigs.categories}
              onEdit={row => startEditSimpleRow(row as unknown as Record<string, unknown>, simpleResourceConfigs.categories)}
              onDelete={handleDeleteSimpleRow}
              disabled={isSaving}
            />
          )}
          {activeTab === 'mechanisms' && (
            <SimpleDictionaryTable
              rows={filteredData.mechanisms as Array<Record<string, unknown> & { removed: boolean }>}
              config={simpleResourceConfigs.mechanisms}
              onEdit={row => startEditSimpleRow(row as unknown as Record<string, unknown>, simpleResourceConfigs.mechanisms)}
              onDelete={handleDeleteSimpleRow}
              disabled={isSaving}
            />
          )}
          {activeTab === 'watchModels' && (
            <WatchModelsTable
              rows={filteredData.watchModels}
              onEdit={startEditWatchModel}
              onDelete={handleDeleteWatchModel}
              disabled={isSaving}
            />
          )}
          {activeTab === 'watchInstances' && (
            <WatchInstancesTable
              rows={filteredData.watchInstances}
              onEdit={startEditWatchInstance}
              onDelete={handleDeleteWatchInstance}
              disabled={isSaving}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersTable
              rows={filteredData.orders}
              onDelete={handleDeleteOrder}
              disabled={isSaving}
            />
          )}
        </div>
      )}
    </div>
  )
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-muted-foreground">
        Ничего не найдено
      </TableCell>
    </TableRow>
  )
}

function UsersTable({ rows }: { rows: AdminUser[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Имя</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Роль</TableHead>
          <TableHead className="text-center">Статус</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? <EmptyRow colSpan={5} /> : rows.map(row => (
          <TableRow key={String(row.user_id)}>
            <TableCell className="font-mono text-xs">{row.user_id}</TableCell>
            <TableCell className="font-medium">{row.full_name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.role_name}</TableCell>
            <TableCell className="text-center">{getRemovedBadge(row.removed)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function StoresTable({
  rows,
  onEdit,
  onDelete,
  disabled,
}: {
  rows: AdminStore[]
  onEdit: (row: AdminStore) => void
  onDelete: (id: string | number) => void
  disabled: boolean
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Магазин</TableHead>
          <TableHead>Город</TableHead>
          <TableHead className="text-center">Статус</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? <EmptyRow colSpan={5} /> : rows.map(row => (
          <TableRow key={String(row.store_id)}>
            <TableCell className="font-mono text-xs">{row.store_id}</TableCell>
            <TableCell className="font-medium">{row.store_name}</TableCell>
            <TableCell>{row.city}</TableCell>
            <TableCell className="text-center">{getRemovedBadge(row.removed)}</TableCell>
            <TableCell className="text-right">
              <RowActions
                id={row.store_id}
                removed={row.removed}
                disabled={disabled}
                onEdit={() => onEdit(row)}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function SimpleDictionaryTable({
  rows,
  config,
  onEdit,
  onDelete,
  disabled,
}: {
  rows: Array<Record<string, unknown> & { removed: boolean }>
  config: SimpleResourceConfig
  onEdit: (row: Record<string, unknown> & { removed: boolean }) => void
  onDelete: (id: string | number) => void
  disabled: boolean
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>{config.nameLabel}</TableHead>
          <TableHead className="text-center">Статус</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? <EmptyRow colSpan={4} /> : rows.map(row => {
          const id = row[config.idKey] as string | number

          return (
            <TableRow key={String(id)}>
              <TableCell className="font-mono text-xs">{String(id)}</TableCell>
              <TableCell className="font-medium">{String(row[config.nameKey])}</TableCell>
              <TableCell className="text-center">{getRemovedBadge(row.removed)}</TableCell>
              <TableCell className="text-right">
                <RowActions
                  id={id}
                  removed={row.removed}
                  disabled={disabled}
                  onEdit={() => onEdit(row)}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function RowActions({
  id,
  removed,
  disabled,
  onEdit,
  onDelete,
}: {
  id: string | number
  removed: boolean
  disabled: boolean
  onEdit: () => void
  onDelete: (id: string | number) => void
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={onEdit} disabled={disabled || removed}>
        Редактировать
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete(id)} disabled={disabled || removed}>
        Удалить
      </Button>
    </div>
  )
}

function WatchModelsTable({
  rows,
  onEdit,
  onDelete,
  disabled,
}: {
  rows: AdminWatchModel[]
  onEdit: (row: AdminWatchModel) => void
  onDelete: (id: string | number) => void
  disabled: boolean
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Бренд</TableHead>
          <TableHead>Модель</TableHead>
          <TableHead>Артикул</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Механизм</TableHead>
          <TableHead>Изображение</TableHead>
          <TableHead className="text-center">Статус</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? <EmptyRow colSpan={9} /> : rows.map(row => (
          <TableRow key={String(row.model_id)}>
            <TableCell className="font-mono text-xs">{row.model_id}</TableCell>
            <TableCell>{row.brand_name}</TableCell>
            <TableCell className="font-medium">{row.model_name}</TableCell>
            <TableCell>{row.reference_code}</TableCell>
            <TableCell>{row.category_name}</TableCell>
            <TableCell>{row.mechanism_name}</TableCell>
            <TableCell className="max-w-[180px] truncate">{row.image_url || '-'}</TableCell>
            <TableCell className="text-center">{getRemovedBadge(row.removed)}</TableCell>
            <TableCell className="text-right">
              <RowActions
                id={row.model_id}
                removed={row.removed}
                disabled={disabled}
                onEdit={() => onEdit(row)}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function WatchInstancesTable({
  rows,
  onEdit,
  onDelete,
  disabled,
}: {
  rows: AdminWatchInstance[]
  onEdit: (row: AdminWatchInstance) => void
  onDelete: (id: string | number) => void
  disabled: boolean
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Часы</TableHead>
          <TableHead>Артикул</TableHead>
          <TableHead>Магазин</TableHead>
          <TableHead>Город</TableHead>
          <TableHead>Serial</TableHead>
          <TableHead className="text-right">Цена</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-center">Запись</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? <EmptyRow colSpan={10} /> : rows.map(row => (
          <TableRow key={String(row.instance_id)}>
            <TableCell className="font-mono text-xs">{row.instance_id}</TableCell>
            <TableCell className="font-medium">{row.brand_name} {row.model_name}</TableCell>
            <TableCell>{row.reference_code}</TableCell>
            <TableCell>{row.store_name}</TableCell>
            <TableCell>{row.city}</TableCell>
            <TableCell>{row.serial_number}</TableCell>
            <TableCell className="text-right">{formatPrice(Number(row.price))}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell className="text-center">{getRemovedBadge(row.removed)}</TableCell>
            <TableCell className="text-right">
              <RowActions
                id={row.instance_id}
                removed={row.removed}
                disabled={disabled}
                onEdit={() => onEdit(row)}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function OrdersTable({
  rows,
  onDelete,
  disabled,
}: {
  rows: AdminOrder[]
  onDelete: (id: string | number) => void
  disabled: boolean
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Клиент</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Сумма</TableHead>
          <TableHead className="text-center">Запись</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? <EmptyRow colSpan={8} /> : rows.map(row => (
          <TableRow key={String(row.order_id)}>
            <TableCell className="font-mono text-xs">{row.order_id}</TableCell>
            <TableCell className="font-medium">{row.customer_name}</TableCell>
            <TableCell>{row.customer_email}</TableCell>
            <TableCell>{formatDate(row.order_date)}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell className="text-right">{formatPrice(Number(row.total_amount))}</TableCell>
            <TableCell className="text-center">{getRemovedBadge(row.removed)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(row.order_id)}
                disabled={disabled || row.removed}
              >
                Удалить
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
